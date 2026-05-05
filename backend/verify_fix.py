import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/accounts"

def test_guest_login():
    print("Testing Guest Login...")
    try:
        response = requests.post(f"{BASE_URL}/guest/")
        if response.status_code == 200:
            data = response.json()
            print("SUCCESS: Guest login returned 200")
            print(f"Token: {data.get('access')[:20]}...")
            return True
        else:
            print(f"FAILURE: Status {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    if test_guest_login():
        sys.exit(0)
    else:
        sys.exit(1)
