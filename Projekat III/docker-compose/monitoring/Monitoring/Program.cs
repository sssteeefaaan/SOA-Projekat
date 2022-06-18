using MQTTnet.Client;
using MQTTnet;
using Newtonsoft.Json;

namespace Monitoring
{
    public static class Program
    {
        public static void Main(String[] args)
        {
            var mqttFactory = new MqttFactory();

            string? address = Environment.GetEnvironmentVariable("BROKER_ADDRESS"),
                topic = Environment.GetEnvironmentVariable("BROKER_TOPIC"),
                deviceAddress = Environment.GetEnvironmentVariable("DEVICE_ADDRESS");
            if (address == null)
                address = "127.0.0.1";
            if (topic == null)
                topic = "edgex-tutorial";
            if (deviceAddress == null)
                deviceAddress = "http://127.0.0.1:48082/api/v1/device/name/SOAProjectIII/command/color";

            var mqttClient = mqttFactory.CreateMqttClient();

            var mqttClientOptions = new MqttClientOptionsBuilder()
                .WithTcpServer(address)
                .Build();

            mqttClient.ApplicationMessageReceivedAsync += e =>
            {
                string s = System.Text.Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
                SensorDataMessage m = JsonConvert.DeserializeObject<SensorDataMessage>(s);

                string color = "";
                if(m.Readings?.Count > 0)
                    color = Evaluate(m.Readings[0]);
                if (!String.IsNullOrEmpty(color))
                {
                    Console.Write(color + "\t");
                    HttpClient client = new HttpClient();
                    HttpResponseMessage rm = client.PutAsync(deviceAddress,
                            new StringContent(JsonConvert.SerializeObject(
                                new
                                {
                                    color
                                }),
                                System.Text.Encoding.UTF8,
                                "application/json")).Result;
                    Console.WriteLine(rm.Content.ReadAsStringAsync().Result);
                }

                return Task.CompletedTask;
            };

            mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None).Wait();

            Console.WriteLine("MQTT client connected!");

            var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
                .WithTopicFilter(f => { f.WithTopic(topic); })
                .Build();

            mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None).Wait();

            Console.WriteLine("MQTT client subscribed to topic!");
            Thread.Sleep(Timeout.Infinite);
        }

        public static string Evaluate(SensorDataReading r)
        {
            string ret = "";
            switch(r.Name)
            {
                case ("temperature"):
                    int t = Int16.Parse(r.Value);
                    if (t > 25)
                        ret = "red";
                    else if (t < 15)
                        ret = "lightblue";
                    break;
                case ("humidity"):
                    int h = Int16.Parse(r.Value);
                    if (h > 70)
                        ret = "blue";
                    else if (h < 50)
                        ret = "yellow";
                    break;
                case ("light"):
                    if (!Boolean.Parse(r.Value))
                        ret = "black";
                    break;
                default:
                    break;
            }
            return ret;
        }
    }
}