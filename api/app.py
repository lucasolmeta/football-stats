from flask import Flask, jsonify
import pandas as pd
import requests
import os
import logging

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

app = Flask(__name__)

@app.route('/')
def index():
    return "Welcome to the Football Stats API!"

@app.errorhandler(404)
def not_found(e):
    return "Page not found", 404

if __name__ == '__main__':
    logging.debug("Starting the Flask application.")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    app.run(debug=True)
    app.logger.setLevel(logging.DEBUG)

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

@app.route('/search/<query>', METHOD=['GET'])
def get_data(query):

    logging.debug(f"Search query received: {query}")

    #set url

    url = "https://api-football-v1.p.rapidapi.com/v3/players/profiles"

    #get api key from environmental variable and set host

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }

    #if query is one word long, search for single word

    if "-" not in query:
        logging.debug(f"Single word query: {querystring}")
        querystring = {"search":query}
        try:
            results = requests.get(url, headers=headers, params=querystring)
            results.raise_for_status()  

            data = results.json()

            logging.debug(f"Results received: {data}")
            return jsonify(data)  # Return JSON data
        except requests.exceptions.HTTPError as http_err:
            logging.error(f"HTTP error occurred: {str(http_err)}")
            return jsonify({"error": str(http_err)}), 500
        except Exception as err:
            logging.error(f"An error occurred: {str(err)}")
            return jsonify({"error": str(err)}), 500

    #if query is multiple words, search by last word and filter results to only those who include previous words

    querystring = {"search":get_last_word(query)}
    logging.debug(f"Multiple word query, last word: {querystring}")

    try:
        results = requests.get(url, headers=headers, params=querystring)
        results.raise_for_status()  

        data = results.json()

        filtered_results = filter_data_to_match_query(data, query)  # Ensure `filtered_results` is returned

        logging.debug(f"Filtered results: {filtered_results}")
        return jsonify(filtered_results)
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {str(http_err)}")
        return jsonify({"error": str(http_err)}), 500
    except Exception as err:
        logging.error(f"HTTP error occurred: {str(http_err)}")
        return jsonify({"error": str(err)}), 500