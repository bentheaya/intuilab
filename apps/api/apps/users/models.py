from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Additional fields can be added here as per architecture
    # Profile, Streak, Curriculum preference etc.
    is_premium = models.BooleanField(default=False)
    
    def __str__(self):
        return self.email or self.username

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    curriculum_preference = models.CharField(max_length=50, default='KCSE')
    language = models.CharField(max_length=10, default='en')
    streak_count = models.IntegerField(default=0)
    total_xp = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Profile of {self.user.username}"
