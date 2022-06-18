# Tutorial

1. Iz foldera ./Kod:\
	docker-compose -p projekat3 up -d
						
2. Pokrenuti fajl ./EdgeX_Tutorial/deviceCreation/createSensorCluster.py:\
	python createSensorCluster.py -ip 127.0.0.1

3. Iz postman-a komanda GET http://0.0.0.0:48082/api/v1/device

4. Pokrenuti fajl EdgeX_Tutorial/deviceCreation/createRESTDevice.py:\
	python createRESTDevice.py -ip 127.0.0.1 -devip <uneti ID device-a iz postman-a> [preferably c18d9df1-57eb-4ba3-9169-17b8c84ecb96 (Sensor_cluster_project_iii)]

5. Pokrenuti fajl EdgeX_Tutorial/sensorDataGeneration/genSensorData.py:\
	python genSensorData.py

6. Iz postman-a komanda GET http://0.0.0.0:48080/api/v1/reading i trebalo bi da se vide upisani podaci

7. Podesavanje vizuelizacije generisanih podataka u grafani\
<ol>
	<li>7.0. U pretrazivacu uneti localhost:3000</li>
	<li>7.1. Ulogovati se
		<ul>
			<li>admin</li>
			<li>admin</li>
			<li>Skip</li>
		</ul>
	</li>
	<li>7.2. Configuration > Data Sources > Add new data source > InfluxDB</li>
	<li>7.3. Uneti
		<ul>
			<li>URL: 		http://influxdb-edgex:8086</li>
			<li>Database: 	sensordata</li>
			<li>User: 		admin</li>
			<li>Password: 	admin</li>
			<li>Sve ostalo ostaje isto</li>
		</ul>
	</li>
	<li>7.4. Save & Test</li>
	<li>7.5. Dashboards > New dashboard > Add a new panel</li>
	<li>7.6. Odabrati
		<ul>
			<li>select measurement: sensor_cluster_project_iii</li>
			<li>field(*)</li>
		</ul>
	</li>
	<li>7.7. Apply</li>
</ol>

8. Komande za EdgeX ostale