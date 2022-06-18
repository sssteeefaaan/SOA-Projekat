# Tutorial

1. Iz foldera ./Kod:
	docker-compose -p projekat3 up -d
						
2. Pokrenuti fajl ./EdgeX_Tutorial/deviceCreation/createSensorCluster.py:
	python createSensorCluster.py -ip 127.0.0.1

3. Iz postman-a komanda GET http://0.0.0.0:48082/api/v1/device

4. Pokrenuti fajl EdgeX_Tutorial/deviceCreation/createRESTDevice.py:
	python createRESTDevice.py -ip 127.0.0.1 -devip <uneti ID device-a iz postman-a> [preferably c18d9df1-57eb-4ba3-9169-17b8c84ecb96 (Sensor_cluster_project_iii)]

5. Pokrenuti fajl EdgeX_Tutorial/sensorDataGeneration/genSensorData.py:
	python genSensorData.py

6. Iz postman-a komanda GET http://0.0.0.0:48080/api/v1/reading i trebalo bi da se vide upisani podaci

7. Podesavanje vizuelizacije generisanih podataka u grafani
	7.0. U pretrazivacu uneti localhost:3000
	7.1. Ulogovati se
		admin
		admin
	7.2. Configuration > Data Sources > Add new data source > InfluxDB
	7.3. Uneti
		URL: 		http://influxdb-edgex:8086
		Database: 	sensordata
		User: 		admin
		Password: 	admin
		Sve ostalo ostaje isto
	7.4. Save & Test
	7.5. Dashboards > New dashboard > Add a new panel
	7.6. Odabrati
		select measurement: sensor_cluster_project_iii
		field(*)
	7.7. Apply

8. Komande za EdgeX ostale