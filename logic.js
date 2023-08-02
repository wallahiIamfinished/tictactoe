function updateLeaderboard() {
    fetch('/leaderboard')
    .then(response => response.json())
    .then(leaderboard => {
        leaderboard.forEach(entry => {
            console.log(`Player: ${entry[0]}, Wins: ${entry[1]}`);
        });
    })
    .catch(error => console.error('Error:', error));
}

let board = Array(9).fill(null);
let currentPlayer = 'X';
let playerNames = {
    'X': '',
    'O': ''
};

// Winning combinations
const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Check for a win
function checkWin() {
    for (let i = 0; i < wins.length; i++) {
        const [a, b, c] = wins[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return currentPlayer;
        }
    }
    return null;
}

document.getElementById('player-names-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    playerNames['X'] = document.getElementById('player-x-name').value;
    playerNames['O'] = document.getElementById('player-o-name').value;

  
    console.log(`Team X Player Name: ${playerNames['X']}`);
    console.log(`Team O Player Name: ${playerNames['O']}`);
});


document.querySelectorAll('.cell').forEach((cell, i) => {
    cell.addEventListener('click', () => {
        if (!board[i]) {
            board[i] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase()); // Add the class to the cell
            const winner = checkWin();
            if (winner) {
                // Delay the reset of the board until after the win alert is dismissed
                setTimeout(() => {
                    alert(`${playerNames[winner]} wins!`);
                    fetch('/leaderboard', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            playerName: playerNames[winner]
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.message)
                        updateLeaderboard();
                })
                    .catch(error => console.error('Error:', error));
                    // Reset the board
                    board = Array(9).fill(null);
                    currentPlayer = 'X';
                    document.querySelectorAll('.cell').forEach(cell => {
                        cell.textContent = '';
                        cell.classList.remove('x', 'o'); // Remove the classes from the cell
                    });
                }, 0);
            }            
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    });
});


// Get the leaderboard when the page loads
window.addEventListener('load', () => {
    fetch('/leaderboard')
    .then(response => response.json())
    .then(leaderboard => {
        // Display the leaderboard
        console.log('Leaderboard:', leaderboard);
    })
    .catch(error => console.error('Error:', error));
});


window.addEventListener('load', updateLeaderboard);

document.getElementById('reset-button').addEventListener('click', () => {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
});
