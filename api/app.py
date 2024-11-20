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

#-------- CREATE GRAPH --------#

@app.route('/graph/<id>/<param>', methods=['GET'])
def player_graph(id, param):
    seasons = get_seasons_for_player(id)
    formatted_seasons = []
    stat_by_season = []
    data_by_season = []

    name = ""

    if param not in ["Goals","Assists","Games"]:
        return "error"

    for season in seasons:
        data = get_data_by_id_and_season(id, season)
        if data is None:
            continue

        data_by_season.append(data)

        total_of_stat = 0

        if "statistics" in data:
            for stat in data["statistics"]:
                if param == "Goals":
                    goals = stat["goals"]["total"]
                    total_of_stat += goals if goals is not None else 0

                elif param == "Assists":
                    assists = stat["goals"]["assists"]
                    total_of_stat += assists if assists is not None else 0

                elif param == "Games":
                    games = stat["games"]["appearences"]
                    total_of_stat += games if games is not None else 0

            stat_by_season.append(total_of_stat)

        else:
            stat_by_season.append(0)

        formatted_seasons.append(str(season) + "/" + (str(season + 1))[-2:])

    name = data_by_season[0]["player"]["name"]

    print(name)

    print(formatted_seasons)
    print(stat_by_season)
    print(data_by_season)

    fig, ax = plt.subplots(figsize=(18, 8))

    ax.bar(formatted_seasons, stat_by_season, color='yellow')
    fig.patch.set_facecolor('black')
    ax.set_facecolor('black')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.xaxis.label.set_color('white')
    ax.yaxis.label.set_color('white')

    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.15)

    ax.set_title(f"{param} by Season for " + name, color='white', pad=20)
    ax.set_ylabel(param, labelpad=15)
    ax.set_xlabel("Season", labelpad=15)

    for i, txt in enumerate(stat_by_season):
        ax.text(i, stat_by_season[i], str(txt), ha='center', va='bottom', fontsize=8, color='white')

    buf = io.BytesIO()
    plt.savefig(buf, format='png', facecolor=fig.get_facecolor())
    buf.seek(0)
    plt.close(fig)

    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()

    # RETURN VALUE: image in base64

    return {'image': img_base64}
    
#-------- RUN APP (MUST COME LAST) --------#

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)