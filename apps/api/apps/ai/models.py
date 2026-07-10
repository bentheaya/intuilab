from django.db import models
from django.conf import settings
from apps.content.models import Lesson

class SocraticSession(models.Model):
    """
    Groups a sequence of Socratic chat messages for a user and lesson.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='socratic_sessions'
    )
    # Stored as string to support both numeric database IDs and alphanumeric slugs (e.g. 'projectile-motion-lab')
    lesson_id_str = models.CharField(max_length=100, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        user_str = self.user.username if self.user else "Guest"
        return f"Session: {user_str} on {self.lesson_id_str} ({self.updated_at.strftime('%Y-%m-%d %H:%M')})"


class SocraticMessage(models.Model):
    """
    A single message exchanged in a Socratic session.
    """
    ROLE_CHOICES = [
        ('user', 'Student'),
        ('assistant', 'Mentor'),
    ]
    session = models.ForeignKey(
        SocraticSession, 
        on_delete=models.CASCADE, 
        related_name='messages'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.role.capitalize()}: {self.content[:30]}..."
