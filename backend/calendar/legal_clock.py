# ============================================================
#  Juris.AI — Legal Clock Agent (Google Calendar API)
# ============================================================
import os
from datetime import datetime, timedelta
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

SCOPES = ["https://www.googleapis.com/auth/calendar"]
CREDENTIALS_FILE = os.getenv("GOOGLE_CREDENTIALS_FILE", "./calendar/credentials.json")
CALENDAR_ID = os.getenv("GOOGLE_CALENDAR_ID", "primary")


def get_calendar_service():
    creds = None
    token_path = "./calendar/token.json"
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
        creds = flow.run_local_server(port=0)
        with open(token_path, "w") as f:
            f.write(creds.to_json())
    return build("calendar", "v3", credentials=creds)


def get_upcoming_events(days: int = 30) -> list:
    service = get_calendar_service()
    now = datetime.utcnow().isoformat() + "Z"
    future = (datetime.utcnow() + timedelta(days=days)).isoformat() + "Z"
    result = service.events().list(
        calendarId=CALENDAR_ID,
        timeMin=now, timeMax=future,
        maxResults=20, singleEvents=True, orderBy="startTime"
    ).execute()
    events = result.get("items", [])
    return [{"summary": e.get("summary"), "start": e["start"].get("dateTime", e["start"].get("date")), "description": e.get("description", "")} for e in events]


def create_legal_deadline(summary: str, date: str, description: str = "") -> dict:
    """Create a Google Calendar event for a legal deadline."""
    service = get_calendar_service()
    event = {
        "summary": f"⚖️ {summary}",
        "description": description,
        "start": {"date": date},
        "end": {"date": date},
        "reminders": {"useDefault": False, "overrides": [
            {"method": "email", "minutes": 7 * 24 * 60},
            {"method": "popup", "minutes": 24 * 60},
        ]},
    }
    created = service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
    return {"event_id": created.get("id"), "link": created.get("htmlLink")}
