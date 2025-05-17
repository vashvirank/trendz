# chatbot/routers/socket_router.py
from controllers.socket_controller import register_socket_events

def setup_socket_events(sio):
    register_socket_events(sio)  # This registers the events from your controller
