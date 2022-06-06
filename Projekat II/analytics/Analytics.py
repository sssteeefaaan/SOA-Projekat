from datetime import datetime as dt
from paho.mqtt.client import Client, MQTTMessage
from json import dumps, loads
from grpc import insecure_channel
from alerts_pb2_grpc import AlertsStub
from alerts_pb2 import Alert
from os import environ
from socket import gethostname
from pymongo.mongo_client import MongoClient

MY_HOSTNAME = gethostname()
MQTT_SUB_CHANNEL = environ.get("MQTT_SUB_CHANNEL", "services/alerts")
GRPC_URL = environ.get("GRPC_URL", "localhost:9999")

stub = AlertsStub(insecure_channel(GRPC_URL))
broker = Client()

mongoDB = MongoClient(environ.get('MONGO_URL_LOCAL', "localhost:27017"))
mongoAlerts = mongoDB.alerts
#mongoAlerts.alerts.create_indexes([IndexModel([("username", 1)], name="username"), IndexModel([("departureDate", 1)], name="departureDate")])

def onAlert(c: Client, userData, message: MQTTMessage):
    try:
        document = {
            "sender": MY_HOSTNAME,
            "receiver": GRPC_URL,
            "date": dt.utcnow(),
            "payload": loads(message.payload)
        }
        document["id"] = str(mongoAlerts.alerts.insert_one(document).inserted_id)
        print(stub.Send(Alert(id = document["id"], sender = document["sender"], receiver = document["receiver"], date = document["date"].isoformat(), payload = dumps(document["payload"]))).status)
    except Exception as e:
        print("Error occurred:", str(e))

def onMessageDefault(c: Client, userData, message: MQTTMessage):
    data = loads(message.payload)
    print("Payload:", data)

broker.connect(environ.get("MQTT_HOST", "localhost"), int(environ.get("MQTT_PORT", "1883")))
broker.subscribe(MQTT_SUB_CHANNEL)
broker.message_callback_add(MQTT_SUB_CHANNEL, onAlert)
broker.on_message = onMessageDefault

broker.loop_forever()