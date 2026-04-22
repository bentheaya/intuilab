from django.db import models
from django.conf import settings
from apps.content.models import Concept, AssessmentItem

class ConceptMastery(models.Model):
    """
    Stores the current mastery probability for a User + Concept pair 
    using Bayesian Knowledge Tracing (BKT).
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mastery_profiles')
    concept = models.ForeignKey(Concept, on_delete=models.CASCADE)
    
    # BKT Current State: Probability that student knows the concept
    p_known = models.FloatField(default=0.1, help_text="P(Ln): Current probability of mastery")
    
    # BKT Global Parameters for this Concept (can be tuned per concept)
    p_transit = models.FloatField(default=0.1, help_text="P(T): Probability of learning after attempt")
    
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'concept')
        verbose_name_plural = "Concept Masteries"

    def __str__(self):
        return f"{self.user.username} - {self.concept.title} ({self.p_known:.2%})"

class AssessmentAttempt(models.Model):
    """
    Records an individual attempt at an assessment item. 
    Feeds the BKT engine.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_attempts')
    assessment_item = models.ForeignKey(AssessmentItem, on_delete=models.CASCADE)
    is_correct = models.BooleanField()
    response_data = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Meta
    interaction_type = models.CharField(max_length=20, choices=[
        ('quiz', 'Lesson Quiz'),
        ('socratic', 'Socratic Discovery'),
        ('check', 'Quick Check'),
    ], default='quiz')

    def __str__(self):
        return f"{self.user.username} - {self.assessment_item.id} - {'Correct' if self.is_correct else 'Incorrect'}"

class Flashcard(models.Model):
    """
    Spaced Repetition (SRS) item linked to a Concept.
    """
    concept = models.ForeignKey(Concept, on_delete=models.CASCADE, related_name='flashcards')
    front_text = models.TextField()
    back_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Flashcard: {self.concept.title} - {self.front_text[:30]}"

class SRSReview(models.Model):
    """
    Tracks the Spaced Repetition (SM-2) state for a Flashcard per User.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='srs_reviews')
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
    
    # SM-2 Parameters
    interval = models.IntegerField(default=0, help_text="Days until next review")
    ease_factor = models.FloatField(default=2.5)
    repetition_count = models.IntegerField(default=0)
    
    next_review_date = models.DateField(auto_now_add=True)
    last_review_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'flashcard')

    def __str__(self):
        return f"{self.user.username} - Review for card {self.flashcard.id}"
