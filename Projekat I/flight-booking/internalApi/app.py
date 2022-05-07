from crypt import methods
from datetime import datetime
from flask import Flask, request, Response
from influxdb import InfluxDBClient
from os import environ as env, stat
from handleError import handleError
from pymongo import MongoClient, ReturnDocument
from bson.objectid import ObjectId
from bson.json_util import dumps

DB = env['DATABASE_NAME']

app = Flask(__name__)
influxClient = InfluxDBClient(host=env['INFLUX_HOST'],
                        port=env['INFLUX_PORT'],
                        username=env['INFLUX_USERNAME'],
                        password=env['INFLUX_PASSWORD'])


mongoClient = MongoClient(env['MONGODB_URL'])
mongoDatabase = mongoClient.bookings

print("Connected successfully!")

if DB not in map(lambda x: x['name'], influxClient.get_list_database()):
    influxClient.create_database(DB)
    
influxClient.switch_database(DB)


@app.route('/writeDB', methods=["POST"])
def writeDB():
    try:
        if not request.is_json:
            raise Exception("Request must be application/json!")
        data = request.get_json()
        if not influxClient.write_points(points=[{
            "time": datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
            **data
        }]):
            raise Exception("Writting to database was unsuccessful!")
        return Response("Ok", status=200)
    except Exception as e:
        return Response(handleError(e), status=500)
    
    
@app.route('/book-a-ticket', methods=["POST"])
def bookTicket():
    try:
        if not request.is_json:
            raise Exception("Request must be application/json!")
        data = request.get_json()
        result = mongoDatabase.tickets.insert_one(data)
        data.update({ "_id": str(result.inserted_id) })
        return Response(dumps(data), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
        
        
@app.route('/book-a-flight', methods=["POST"])
def bookFlight():
    try:
        if not request.is_json:
            raise Exception("Request must be application/json!")
        data = request.get_json()
        result = mongoDatabase.tickets.insert_one(data)
        data.update({ "_id": str(result.inserted_id) })
        return Response(dumps(data), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
        
        
@app.route('/change-ticket-info', methods=["PATCH"])
def changeTicketInfo():
    try:
        if not request.is_json:
            raise Exception("Request must be application/json!")
        data = request.get_json()
        ticketId = ObjectId(data['ticketId'])
        update = { x : data[x] for x in data.keys() if x != 'ticketId' }
        if not update:
            raise Exception("Nothing to update!")
        result = mongoDatabase.tickets.find_one_and_update({ '_id': ticketId }, { '$set': update }, return_document=ReturnDocument.AFTER)
        return Response(dumps(result), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
        
        
@app.route('/change-user', methods=["PATCH"])
def changeUser():
    try:
        if not request.is_json:
            raise Exception("Request must be application/json!")
        data = request.get_json()
        ticketId = ObjectId(data['ticketId'])
        update = { x : data[x] for x in data.keys() if x != 'ticketId' }
        if not update:
            raise Exception("Nothing to update!")
        result = mongoDatabase.tickets.find_one_and_update({ '_id': ticketId }, { '$set': update }, return_document=ReturnDocument.AFTER)
        return Response(dumps(result), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)

    
@app.route('/cancel-a-ticket', methods=["DELETE"])
def cancelTicket():
    try:
        ticketId = ObjectId(request.args.get('ticketId'))
        result = mongoDatabase.tickets.find_one_and_delete({'_id': ticketId })
        if not result:
            raise Exception("Ticket cancellation failed!")
        return Response(dumps(result), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
    
    
@app.route('/get-tickets', methods=["GET"])
def getTickets():
    try:
        result = mongoDatabase.tickets.find({"username": request.args.get('username')}).skip(request.args.get('skip', 0)).limit(request.args.get('limit', 100))
        return Response(dumps(result), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
    
    
@app.route('/get-ticket', methods=["GET"])
def getTicket():
    try:
        ticketId = ObjectId(request.args.get("ticketId"))
        result = mongoDatabase.tickets.find_one(ticketId)
        return Response(dumps(result), status=200, mimetype="json")
    
    except Exception as e:
        return Response(handleError(e), status=500)
        
        
@app.route('/get-flights', methods=["GET"])
def getFlights():
    try:
        result = mongoDatabase.tickets.find({"destination": request.args.get('destination')}).sort("departureDate")
        return Response(dumps(result), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
        
        
@app.route('/get-flights-date', methods=["GET"])
def getFlightsForDate():
    try:
        result = mongoDatabase.tickets.find({"departureDate": request.args.get('departureDate')}).sort("username")
        return Response(dumps(result), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
    
    
@app.route('/')
def get():
    try:
        print("Here i am")
        return Response("Ok", status=200)
    except Exception as e:
        return Response(handleError(e), status=500)


if __name__ == "__main__":
    app.run(debug=env["DEBUG"])
