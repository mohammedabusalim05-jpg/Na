import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = "admin@nakhwa.com"
password = "admin"

try:
    if User.objects.filter(email=email).exists():
        u = User.objects.get(email=email)
        u.set_password(password)
        u.is_superuser = True
        u.is_staff = True
        u.save()
        print(f"SUCCESS: Reset password for existing admin.\nEmail: {email}\nPassword: {password}")
    else:
        # Create as superuser
        User.objects.create_superuser(username="admin_nakhwa", email=email, password=password)
        print(f"SUCCESS: Created new admin.\nEmail: {email}\nPassword: {password}")

except Exception as e:
    print(f"ERROR: {e}")
