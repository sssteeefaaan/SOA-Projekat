from datetime import datetime
from hashlib import new
import time
import csv


with open('seattle-weather.csv', encoding='latin-1') as file:
    data = csv.DictReader(file)
    for row in data:
        date = row.get('date')
        isoDate = datetime.strptime(date, '%Y-%m-%d')
        year = isoDate.year
        year += 8
        newDate = isoDate.replace(year = year)
        row['date'] = newDate   
        print(row)   
        time.sleep(5)
