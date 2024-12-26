from flask import Flask
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

#-------- INTERNAL FUNCTION: finds last word of a multi-word query --------#

def get_last_word(query):
    words = query.split("-")
    return words[-1]

#-------- INTERNAL FUNCTION: filters initial search by full query --------#

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

#-------- INTERNAL FUNCTION: creates graph --------#

def create_graph(name, formatted_seasons, stat_by_season, param):
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
    plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.2)

    ax.set_title(param.capitalize() + " by Season for " + name, color='white', pad=20, fontsize=25)
    ax.set_ylabel(param.capitalize(), labelpad=15, fontsize=20)

    if param == "goals" or param == "games":
        ax.set_xlabel("Season", labelpad=15, fontsize=20)
    elif param == "assists":
        ax.set_xlabel("Season (Assist Data Only Available Through 2015/2016)", labelpad=15, fontsize=20)
    elif param == "ratings":
        ax.set_xlabel("Season (Rating Data Only Available Through 2015/2016)", labelpad=15, fontsize=20)

    for i, txt in enumerate(stat_by_season):
        if param == "ratings":
            ax.text(i, stat_by_season[i], str(txt), ha='center', va='bottom', fontsize=14, color='white')
        else:
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

    return img_base64

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

            # RETURN VALUE: list of jsons with basic player information

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

        # RETURN VALUE: list of jsons with basic player information
            
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
        "x-rapidapi-key": RAPIDAPI_KEY,
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

        # RETURN VALUE: list of valid seasons

        return results
    except requests.exceptions.HTTPError as http_err:
        return {"error": str(http_err)}
    except Exception as err:
        return {"error": str(err)}

#-------- CREATE GRAPH --------#

@app.route('/graphs/<id>', methods=['GET'])
def player_graph(id):

    data = get_data_for_player(id)
    seasons = get_seasons_for_player(id)
    seasons_truncated = [season for season in seasons if season >= 2015]

    goals_by_season = [0] * len(seasons)
    games_by_season = [0] * len(seasons)

    assists_by_season = [0] * len([season for season in seasons if season >= 2015])
    ratings_by_season = [0] * len([season for season in seasons if season >= 2015])

    total_ratings_per_season = [0] * len([season for season in seasons if season >= 2015])
    total_games_per_season = [0] * len([season for season in seasons if season >= 2015])

    formatted_seasons_full = [""] * len(seasons)
    formatted_seasons_truncated = [""] * len(seasons_truncated)

    for i, season in enumerate(seasons):
        formatted_seasons_full[i] = str(season) + "/" + str(season + 1)

    for i, season in enumerate(seasons_truncated):
        formatted_seasons_truncated[i] = str(season) + "/" + str(season + 1)

    for instance in data:
        for i, season in enumerate(seasons):
            if int(instance["season"][:4]) == season:
                instance_goals = instance.get("goals", {}).get("total", 0) or 0
                goals_by_season[i] += instance_goals

                instance_games = instance.get("games", {}).get("appearences", 0) or 0
                games_by_season[i] += instance_games

                break

    for instance in data:
        for i, season in enumerate(seasons_truncated):
            if int(instance["season"][:4]) == season:
                instance_assists = instance.get("goals", {}).get("assists", 0) or 0
                assists_by_season[i] += instance_assists

                if instance.get("rating", {}) is not None and float(instance.get("rating", {})) != 0:
                    instance_ratings = float(instance.get("rating", {})) * instance.get("games", {}).get("appearences", 0)

                    total_ratings_per_season[i] += instance_ratings
                    total_games_per_season[i] += instance.get("games", {}).get("appearences", 0)

                break

    for i, rating in enumerate(total_ratings_per_season):
        if total_games_per_season[i] != 0:
            ratings_by_season[i] = rating / total_games_per_season[i]
            ratings_by_season[i] = round(ratings_by_season[i], 2)
        else:
            ratings_by_season[i] = 0

    name = data[0]["player_name"]

    goals_graph = create_graph(name, formatted_seasons_full, goals_by_season, "goals")
    assists_graph = create_graph(name, formatted_seasons_truncated, assists_by_season, "assists")
    games_graph = create_graph(name, formatted_seasons_full, games_by_season, "games")
    ratings_graph = create_graph(name, formatted_seasons_truncated, ratings_by_season, "ratings")

    return {
        "goals" : goals_graph,
        "assists" : assists_graph,
        "games" : games_graph,
        "ratings" : ratings_graph
    }

#-------- RETURN IMAGE LINK --------#

@app.route('/photo/<id>', methods=['GET'])
def player_photo(id):
    url = "https://api-football-v1.p.rapidapi.com/v3/players/profiles"

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

        image_link = results[0]["player"]["photo"] or "https://media.api-sports.io/football/players/434267.png"

        # RETURN VALUE: link to player image

        return image_link
    except requests.exceptions.HTTPError as http_err:
        return {"error": str(http_err)}
    except Exception as err:
        return {"error": str(err)}
    
#-------- RETURN TROPHIES --------#

@app.route('/trophies/<id>', methods=['GET'])
def trophies(id):
    url = "https://api-football-v1.p.rapidapi.com/v2/trophies/player/"
    url += id

    headers = {
	    "x-rapidapi-key": RAPIDAPI_KEY,
	    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"    
    }

    try:
        results = requests.get(url, headers=headers)
        results.raise_for_status()  
        results = results.json()

        # RETURN VALUE: list of trophies won

        return results
    except requests.exceptions.HTTPError as http_err:
        return {"error": str(http_err)}
    except Exception as err:
        return {"error": str(err)}
    
#-------- RUN APP (MUST COME LAST) --------#

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)