import requests

BASE_URL = "http://127.0.0.1:8000/api"

def test_profile():
    # 1. Login
    print("Logging in...")
    login_res = requests.post(f"{BASE_URL}/accounts/login/", json={
        "email": "admin@nakhwa.com",
        "password": "admin"
    })
    
    if login_res.status_code != 200:
        print(f"Login Failed: {login_res.status_code} - {login_res.text}")
        return

    token = login_res.json()["access"]
    print("Got Token.")

    # 2. Get Profile
    print("Fetching Profile...")
    headers = {"Authorization": f"Bearer {token}"}
    profile_res = requests.get(f"{BASE_URL}/accounts/profile/", headers=headers)

    if profile_res.status_code == 200:
        print("SUCCESS: Profile Fetched!")
        data = profile_res.json()
        print(f"User: {data['email']}")
        print(f"Donations Count: {len(data['donations'])}")
    else:
        print(f"FAILED: {profile_res.status_code}")
        print(profile_res.text)

if __name__ == "__main__":
    test_profile()
