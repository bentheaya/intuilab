from django.contrib import admin
from reversion.admin import VersionAdmin
from .models import ConceptMastery, AssessmentAttempt, Flashcard, SRSReview, StudentInsight

@admin.register(ConceptMastery)
class ConceptMasteryAdmin(VersionAdmin):
    list_display = ('id', 'user', 'concept', 'p_known', 'last_updated')
    list_filter = ('last_updated', 'concept__topic__subject')
    search_fields = ('user__username', 'concept__title')

@admin.register(AssessmentAttempt)
class AssessmentAttemptAdmin(VersionAdmin):
    list_display = ('id', 'user', 'assessment_item', 'is_correct', 'timestamp')
    list_filter = ('is_correct', 'timestamp', 'assessment_item__item_type')
    search_fields = ('user__username', 'assessment_item__question_text')

@admin.register(Flashcard)
class FlashcardAdmin(VersionAdmin):
    list_display = ('id', 'concept', 'front_text_preview')
    search_fields = ('front_text', 'concept__title')

    def front_text_preview(self, obj):
        return obj.front_text[:60] + ("..." if len(obj.front_text) > 60 else "")

@admin.register(SRSReview)
class SRSReviewAdmin(VersionAdmin):
    list_display = ('id', 'user', 'flashcard', 'interval', 'ease_factor', 'next_review_date')
    list_filter = ('next_review_date', 'interval')
    search_fields = ('user__username', 'flashcard__front_text')

@admin.register(StudentInsight)
class StudentInsightAdmin(VersionAdmin):
    list_display = ('id', 'user', 'title', 'insight_type', 'subject', 'created_at')
    list_filter = ('insight_type', 'subject', 'created_at')
    search_fields = ('user__username', 'title', 'summary')
