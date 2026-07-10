from django.contrib import admin
from .models import SocraticSession, SocraticMessage

class SocraticMessageInline(admin.TabularInline):
    model = SocraticMessage
    extra = 0
    readonly_fields = ('role', 'content', 'timestamp')

@admin.register(SocraticSession)
class SocraticSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'lesson_id_str', 'created_at', 'updated_at')
    list_filter = ('lesson_id_str', 'created_at')
    search_fields = ('user__username', 'lesson_id_str')
    inlines = [SocraticMessageInline]

@admin.register(SocraticMessage)
class SocraticMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'role', 'content_preview', 'timestamp')
    list_filter = ('role', 'timestamp')
    
    def content_preview(self, obj):
        return obj.content[:50] + ("..." if len(obj.content) > 50 else "")
    content_preview.short_description = "Content"
