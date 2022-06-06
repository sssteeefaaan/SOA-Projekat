1. Kreirati eksterni network "flightbookings" ukoliko već ne postoji
    docker network create flightbookings
2. Locirati se u okviru direktorijuma ~/Projekat I/flight-booking
3. Izvrsiti komandu
    docker-compose -p projekat1 up
4. Locirati se u okviru direktorijuma ~/Projekat II
5. Izvršiti komandu
    docker-compose -p projekat2 up
6. Pokrenuti pretraživač i ići na adresu localhost:9082
7. Ulogovati se:
    username: admin
    password: public
8. Dodati novi servis:
    Service type: Dirrect link service
    Service name: Analytics
    Endpoint: http://ekuiper:9081
9. Konfigurisati servis
    9.1. Configuration tab > Source config > mqtt > Dodati novi
        Name: mosquitto
        Server list: tcp://mosquitto:1883 (ovde obavezno pritisnuti ENTER!!!)
        Skip Certification verification: true
    9.2. Source tab > Create stream
        Stream Name: weatherStream
        Stream fields:
            temp_min - float
            temp_max - float
            date - datetime
            precipitation - float
            wind - float
            weather - string
        Data Source: services/weather
        Stream Type: mqtt
        Configuration key: mosquitto
        Stream Format: json
    9.3. Rules > Create rule
        Rule ID: badWeatherConditions
        SQL: SELECT * FROM weatherStream WHERE precipitation > 20 OR wind > 15
        Actions:
            Sink: mqtt
            MQTT broker address: tcp://mosquitto:1883
            MQTT topic: services/alerts
            Skip Certification verification: true
10. Ići na localhost[:80]
11. Izvrišiti http post request na endpoint /weather/start