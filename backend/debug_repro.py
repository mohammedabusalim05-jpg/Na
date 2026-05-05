import os
import django
import sys

# Add the project directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
import uuid
from datetime import timedelta

print("Starting debug...")
try:
    print("Creating RefreshToken...")
    refresh = RefreshToken()
    print("RefreshToken created.")
    
    print("Setting user_id...")
    refresh['user_id'] = str(uuid.uuid4())
    print("user_id set.")

    print("Setting is_guest...")
    refresh['is_guest'] = True
    print("is_guest set.")

    print("Setting expiration...")
    refresh.set_exp(lifetime=timedelta(minutes=30))
    print("Expiration set.")

    print("Attempting to generate access token...")
    print(f"Access Token: {str(refresh.access_token)}")

except Exception as e:
    import traceback
    traceback.print_exc()
