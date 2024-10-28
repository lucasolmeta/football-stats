from flask import Flask, jsonify
import pandas as pd
import requests
from config.py import RAPIDAPI_KEY

app = Flask(__name__)

@app.route('/data')
def get_data():
    url = "https://api-football-v1.p.rapidapi.com/v3/fixtures"

    querystring = {"date":"2024-10-27"}

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }   

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()  
        return jsonify(response.json())
    except requests.exceptions.HTTPError as http_err:
        return jsonify({"error": str(http_err)}), 500
    except Exception as err:
        return jsonify({"error": str(err)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)