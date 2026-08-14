import os
import sys
import json
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from kharandi.apps.courses.models import Subject, Document
from kharandi.apps.search.models import ExamResult

# Import fallback subjects from src/data/fallbackSubjects.ts or load data
# Since it's typescript, let's read fallbackSubjects or parse json datasets
def seed_datasets():
    print("🚀 Démarrage du peuplement Django (Sujets BAC et Résultats d'Examens)...")

    # 1. Seed Subjects & BAC Documents from JSON/fallback
    data_dir = os.path.join(os.getcwd(), 'data')
    
    # Let's seed core subjects
    subjects_data = [
        {"name": "Mathématiques", "slug": "mathematiques", "icon": "Calculator", "description": "Algèbre, Analyse, Géométrie et Probabilités"},
        {"name": "Physique-Chimie", "slug": "physique-chimie", "icon": "Atom", "description": "Mécanique, Électricité, Thermodynamique et Chimie organique"},
        {"name": "SVT (Sciences de la Vie et de la Terre)", "slug": "svt", "icon": "Leaf", "description": "Biologie, Génétique et Géologie"},
        {"name": "Français", "slug": "francais", "icon": "BookOpen", "description": "Dissertation, Commentaire composé et Étude de texte"},
        {"name": "Philosophie", "slug": "philosophie", "icon": "Brain", "description": "Dissertation philosophique et Analyse de texte"},
        {"name": "Histoire-Géographie", "slug": "histoire-geographie", "icon": "Globe", "description": "Histoire contemporaine et Géographie humaine et économique"},
        {"name": "Anglais", "slug": "anglais", "icon": "Languages", "description": "Reading comprehension, Grammar and Essay writing"},
    ]

    subject_objs = {}
    for s in subjects_data:
        subj, _ = Subject.objects.get_or_create(
            slug=s["slug"],
            defaults={"name": s["name"], "icon": s["icon"], "description": s["description"]}
        )
        subject_objs[s["name"].toLowerCase() if hasattr(s["name"], 'toLowerCase') else s["name"].lower()] = subj

    # Helper function to get or create subject by name
    def get_subject_obj(name_str):
        lower = name_str.lower()
        for k, v in subject_objs.items():
            if k in lower or lower in k:
                return v
        # Default fallback subject
        default_subj, _ = Subject.objects.get_or_create(slug="general", defaults={"name": "Général", "icon": "BookOpen"})
        return default_subj

    # 2. Load and seed Exam Results from JSON and CSV datasets
    result_files = [
        {"file": 'results_bac_2026.json', "exam": 'BAC', "title": "Baccalauréat Unique 2026"},
        {"file": 'results_bepc_eg.json', "exam": 'BEPC', "title": "BEPC Enseignement Général 2026"},
        {"file": 'results_bepc_fa.json', "exam": 'BEPC_FA', "title": "BEPC Franco-Arabe 2026"},
    ]

    for item in result_files:
        fpath = os.path.join(data_dir, item["file"])
        if os.path.exists(fpath):
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    try:
                        records = json.loads(content)
                    except json.JSONDecodeError:
                        # Auto repair truncated JSON
                        last_obj = content.rfind('}')
                        if last_obj != -1:
                            repaired = content[:last_obj+1].strip()
                            if repaired.endswith(','): repaired = repaired[:-1]
                            if not repaired.endswith(']'): repaired += ']'
                            records = json.loads(repaired)
                        else:
                            records = []

                print(f"Importation de {len(records)} enregistrements pour {item['exam']} ({item['file']})...")
                count = 0
                for r in records:
                    pv = r.get('pv') or r.get('numero_pv') or f"PV_{count}"
                    noms = r.get('noms') or r.get('nom') or "Candidat Anonyme"
                    ExamResult.objects.update_or_create(
                        exam=item["exam"],
                        pv=pv,
                        defaults={
                            "exam_title": r.get('examTitle') or item["title"],
                            "year": int(r.get('year') or 2026),
                            "dpe": r.get('dpe') or "",
                            "rang": str(r.get('rang') or ""),
                            "ex": str(r.get('ex') or ""),
                            "noms": noms,
                            "centre": r.get('centre') or "",
                            "origine": r.get('origine') or "",
                            "option": r.get('option') or r.get('serie') or "",
                            "mention": r.get('mention') or "ADMIS",
                        }
                    )
                    count += 1
                print(f"✅ {count} résultats {item['exam']} synchronisés avec succès dans Django.")
            except Exception as e:
                print(f"❌ Erreur lors de l'import de {item['file']}: {e}")
        else:
            print(f"⚠️ Fichier introuvable : {fpath}")

    print("🎉 Synchronisation des sujets BAC et des résultats d'examens vers Django terminée avec succès !")

if __name__ == '__main__':
    seed_datasets()
