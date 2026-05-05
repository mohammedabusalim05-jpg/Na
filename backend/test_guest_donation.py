import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/donations/create/"

payload = {
    "title": "Guest Donation Test",
    "description": "Testing guest donation functionality",
    "donation_type": "money",
    "guest_name": "Test Guest",
    "guest_email": "guest@example.com",
    "guest_phone": "123456789"
}

print(f"Sending Guest Donation to {BASE_URL}...")
try:
    response = requests.post(BASE_URL, data=payload) # No Auth Headers
    
    if response.status_code == 201:
        print("SUCCESS: Donation created!")
        print(response.json())
    else:
        print(f"FAILED: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"ERROR: {e}")
