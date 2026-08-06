"""
╔══════════════════════════════════════════════════════════════════════════╗
║             KHARANDI — Django Settings (Base)                           ║
║  Configuration adaptée pour Render (Gratuit) — Sans Redis — Sans Celery ║
╚══════════════════════════════════════════════════════════════════════════╗
"""

import os
from pathlib import Path
from datetime import timedelta
import dj_database_url
import environ

# ── Chemins ────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# ── Environnement (fichier .env ou variables Render) ────────────────────────
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

SECRET_KEY = env("SECRET_KEY", default="django-insecure-default-key-replace-me-in-prod")
DEBUG = env.bool("DEBUG", default=False)

# Autorise les domaines de Render et localhost
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[
    "localhost", 
    "127.0.0.1", 
    ".onrender.com"
])

# ── Applications ──────────────────────────────────────────────────────────
DJANGO_APPS = [
    "unfold",                          # Admin UI moderne (AVANT django.contrib.admin)
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.postgres",         # Full-text search PostgreSQL natif
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",
    "auditlog",
    "axes",
    "phonenumber_field",
    "storages",
    "cloudinary_storage",
    "cloudinary",
]

LOCAL_APPS = [
    "kharandi.apps.accounts",
    "kharandi.apps.marketplace",
    "kharandi.apps.payments",
    "kharandi.apps.courses",
    "kharandi.apps.notifications",
    "kharandi.apps.search",
    "kharandi.apps.reports",
    "kharandi.apps.support",
    "kharandi.apps.ai_assistant",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ── Middleware ────────────────────────────────────────────────────────────
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",    # Pour les fichiers statiques sur Render
    "corsheaders.middleware.CorsMiddleware",          # DOIT être avant CommonMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "auditlog.middleware.AuditlogMiddleware",
    "axes.middleware.AxesMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# ── Templates ─────────────────────────────────────────────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ── Base de données ───────────────────────────────────────────────────────
# Utilise DATABASE_URL si présent (Render), sinon sqlite3 pour le dev
DATABASES = {
    "default": dj_database_url.config(
        default=env("DATABASE_URL", default="sqlite:///kharandi_dev.db"),
        conn_max_age=600,
        ssl_require=not DEBUG
    )
}
DATABASES["default"]["ATOMIC_REQUESTS"] = True

# ── Auth personnalisé ─────────────────────────────────────────────────────
AUTH_USER_MODEL = "accounts.User"

# ── Validation mots de passe ──────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 8}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── Internationalisation ──────────────────────────────────────────────────
LANGUAGE_CODE = "fr-gn"
TIME_ZONE = "Africa/Conakry"
USE_I18N = True
USE_TZ = True

# ── Fichiers statiques & media (WhiteNoise & Cloudinary) ───────────────────
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# On utilise Cloudinary pour les médias en production (Render free tier n'a pas de stockage persistant)
if not DEBUG:
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME', default=''),
        'API_KEY': env('CLOUDINARY_API_KEY', default=''),
        'API_SECRET': env('CLOUDINARY_API_SECRET', default=''),
    }
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
else:
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ══════════════════════════════════════════════════════════════════════════
#  CORS & CSRF (Configuration Frontend / Vercel / kharandi.gn)
# ══════════════════════════════════════════════════════════════════════════
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[
    "https://kharandi.gn",
    "https://www.kharandi.gn",
    "http://localhost:3000",
    "http://localhost:5173",
])

CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[
    "https://kharandi.gn",
    "https://www.kharandi.gn",
])

CORS_ALLOW_CREDENTIALS = True

# ══════════════════════════════════════════════════════════════════════════
#  CACHE (Database Based for Free Tier)
# ══════════════════════════════════════════════════════════════════════════
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "kharandi_cache_table",
    }
}

# ══════════════════════════════════════════════════════════════════════════
#  DJANGO REST FRAMEWORK
# ══════════════════════════════════════════════════════════════════════════
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "1000/hour",
        "otp":  "5/minute",
        "ai":   "20/hour",
    },
}

# ══════════════════════════════════════════════════════════════════════════
#  JWT
# ══════════════════════════════════════════════════════════════════════════
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":  timedelta(hours=2),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS":  True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# ══════════════════════════════════════════════════════════════════════════
#  SERVICES TIERS
# ══════════════════════════════════════════════════════════════════════════
NIMBA_SID         = env("NIMBA_SID",   default="")
NIMBA_TOKEN       = env("NIMBA_TOKEN", default="")
NIMBA_SENDER_NAME = env("NIMBA_SENDER", default="Kharandi")

LENGOPAY_WEBSITE_ID  = env("LENGOPAY_SITE_ID",  default="")
LENGOPAY_LICENSE_KEY = env("LENGOPAY_LICENSE",  default="")
PLATFORM_COMMISSION_RATE = env.float("COMMISSION_RATE", default=0.05)

GEMINI_API_KEY      = env("GEMINI_API_KEY",  default="")
DEEPSEEK_API_KEY    = env("DEEPSEEK_API_KEY", default="")
AI_DAILY_LIMIT_FREE = env.int("AI_DAILY_LIMIT_FREE", default=10)

# ══════════════════════════════════════════════════════════════════════════
#  SÉCURITÉ
# ══════════════════════════════════════════════════════════════════════════
AXES_FAILURE_LIMIT = 5
AXES_COOLOFF_TIME = timedelta(minutes=30)
AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesStandaloneBackend",
    "django.contrib.auth.backends.ModelBackend",
]

# ══════════════════════════════════════════════════════════════════════════
#  UNFOLD ADMIN
# ══════════════════════════════════════════════════════════════════════════
UNFOLD = {
    "SITE_TITLE": "Kharandi Admin",
    "SITE_HEADER": "Kharandi",
}
