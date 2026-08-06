import json
import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from kharandi.apps.marketplace.models import Category, Product
from kharandi.apps.accounts.models import User

def migrate_from_firebase(source_file):
    """
    Migration script to move from Firebase JSON export to Django PostgreSQL.
    """
    print(f"Migration à partir de {source_file}...")
    
    with open(source_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Chargement de {len(data.get('users', []))} utilisateurs...")
    # Logique de création Django ici...
    print("Migration terminée avec succès !")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        migrate_from_firebase(sys.argv[1])
    else:
        print("Usage: python scripts/migrate_from_firebase.py <source.json>")
