# Tutorial

<ol>
	<li>
		Iz foldera ./Kod:<br/>
		<b>docker-compose -p projekat3 up -d</b>
	</li><br/>
	<li>
		Pokrenuti fajl ./EdgeX_Tutorial/deviceCreation/createSensorCluster.py:<br/>
		<b>python createSensorCluster.py -ip 127.0.0.1</b>
	</li><br/>
	<li>
		Iz postman-a komanda GET http://0.0.0.0:48082/api/v1/device
	</li><br/>
	<li>
		Pokrenuti fajl EdgeX_Tutorial/deviceCreation/createRESTDevice.py:<br/>
		<b>python createRESTDevice.py -ip 127.0.0.1 -devip <uneti ID device-a iz postman-a> </b> [preferably c18d9df1-57eb-4ba3-9169-17b8c84ecb96 (Sensor_cluster_project_iii)]
	</li><br/>
	<li>
		Pokrenuti fajl EdgeX_Tutorial/sensorDataGeneration/genSensorData.py:<br/>
		<b>python genSensorData.py</b>
	</li><br/>
	<li>
		Iz postman-a komanda GET http://0.0.0.0:48080/api/v1/reading i trebalo bi da se vide upisani podaci
	</li><br/>
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
	</li><br/>
	<li>
		Komande za EdgeX ostale
	</li><br/>
</ol>