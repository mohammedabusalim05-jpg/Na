print("Starting debug...")
try:
    print("Importing settings...")
    import os
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()
    print("Django setup done.")
    
    print("Importing User...")
    from accounts.models import User
    print("User imported.")

    print("Importing Donation...")
    from donations.models import Donation
    print("Donation imported.")

    print("Importing accounts serializers...")
    from accounts.serializers import RegisterSerializer
    print("Accounts serializers imported.")

except Exception as e:
    print(f"Error: {e}")
