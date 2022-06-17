import paho.mqtt.client as mqtt
import sys
import time
import json
import argparse
from influxdb import InfluxDBClient
from datetime import datetime

broker_address  = "127.0.0.1"
topic           = "edgex-tutorial"
dbhost          = "127.0.0.1"
dbport          = 8086
dbuser          = "root"
dbpassword      = "pass"
dbname          = "sensordata"


def influxDBconnect():

    """Instantiate a connection to the InfluxDB."""
    influxDBConnection = InfluxDBClient(dbhost, dbport, dbuser, dbpassword, dbname)

    return influxDBConnection



def influxDBwrite(device, sensorName, sensorValue):

    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

    measurementData = [
        {
            "measurement": device,
            "tags": {
                "gateway": device,
                "location": "Nis"
            },
            "time": timestamp,
            "fields": {
                sensorName: sensorValue
            }
        }
    ]
    influxDBConnection.write_points(measurementData, time_precision='ms')



def on_message(client, userdata, message):
    m = str(message.payload.decode("utf-8"))
    obj = json.loads(m)
 
    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

    for entry in obj["readings"]:

        device      = entry["device"]
        sensorName  = entry["name"]
        sensorValue = entry["value"]

        influxDBwrite(device, sensorName, sensorValue)




influxDBConnection = influxDBconnect()

print("Creating new instance ...")
client = mqtt.Client("sub1") 
client.on_message=on_message 
# client.username_pw_set("mqttUser", "mqttPass")

print("Connecting to broker ...")
client.connect(broker_address, 1883) 
print("...done")

client.loop_start()

while True:
    client.subscribe(topic)
    time.sleep(1)

client.loop_stop()
