from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from django.conf import settings
from apps.content.models import Lesson, Concept
import json

class SocraticOrchestrator:
    """
    Central AI service for IntuiLab. 
    Orchestrates Socratic tutoring sessions using Google Gemini.
    """
    
    def __init__(self, google_api_key=None, model=None):
        self.api_key = google_api_key or settings.GOOGLE_API_KEY
        self.model_name = model or settings.GEMINI_MODEL
        
        # Initialize the Chat model configured for Gemini
        self.llm = ChatGoogleGenerativeAI(
            model=self.model_name,
            google_api_key=self.api_key,
            streaming=True,
            convert_system_message_to_human=True # Gemini handles system messages uniquely in some versions
        )


    def get_socratic_prompt(self, concept_title, concept_summary, history_text=None, is_lab=False):
        """Returns the system prompt enforcing the Socratic Rediscovery Mode."""
        history_context = f"\n\nHistorical Context to weave in: {history_text}" if history_text else ""
        
        lab_instruction = ""
        if is_lab:
            lab_instruction = """
YOU ARE IN LAB MONITOR MODE. 
Specifically, the student is in the Projectile Motion Virtual Lab.
- Encourage them to experiment with the SLIDERS (Angle, Velocity, Gravity).
- If they observe a path, ask them to describe the SHAPE (Parabola).
- Ask about the 'range' or 'peak' and how they relate to the launch angle.
- Guide them toward the realization that vertical and horizontal motions are independent.
"""

        return SystemMessage(content=f"""
You are the IntuiLab Socratic Tutor, a world-class mentor in science and mathematics.
Your goal is to guide students to REDISCOVER concepts through their own reasoning.{lab_instruction}

CRITICAL RULE:
- NEVER state the answer, definition, or formula directly.
- If the student asks for the answer, respond with a question that helps them take one small step toward it.
- Use Socratic questioning: ask questions that reveal contradictions or lead to logic jumps.
- Encourage the student to form an 'intuition' before learning the jargon.
- If the student is stuck, provide a 'graduated hint' (a small nudge, then a clue, but never the answer).

Current Concept: {concept_title}
Concept Summary: {concept_summary}{history_context}

Always stay in character. Be encouraging, patient, and intellectually challenging.
""")

    async def get_response(self, message_history, concept_id=None, lesson_id=None):
        """
        Generates a Socratic response based on conversation history and context.
        """
        # Load Context
        concept_title = "Science"
        concept_summary = "General science exploration."
        history_text = ""
        
        if concept_id:
            try:
                concept = Concept.objects.get(id=concept_id)
                concept_title = concept.title
                concept_summary = concept.summary
                history_text = concept.history_text
            except Concept.DoesNotExist:
                pass
        elif lesson_id:
            try:
                if str(lesson_id).isdigit():
                    lesson = Lesson.objects.get(id=lesson_id)
                else:
                    # Fallback to checking slug on the associated concept 
                    # (since Lesson model doesn't have its own slug in this version)
                    lesson = Lesson.objects.filter(concept__slug=lesson_id).first()
                    if not lesson:
                        # Or if we have a title-based slug directly on Lesson (auto-generated)
                        # We'll check concept slug as primary since it's the main entity
                        lesson = Lesson.objects.filter(title__iexact=lesson_id.replace('-', ' ')).first()
                
                if lesson:
                    concept_title = lesson.concept.title
                    concept_summary = lesson.concept.summary
                    history_text = lesson.concept.history_text
            except Exception:
                pass


        is_lab = lesson_id == "projectile-motion-lab"
        system_message = self.get_socratic_prompt(concept_title, concept_summary, history_text, is_lab=is_lab)
        
        # Prepare the prompt
        prompt = ChatPromptTemplate.from_messages([
            system_message,
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])
        
        # In a real implementation with streaming, we would handle the stream.
        # For the service layer, we provide a clean interface.
        chain = prompt | self.llm
        
        # Process history
        history_objects = []
        for msg in message_history[:-1]:
            if msg['role'] == 'user':
                history_objects.append(HumanMessage(content=msg['content']))
            else:
                history_objects.append(AIMessage(content=msg['content']))
        
        last_input = message_history[-1]['content']
        
        # Return the chain for the consumer to invoke/stream
        return chain.astream({"history": history_objects, "input": last_input})
