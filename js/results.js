
const winner = localStorage.getItem('winner');
const winnerPoints = localStorage.getItem('winner-points');


document.querySelector('.winner-text').textContent = winner;
document.querySelector('.points-number').textContent = winnerPoints;



const gameLogString = localStorage.getItem('gameLog');
const gameLog = gameLogString ? JSON.parse(gameLogString) : [];
const gridContainer = document.querySelector('.grid-history-container');

function createGridItem(text) {
    const div = document.createElement('div');
    div.classList.add('grid-item');
    div.textContent = text;
    return div;
}

gameLog.forEach(entry => {
    const playerName = createGridItem(entry.playerName);
    const cardsNumber = createGridItem(entry.cardsNumber);
    const success = createGridItem(entry.success);

    gridContainer.appendChild(playerName);
    gridContainer.appendChild(cardsNumber);
    gridContainer.appendChild(success);
});

