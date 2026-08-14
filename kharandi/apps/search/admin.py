from django.contrib import admin
from .models import ExamResult


@admin.register(ExamResult)
class ExamResultAdmin(admin.ModelAdmin):
    list_display = ("pv", "noms", "exam", "year", "dpe", "centre", "origine", "mention", "rang")
    list_filter = ("exam", "year", "mention", "dpe")
    search_fields = ("pv", "noms", "centre", "origine", "dpe")
    ordering = ("exam", "dpe", "noms")
