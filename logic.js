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
            cell.classList.add(currentPlayer.toLowerCase()); 
            const winner = checkWin();
            if (winner) {
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
                    board = Array(9).fill(null);
                    currentPlayer = 'X';
                    document.querySelectorAll('.cell').forEach(cell => {
                        cell.textContent = '';
                        cell.classList.remove('x', 'o'); 
                    });
                }, 0);
            }            
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    });
});

window.addEventListener('load', () => {
    fetch('/leaderboard')
    .then(response => response.json())
    .then(leaderboard => {
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
