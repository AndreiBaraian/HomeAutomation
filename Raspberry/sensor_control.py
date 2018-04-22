# -*- coding: utf-8 -*-
"""
Created on Sun Apr 22 22:47:14 2018

@author: bara_
"""

import sys

import Adafruit_DHT

temperature_sensor = 22
temperature_pin = 23

humidity, temperature = Adafruit_DHT.read_retry(temperature_sensor, temperature_pin)

# Un-comment the line below to convert the temperature to Fahrenheit.
# temperature = temperature * 9/5.0 + 32

if humidity is not None and temperature is not None:
    print('Temp={0:0.1f}*  Humidity={1:0.1f}%'.format(temperature, humidity))
else:
    print('Failed to get reading. Try again!')
    sys.exit(1)