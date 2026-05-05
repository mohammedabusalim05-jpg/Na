import requests

URL = "http://127.0.0.1:8000/api/accounts/guest/"

print(f"POST {URL}")
try:
    res = requests.post(URL)
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        print("SUCCESS: Guest Token Received")
        print(res.json())
    else:
        print("FAILED:")
        print(res.text)
except Exception as e:
    print(f"Request failed: {e}")
