# Tutorial

<ol>
	<li>
		Iz foldera ./Kod:<br/>
		docker-compose -p projekat3 up -d
	</li>
	<li>
		Pokrenuti fajl ./EdgeX_Tutorial/deviceCreation/createSensorCluster.py:<br/>
		python createSensorCluster.py -ip 127.0.0.1
	</li>
	<li>
		Iz postman-a komanda GET http://0.0.0.0:48082/api/v1/device
	</li>
	<li>
		Pokrenuti fajl EdgeX_Tutorial/deviceCreation/createRESTDevice.py:<br/>
		python createRESTDevice.py -ip 127.0.0.1 -devip <uneti ID device-a iz postman-a> [preferably c18d9df1-57eb-4ba3-9169-17b8c84ecb96 (Sensor_cluster_project_iii)]
	</li>
	<li>
		Pokrenuti fajl EdgeX_Tutorial/sensorDataGeneration/genSensorData.py:<br/>
		python genSensorData.py
	</li>
	<li>
		Iz postman-a komanda GET http://0.0.0.0:48080/api/v1/reading i trebalo bi da se vide upisani podaci
	</li>
	<li>
		Podesavanje vizuelizacije generisanih podataka u grafani
		<ol type=1>
			<li>U pretrazivacu uneti localhost:3000</li>
			<li>Ulogovati se
				<ul>
					<li>admin</li>
					<li>admin</li>
					<li>Skip</li>
				</ul>
			</li>
			<li>Configuration > Data Sources > Add new data source > InfluxDB</li>
			<li>Uneti
				<ul>
					<li>URL: 		http://influxdb-edgex:8086</li>
					<li>Database: 	sensordata</li>
					<li>User: 		admin</li>
					<li>Password: 	admin</li>
					<li>Sve ostalo ostaje isto</li>
				</ul>
			</li>
			<li>Save & Test</li>
			<li>Dashboards > New dashboard > Add a new panel</li>
			<li>Odabrati
				<ul>
					<li>select measurement: sensor_cluster_project_iii</li>
					<li>field(*)</li>
				</ul>
			</li>
			<li>Apply</li>
		</ol>
	</li>
	<li>
		Komande za EdgeX ostale
	</li>
</ol>