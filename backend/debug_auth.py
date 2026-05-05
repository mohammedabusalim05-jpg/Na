import os
import django
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model, authenticate
User = get_user_model()

email = "admin@nakhwa.com"
password = "admin"

print(f"--- DEBUGGING AUTH FOR {email} ---")

try:
    if not User.objects.filter(email=email).exists():
        print("ERROR: User not found in DB!")
    else:
        u = User.objects.get(email=email)
        print(f"User Found: ID={u.id}, Username='{u.username}', Email='{u.email}'")
        print(f"Is Active: {u.is_active}")
        
        # 1. Check Password directly
        is_correct = u.check_password(password)
        print(f"DIRECT check_password('{password}'): {is_correct}")

        # 2. Check authenticate
        user_auth = authenticate(username=u.username, password=password)
        print(f"authenticate(username='{u.username}', password='{password}'): {user_auth}")

        if user_auth is None:
             print("FAIL: authenticate returned None.")
        else:
             print("SUCCESS: authenticate returned User.")

except Exception as e:
    print(f"EXCEPTION: {e}")
