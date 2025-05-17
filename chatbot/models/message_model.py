from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("DB_NAME")]
messages_collection = db["messages"]

def save_message(sender, message):
    messages_collection.insert_one({"sender": sender, "message": message})

def get_all_messages():
    return list(messages_collection.find({}, {"_id": 0}))