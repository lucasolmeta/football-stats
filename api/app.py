from flask import Flask, jsonify
import pandas as pd
import requests
import json
import os

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

app = Flask(__name__)

@app.route('/')
def index():
    return "Welcome to the Football Stats API!"

if __name__ == '__main__':
        app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

def get_last_word(query):
    words = query.split("-")
    return words[-1]

def filter_data_to_match_query(data,query):
    players = data.get("response", [])

    filtered_players = [
        player for player in players

        if all(
            word.lower() in (
                (player.get("player", {}).get("firstname") or "") + " " + (player.get("player", {}).get("lastname") or "")
            ).lower() for word in query.split("-")
        )
    ]

    return filtered_players

@app.route('/search/<query>', methods=['GET'])
def get_data(query):

    #set url

    url = "https://api-football-v1.p.rapidapi.com/v3/players/profiles"

    #get api key from environmental variable and set host

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }

    #if query is one word long, search for single word

    if "-" not in query:
        querystring = {"search":query}
        try:
            results = requests.get(url, headers=headers, params=querystring)
            results.raise_for_status()  

            return jsonify(results)
        except requests.exceptions.HTTPError as http_err:
            return jsonify({"error": str(http_err)}), 500
        except Exception as err:
            return jsonify({"error": str(err)}), 500

    #if query is multiple words, search by last word and filter results to only those who include previous words

    querystring = {"search":get_last_word(query)}

    try:
        results = requests.get(url, headers=headers, params=querystring)
        results.raise_for_status()  
        results = results.json()
        results = filter_data_to_match_query(results,query)

        return jsonify(results)
    except requests.exceptions.HTTPError as http_err:
        return jsonify({"error": str(http_err)}), 500
    except Exception as err:
        return jsonify({"error": str(err)}), 500