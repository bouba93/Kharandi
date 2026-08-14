from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Profil Éducatif Guinéen", {"fields": ("role", "phone", "school", "level", "avatar_url", "is_phone_verified")}),
    )
    list_display = ("username", "email", "role", "level", "school", "phone", "is_staff")
    list_filter = ("role", "level", "is_staff", "is_active")
