# chatbot/main.py
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from socketio.asgi import ASGIApp
from routers import chat_router, socket_router

# Initialize Socket.IO server instance
sio = socketio.AsyncServer()

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Socket.IO server
sio_app = ASGIApp(sio, socketio_path="ws/socket.io")
app.mount("/ws", sio_app)

# Register routers
app.include_router(chat_router.router, prefix="/chat", tags=["chat"])

# Register Socket.IO events
socket_router.setup_socket_events(sio)  # Ensure this is using the correct function
