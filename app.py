from flask import Flask, jsonify
import pandas as pd
import requests
import os

app = Flask(__name__)

@app.route('')
def get_data():
    url = "https://api-football-v1.p.rapidapi.com/v3/fixtures"

    querystring = {"date":"2024-10-27"}

    headers = {
	    "x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }   

    response = requests.get(url, headers=headers, params=querystring)

    return(response.json())  