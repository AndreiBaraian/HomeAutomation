from flask import Flask
#from flask import request
import json
import Adafruit_DHT

temperature_sensor = 22
temperature_pin = 23

app = Flask(__name__)

@app.route("/temperature",methods=['GET'])
def read_temperature():
    print("Request for temperature!")
    humidity, temperature = Adafruit_DHT.read_retry(temperature_sensor, temperature_pin)
    
    data = {}
    data['temperature']=int(temperature)
    json_data=json.dumps(data)
    return json_data
    

if __name__ == "__main__":
    port = 5000
    app.run(host = '0.0.0.0',port=port,debug=True)