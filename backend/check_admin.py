import os
import django
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = "admin@nakhwa.com"

try:
    if User.objects.filter(email=email).exists():
        u = User.objects.get(email=email)
        print(f"USER FOUND: {u.email}")
        print(f"Username: {u.username}")
        print(f"Is Staff: {u.is_staff}")
        print(f"Is Superuser: {u.is_superuser}")
        print(f"Check Password (admin): {u.check_password('admin')}")
    else:
        print("USER NOT FOUND")

except Exception as e:
    print(f"ERROR: {e}")
