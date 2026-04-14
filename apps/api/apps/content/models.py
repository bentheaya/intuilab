from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django_extensions.db.fields import AutoSlugField
import json

class CurriculumTag(models.Model):

    name = models.CharField(max_length=100)
    slug = AutoSlugField(populate_from='name', unique=True)
    level_choices = [
        ('HS', 'High School'),
        ('UNI', 'University'),
        ('OTH', 'Other'),
    ]
    level = models.CharField(max_length=10, choices=level_choices, default='HS')
    curriculum_system = models.CharField(max_length=100, help_text="e.g., KCSE, CBC, IB")

    def __str__(self):
        return f"{self.name} ({self.curriculum_system})"

class Subject(models.Model):
    name = models.CharField(max_length=100)
    slug = AutoSlugField(populate_from='name', unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide or FontAwesome icon name")
    color = models.CharField(max_length=20, default="#000000", help_text="HEX color code for UI")

    def __str__(self):
        return self.name

class Topic(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='topics')
    parent_topic = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subtopics')
    title = models.CharField(max_length=200)
    level_choices = [
        ('HS', 'High School'),
        ('UNI', 'University'),
    ]
    level = models.CharField(max_length=10, choices=level_choices, default='HS')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return f"{self.subject.name} > {self.title}"

class Concept(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='concepts')
    title = models.CharField(max_length=200)
    slug = AutoSlugField(populate_from='title', unique=True)
    summary = models.TextField()
    history_text = models.TextField(blank=True)
    importance_text = models.TextField(blank=True)
    rediscovery_path_json = models.JSONField(default=dict, blank=True)
    embedding = models.JSONField(null=True, blank=True, help_text="Vector embedding (placeholder for pgvector)")

    def __str__(self):

        return self.title

class Lesson(models.Model):
    concept = models.ForeignKey(Concept, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    duration_minutes = models.PositiveIntegerField(default=15)
    content_json = models.JSONField(default=list, blank=True, help_text="Denormalized cache of LessonSections")
    difficulty = models.PositiveIntegerField(default=1, choices=[(i, i) for i in range(1, 6)])
    tags = models.ManyToManyField(CurriculumTag, related_name='lessons', blank=True)
    version = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.concept.title}: {self.title}"

    def rebuild_content_cache(self):
        """Rebuilds the content_json from related LessonSections."""
        sections = self.sections.all().order_by('order')
        content_list = []
        for section in sections:
            content_list.append({
                'id': section.id,
                'type': section.type,
                'content': section.content,
                'media_url': section.media_url,
                'component_config': section.component_config,
                'order': section.order
            })
        self.content_json = content_list
        self.save(update_fields=['content_json'])

class LessonSection(models.Model):
    SECTION_TYPES = [
        ('text', 'Text Block'),
        ('video', 'Video'),
        ('diagram', 'Diagram/Image'),
        ('interactive', 'Interactive Component'),
        ('lab', 'Virtual Lab'),
        ('socratic_pause', 'Socratic Pause Point'),
    ]
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='sections')
    order = models.PositiveIntegerField(default=0)
    type = models.CharField(max_length=20, choices=SECTION_TYPES)
    content = models.TextField(blank=True)
    media_url = models.URLField(max_length=500, blank=True, null=True)
    component_config = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.lesson.title} - Section {self.order} ({self.type})"

class VirtualLab(models.Model):
    concept = models.ForeignKey(Concept, on_delete=models.CASCADE, related_name='labs')
    title = models.CharField(max_length=200)
    lab_type = models.CharField(max_length=100, help_text="e.g., titration, projectile")
    parameters_schema = models.JSONField(default=dict, blank=True)
    simulation_mode_choices = [
        ('client', 'Client-side only'),
        ('server', 'Server-supported'),
    ]
    simulation_mode = models.CharField(max_length=10, choices=simulation_mode_choices, default='client')
    threejs_config = models.JSONField(default=dict, blank=True)
    python_entry = models.CharField(max_length=255, blank=True, help_text="Path to server-side script if needed")

    def __str__(self):
        return self.title

class HistoryTimeline(models.Model):
    concept = models.OneToOneField(Concept, on_delete=models.CASCADE, related_name='timeline')
    title = models.CharField(max_length=200)
    entries_json = models.JSONField(default=list, help_text="List of timeline events")

    def __str__(self):
        return f"Timeline: {self.concept.title}"

class WhyItMattersStory(models.Model):
    concept = models.OneToOneField(Concept, on_delete=models.CASCADE, related_name='story')
    title = models.CharField(max_length=200)
    narration_script = models.TextField()
    video_url = models.URLField(max_length=500, blank=True, null=True)
    audio_url = models.URLField(max_length=500, blank=True, null=True)
    duration_seconds = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Story: {self.concept.title}"

# Signals for denormalization
@receiver(post_save, sender=LessonSection)
@receiver(post_delete, sender=LessonSection)
def update_lesson_content_cache(sender, instance, **kwargs):
    """Trigger rebuild of lesson cache when a section is changed or deleted."""
    instance.lesson.rebuild_content_cache()
