from flask import Flask, request, Response
from paho.mqtt.client import Client, MQTTMessage
from json import dumps, loads
from grpc import insecure_channel
from notifications_pb2_grpc import NotificationsStub
from notifications_pb2 import Notification
from os import environ

environ.setdefault("FLASK_ENV", "development")

MQTT_SUB_CHANNEL = environ.get("MQTT_SUB_CHANNEL", "devices/notifications")
MQTT_PUB_CHANNEL = environ.get("MQTT_PUB_CHANNEL", "devices/messages")

stub = NotificationsStub(insecure_channel(environ.get("GRPC_URL", "localhost:9999")))
print("Sent: ", stub.Send(Notification(id = "123", sender = "123", receiver = "123", date = "123", payload = "Hey")).status)

broker = Client()

def onNotification(c: Client, userData, message: MQTTMessage):
    data = loads(message.payload)
    print("Payload:", data)
    print(stub.Send(Notification(id = "123", sender = "123", receiver = "123", date = "123", payload = dumps(data))).status)

broker.connect(environ.get("MQTT_HOST", "localhost"), int(environ.get("MQTT_PORT", "1883")))
broker.subscribe(MQTT_SUB_CHANNEL)
broker.message_callback_add(MQTT_SUB_CHANNEL, onNotification)
broker.on_message = onNotification

app = Flask(__name__)

@app.route("/publish", methods=["POST"])
def publish():
    try:
        json = request.get_json()
        assert "temperature" in json, "Body requires field 'temperature'"
        assert "humidity" in json, "Body requires field 'humidity'"
        broker.publish(MQTT_PUB_CHANNEL, dumps(json))
        return Response(response=dumps({ "message": "success!" }), status=200, content_type="json")
    except Exception as e:
        return Response(response=dumps({ "error": str(e) }), status=500, content_type="json")

broker.loop_start()
app.run()