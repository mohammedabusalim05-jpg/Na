import os
import django
from rest_framework_simplejwt.tokens import RefreshToken

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

try:
    print("Attempting RefreshToken.for_user(None)...")
    refresh = RefreshToken.for_user(None)
    print("Success!")
except Exception as e:
    print(f"Failed: {e}")
