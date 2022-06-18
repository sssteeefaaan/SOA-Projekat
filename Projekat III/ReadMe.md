# Tutorial

<ol>
	<li>
		Iz foldera ./docker-compose:<br/>
		<pre>docker-compose -p projekat3 up -d</pre>
	</li><br/>
	<li>
		Pokrenuti fajl ./device-creation/createSensorCluster.py:<br/>
		<pre>python createSensorCluster.py -ip 127.0.0.1</pre>
	</li><br/>
	<li>
		Iz postman-a komanda GET http://0.0.0.0:48082/api/v1/device
	</li><br/>
	<li>
		Pokrenuti fajl ./device-creation/createRESTDevice.py:<br/>
		<pre>python createRESTDevice.py -ip 127.0.0.1 -devip color-changer-edgex</pre>
	</li><br/>
	<li>
		Pokrenuti fajl ./sensor-data-gen/genSensorData.py:<br/>
		<pre>python genSensorData.py</pre>
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
		U pretraživaču otvoriti http://localhost:5000
	</li>
</ol>
