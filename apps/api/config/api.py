from ninja import NinjaAPI, Router
from apps.content.models import Lesson, Concept, Subject, Topic, AssessmentItem
from apps.assessment.models import ConceptMastery, AssessmentAttempt
from apps.assessment.services import MasteryService, SRSService
from typing import List, Optional

api = NinjaAPI(
    title="IntuiLab API",
    version="1.0.0",
    description="The Rediscovery Learning Platform API",
)

content_router = Router()

@content_router.get("/subjects/{subject_slug}/topics", response=dict)
def get_topics(request, subject_slug: str):
    try:
        subject = Subject.objects.filter(name__iexact=subject_slug).first()
        if not subject:
            return {"error": "Subject not found"}
        
        topics = Topic.objects.filter(subject=subject).order_by('order')
        topic_list = []
        for t in topics:
            topic_list.append({
                "id": t.id,
                "title": t.title,
                "concepts": [
                    {
                        "id": c.id,
                        "title": c.title,
                        "slug": c.slug,
                        "lesson_count": c.lessons.count()
                    } for c in t.concepts.all()
                ]
            })
        return {"subject": subject.name, "topics": topic_list}
    except Exception as e:
        return {"error": str(e)}

@content_router.get("/lessons/{lesson_id}", response=dict)
def get_lesson(request, lesson_id: str):
    try:
        if lesson_id.isdigit():
            lesson = Lesson.objects.get(id=lesson_id)
        else:
            # Try by concept slug
            lesson = Lesson.objects.filter(concept__slug=lesson_id).first()
            if not lesson:
                # Try by exact title
                lesson = Lesson.objects.filter(title__iexact=lesson_id.replace('-', ' ')).first()
        
        if not lesson:
            return {"error": "Lesson not found"}
            
        return {
            "id": lesson.id,
            "title": lesson.title,
            "concept_title": lesson.concept.title,
            "content": lesson.content_json,
            "difficulty": lesson.difficulty,
            "summary": lesson.concept.summary,
            "history_text": lesson.concept.history_text,
            "subject": lesson.concept.topic.subject.name
        }
    except Exception as e:
        return {"error": str(e)}

@content_router.get("/map", response=dict)
def get_map(request):
    try:
        concepts = Concept.objects.all().select_related('topic__subject')
        nodes = []
        edges = []
        
        for c in concepts:
            # Get real mastery if user is logged in
            mastery_percentage = 0
            if request.user.is_authenticated:
                profile = ConceptMastery.objects.filter(user=request.user, concept=c).first()
                if profile:
                    mastery_percentage = int(profile.p_known * 100)

            nodes.append({
                "id": str(c.id),
                "position": {"x": c.x_pos, "y": c.y_pos},
                "data": {
                    "label": c.title,
                    "subject": c.topic.subject.name.lower(),
                    "mastery": mastery_percentage
                },
                "type": "concept",
                "slug": c.slug
            })

            
            for pre in c.prerequisites.all():
                edges.append({
                    "id": f"e{pre.id}-{c.id}",
                    "source": str(pre.id),
                    "target": str(c.id),
                    "animated": True
                })
                
        return {"nodes": nodes, "edges": edges}
    except Exception as e:
        return {"error": str(e)}

api.add_router("/content", content_router)

assessment_router = Router()

@assessment_router.post("/submit", response=dict)
def submit_attempt(request, assessment_id: int, is_correct: bool):
    if not request.user.is_authenticated:
        return {"error": "Authentication required"}
    
    try:
        item = AssessmentItem.objects.get(id=assessment_id)
        # Record attempt
        AssessmentAttempt.objects.create(
            user=request.user,
            assessment_item=item,
            is_correct=is_correct
        )
        
        # Update BKT Mastery
        MasteryService.update_mastery(
            user=request.user,
            concept=item.concept,
            is_correct=is_correct,
            p_slip=item.p_slip,
            p_guess=item.p_guess
        )
        
        return {"status": "success", "message": "Mastery updated"}
    except Exception as e:
        return {"error": str(e)}

@assessment_router.get("/mastery", response=List[dict])
def get_user_mastery(request):
    if not request.user.is_authenticated:
        return []
        
    profiles = ConceptMastery.objects.filter(user=request.user)
    return [
        {
            "concept_id": p.concept.id,
            "slug": p.concept.slug,
            "p_known": p.p_known,
            "mastery_percent": int(p.p_known * 100)
        } for p in profiles
    ]

api.add_router("/assessment", assessment_router)


@api.get("/hello")
def hello(request):
    return {"message": "Welcome to IntuiLab"}
