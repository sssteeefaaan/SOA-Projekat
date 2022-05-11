from datetime import datetime, timedelta
from lib2to3.pytree import convert
from flask import Flask, request, Response
from influxdb import InfluxDBClient
from os import environ as env
from utility import handleError, convertISO
from pymongo import IndexModel, MongoClient, ReturnDocument
from bson.objectid import ObjectId
from bson.json_util import dumps

DB = env['DATABASE_NAME']

##################################
# Setting up mongoDB
#mongoDB = MongoClient(env['MONGODB_URL'])
mongoDB = MongoClient(env['MONGO_URL_LOCAL'])
mongoBookings = mongoDB.bookings
mongoWeather = mongoDB.weather
mongoBookings.tickets.create_indexes([IndexModel([("username", 1)], name="username"), IndexModel([("departureDate", 1)], name="departureDate")])
mongoBookings.notifications.create_indexes([IndexModel([("username", 1)], name="username")])
mongoWeather.forecast.create_indexes([IndexModel([("date", 1)], name="date", unique=True)])
##################################

##################################
# Setting up influxDB
influxClient = InfluxDBClient(host=env['INFLUX_HOST'],
                        port=env['INFLUX_PORT'],
                        username=env['INFLUX_USERNAME'],
                        password=env['INFLUX_PASSWORD'])
if DB not in map(lambda x: x['name'], influxClient.get_list_database()):
    influxClient.create_database(DB)
influxClient.switch_database(DB)
##################################

##################################
# Flask
app = Flask(__name__)
@app.route('/writeDB', methods=["POST"])
def writeDB():
    try:
        if not request.is_json:
            raise Exception("Request must be application/json!")
        data = request.get_json()
        if not influxClient.write_points(points=[{
            "time": datetime.now().isoformat(),
            **data
        }]):
            raise Exception("Writting to database was unsuccessful!")
        return Response("Ok", status=200)
    except Exception as e:
        return Response(handleError(e), status=500)
    
    
@app.route('/tickets/create', methods=["POST"])
def createTicket():
    try:
        if not request.is_json:
            raise Exception("Request must be application/json!")
        data = request.get_json()
        for x in ['departureDate', 'arrivalDate']:
            data[x] = convertISO(data[x])
        result = mongoBookings.tickets.insert_one(data)
        data.update({ "_id": str(result.inserted_id) })
        return Response(dumps(data), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
        
        
@app.route('/tickets/update', methods=["PATCH"])
def updateTicket():
    try:
        if not request.is_json:
            raise Exception("Request must be application/json!")
        data = request.get_json()
        ticketId = ObjectId(data['ticketId'])
        update = {}
        if data['username']:
            update['username'] = data['username']
        if data['departureDate']:
            update['departureDate'] = convertISO(data['departureDate'])
        if data['arrivalDate']:
            update['arrivalDate'] = convertISO(data['arrivalDate'])
        if not update:
            raise Exception("Nothing to update!")
        result = mongoBookings.tickets.find_one_and_update({ '_id': ticketId }, { '$set': update }, return_document=ReturnDocument.BEFORE)
        notification = {
                'notification-type': 'Flight info modified',
                'info': data.get('info', 'General modification'),
                'username': result['username'], # update['username'] or result['username']
                'ticket': result,
                'changes': update
        }
        notification.update({ '_id': mongoBookings.notifications.insert_one(notification).inserted_id })
        return Response(dumps(notification), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)

    
@app.route('/tickets/delete/<ticketId>', methods=["DELETE"])
def deleteTicket(ticketId):
    try:
        ticketId = ObjectId(ticketId)
        result = mongoBookings.tickets.find_one_and_delete({'_id': ticketId })
        if not result:
            raise Exception("Ticket cancellation failed!")
        return Response(dumps(result), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
    
@app.route('/tickets/user/<username>/', defaults={ 'skip': 0, 'limit': 100 })
@app.route('/tickets/user/<username>/<skip>/<limit>', methods=["GET"])
def getTickets(username, skip=0, limit=100):
    try:
        result = mongoBookings.tickets.find({ "username": username }).skip(skip).limit(limit)
        return Response(dumps(result), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)
    

@app.route('/tickets/<ticketId>', methods=["GET"])
def getTicket(ticketId):
    try:
        result = mongoBookings.tickets.find_one(ObjectId(ticketId))
        return Response(dumps(result), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)


@app.route('/delay-flights', methods=["POST"])
def delayFlights():
    try:
        data = request.get_json()
        data['date'] = convertISO(data['date'])
        dayApart = (data['date'] + timedelta(days=1))
        flights = mongoBookings.tickets.find({ 'departureDate': { '$gte': data['date'], '$lt': dayApart }}, { '_id': 0 })
        notifications = []
        for flight in flights:
            notifications.append({
                'notification-type': 'Flight delayed',
                'info': data.get('info', 'Bad weather conditions'),
                'newDepartureDate': (flight['departureDate'] + timedelta(days=1)),
                'newarrivalDate': (flight['arrivalDate'] + timedelta(days=1)),
                'username': flight['username'],
                'ticket': flight
            })
        if notifications:
            inserted = len(mongoBookings.notifications.insert_many(notifications).inserted_ids)
            updated = (mongoBookings.tickets.update_many({ 'departureDate': { '$gte': data['date'], '$lt': dayApart }},
            [{
                '$set':
                {
                    'departureDate': { '$add': [ "$departureDate", 1000 * 60 * 60 * 24 ] },
                    'arrivalDate': { '$add': [ "$arrivalDate", 1000 * 60 * 60 * 24 ] }
                }
            }])).modified_count
        else:
            inserted = updated = 0
        return Response(dumps({ 'modified_count': updated, 'notified_count': inserted }), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)


@app.route('/weather', methods=["POST"])
def logWeather():
    try:
        data = request.get_json()
        data['date'] = convertISO(data['date'])
        weather = mongoWeather.forecast.find_one_and_update({ 'date': data['date'] }, { '$set' : data }, upsert=True, return_document=ReturnDocument.AFTER)
        return Response(dumps(weather), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)


@app.route('/weather/<start_date>/<end_date>', methods=["GET"])
def weatherForecast(start_date, end_date):
    try:
        filter = {
            '$gte': convertISO(start_date),
            '$lte': convertISO(end_date)
        }
        search = mongoWeather.forecast.find({ 'date': filter })
        return Response(dumps(search), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)


@app.route('/notifications/<username>', methods=["GET"])
def getNotifications(username):
    try:
        search = mongoBookings.notifications.find({ 'username': username })
        return Response(dumps(search), status=200, mimetype="json")
    except Exception as e:
        return Response(handleError(e), status=500)


if __name__ == "__main__":
    app.run(debug=env["DEBUG"])
