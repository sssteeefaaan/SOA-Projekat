from datetime import datetime
import time
import json
from flask import Flask, request, Response
from influxdb import InfluxDBClient
from os import environ as env, stat
from handleError import handleError
from pymongo import MongoClient, ReturnDocument
from bson.objectid import ObjectId
from bson.json_util import dumps
import csv

app = Flask(__name__)

mongoClient = MongoClient(env['MONGODB_URL'])
mongoDatabase = mongoClient.bookings

WRITE_DATA = False

def sendToGateway():
    with open('seattle-weather.csv', encoding='latin-1') as file:
        data = csv.DictReader(file)
        for row in data:
            if not '2012' in row[1] or not '2013' in row[1]:
                json.dumps(data)
                print('send')                 # slanje jednog sloga gateway-u
            time.sleep(5)

        
@app.route('/writeWeatherData', methods=["POST"])
def writeWeatherData():
    try:
        if not request.is_json:
            raise Exception("Request must be application/json!")
        data = request.get_json()
        result = mongoDatabase.weather.insert_one(data)
        data.update({ "_id": str(result.inserted_id) })
        return Response(dumps(data), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)