import socket
import os

host = os.getenv('DB_HOST', 'localhost')
port = int(os.getenv('DB_PORT', '5432'))

print(f"Checking connection to {host}:{port}...")
try:
    sock = socket.create_connection((host, port), timeout=5)
    print("Connection successful!")
    sock.close()
except Exception as e:
    print(f"Connection failed: {e}")
