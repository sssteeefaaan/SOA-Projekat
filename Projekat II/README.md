<body>
    <h1>Tutorijal</h1>
    <ol>
        <li>
            Kreirati eksterni network "<em>flightbookings</em>" ukoliko već ne postoji
            <pre>docker network create flightbookings</pre>
        </li>
        <li>
            Pokrenuti prvi projekat  [<a href="https://github.com/sssteeefaaan/SOA-Projekat/edit/main/Projekat%20I">Tutorijal</a>]
        </li><br/>
        <li>
            U okviru direktorijuma ~/Projekat II izvršiti komandu
            <pre>docker-compose -p projekat2 up</pre>
        </li>
        <li>
            Konfiguracija eKuiper-a:
            <ol>
                <li>
                    U pretraživaču otvoriti eKuiperManager Web UI  [<a href="http://localhost:9082">http://localhost:9082</a>]
                </li>
                <li>
                    Ulogovati se:
                    <ul>
                        <li><b>username:</b> <em>admin</em></li>
                        <li><b>password:</b> <em>public</em></li>
                    </ul>
                </li><br/>
                <li>
                    Dodati novi servis:
                    <ul>
                        <li><b>Service type:</b> <em>Dirrect link service</em></li>
                        <li><b>Service name:</b> <em>Analytics</em></li>
                        <li><b>Endpoint:</b> <a href="http://ekuiper:9081">http://ekuiper:9081</a></li>
                    </ul>
                </li><br/>
                <li>
                    Konfigurisati servis:
                    <ol>
                        <li>
                            Configuration tab > Source config > mqtt > Dodati novi
                            <ul>
                                <li><b>Name:</b> <em>mosquitto</em></li>
                                <li><b>Server list:</b> <em>tcp://mosquitto:1883</em> <u>(ovde obavezno pritisnuti ENTER!!!)</u></li>
                                <li><b>Skip Certification verification:</b> <em>true</em></li>
                            </ul>
                        </li><br/>
                        <li>
                            Source tab > Create stream
                            <ul>
                                <li><b>Stream Name:</b> <em>weatherStream</em></li>
                                <li>
                                    <b>Stream fields:</b>
                                    <ul>
                                        <li><em>temp_min - float</em></li>
                                        <li><em>temp_max - float</em></li>
                                        <li><em>date - datetime</em></li>
                                        <li><em>precipitation - float</em></li>
                                        <li><em>wind - float</em></li>
                                        <li><em>weather - string</em></li>
                                    </ul>
                                </li>
                                <li><b>Data Source:</b> <em>services/weather</em></li>
                                <li><b>Stream Type:</b> <em>mqtt</em></li>
                                <li><b>Configuration key:</b> <em>mosquitto</em></li>
                                <li><b>Stream Format:</b> <em>json</em></li>
                            </ul>
                        </li><br/>
                        <li>
                            Rules > Create rule:
                            <ul>
                                <li><b>Rule ID:</b> <em>badWeatherConditions</em></li>
                                <li><b>SQL:</b> <em>SELECT * FROM weatherStream WHERE precipitation > 20 OR wind > 15</em></li>
                                <li>
                                    <b>Actions:</b>
                                    <ul>
                                        <li><b>Sink:</b> <em>mqtt</em></li>
                                        <li><b>MQTT broker address:</b> <em>tcp://mosquitto:1883</em></li>
                                        <li><b>MQTT topic:</b> <em>services/alerts</em></li>
                                        <li><b>Skip Certification verification:</b> <em>true</em></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ol>
                </li>
            </ol>
        </li><br/>
        <li>
            Otvoriti Swager UI  [<a href="http://localhost:80">http://localhost:80</a>]
        </li><br/>
        <li>
            Izvršiti POST request na endpoint
            <pre>/weather/start</pre>
        </li><br/>
        <li>
            Nadgledati podatke u bazi<br/>
            <pre>mongodb://admin:admin@mongo:27017/?authSource=admin</pre>
        </li>
    </ol>
</body>
