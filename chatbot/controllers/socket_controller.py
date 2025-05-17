# controllers/socket_controller.py
import socketio
from socketio import AsyncServer
from controllers.chat_controller import detect_intent_text
from models.message_model import save_message

sio = AsyncServer()

def register_socket_events(sio: AsyncServer):
    @sio.event
    async def connect(sid, environ):
        print(f"Client {sid} connected")

    @sio.event
    async def disconnect(sid):
        print(f"Client {sid} disconnected")

    @sio.event
    async def message(sid, data):
        print(f"Message from {sid}: {data}")
        # Here you can handle the message and send a response back to the client
        await sio.send(sid, "Hello, you said: " + data)