from google.cloud import dialogflow_v2 as dialogflow
import os
import uuid
import json
from google.api_core.exceptions import InvalidArgument

from models.message_model import save_message

DIALOGFLOW_PROJECT_ID = json.load(open(os.getenv("DIALOGFLOW_CREDENTIALS")))['project_id']
DIALOGFLOW_LANGUAGE_CODE = 'en'
SESSION_ID = str(uuid.uuid4())

session_client = dialogflow.SessionsClient.from_service_account_json(os.getenv("DIALOGFLOW_CREDENTIALS"))


def detect_intent_text(message_text):
    session = session_client.session_path(DIALOGFLOW_PROJECT_ID, SESSION_ID)
    text_input = dialogflow.types.TextInput(text=message_text, language_code=DIALOGFLOW_LANGUAGE_CODE)
    query_input = dialogflow.types.QueryInput(text=text_input)
    try:
        response = session_client.detect_intent(session=session, query_input=query_input)
        return response.query_result.fulfillment_text
    except InvalidArgument:
        return "Sorry, I didn't understand that."
