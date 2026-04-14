from django.contrib import admin
from reversion.admin import VersionAdmin
from .models import (
    CurriculumTag, Subject, Topic, Concept, 
    Lesson, LessonSection, VirtualLab, 
    HistoryTimeline, WhyItMattersStory
)

class LessonSectionInline(admin.StackedInline):
    model = LessonSection
    extra = 1
    ordering = ('order',)

@admin.register(CurriculumTag)
class CurriculumTagAdmin(VersionAdmin):
    list_display = ('name', 'curriculum_system', 'level')
    search_fields = ('name', 'curriculum_system')
    list_filter = ('level', 'curriculum_system')

@admin.register(Subject)
class SubjectAdmin(VersionAdmin):
    list_display = ('name', 'slug', 'icon', 'color')
    search_fields = ('name',)

@admin.register(Topic)
class TopicAdmin(VersionAdmin):
    list_display = ('title', 'subject', 'parent_topic', 'level', 'order')
    list_filter = ('subject', 'level')
    search_fields = ('title',)

@admin.register(Concept)
class ConceptAdmin(VersionAdmin):
    list_display = ('title', 'topic', 'slug')
    search_fields = ('title', 'summary')
    list_filter = ('topic__subject',)

@admin.register(Lesson)
class LessonAdmin(VersionAdmin):
    list_display = ('title', 'concept', 'duration_minutes', 'difficulty', 'version')
    list_filter = ('difficulty', 'concept__topic__subject')
    search_fields = ('title',)
    inlines = [LessonSectionInline]
    filter_horizontal = ('tags',)

@admin.register(LessonSection)
class LessonSectionAdmin(VersionAdmin):
    list_display = ('lesson', 'order', 'type')
    list_filter = ('type', 'lesson')
    ordering = ('lesson', 'order')

@admin.register(VirtualLab)
class VirtualLabAdmin(VersionAdmin):
    list_display = ('title', 'concept', 'lab_type', 'simulation_mode')
    list_filter = ('lab_type', 'simulation_mode')

@admin.register(HistoryTimeline)
class HistoryTimelineAdmin(VersionAdmin):
    list_display = ('concept', 'title')

@admin.register(WhyItMattersStory)
class WhyItMattersStoryAdmin(VersionAdmin):
    list_display = ('concept', 'title', 'duration_seconds')
