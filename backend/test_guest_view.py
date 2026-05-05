import os
import django
from rest_framework.test import APIRequestFactory

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.views import guest_view

def test_view():
    print("Testing guest_view functionality...")
    factory = APIRequestFactory()
    request = factory.post('/api/accounts/guest/')
    try:
        response = guest_view(request)
        print(f"Status Code: {response.status_code}")
        print(f"Data: {response.data}")
        if response.status_code == 200:
            print("SUCCESS: View works correctly")
        else:
            print("FAILURE: Status code is not 200")
    except Exception as e:
        print(f"CRASH: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_view()
