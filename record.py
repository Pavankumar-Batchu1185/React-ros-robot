from flask import Flask, jsonify
from zoomus import ZoomClient
from datetime import datetime, timedelta, timezone

app = Flask(__name__)

# Zoom API credentials
api_key = 'MSTBdgO9RZCH_HviSEYWwQ'
api_secret = 'HdjpCJ6bTJuefn4oaKQeH1P4f9ju2aKW'
api_account_id ='zeWuxssCT-uzaZHHdkmV5A'

@app.route('/start-meeting', methods=['POST'])
def create_zoom_meeting():
    client = ZoomClient(api_key, api_secret, api_account_id)

    meeting = {
        "topic": "Test Meeting",
        "type": 2,
        "start_time": (datetime.now(timezone.utc) + timedelta(minutes=10)).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "duration": 30,
        "timezone": "UTC ",
        "agenda": "Discuss project updates",
        "settings": {
            "host_video": True,
            "participant_video": True,
            "join_before_host": True,
            "mute_upon_entry": False,
            "audio": "voip",
            "auto_recording": "cloud"
        }
    }

    try:
        response = client.meeting.create(user_id="me", data=meeting)
        if response.status_code == 201:
            meeting_details = response.json()
            return jsonify({
                "meeting_url": meeting_details.get("join_url"),
                "meeting_id": meeting_details.get("id"),
                "meeting_password": meeting_details.get("password"),
            })
        else:
            return jsonify({"error": response.text}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
