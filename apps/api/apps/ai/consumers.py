import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .services.orchestrator import SocraticOrchestrator
from .models import SocraticSession, SocraticMessage


class SocraticConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time Socratic tutoring sessions.
    Persists session history and streams Socratic guidance.
    """
    
    async def connect(self):
        self.lesson_id = self.scope['url_route']['kwargs']['lesson_id']
        self.room_group_name = f'chat_lesson_{self.lesson_id}'
        self.orchestrator = SocraticOrchestrator()
        
        # Load or create Socratic session
        self.session_obj = await self.get_or_create_session()
        
        # Load conversation history from database
        db_history = await self.load_message_history()
        
        # Maintain history in memory for LangChain prompt context
        self.message_history = []
        for msg in db_history:
            self.message_history.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Send existing message history to frontend
        if db_history:
            await self.send(text_data=json.dumps({
                'type': 'history',
                'messages': db_history
            }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Receive message from WebSocket.
        Expected format: {"message": "Student query"}
        """
        data = json.loads(text_data)
        user_input = data.get('message')

        if not user_input:
            return

        # Add user message to history & save to DB
        self.message_history.append({"role": "user", "content": user_input})
        await self.save_message("user", user_input)

        full_response = ""
        
        try:
            # Get streaming response from orchestrator
            # We pass the lesson_id to provide context awareness
            stream = await self.orchestrator.get_response(
                message_history=self.message_history, 
                lesson_id=self.lesson_id
            )
            
            async for chunk in stream:
                # Handle both dict-like and object-like chunks from LangChain
                content = None
                if hasattr(chunk, 'content'):
                    content = chunk.content
                elif isinstance(chunk, dict) and 'content' in chunk:
                    content = chunk['content']
                elif hasattr(chunk, 'additional_kwargs') and 'tool_calls' in chunk.additional_kwargs:
                    # Ignore raw tool-call objects in direct text streaming
                    pass
                
                if content:
                    full_response += content
                    await self.send(text_data=json.dumps({
                        'type': 'chunk',
                        'content': content
                    }))
            
            # If the response is empty (e.g. model called a tool but returned no direct text yet),
            # or if we have finished, we record and send completion signals.
            if not full_response:
                full_response = "I am processing your input, let me guide you further..."
                await self.send(text_data=json.dumps({
                    'type': 'chunk',
                    'content': full_response
                }))

            # Record AI response in history & save to DB
            self.message_history.append({"role": "assistant", "content": full_response})
            await self.save_message("assistant", full_response)
            
            # Send completion signal
            await self.send(text_data=json.dumps({
                'type': 'complete',
                'full_message': full_response
            }))
            
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))

    @database_sync_to_async
    def get_or_create_session(self):
        user = self.scope.get('user')
        if user and user.is_authenticated:
            session = SocraticSession.objects.filter(
                user=user,
                lesson_id_str=self.lesson_id
            ).first()
            if not session:
                session = SocraticSession.objects.create(
                    user=user,
                    lesson_id_str=self.lesson_id
                )
            return session
        else:
            # Fallback for anonymous users: get or create an anonymous session for this session ID
            # In production, this can be linked to session_key
            session_key = self.scope.get('session', {}).session_key or 'anonymous'
            session, created = SocraticSession.objects.get_or_create(
                user=None,
                lesson_id_str=f"{self.lesson_id}_{session_key}"
            )
            return session

    @database_sync_to_async
    def load_message_history(self):
        messages = self.session_obj.messages.all().order_by('timestamp')
        return [
            {
                "id": str(msg.id),
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in messages
        ]

    @database_sync_to_async
    def save_message(self, role, content):
        return SocraticMessage.objects.create(
            session=self.session_obj,
            role=role,
            content=content
        )
