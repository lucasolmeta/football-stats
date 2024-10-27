from flask import Flask, jsonify
import pandas as pd
import http.client

conn = http.client.HTTPSConnection("api-football-v1.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "9c6433de11mshda6f47bba2f5efdp1a466bjsn8a69659f5d78",
    'x-rapidapi-host': "api-football-v1.p.rapidapi.com"
}

conn.request("GET", "/v2/odds/league/865927/bookmaker/5?page=2", headers=headers)

res = conn.getresponse()
data = res.read()

print (data)