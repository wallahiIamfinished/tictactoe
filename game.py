from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

# Simulate a database with a Python dictionary
database = {}

@app.route('/leaderboard', methods=['GET', 'POST'])
def leaderboard():
    if request.method == 'POST':
        # Update the leaderboard
        player_name = request.json.get('playerName').lower()  # Make the name case-insensitive
        if player_name in database:
            database[player_name] += 1
        else:
            database[player_name] = 1
        return jsonify({'message': 'Leaderboard updated.'})
    else:
        # Get the leaderboard
        leaderboard = sorted(database.items(), key=lambda x: x[1], reverse=True)[:5]  # Get the top 5 players
        return jsonify(leaderboard)

if __name__ == '__main__':
    app.run(debug=True)
