from flask import Flask, jsonify
import pandas as pd
import requests
import os

app = Flask(__name__)

@app.route('/data')
def get_data():
    url = "https://api-football-v1.p.rapidapi.com/v3/fixtures"

    querystring = {"date":"2024-10-26"}

    headers = {
	    "x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }   

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()  # Raise an error for bad responses
        return jsonify(response.json())  # Return the API response as JSON
    except requests.exceptions.HTTPError as http_err:
        return jsonify({"error": str(http_err)}), 500
    except Exception as err:
        return jsonify({"error": str(err)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)