from django.contrib import admin
from django.utils.html import format_html
from reversion.admin import VersionAdmin
from .models import (
    CurriculumTag, Subject, Topic, Concept, 
    Lesson, LessonSection, VirtualLab, 
    HistoryTimeline, WhyItMattersStory, AssessmentItem, AssessmentChoice
)

class LessonSectionInline(admin.StackedInline):
    model = LessonSection
    extra = 1
    ordering = ('order',)
    fieldsets = (
        (None, {
            'fields': (('order', 'type'), 'content', 'media_url', 'component_config')
        }),
    )

class VirtualLabInline(admin.StackedInline):
    model = VirtualLab
    extra = 0
    fieldsets = (
        (None, {
            'fields': ('title', 'lab_type', 'simulation_mode', 'parameters_schema', 'threejs_config', 'python_entry')
        }),
    )

class HistoryTimelineInline(admin.StackedInline):
    model = HistoryTimeline
    extra = 0

class WhyItMattersStoryInline(admin.StackedInline):
    model = WhyItMattersStory
    extra = 0


@admin.register(CurriculumTag)
class CurriculumTagAdmin(VersionAdmin):
    list_display = ('name', 'curriculum_system', 'level')
    search_fields = ('name', 'curriculum_system')
    list_filter = ('level', 'curriculum_system')


@admin.register(Subject)
class SubjectAdmin(VersionAdmin):
    list_display = ('name', 'slug', 'color_preview', 'icon', 'color')
    search_fields = ('name',)

    def color_preview(self, obj):
        return format_html(
            '<div style="width: 24px; height: 24px; border-radius: 4px; background-color: {}; border: 1px solid #ccc;"></div>',
            obj.color
        )
    color_preview.short_description = "Color Preview"


@admin.register(Topic)
class TopicAdmin(VersionAdmin):
    list_display = ('title', 'subject_badge', 'parent_topic', 'level', 'order')
    list_editable = ('order',)
    list_filter = ('subject', 'level')
    search_fields = ('title',)
    autocomplete_fields = ['parent_topic']

    def subject_badge(self, obj):
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">{}</span>',
            obj.subject.color,
            obj.subject.name
        )
    subject_badge.short_description = "Subject"


@admin.register(Concept)
class ConceptAdmin(VersionAdmin):
    list_display = ('title', 'topic_link', 'subject_badge', 'slug', 'prereqs_count')
    list_filter = ('topic__subject', 'topic')
    search_fields = ('title', 'summary')
    autocomplete_fields = ['topic']
    filter_horizontal = ('prerequisites',)
    inlines = [VirtualLabInline, HistoryTimelineInline, WhyItMattersStoryInline]
    
    def subject_badge(self, obj):
        subject = obj.topic.subject
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">{}</span>',
            subject.color,
            subject.name
        )
    subject_badge.short_description = "Subject"

    def topic_link(self, obj):
        return obj.topic.title
    topic_link.short_description = "Topic"

    def prereqs_count(self, obj):
        return obj.prerequisites.count()
    prereqs_count.short_description = "Prerequisites"


@admin.register(Lesson)
class LessonAdmin(VersionAdmin):
    list_display = ('title', 'concept_link', 'duration_minutes', 'difficulty_stars', 'version', 'has_cache')
    list_filter = ('difficulty', 'concept__topic__subject', 'concept__topic')
    search_fields = ('title', 'concept__title')
    inlines = [LessonSectionInline]
    filter_horizontal = ('tags',)
    autocomplete_fields = ['concept']
    actions = ['rebuild_cache']

    def concept_link(self, obj):
        return obj.concept.title
    concept_link.short_description = "Concept"

    def difficulty_stars(self, obj):
        return "★" * obj.difficulty + "☆" * (5 - obj.difficulty)
    difficulty_stars.short_description = "Difficulty"

    def has_cache(self, obj):
        return bool(obj.content_json)
    has_cache.boolean = True
    has_cache.short_description = "Cache Active"

    def rebuild_cache(self, request, queryset):
        for lesson in queryset:
            lesson.rebuild_content_cache()
        self.message_user(request, f"Successfully rebuilt content JSON cache for {queryset.count()} lessons.")
    rebuild_cache.short_description = "Rebuild content JSON cache"


@admin.register(LessonSection)
class LessonSectionAdmin(VersionAdmin):
    list_display = ('lesson', 'order', 'type', 'content_preview')
    list_filter = ('type', 'lesson__concept__topic__subject')
    search_fields = ('content', 'lesson__title')
    ordering = ('lesson', 'order')

    def content_preview(self, obj):
        return obj.content[:50] + ("..." if len(obj.content) > 50 else "")
    content_preview.short_description = "Content"


@admin.register(VirtualLab)
class VirtualLabAdmin(VersionAdmin):
    list_display = ('title', 'concept', 'lab_type', 'simulation_mode')
    list_filter = ('lab_type', 'simulation_mode')
    search_fields = ('title', 'concept__title')


@admin.register(HistoryTimeline)
class HistoryTimelineAdmin(VersionAdmin):
    list_display = ('concept', 'title')
    search_fields = ('title', 'concept__title')


@admin.register(WhyItMattersStory)
class WhyItMattersStoryAdmin(VersionAdmin):
    list_display = ('concept', 'title', 'duration_seconds')
    search_fields = ('title', 'concept__title')


class AssessmentChoiceInline(admin.TabularInline):
    model = AssessmentChoice
    extra = 3

@admin.register(AssessmentItem)
class AssessmentItemAdmin(VersionAdmin):
    list_display = ('question_text_preview', 'concept', 'item_type', 'difficulty', 'choices_count')
    list_filter = ('item_type', 'difficulty', 'concept__topic__subject')
    search_fields = ('question_text', 'concept__title')
    inlines = [AssessmentChoiceInline]

    def question_text_preview(self, obj):
        return obj.question_text[:75] + ("..." if len(obj.question_text) > 75 else "")
    question_text_preview.short_description = "Question Text"

    def choices_count(self, obj):
        return obj.choices.count()
    choices_count.short_description = "Choices"
