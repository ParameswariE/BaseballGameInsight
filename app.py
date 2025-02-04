from flask import Flask, render_template, request, jsonify
import requests
import google.generativeai as genai
import os

app = Flask(__name__)

# Set up Google Gemini AI Key
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise Exception("API Key is missing. Set the GEMINI_API_KEY environment variable.")
MLB_API_URL = "https://statsapi.mlb.com/api/v1/schedule"
genai.configure(api_key=API_KEY)

def get_all_games(year=2024):
    """Fetch the latest MLB games (live + completed)."""
    params = {
        "sportId": 1,
        "season": year,
        "startDate": f"{year}-03-01",
        "endDate": f"{year}-11-01",
    }
    response = requests.get(MLB_API_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        games = []
        for date in data.get("dates", []):
            for game in date.get("games", []):
                game_info = {
                    "gamePk": game["gamePk"],
                    "homeTeam": game["teams"]["home"]["team"]["name"],
                    "awayTeam": game["teams"]["away"]["team"]["name"],
                    "homeLogo": f"https://www.mlbstatic.com/team-logos/{game['teams']['home']['team']['id']}.svg",
                    "awayLogo": f"https://www.mlbstatic.com/team-logos/{game['teams']['away']['team']['id']}.svg",
                    # "teams": f"{game['teams']['away']['team']['name']} vs {game['teams']['home']['team']['name']}",
                    "gameDate": game["gameDate"],
                    "status": game["status"]["detailedState"],
                    # "score": f"{game['teams']['away']['score']} vs {game['teams']['home']['score']}"
                }
                games.append(game_info)
        print(f'Games:{games}')
        return games
    return []

# Function to get video highlights
def get_game_videos(game_pk):
    url = f"https://statsapi.mlb.com/api/v1/game/{game_pk}/content"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        for highlight in data.get("highlights", {}).get("highlights", {}).get("items", []):
            for playback in highlight["playbacks"]:
                if "mp4" in playback["url"]:
                    print(f"URL********{url}")
                    return playback["url"]
    return None

@app.route("/")
def index():
    games = get_all_games()
    return render_template("index.html", games=games)


@app.route("/get_game_video", methods=["POST"])
def fetch_game_video():
    game_pk = request.json.get("gamePk")
    video_url = get_game_videos(game_pk)
    print(f"URL***1111{video_url}")
    return jsonify({"videoUrl": video_url})


@app.route("/get_innings", methods=["POST"])
def fetch_innings():
    game_pk = request.json.get("gamePk")
    url = f"https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        plays = [
            {"inning": play["about"]["inning"], "half": play["about"]["halfInning"], "event": play["result"]["description"]}
            for play in data.get("liveData", {}).get("plays", {}).get("allPlays", [])
        ]
        return jsonify(plays)
    return jsonify([])

@app.route("/get_all_games", methods=["GET"])
def get_all_games_api():
    """Returns the list of all MLB games"""
    games = get_all_games()
    print(f"all_game:{games}")
    return jsonify(games)
@app.route("/get_insight", methods=["POST"])
def fetch_insight():
    data = request.json

    # ✅ Debugging: Print received data
    print(f"🔍 Received data for insight: {data}")

    if not data or "inning" not in data or "half" not in data or "event" not in data:
        return jsonify({"error": "Invalid request"}), 400

    model = genai.GenerativeModel("gemini-pro")

    prompt = (
        f"Explain this baseball play for a casual viewer:\n"
        f"- Inning: {data['inning']} ({data['half']})\n"
        f"- Event: {data['event']}\n\n"
        f"Describe what happened and why it was important."
    )

    response = model.generate_content(prompt)
    return jsonify({"insight": response.text})

@app.route("/game_details/<int:gamePk>")
def game_details(gamePk):
    """Render the game details page with game data"""
    return render_template("game_details.html", gamePk=gamePk)



if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
