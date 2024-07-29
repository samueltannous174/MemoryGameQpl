const images = [
    "https://img.freepik.com/free-photo/view-woman-snowboarding-with-pastel-shades-dreamy-landscape_23-2151505145.jpg?t=st=1721897156~exp=1721900756~hmac=9d7351e51992d303ea83fdc21d51e97792561f0f8f2b914ce09673ec014a4587&w=360",
    "https://img.freepik.com/free-photo/portrait-woman-competing-olympic-games-championship_23-2151460420.jpg?t=st=1721895112~exp=1721898712~hmac=424c00e5860882539cac4b845788401c96f65f48a1bfb90927db95e26629ea21&w=996",
    "https://img.freepik.com/free-photo/close-up-athlete-playing-box_23-2150845552.jpg?t=st=1721897305~exp=1721900905~hmac=c4ccbf8759d3f6e25db0bd029c2b8f0ca87abfb57afbb6cdb4e6c666a26826e6&w=996",
    "https://img.freepik.com/free-photo/fencing_654080-2284.jpg?w=1060&t=st=1721942954~exp=1721943554~hmac=e6c1f126b2f05e031e0967997a93d9c52eeff662bd4ccc5052acc2f080b974c3",
    "https://img.freepik.com/free-photo/skateboarder-performing-trick-mini-ramp-skate-park-indoor_613910-21712.jpg?w=740&t=st=1721897469~exp=1721898069~hmac=9f3975e9473c1b71ffbf44a2a179c762e6406c0cb6f8f7a0b0aa32bb4e6278ed",
    "https://img.freepik.com/free-photo/view-tennis-racket-hitting-ball_23-2151378486.jpg?t=st=1721897160~exp=1721900760~hmac=b6fce45649d183ff653ebaba4a7206241084f57c357aa259aa74cf84e1edf319&w=1060",
    "https://img.freepik.com/free-photo/contour-bicycle-cyclist-tour-sport_1150-1018.jpg?w=996&t=st=1721897615~exp=1721898215~hmac=6574118b22e6e5853eaf341a4121572edd2731ac344c85a3af7611f54830a437",
    "https://img.freepik.com/free-photo/portrait-man-with-fantasy-unicorn-animal-cinematic-atmosphere_23-2151586594.jpg?t=st=1721897674~exp=1721901274~hmac=a528ec55825c707831ea20a1ce40b13722dc9cd07a74a80126703faa1c114062&w=1060",
    "https://img.freepik.com/free-photo/man-moving-giant-tire-wheel-gym_651396-296.jpg?t=st=1722003367~exp=1722006967~hmac=a70a8504ce91ed2059eb82d9fffa9eabe71e4b376726d165b270ad9e750f8fe8&w=360"
];
let timeoutId; //to remove it at the end
const duplicatedImages = [...images, ...images];
const memoryGame = {
    currentSelectionCloned: [],
    currentSelection: [],
    playerTurns: 1,
    currentFlipNumber: 0,
    success: false,
    buttonsStates: Array(18).fill(false),
    gameLog: [],
    gameFinished: false
};

let shuffledArray = shuffleArray(duplicatedImages); // shuffle the duplicate images array
function shuffleArray(array) {return array.sort(() => Math.random() - 0.5);}

