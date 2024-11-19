from flask import Flask
import pandas as pd
import requests
import os
import base64
import io
import matplotlib.pyplot as plt
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

def get_last_word(query):
    words = query.split("-")
    return words[-1]

def filter_data_to_match_query(data,query):
    players = data.get("response", [])

    filtered_players = [
        player for player in players

        # filter by words in search query

        if all(
            word.lower() in (
                (player.get("player", {}).get("firstname") or "") + " " + (player.get("player", {}).get("lastname") or "")
            ).lower() for word in query.split("-")
        )
    ]

    return filtered_players

#-------- SEARCH BY NAME --------#

@app.route('/search/<query>', methods=['GET'])
def get_data_by_name(query):

    url = "https://api-football-v1.p.rapidapi.com/v3/players/profiles"

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }

    # one word query

    if "-" not in query:
        querystring = {"search":query}
        try:
            results = requests.get(url, headers=headers, params=querystring)
            results.raise_for_status()  
            results = results.json()

            results = results.get("response", [])

            # RETURN VALUE: array of player info packages

            return results
        except requests.exceptions.HTTPError as http_err:
            return {"error": str(http_err)}
        except Exception as err:
            return {"error": str(err)}

    # multi word query

    querystring = {"search":get_last_word(query)}

    try:
        results = requests.get(url, headers=headers, params=querystring)
        results.raise_for_status()  

        results = results.json()

        results = filter_data_to_match_query(results, query)

        # RETURN VALUE: array of player info packages
            
        return results
    except requests.exceptions.HTTPError as http_err:
        return {"error": str(http_err)}
    except Exception as err:
        return {"error": str(err)}
    
#-------- SEARCH BY ID --------#

@app.route('/id/<id>', methods=['GET'])
def get_data_by_id(id):

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }

    seasons = get_seasons_for_player(id)

    if len(seasons) > 0:

        url = "https://api-football-v1.p.rapidapi.com/v3/players"

        recent_season = seasons[-1]

        querystring = {"id":id,"season":recent_season}

        try:
            results = requests.get(url, headers=headers, params=querystring)
            results.raise_for_status()  
            results = results.json()

            results = results.get("response", [])
            results = results[0]

            # RETURN VALUE: player info package

            return results
        except requests.exceptions.HTTPError as http_err:
            return {"error": str(http_err)}
        except Exception as err:
            return {"error": str(err)}
    
    else:
        url = "https://api-football-v1.p.rapidapi.com/v3/players/profiles"

        querystring = {"player":id}

        try:
            results = requests.get(url, headers=headers, params=querystring)
            results.raise_for_status()  
            results = results.json()

            results = results.get("response", [])
            results = results[0]

            # RETURN VALUE: player info package

            return results
        except requests.exceptions.HTTPError as http_err:
            return {"error": str(http_err)}
        except Exception as err:
            return {"error": str(err)}


    
#-------- SEARCH BY ID AND SEASON --------#

@app.route('/playerseason/<id>/<season>', methods=['GET'])
def get_data_by_id_and_season(id,season):

    url = "https://api-football-v1.p.rapidapi.com/v3/players"

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }

    querystring = {"id":id,"season":season}

    try:
        results = requests.get(url, headers=headers, params=querystring)
        results.raise_for_status()  
        results = results.json()

        results = results.get("response", [])
        results = results[0]

        # RETURN VALUE: player info package

        return results
    except requests.exceptions.HTTPError as http_err:
        return {"error": str(http_err)}
    except Exception as err:
        return {"error": str(err)}
    
#-------- SEARCH FOR AVAILABLE SEASONS --------#

@app.route('/playerseasons/<id>', methods=['GET'])
def get_seasons_for_player(id):

    url = "https://api-football-v1.p.rapidapi.com/v3/players/seasons"

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }

    querystring = {"player":id}

    try:
        results = requests.get(url, headers=headers, params=querystring)
        results.raise_for_status()  
        results = results.json()

        results = results.get("response", [])

        # RETURN VALUE: array of valid seasons

        return results
    except requests.exceptions.HTTPError as http_err:
        return {"error": str(http_err)}
    except Exception as err:
        return {"error": str(err)}
    
#-------- RUN APP (MUST COME LAST) --------#

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)