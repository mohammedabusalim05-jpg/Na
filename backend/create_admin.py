import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = "admin@nakhwa.com"
password = "admin"

try:
    if not User.objects.filter(email=email).exists():
        # Username must be unique, using email as username based on serializers.py pattern
        User.objects.create_superuser(username="admin_user", email=email, password=password)
        print(f"SUCCESS: Created superuser.\nEmail: {email}\nPassword: {password}")
    else:
        u = User.objects.get(email=email)
        if not u.is_superuser:
            u.is_superuser = True
            u.is_staff = True
            u.save()
            print(f"SUCCESS: Updated existing user to admin.\nEmail: {email}\nPassword: (unknown, try resetting if needed)")
        else:
            print(f"SUCCESS: Admin already exists.\nEmail: {email}\nPassword: {password} (if you haven't changed it)")

except Exception as e:
    print(f"ERROR: {e}")
