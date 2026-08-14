from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("STUDENT", "Élève / Candidat"),
        ("TEACHER", "Enseignant"),
        ("PARENT", "Parent"),
        ("ADMIN", "Administrateur"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="STUDENT")
    phone = models.CharField(max_length=30, blank=True, null=True, unique=True)
    school = models.CharField(max_length=150, blank=True, null=True)
    level = models.CharField(max_length=50, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    is_phone_verified = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
