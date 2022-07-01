<body>
    <h1>Tutorijal</h1>
    <ol>
        <li>
            Pozicionirati se u okviru docker-compose direktorijuma<br/>
            <pre>cd docker-compose</pre>
        </li>
        <li>
            Iz foldera ~/Projekat III/docker-compose izvršiti komandu:<br/>
            <pre>docker-compose -p projekat3 up -d</pre>
        </li>
        <li>
            Pozicionirati se u okviru direktorijuma device-creation<br/>
            <pre>cd ../device-creation</pre>
        </li>
        <li>
            Pokrenuti fajl ~/Projekat III/device-creation/createSensorCluster.py:<br/>
            <pre>python createSensorCluster.py -ip 127.0.0.1</pre>
        </li>
        <li>
            Iz postman-a izvršiti komandu GET na http://0.0.0.0:48082/api/v1/device
        </li><br/>
        <li>
            Pokrenuti fajl ./device-creation/createRESTDevice.py:<br/>
            <pre>python createRESTDevice.py -ip 127.0.0.1 -devip color-changer-edgex</pre>
        </li>
        <li>
            Pozicionirati se u okviru direktorijuma sensor-data-gen<br/>
            <pre>cd ../sensor-data-gen</pre>
        </li>
        <li>
            Pokrenuti fajl ./sensor-data-gen/genSensorData.py:<br/>
            <pre>python genSensorData.py</pre>
        </li>
        <li>
            Iz postman-a izvršiti komandu GET na http://0.0.0.0:48080/api/v1/reading i trebalo bi da se vide upisani podaci
        </li><br/>
        <li>
            Podešavanje vizuelizacije generisanih podataka u grafani
            <ol type=1>
                <li>U pretraživaču uneti <a href="http://localhost:3000">http://localhost:3000</a></li>
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
            U pretraživaču otvoriti <a href="http://localhost:5000">http://localhost:5000</a>
        </li>
    </ol>
</body>
