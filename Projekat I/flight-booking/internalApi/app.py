from json import dumps, loads
from datetime import datetime
from flask import Flask, request
from influxdb import InfluxDBClient

app = Flask(__name__)
client = InfluxDBClient(host="influx", port=8086, username="admin", password="admin")

print("Connected successfully!")

if 'flight-bookings' not in map(lambda x: x['name'], client.get_list_database()):
    client.create_database('flight-bookings')

client.switch_database('flight-bookings')

@app.route('/')
def get():
    return '<h1>Hello from Flaskssssssssssssssss & Docker</h2>'

@app.route('/writeDB', methods=["POST"])
def writeDB():
    try:
        data = request.get_json()
        if client.write_points(points=[{
            "time": datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
            **data
        }]):
            return "Successful!"
        else:
            return "Unsuccessful!"
    except Exception as e:
        return "Error occurred! " + str(e).capitalize()
    

if __name__ == "__main__":
    app.run(debug=True)
