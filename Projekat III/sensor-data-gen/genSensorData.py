import csv
import requests
import json
import random
import time


edgexip = '127.0.0.1'

tempList = list()
humList = list()
lightList = list()
motionList = list()

with open("iot_telemetry_data.csv", "r") as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        tempList.append(row['temp'])
        humList.append(row['humidity'])
        lightList.append(row['light'])
        motionList.append(row['motion'])

def generateSensorData():

    i = random.randint(1, 405185)
    temp = int(round(float(tempList[i])))
    humidity = int(round(float(humList[i])))
    if lightList[i]=='true':
        light = True
    else:
        light = False
    if motionList[i]=='true':
        motion = True
    else:
        motion = False

    print("Sending values: Temperature %s, Humidity %s, Light detected %s, Motion detected %s" % (temp, humidity, light, motion))

    return (temp, humidity, light, motion)
            

if __name__ == "__main__":

    sensorTypes = ["temperature", "humidity", "light", "motion"]

    while(1):

        (temperature, humidity, light, motion) = generateSensorData()

        url = 'http://%s:49986/api/v1/resource/Sensor_cluster_project_iii/temperature' % edgexip
        payload = temperature
        headers = {'content-type': 'application/json'}
        response = requests.post(url, data=json.dumps(payload), headers=headers, verify=False)

        url = 'http://%s:49986/api/v1/resource/Sensor_cluster_project_iii/humidity' % edgexip
        payload = humidity
        headers = {'content-type': 'application/json'}
        response = requests.post(url, data=json.dumps(payload), headers=headers, verify=False)

        url = 'http://%s:49986/api/v1/resource/Sensor_cluster_project_iii/light' % edgexip
        payload = light
        headers = {'content-type': 'application/json'}
        response = requests.post(url, data=json.dumps(payload), headers=headers, verify=False)

        url = 'http://%s:49986/api/v1/resource/Sensor_cluster_project_iii/motion' % edgexip
        payload = motion
        headers = {'content-type': 'application/json'}
        response = requests.post(url, data=json.dumps(payload), headers=headers, verify=False)

        time.sleep(5)