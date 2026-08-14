from django.db import models


class ExamResult(models.Model):
    EXAM_CHOICES = [
        ("BAC", "Baccalauréat Unique"),
        ("BEPC", "BEPC Enseignement Général"),
        ("BEPC_FA", "BEPC Franco-Arabe"),
        ("CEE", "Examen d'Entrée en 7ème Année (CEE)"),
    ]

    exam = models.CharField(max_length=20, choices=EXAM_CHOICES, db_index=True, verbose_name="Type d'Examen")
    exam_title = models.CharField(max_length=255, default="Baccalauréat Unique 2026", verbose_name="Intitulé officiel de la session")
    year = models.PositiveIntegerField(default=2026, db_index=True, verbose_name="Année de session")
    dpe = models.CharField(max_length=150, db_index=True, blank=True, verbose_name="DPE / DCE / Région")
    rang = models.CharField(max_length=50, blank=True, verbose_name="Rang du candidat")
    ex = models.CharField(max_length=50, blank=True, verbose_name="Ex-æquo / Mention spéciale")
    noms = models.CharField(max_length=255, db_index=True, verbose_name="Nom et Prénom(s) du candidat")
    centre = models.CharField(max_length=255, db_index=True, blank=True, verbose_name="Centre d'Examen")
    pv = models.CharField(max_length=100, db_index=True, verbose_name="Numéro de Procès-Verbal (PV)")
    origine = models.CharField(max_length=255, db_index=True, blank=True, verbose_name="École d'Origine / Établissement")
    option = models.CharField(max_length=100, blank=True, verbose_name="Option / Série (ex: Sciences Mathématiques)")
    mention = models.CharField(max_length=50, default="ADMIS", blank=True, verbose_name="Mention / Résultat")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Résultat d'Examen National"
        verbose_name_plural = "Résultats des Examens Nationaux (BAC, BEPC, CEE)"
        indexes = [
            models.Index(fields=["exam", "pv"]),
            models.Index(fields=["exam", "noms"]),
            models.Index(fields=["exam", "centre"]),
            models.Index(fields=["exam", "dpe"]),
            models.Index(fields=["pv"]),
        ]
        ordering = ["exam", "dpe", "centre", "rang", "noms"]

    def __str__(self):
        return f"[{self.exam} {self.year}] {self.noms} (PV: {self.pv}) - {self.mention}"
