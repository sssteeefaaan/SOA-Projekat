from json import dumps, loads
from datetime import datetime
from flask import Flask, request
from influxdb import InfluxDBClient
from os import environ as env

app = Flask(__name__)
client = InfluxDBClient(host=env['DATABASE_HOSTNAME'], port=env['DATABASE_PORT'], username=env['DATABASE_USERNAME'], password=env['DATABASE_PASSWORD'])

print("Connected successfully!")

DB = env['DATABASE_NAME']

if DB not in map(lambda x: x['name'], client.get_list_database()):
    client.create_database(DB)

client.switch_database(DB)

@app.route('/writeDB', methods=["POST"])
def writeDB():
    try:
        resp = "Successful!"
        print(request.data)
        data = loads(request.data)
        print("Data is this", data)
        if not client.write_points(points=[{
            "time": datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
            **data
        }]):
            resp = "Unsuccessful!"
        print(resp)
        return resp
    except Exception as e:
        msg = "Error occurred! " + str(e).capitalize()
        print(msg)
        return msg
    
@app.route('/')
def get():
    try:
        print("Here i am")
        return "OK"
    except Exception as e:
        msg = "Error occurred! " + str(e).capitalize()
        print(msg)
        return msg
    

if __name__ == "__main__":
    app.run(debug=env["DEBIG"])
