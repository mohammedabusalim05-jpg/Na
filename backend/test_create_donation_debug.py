import os
import django
from django.core.files.uploadedfile import SimpleUploadedFile

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from donations.models import Donation
from django.test import RequestFactory
from donations.views import DonationCreateView
from django.contrib.auth import get_user_model

User = get_user_model()

print(f"--- START DEBUG ---")
print(f"Initial Donation Count: {Donation.objects.count()}")

# 1. Try creating via ORM
try:
    d = Donation.objects.create(
        title="ORM Test Donation",
        donation_type="money",
        description="Created via ORM script",
        guest_name="ScriptHost"
    )
    print(f"ORM Create Success: {d} (ID: {d.id})")
except Exception as e:
    print(f"ORM Create Failed: {e}")

# 2. Try creating via API View (Simulated)
try:
    factory = RequestFactory()
    data = {
        "title": "API View Test Donation",
        "donation_type": "money",
        "description": "Created via API View script",
        "guest_name": "ApiHost"
    }
    request = factory.post("/api/donations/create/", data, format="multipart")
    
    # Mock user - Guest
    from django.contrib.auth.models import AnonymousUser
    request.user = AnonymousUser()
    
    view = DonationCreateView.as_view()
    response = view(request)
    
    print(f"API View Status Code: {response.status_code}")
    if response.status_code == 201:
        print("API View Create Success")
    else:
        print(f"API View Failed: {response.data}")

except Exception as e:
    print(f"API View Exception: {e}")

print(f"Final Donation Count: {Donation.objects.count()}")
print(f"--- END DEBUG ---")
