import sqlite3
from flask import Flask, render_template, jsonify, request, url_for, redirect

app = Flask(__name__)
db_path_leaderboard = 'C:/Users/16303/Desktop/TicTacToe/leaderboard.db'
db_path_feedback = 'C:/Users/16303/Desktop/TicTacToe/feedback.db'

def create_tables():
    conn_leaderboard = sqlite3.connect(db_path_leaderboard)
    cursor_leaderboard = conn_leaderboard.cursor()
    cursor_leaderboard.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY,
            player_name TEXT UNIQUE NOT NULL,
            score INTEGER NOT NULL
        )
    ''')
    conn_leaderboard.commit()
    conn_leaderboard.close()

    conn_feedback = sqlite3.connect(db_path_feedback)
    cursor_feedback = conn_feedback.cursor()
    cursor_feedback.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            feedback TEXT NOT NULL
        )
    ''')
    conn_feedback.commit()
    conn_feedback.close()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/tictactoe')
def tictactoe():
    return render_template('tictactoe.html')

@app.route('/contact', methods=['GET'])
def contact():
    return render_template('contact.html')

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    name = request.form['name']
    email = request.form['email']
    feedback = request.form['feedback']

    conn_feedback = sqlite3.connect(db_path_feedback)
    cursor_feedback = conn_feedback.cursor()

    cursor_feedback.execute('INSERT INTO feedback (name, email, feedback) VALUES (?, ?, ?)', (name, email, feedback))
    conn_feedback.commit()
    conn_feedback.close()

    return redirect(url_for('thank_you'))

@app.route('/thank_you', methods=['GET'])
def thank_you():
    return "Thank you for your feedback!"

@app.route('/comments')
def comments():
    conn_feedback = sqlite3.connect(db_path_feedback)
    cursor_feedback = conn_feedback.cursor()

    cursor_feedback.execute('SELECT name, feedback FROM feedback')
    comments = cursor_feedback.fetchall()

    conn_feedback.close()

    return render_template('comments.html', comments=comments)


@app.route('/leaderboard', methods=['GET', 'POST'])
def leaderboard():
    if request.method == 'POST':
        player_name = request.json.get('playerName').lower()
        conn_leaderboard = sqlite3.connect(db_path_leaderboard)
        cursor_leaderboard = conn_leaderboard.cursor()

        cursor_leaderboard.execute('SELECT * FROM leaderboard WHERE player_name = ?', (player_name,))
        player = cursor_leaderboard.fetchone()

        if player:
            new_score = player[2] + 1
            cursor_leaderboard.execute('UPDATE leaderboard SET score = ? WHERE player_name = ?', (new_score, player_name))
        else:
            cursor_leaderboard.execute('INSERT INTO leaderboard (player_name, score) VALUES (?, ?)', (player_name, 1))

        conn_leaderboard.commit()
        conn_leaderboard.close()
        return jsonify({'message': 'Leaderboard updated.'})
    else:
        conn_leaderboard = sqlite3.connect(db_path_leaderboard)
        cursor_leaderboard = conn_leaderboard.cursor()

        cursor_leaderboard.execute('SELECT player_name, score FROM leaderboard ORDER BY score DESC LIMIT 5')
        leaderboard = cursor_leaderboard.fetchall()

        conn_leaderboard.close()
        return render_template('leaderboard.html', leaderboard=leaderboard)

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)
