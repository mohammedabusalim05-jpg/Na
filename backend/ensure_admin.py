
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

email = "admin@nakhwa.com"
password = "admin"  # Or whatever default we want

try:
    if not User.objects.filter(email=email).exists():
        print(f"Creating superuser {email}...")
        User.objects.create_superuser(
            email=email,
            username=email, # Start with email as username
            password=password,
            first_name="Admin",
            last_name="User"
        )
        print("Superuser created successfully.")
    else:
        print(f"User {email} already exists. Ensuring it is a superuser/staff...")
        u = User.objects.get(email=email)
        u.is_staff = True
        u.is_superuser = True
        u.set_password(password) # Reset password to be sure
        u.save()
        print("User updated to superuser status.")

except Exception as e:
    print(f"Error: {e}")
