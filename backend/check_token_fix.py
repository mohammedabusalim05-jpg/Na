import os
import django
from rest_framework_simplejwt.tokens import RefreshToken

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_token():
    print("Testing RefreshToken() with no args...")
    try:
        refresh = RefreshToken()
        print(f"Created token: {refresh}")
        print(f"Access token: {refresh.access_token}")
        print("Success!")
    except Exception as e:
        print(f"Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_token()
