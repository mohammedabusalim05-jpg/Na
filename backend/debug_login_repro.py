import requests

URL = "http://127.0.0.1:8000/api/accounts/login/"
DATA = {
    "email": "admin@nakhwa.com",
    "password": "admin"
}

print(f"POST {URL}")
try:
    res = requests.post(URL, json=DATA)
    print(f"Status: {res.status_code}")
    print("Response Text:")
    print(res.text)
except Exception as e:
    print(f"Request failed: {e}")
