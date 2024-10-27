from flask import Flask, jsonify
import pandas as pd
import requests
import os

app = Flask(__name__)

url = "https://api-football-v1.p.rapidapi.com/v3/fixtures"

querystring = {"date":"2024-10-27"}

headers = {
	"x-rapidapi-key": os.getenv("RAPIDAPI_KEY"), # 9c6433de11mshda6f47bba2f5efdp1a466bjsn8a69659f5d78"
	"x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
}   

response = requests.get(url, headers=headers, params=querystring)

print(response.json())