from fastapi import APIRouter
from models.message_model import get_all_messages

router = APIRouter()


@router.get("/messages")
def fetch_messages():
    return get_all_messages()