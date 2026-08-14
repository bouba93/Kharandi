from django.contrib import admin
from .models import Subject, Document, ReadingProgress


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "icon", "created_at")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "subject", "level", "year", "category", "doc_type", "is_free", "downloads")
    list_filter = ("level", "category", "doc_type", "year", "subject", "is_free")
    search_fields = ("title", "description", "content", "institution")
    readonly_fields = ("created_at", "updated_at", "downloads")


@admin.register(ReadingProgress)
class ReadingProgressAdmin(admin.ModelAdmin):
    list_display = ("user_id", "document", "progress", "is_read", "last_accessed")
    list_filter = ("is_read",)
    search_fields = ("user_id", "document__title")
