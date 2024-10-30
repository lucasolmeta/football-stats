from flask import Flask, jsonify
import pandas as pd
import requests
import os
import logging
from flask_cors import CORS

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

app = Flask(__name__)
CORS(app)

#-------- ESTABLISH ROOT PAGE --------#

@app.route('/')
def index():
    return "Welcome to the Football Stats API!"

#-------- ESTABLISH 404 PAGE --------#

@app.errorhandler(404)
def not_found(e):
    return "Page not found", 404

#-------- FIND LAST WORD IN QUERY --------#

def get_last_word(query):
    words = query.split("-")
    return words[-1]

#-------- FILTER JSON BY QUERY --------#

def filter_data_to_match_query(data,query):
    players = data.get("response", [])

    #-------- DECLARE AND SET NEW FILTERED JSON --------#

    filtered_players = [
        player for player in players

        #-------- FILTER BY WORDS IN SEARCH QUERY --------#

        if all(
            word.lower() in (
                (player.get("player", {}).get("firstname") or "") + " " + (player.get("player", {}).get("lastname") or "")
            ).lower() for word in query.split("-")
        )
    ]

    return filtered_players

@app.route('/search/<query>', methods=['GET'])
def get_data(query):

    #-------- SET URL --------#

    url = "https://api-football-v1.p.rapidapi.com/v3/players/profiles"

    #-------- GET API KEY AND SET HEADERS --------#

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }

    #-------- ONE WORD QUERY --------#

    if "-" not in query:
        querystring = {"search":query}
        try:
            results = requests.get(url, headers=headers, params=querystring)
            results.raise_for_status()  
            results = results.json()

            return jsonify(results)
        except requests.exceptions.HTTPError as http_err:
            return jsonify({"error": str(http_err)}), 500
        except Exception as err:
            return jsonify({"error": str(err)}), 500

    #-------- MULTI WORD QUERY --------#

    querystring = {"search":get_last_word(query)}

    try:
        results = requests.get(url, headers=headers, params=querystring)
        results.raise_for_status()  

        results = results.json()

        results = filter_data_to_match_query(results, query)

        return jsonify(results)
    except requests.exceptions.HTTPError as http_err:
        return jsonify({"error": str(http_err)}), 500
    except Exception as err:
        return jsonify({"error": str(err)}), 500
    
#-------- SEARCH BY ID --------#

@app.route('/id/<id>', methods=['GET'])
def get_data(id):

    #-------- SET URL --------#

    url = "https://api-football-v1.p.rapidapi.com/v3/players"

    #-------- GET API KEY AND SET HEADERS --------#

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }

    querystring = {"id":id,"season":"2024"}

    try:
        results = requests.get(url, headers=headers, params=querystring)
        results.raise_for_status()  
        results = results.json()

        return jsonify(results)
    except requests.exceptions.HTTPError as http_err:
        return jsonify({"error": str(http_err)}), 500
    except Exception as err:
        return jsonify({"error": str(err)}), 500

        
#-------- RUN APP (MUST COME LAST) --------#

if __name__ == '__main__':
    logging.debug("Starting the Flask application.")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)