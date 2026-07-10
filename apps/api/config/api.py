from ninja import NinjaAPI, Router
from apps.content.models import Lesson, Concept, Subject, Topic, AssessmentItem
from apps.assessment.models import ConceptMastery, AssessmentAttempt, Flashcard, SRSReview
from apps.assessment.services import MasteryService, SRSService
from django.utils import timezone
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
            "concept_id": lesson.concept.id,
            "concept_slug": lesson.concept.slug,
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

from pydantic import BaseModel

class AssessmentSubmitSchema(BaseModel):
    assessment_id: int
    is_correct: bool

assessment_router = Router()

@assessment_router.post("/submit", response=dict)
def submit_attempt(request, payload: AssessmentSubmitSchema):
    if not request.user.is_authenticated:
        return {"error": "Authentication required"}
    
    try:
        item = AssessmentItem.objects.get(id=payload.assessment_id)
        # Record attempt
        AssessmentAttempt.objects.create(
            user=request.user,
            assessment_item=item,
            is_correct=payload.is_correct
        )
        
        # Update BKT Mastery
        MasteryService.update_mastery(
            user=request.user,
            concept=item.concept,
            is_correct=payload.is_correct,
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

def create_default_flashcards():
    """Programmatically seeds default flashcards based on Concepts if none exist."""
    concepts = Concept.objects.all().select_related('topic__subject')
    for c in concepts:
        Flashcard.objects.get_or_create(
            concept=c,
            defaults={
                "front_text": f"What is the physical intuition and core concept of: {c.title}?",
                "back_text": c.summary
            }
        )

@assessment_router.get("/flashcards", response=List[dict])
def get_flashcards(request):
    # Ensure default flashcards are created if none exist
    if not Flashcard.objects.exists():
        create_default_flashcards()

    if not request.user.is_authenticated:
        # Fallback/guest list
        flashcards = Flashcard.objects.all()[:15]
        return [
            {
                "id": f.id,
                "question": f.front_text,
                "answer": f.back_text,
                "subject": f.concept.topic.subject.name.lower(),
                "difficulty": "medium",
                "interval": 0,
                "repetition_count": 0
            } for f in flashcards
        ]
        
    today = timezone.now().date()
    # 1. Get cards that are due for review
    reviews = SRSReview.objects.filter(user=request.user, next_review_date__lte=today)
    
    # 2. Get cards that have not been reviewed yet by this user
    reviewed_ids = SRSReview.objects.filter(user=request.user).values_list('flashcard_id', flat=True)
    unreviewed_cards = Flashcard.objects.exclude(id__in=reviewed_ids)
    
    cards_to_review = []
    for r in reviews:
        cards_to_review.append(r.flashcard)
    for f in unreviewed_cards:
        cards_to_review.append(f)
        
    # If no reviews are due and all cards are reviewed, fall back to random/all cards
    if not cards_to_review:
        cards_to_review = list(Flashcard.objects.all()[:15])
        
    result = []
    for f in cards_to_review[:25]:
        review = SRSReview.objects.filter(user=request.user, flashcard=f).first()
        result.append({
            "id": f.id,
            "question": f.front_text,
            "answer": f.back_text,
            "subject": f.concept.topic.subject.name.lower(),
            "difficulty": "medium",
            "interval": review.interval if review else 0,
            "repetition_count": review.repetition_count if review else 0
        })
    return result

class FlashcardReviewSchema(BaseModel):
    flashcard_id: int
    quality: int

@assessment_router.post("/flashcards/review", response=dict)
def review_flashcard(request, payload: FlashcardReviewSchema):
    if not request.user.is_authenticated:
        return {"error": "Authentication required"}
        
    try:
        flashcard = Flashcard.objects.get(id=payload.flashcard_id)
        review = SRSService.record_review(
            user=request.user,
            flashcard=flashcard,
            quality=payload.quality
        )
        return {
            "status": "success",
            "interval": review.interval,
            "ease_factor": review.ease_factor,
            "next_review_date": review.next_review_date.isoformat()
        }
    except Flashcard.DoesNotExist:
        return {"error": "Flashcard not found"}
    except Exception as e:
        return {"error": str(e)}

api.add_router("/assessment", assessment_router)


@api.get("/hello")
def hello(request):
    return {"message": "Welcome to IntuiLab"}
