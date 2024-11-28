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

            # RETURN VALUE: array of jsons with basic player information

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

        # RETURN VALUE: array of jsons with basic player information
            
        return results
    except requests.exceptions.HTTPError as http_err:
        return {"error": str(http_err)}
    except Exception as err:
        return {"error": str(err)}
    
#-------- SEARCH BY ID --------#

@app.route('/id/<id>', methods=['GET'])
def get_data_for_player(id):
    url = "https://api-football-v1.p.rapidapi.com/v2/players/player/"

    url += str(id)

    headers = {
        "x-rapidapi-key": "9c6433de11mshda6f47bba2f5efdp1a466bjsn8a69659f5d78",
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
    }

    try:
        results = requests.get(url, headers=headers)
        results.raise_for_status()
        results = results.json()

        results = results["api"]["players"]

        #RETURN VALUE: json of player information

        return results
    except requests.exceptions.HTTPError as http_err:
        return {"error": str(http_err)}
    except Exception as err:
        return {"error": str(err)}

def get_seasons_for_player(id):
    url = "https://api-football-v1.p.rapidapi.com/v3/players/seasons"

    headers = {
        "x-rapidapi-key": "9c6433de11mshda6f47bba2f5efdp1a466bjsn8a69659f5d78",
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
    }

    querystring = {"player": id}

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

#-------- CREATE GRAPH --------#

@app.route('/graph/<id>/<param>', methods=['GET'])
def player_graph(id, param):
    if param not in ["goals","assists","games"]:
        return "error"

    data = get_data_for_player(id)
    seasons = get_seasons_for_player(id)

    stat_by_season = [0] * len(seasons)
    formatted_seasons = [""] * len(seasons)

    for i, season in enumerate(seasons):
        formatted_seasons[i] = str(season) + "/" + str(season + 1)

    for instance in data:
        for i, season in enumerate(seasons):
            if int(instance["season"][:4]) == season:
                if param == "goals":
                    instance_goals = instance.get("goals", {}).get("total", 0) or 0
                    stat_by_season[i] += instance_goals
                    break
                elif param == "assists":
                    instance_assists = instance.get("goals", {}).get("assists", 0) or 0
                    stat_by_season[i] += instance_assists
                    break
                elif param == "games":
                    instance_games = instance.get("games", {}).get("appearances", 0) or 0
                    stat_by_season[i] += instance_games
                    break

    name = data[0]["player_name"]

    fig, ax = plt.subplots(figsize=(18, 8))

    ax.bar(formatted_seasons, stat_by_season, color='yellow')
    fig.patch.set_facecolor('black')
    ax.set_facecolor('black')
    ax.tick_params(colors='gray', labelsize=12)
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.xaxis.label.set_color('white')
    ax.yaxis.label.set_color('white')

    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.15)

    ax.set_title(param.capitalize() + " by Season for " + name, color='white', pad=20, fontsize=25)
    ax.set_ylabel(param.capitalize(), labelpad=15, fontsize=20)
    ax.set_xlabel("Season", labelpad=15, fontsize=20)

    for i, txt in enumerate(stat_by_season):
        ax.text(i, stat_by_season[i], str(txt), ha='center', va='bottom', fontsize=20, color='white')

    buf = io.BytesIO()
    plt.savefig(buf, format='png', facecolor=fig.get_facecolor())
    buf.seek(0)
    plt.close(fig)

    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()

    if all(value == 0 for value in stat_by_season):
        return "error"

    # RETURN VALUE: image in base64

    return {'image': img_base64}
    
#-------- RUN APP (MUST COME LAST) --------#

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)