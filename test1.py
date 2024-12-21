import requests

api_key = 'fQ_vrZLQX6gGHjtqK2zQ'
api_secret = 'l0YRtDfST51J1maW4BgWHMNlZLB4n5mS'
access_token = 'eyJzdiI6IjAwMDAwMiIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjI1NDEzZWM5LTVjMDctNDkyZS04ZjQwLWE3NTY1ZDNmZTYwMiJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJjR1IyaVJJb1RyU1Nrc0p0OUZ6dVV3IiwidmVyIjoxMCwiYXVpZCI6IjY2MDhmYjI5ZmUxOWZjNWFkYTI0OWQ2Y2NmYjU5NTQzYjViMzBkMzM1MjMyMWQxMzFkM2RhZDk3ODY3NzBkOGYiLCJuYmYiOjE3MzM1MzY4ODgsImNvZGUiOiJKSW1aWkN5eVFCNkNER3MzX0IwTmh3NXRzdjUwZ2pVUkciLCJpc3MiOiJ6bTpjaWQ6ZlFfdnJaTFFYNmdHSGp0cUsyelEiLCJnbm8iOjAsImV4cCI6MTczMzU0MDQ4OCwidHlwZSI6MywiaWF0IjoxNzMzNTM2ODg4LCJhaWQiOiJkNjA2NWZRZlRaNmo4ZVl6bUc2bnpBIn0.P1rDgmBx8PCGRRKp8aFOuzqYzZm-Olfk6Lp6m9y7FIHqjpYVytTnR47x3DQr3oh1hf50_b3AymW0GYH5kTWs0w'

# Server-to-Server OAuth credentials
CLIENT_ID = api_key
CLIENT_SECRET = api_secret

# Zoom's token endpoint
TOKEN_URL = "https://zoom.us/oauth/token"

# Request body and headers
payload = {"grant_type": "client_credentials"}
headers = {
    "Authorization": f"Basic {requests.auth._basic_auth_str(CLIENT_ID, CLIENT_SECRET)}",
}

# Send the request
response = requests.post(TOKEN_URL, headers=headers, data=payload)

if response.status_code == 200:
    token_data = response.json()
    access_token = token_data["access_token"]
    print("Access Token:", access_token)
else:
    print(f"Failed to get access token: {response.status_code}")
    print(response.json())
