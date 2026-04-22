import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .services.orchestrator import SocraticOrchestrator


class SocraticConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time Socratic tutoring sessions.
    """
    
    async def connect(self):
        self.lesson_id = self.scope['url_route']['kwargs']['lesson_id']
        self.room_group_name = f'chat_lesson_{self.lesson_id}'
        self.orchestrator = SocraticOrchestrator()

        
        # In a real app, we'd persist history in the DB.
        # For now, we maintain it in the session/memory.
        self.message_history = []

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

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

        # Add user message to history
        self.message_history.append({"role": "user", "content": user_input})

        # Send initial "thinking" state if needed
        # We start streaming immediately.
        
        full_response = ""
        
        try:
            # Get streaming response from orchestrator
            # We pass the lesson_id to provide context awareness
            stream = await self.orchestrator.get_response(
                message_history=self.message_history, 
                lesson_id=self.lesson_id
            )
            
            async for chunk in stream:
                content = chunk.content
                if content:
                    full_response += content
                    await self.send(text_data=json.dumps({
                        'type': 'chunk',
                        'content': content
                    }))
            
            # Record AI response in history
            self.message_history.append({"role": "assistant", "content": full_response})
            
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
