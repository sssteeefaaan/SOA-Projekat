<h1>Pokretanje</h1>
<ol>
  <li>
		Pozicionirati se u okviru direktorijuma ./flight-booking<br/>
		<pre>cd flight-booking</pre>
	</li>
	<li>
		Iz foldera ./flight-booking izvršiti komandu:<br/>
		<pre>docker-compose -p projekat1 up -d</pre>
	</li>
</ol>

<h1>Nakon pokretanja dostupan WEB UI:</h1>

<ul>
	<li>
		Swagger UI<br/>
		<pre><a href="http://localhost:80">http://localhost:80</a></pre>
	</li>
	<li>
		Grafana<br/>
		<pre><a href="http://localhost:4200">http://localhost:4200</a></pre>
	</li>
</ul>

<h1>Kratak opis</h1>
<b>Tema projekta: "<i>Pretraga i resezrvacija letova</i>"<br/>
Za projekat su iskorišćeni:
  <ul>
    <li>
      <a href="https://www.kaggle.com/datasets/ananthr1/weather-prediction">Dataset</a>
    </li>
    <li>
      <a href="https://developers.amadeus.com">Public API</a>
    </li>
  </ul>
</b>
    
<h1>Kontejneri</h1>
<ul>
  <li>
     Moleculer API
    <pre><a href="http://localhost:3000">http://localhost:3000</a></pre>
  </li>
  <li>
     Internal (Python-Flask) API
    <pre><a href="http://localhost:99">http://localhost:99</a></pre>
  </li>
  <li>
     MongoDB
    <pre><a href="mongodb://admin:admin@mongo:27017/?authSource=admin">mongodb://admin:admin@mongo:27017/?authSource=admin</a></pre>
  </li>
  <li>
     InfluxDB
    <pre><a href="http://localhost:8086">http://localhost:8086</a></pre>
  </li>
</ul>
