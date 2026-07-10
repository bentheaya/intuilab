from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_xai import ChatXAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.tools import tool

from django.conf import settings
from apps.content.models import Lesson, Concept, HistoryTimeline
import json

# Define Socratic Tools
@tool
def lookup_concept_history(concept_slug: str) -> str:
    """
    Lookup the historical context and timeline of scientific discovery for a concept.
    Use this when the student asks about the history, origin, or who discovered the concept.
    """
    try:
        concept = Concept.objects.get(slug=concept_slug)
        try:
            timeline = concept.timeline
            return f"History & Timeline of {concept.title}:\n" + json.dumps(timeline.entries_json, indent=2)
        except Exception:
            return f"History & Timeline of {concept.title}:\n{concept.history_text or 'No history registered.'}"
    except Concept.DoesNotExist:
        return f"Concept '{concept_slug}' not found."

@tool
def generate_hint(concept_slug: str, hint_level: int = 1) -> str:
    """
    Generate a graduated hint for a concept without giving the direct formula or answer.
    hint_level=1: A subtle nudge or conceptual question to guide their intuition.
    hint_level=2: A stronger clue, drawing attention to relationships or variables, but keeping it challenging.
    """
    try:
        concept = Concept.objects.get(slug=concept_slug)
        if hint_level <= 1:
            return f"Subtle Nudge (Level 1) for {concept.title}: Think about the core question behind this concept. {concept.summary[:120]}..."
        else:
            return f"Strong Clue (Level 2) for {concept.title}: Look at how this connects to its prerequisites. Recall the core physical behavior: {concept.summary[:250]}..."
    except Concept.DoesNotExist:
        return f"Concept '{concept_slug}' not found."


class SocraticOrchestrator:
    """
    Central AI service for IntuiLab. 
    Orchestrates Socratic tutoring sessions using xAI Grok (primary) or Google Gemini (fallback).
    """
    
    def __init__(self, xai_api_key=None, google_api_key=None, model=None):
        self.xai_api_key = xai_api_key or settings.XAI_API_KEY
        self.google_api_key = google_api_key or settings.GOOGLE_API_KEY
        
        # Decide which LLM to instantiate (Grok with Gemini fallback)
        if self.xai_api_key:
            model_name = model or settings.XAI_MODEL or "grok-beta"
            print(f"[AI Brain] Initializing xAI Grok Orchestrator ({model_name})")
            self.llm = ChatXAI(
                model=model_name,
                xai_api_key=self.xai_api_key,
                streaming=True
            )
        else:
            model_name = model or settings.GEMINI_MODEL or "gemini-1.5-flash"
            print(f"[AI Brain] Fallback: Initializing Google Gemini Orchestrator ({model_name})")
            self.llm = ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=self.google_api_key,
                streaming=True,
                convert_system_message_to_human=True
            )
            
        # Bind tools to the model
        self.tools = [lookup_concept_history, generate_hint]
        self.llm_with_tools = self.llm.bind_tools(self.tools)

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

CRITICAL RULES (Socratic Guardrails):
- NEVER state the answer, definition, or formula directly.
- NEVER write out the mathematical derivation for them.
- If the student asks for the answer, respond with a question that helps them take one small step toward it.
- Use Socratic questioning: ask questions that reveal contradictions, raise new evidence, or lead to logical jumps.
- Encourage the student to form an 'intuition' before learning the jargon.
- If the student is stuck, call the 'generate_hint' tool or provide a 'graduated hint' (a small nudge, then a clue, but never the answer).
- If they ask about the history or discovery, use the 'lookup_concept_history' tool to retrieve context.

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
                    lesson = Lesson.objects.filter(concept__slug=lesson_id).first()
                    if not lesson:
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
        
        # Process history
        history_objects = []
        for msg in message_history[:-1]:
            if msg['role'] == 'user':
                history_objects.append(HumanMessage(content=msg['content']))
            else:
                history_objects.append(AIMessage(content=msg['content']))
        
        last_input = message_history[-1]['content']
        
        # Build the chain
        chain = prompt | self.llm_with_tools
        
        # Return the chain stream
        return chain.astream({"history": history_objects, "input": last_input})


# Alias to match GrokOrchestrator naming in roadmap/specifications
GrokOrchestrator = SocraticOrchestrator
