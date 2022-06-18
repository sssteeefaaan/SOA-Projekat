1. Iz foldera geneva: 	- docker-compose pull
						- docker-compose up -d
						- docker ps
						
2. Pokrenuti fajl EdgeX_Tutorial/deviceCreation/createSensorCluster: 		-python ./createSensorCLuster -ip 127.0.0.1

3. Iz postman-a komanda GET http://0.0.0.0:48082/api/v1/device

4. Pokrenuti fajl EdgeX_Tutorial/deviceCreation/createRESTDevice: 			-python ./createRESTDevice -ip 127.0.0.1 -devip <uneti id device-a iz postman-a>

5. Pokrenuti fajl EdgeX_Tutorial/sensorDataGeneration/genSensorData: 		-python ./genSensorData.py

6. Iz postman-a komanda GET http://0.0.0.0:48080/api/v1/reading i trebalo bi da se vide upisani podaci

7. Pokretanje kontejnera mosquitto, influxdb i grafane

	- docker run -it --name mosquitto -p 1883:1883 -v <putanja do tvog conf (u messenger folderu je ovde)>:/mosquitto/config/mosquitto.conf eclipse-mosquitto
	
	- docker run -d --name influxdb -p 8086:8086 -e INFLUXDB_DB=sensordata -e INFLUXDB_ADMIN_USER=root -e INFLUXDB_ADMIN_PASSWORD=pass -e INFLUXDB_HTTP_AUTH_ENABLED=true influxdb

	- docker run -d --name=grafana -p 3000:3000 grafana/grafana
	
8. Pokretanje fajla messenger/app.py (moze i kroz doker)

9. Ponoviti 5. korak da se upise u influxdb i grafana napravi se konekcija za ovu bazu da se ,,posmatra"

10. Komande za EdgeX ostale