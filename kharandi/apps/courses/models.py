from django.db import models
from django.utils.text import slugify


class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom de la matière")
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    icon = models.CharField(max_length=50, default="BookOpen", verbose_name="Icône Lucide")
    description = models.TextField(blank=True, verbose_name="Description")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Matière"
        verbose_name_plural = "Matières"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Document(models.Model):
    DOC_TYPE_CHOICES = [
        ("EXERCICE", "Épreuve / Exercice"),
        ("CORRECTION", "Corrigé Détaillé"),
        ("COURS", "Fiche de Cours"),
        ("LIVRE", "Manuel Scolaire"),
        ("VIDEO", "Vidéo Explicative"),
    ]

    CATEGORY_CHOICES = [
        ("REAL", "Examen Officiel Réel (MEPUA)"),
        ("BLANC", "Baccalauréat Blanc & Écoles d'Excellence"),
        ("ETRANGER", "Baccalauréat International / Zone UEMOA"),
    ]

    id = models.CharField(max_length=120, primary_key=True, verbose_name="Identifiant unique")
    title = models.CharField(max_length=255, verbose_name="Titre de l'épreuve / document")
    description = models.TextField(blank=True, verbose_name="Description synthétique")
    doc_type = models.CharField(max_length=20, choices=DOC_TYPE_CHOICES, default="EXERCICE", verbose_name="Type de document")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="REAL", verbose_name="Catégorie")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="documents", verbose_name="Matière")
    level = models.CharField(max_length=80, verbose_name="Niveau / Série (ex: BAC SM, BAC SE, BAC SS)")
    year = models.CharField(max_length=20, default="2024", verbose_name="Année de session")
    country = models.CharField(max_length=100, default="Guinée", verbose_name="Pays d'origine")
    institution = models.CharField(max_length=150, default="MEPUA - Ministère de l'Éducation Nationale", verbose_name="Institution")
    is_free = models.BooleanField(default=True, verbose_name="Accès Gratuit")
    downloads = models.PositiveIntegerField(default=0, verbose_name="Nombre de téléchargements")
    file_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="Lien de téléchargement / PDF")
    external_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="Lien externe")
    content = models.TextField(blank=True, verbose_name="Contenu textuel & Markdown (avec KaTeX & Corrigés)")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Mis à jour le")

    class Meta:
        verbose_name = "Sujet / Document BAC"
        verbose_name_plural = "Sujets & Documents BAC"
        ordering = ["-year", "subject__name", "title"]

    def __str__(self):
        return f"{self.title} ({self.level} - {self.year})"


class ReadingProgress(models.Model):
    user_id = models.CharField(max_length=120, db_index=True)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="progress_entries")
    progress = models.PositiveIntegerField(default=0, verbose_name="Progression (%)")
    is_read = models.BooleanField(default=False, verbose_name="Terminé / Lu")
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user_id", "document")
        verbose_name = "Progression de lecture"
        verbose_name_plural = "Progressions de lecture"