document.addEventListener('DOMContentLoaded', () => {
    switchTurn(); // the first round
    initializeGameBoard();
    initializePlayerNames();
});
function initializeGameBoard() {
    const gameBoard = document.getElementById('game-board');

    for (let i = 0; i < 18; i++) {
        const card = document.createElement('button');
        card.className = 'card';
        card.textContent = i+1;
        gameBoard.appendChild(card);
    }
    gameBoard.addEventListener('click', function(event) {  //event listener on the grid container
        if (event.target.classList.contains('card')) {
            onCardClick(event.target);
            if (memoryGame.success){   //remove the event
                gameBoard.removeEventListener('click', arguments.callee);
                console.log("Congratulations! You've won the game!");
            }
        }
    });
    document.getElementById('reset-button').addEventListener('click', resetAllCards);
}
function initializePlayerNames() {
    const player1Name = localStorage.getItem('player1Name');
    const player2Name = localStorage.getItem('player2Name');

    document.getElementById('player-one-label').textContent = player1Name;
    document.getElementById('player-two-label').textContent = player2Name;
}
function switchTurn() {
    if (memoryGame.playerTurns === 1) {
        document.getElementById('player2-container').classList.remove('player-two-background');
        document.getElementById('player1-container').classList.add('player-one-background');
        memoryGame.playerTurns = 2;
    } else {
        document.getElementById('player1-container').classList.remove('player-one-background');
        document.getElementById('player2-container').classList.add('player-two-background');
        memoryGame.playerTurns = 1;
    }
    if (memoryGame.gameFinished) {
        endGame();
    }
}
function onCardClick(event) {
    const cardIndex= event.textContent-1
    if (memoryGame.buttonsStates[cardIndex] === true){    // if already opened
        return
    }
    event.style.backgroundImage = `url(${shuffledArray[event.textContent - 1]})`;
    memoryGame.currentSelectionCloned[memoryGame.currentFlipNumber] = event.cloneNode(); // clone the clicked cards
    memoryGame.currentSelection[memoryGame.currentFlipNumber] = event; // reference the clicked cards
    event.disabled = true;    //lock more than one press
    memoryGame.currentFlipNumber++;

    if (memoryGame.currentFlipNumber === 2) { // check if the second card selected
        setTimeout(checkSimilarity, 300);
        setTimeout(handleTurnSwitch, 1300);
        memoryGame.currentFlipNumber = 0;
    }

    event.classList.add('fade');
}
function checkSimilarity() {
    const img1 = memoryGame.currentSelectionCloned[0].style.backgroundImage; // compare the image src
    const img2 = memoryGame.currentSelectionCloned[1].style.backgroundImage;
    const compareContainer = document.querySelector('.compare-container');
    const icon = document.createElement('i');
    const cardCompareContainer = compareContainer.querySelector('.card-compare-container');

    memoryGame.currentSelectionCloned[0].classList.remove('card');
    memoryGame.currentSelectionCloned[0].classList.add('cards-in-compare'); // manipulate the compare container to show the current cards
    memoryGame.currentSelectionCloned[1].classList.remove('card');
    memoryGame.currentSelectionCloned[1].classList.add('cards-in-compare');

    cardCompareContainer.appendChild(memoryGame.currentSelectionCloned[0]);
    cardCompareContainer.appendChild(memoryGame.currentSelectionCloned[1]);

    icon.classList.add('fa-solid', img1 !== img2 ? 'fa-circle-xmark' : 'fa-check');
    memoryGame.success = img1 === img2;
    compareContainer.insertBefore(icon, cardCompareContainer);
    compareContainer.style.visibility = 'visible';

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    setTimeout(() => {
        compareContainer.style.visibility = 'hidden';
        compareContainer.querySelectorAll(".cards-in-compare").forEach(item => {
            item.parentNode.removeChild(item); // remove the previous cards to show the next cards
        });
        compareContainer.removeChild(icon);
    }, 1000);

    memoryGame.currentSelectionCloned = [];
}
function handleTurnSwitch() {
    const player1Name = localStorage.getItem('player1Name');
    const player2Name = localStorage.getItem('player2Name');
    const log = {};
    log["playerName"] = memoryGame.playerTurns === 1 ? player1Name : player2Name;
    const cardOne=memoryGame.currentSelection[0].textContent
    const cardTwo=memoryGame.currentSelection[1].textContent

    log["cardsNumber"] = `opens card ${cardOne} and ${cardTwo}`;
    log["success"] = memoryGame.success ? "True" : "False";
    memoryGame.gameLog.push(log); // getting the log history

    if (memoryGame.success) { // if correct, add points
        const cardIndex1=memoryGame.currentSelection[0].textContent - 1
        const cardIndex2=memoryGame.currentSelection[1].textContent - 1
        memoryGame.buttonsStates[cardIndex1] = true;
        memoryGame.buttonsStates[cardIndex2] = true;
        const allButtonsClicked = memoryGame.buttonsStates.every(state => state === true); // check if all buttons clicked to end the game
        memoryGame.currentSelection[0].disabled = true;
        memoryGame.currentSelection[1].disabled = true;
        if (allButtonsClicked) {
            memoryGame.gameFinished = true;
        }
        updatePoints();
    } else {
        resetCards();
    }

    memoryGame.currentSelection[0].disabled = false;  // unlock the card
    memoryGame.currentSelection[1].disabled = false;
    switchTurn();
}
function resetCards() {
    memoryGame.currentSelection.forEach(node => {
        node.classList.remove('fade');
        node.style.backgroundImage = "";
    });
}
function resetAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('fade');
        card.disabled = false;
        card.style.backgroundImage = "";
        shuffledArray = shuffleArray(duplicatedImages);
    });
    memoryGame.gameLog = [];
    memoryGame.currentSelection = [];
    memoryGame.currentSelectionCloned = [];
    memoryGame.buttonsStates = Array(18).fill(false);
    memoryGame.currentFlipNumber = 0;
    memoryGame.playerTurns = 1;

    switchTurn();

    document.getElementById('player-one-points').textContent = "0";
    document.getElementById('player-two-points').textContent = "0";
}
function updatePoints() {
    const pointsLabel = memoryGame.playerTurns === 2
        ? document.getElementById('player-one-points')
        : document.getElementById('player-two-points');

    pointsLabel.classList.add('points-animation');
    pointsLabel.textContent++;

    const originalColor = pointsLabel.style.backgroundColor;
    pointsLabel.style.backgroundColor = "rgba(127,248,113,0.68)";

    setTimeout(() => {
        pointsLabel.style.backgroundColor = originalColor;
    }, 1300);
}
function endGame() {
    const playerOnePoints = parseInt(document.getElementById('player-one-points').textContent, 10);
    const playerTwoPoints = parseInt(document.getElementById('player-two-points').textContent, 10);
    const player1Name = document.getElementById('player-one-label').textContent;
    const player2Name = document.getElementById('player-two-label').textContent;

    const winner = playerOnePoints > playerTwoPoints ? `Winner Is ${player1Name}`
        : playerTwoPoints > playerOnePoints ? `Winner Is ${player2Name}`
            : 'Draw';
    const winnerPoints = Math.max(playerOnePoints, playerTwoPoints).toString();
    localStorage.setItem('winner', winner);
    localStorage.setItem('winner-points', winnerPoints);
    localStorage.setItem('gameLog', JSON.stringify(memoryGame.gameLog));
    timeoutId = setTimeout(() => {window.location.href = 'results.html';
        clearTimeout(timeoutId)
        }, 2000);

}
