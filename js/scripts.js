import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    var entryForm,mainGame,resultsPage
    //welcome page
    function createEntryForm() {
        const entryForm = document.createElement('form');
        entryForm.className = 'form-container ';
        entryForm.innerHTML = `
            <h1>Welcome To Memory Game</h1>
            <label class="enter-names-text">Please enter players names: </label>
            <div class="player-one-input">
                <label class="input-text input-one" for="player1">Player 1</label>
                <input class="input" id="player1" required>
            </div>  
            <div class="player-two-input">
                <label class="input-text input-two" for="player2">Player 2</label>
                <input id="player2" class="input" required>
            </div>
            <button class="play-button" type="submit">Play</button>
        `;
        content.appendChild(entryForm);
        return entryForm;
    }

    function createMainGame() {
        const mainGame = document.createElement('div');
        mainGame.className = 'container';
        mainGame.innerHTML = `
            <h1 class="title">Memory Game</h1>
            <hr class="line">
            <div class="player-turn-container">
                <p class="player-turn-container-par">Now It's Turn:</p>
                <div id="player1-container" class="player-image-container">
                    <div class="img-name-container">
                        <img src="https://img.freepik.com/free-vector/cute-boy-playing-game-sofa-with-headphone-cartoon-vector-icon-illustration-people-technology_138676-5483.jpg">
                        <label id="player-one-label" class="player-turn-container-label"></label>
                    </div>
                    <label id="player-one-points" class="points">0</label>
                </div>
                <div id="player2-container" class="player-image-container">
                    <div class="img-name-container">
                        <img src="https://img.freepik.com/free-vector/cute-man-playing-game-computer-cartoon-vector-icon-illustration-people-technology-icon-isolated_138676-5731.jpg">
                        <label id="player-two-label" class="player-turn-container-label"></label>
                    </div>
                    <label id="player-two-points" class="points">0</label>
                </div>
            </div>
            <div class="reset-button-container">
                <button id="reset-button" class="reset-button">Reset Game</button>
            </div>
            <div class="grid-container" id="game-board"></div>
            <div class="compare-container">
                <div class="card-compare-container"></div>
            </div>
        `;

        content.appendChild(mainGame);
        return mainGame;
    }


    function createResultsPage() {
        const resultsPage = document.createElement('div');
        resultsPage.className = 'result-container ';
        resultsPage.innerHTML = `
            <h1 class="title">Memory Game</h1>
            <hr class="line">
            <div class="winner-text">Winner Is</div>
            <label class="points-number-text">Number Of Points:</label>
            <div class="points-number-container">
                <div class="points-number"></div>
            </div>
            <div class="grid-history-container">
                <div class="sticky-item">Player name</div>
                <div class="sticky-item">cards number</div>
                <div class="sticky-item">success</div>
            </div>
        `;
        content.appendChild(resultsPage);
        return resultsPage;
    }

    function showSection(section) {
        if (entryForm) {
            content.removeChild(entryForm);
            entryForm = null;
        }
        if (mainGame) {
            content.removeChild(mainGame);
            mainGame = null;
        }
        if (resultsPage) {
            content.removeChild(resultsPage);
            resultsPage = null;
        }
        if (section === 'entry') {    // to show the selected , change url
             entryForm = createEntryForm();
            document.title = "Welcome To Memory Game";
            history.pushState(null, "", "/entry");
        } else if (section === 'main') {
             mainGame = createMainGame();
            document.title = "Memory Game";
            history.pushState(null, "Memory Game", "/game");
            gameJs()

        } else if (section === 'results') {
            resultsPage = createResultsPage();
            document.title = "Game Results";
            history.pushState(null, "Game Results", "/results");
            history.pushState(null, "Memory Game", "/game");
            ResultsJs()
        }
        console.log(`Section: ${section}, Title: ${document.title}, URL: ${window.location.href}`);
    }

    showSection('entry');

      entryForm.addEventListener('submit', function (event) {
        event.preventDefault();
        showSection('main');
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;
        document.getElementById('player-one-label').innerText = player1Name;
        document.getElementById('player-two-label').innerText = player2Name;
    });



    document.addEventListener('gameFinished', function() {  // to show results after game finished
        showSection('results');
    })


});
const  ResultsJs= async ()=>{
    const supabase = createClient('https://fqmawwzhogveaypwhxmd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxbWF3d3pob2d2ZWF5cHdoeG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNTM4NjQsImV4cCI6MjAzNzgyOTg2NH0.njz-zhNI6JEK1frjirCEdKjnVRByEUbUyGHeGNrn0G0')

    console.log('Supabase Instance: ', supabase);
    const getLastId = async () => {
        const {data, error} = await supabase
            .from('game')
            .select('*')
            .order('id', {ascending: false})

        if (error) {
            console.error('Error fetching data:', error);
            return null;
        } else {
            console.log('Fetched data:', data);
            return data[0]?.id;   //get the last game id which presents the current game
        }
    };


    const lastId = await getLastId();

    const getResultsById = async (id) => {   //getting results of winner name and points
        const {data, error} = await supabase
            .from('game')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching data:', error);
            return null;
        } else {
            console.log('Fetched data:', data);
            return data;
        }
    };

    if (lastId) {
        const results = await getResultsById(lastId);
        if (results) {
            const winnerTextElement = document.querySelector('.winner-text');
            const pointsNumberElement = document.querySelector('.points-number');

            if (winnerTextElement && pointsNumberElement) {
                winnerTextElement.textContent = results.winner;
                pointsNumberElement.textContent = results.points;
            }
        }

        const getLogsByGameId = async (gameId) => {  //getting logs
            const {data, error} = await supabase
                .from('logs')
                .select('*')
                .eq('foreignKey', gameId);

            if (error) {
                console.error('Error fetching logs:', error);
                return null;
            } else {
                console.log('Fetched logs:', data);
                return data;
            }
        };

        const gameLog = await getLogsByGameId(lastId);

        if (gameLog) {
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
        }

    } else {
        console.error('No last ID found.');
    }

}

const gameJs=()=>{
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
    const savedData = {}

    const duplicatedImages = [...images, ...images];
    const memoryGame = {
        currentSelectionCloned: [],
        currentSelection: [],
        playerTurns: 1,
        currentFlipNumber: 0,
        success: false,
        buttonsStates: Array(18).fill(false),
        gameLog: [],
        gameFinished: false,
        winner: "",
        winnerPoints: ""
    };


    let shuffledArray = shuffleArray(duplicatedImages); // shuffle the duplicate images array
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }


    switchTurn(); // the first round          //event loaded deleted
    initializeGameBoard();
    initializePlayerNames();

    function initializeGameBoard() {
        const gameBoard = document.getElementById('game-board');

        for (let i = 0; i < 18; i++) {
            const card = document.createElement('button');
            card.className = 'card';
            card.textContent = i + 1;
            gameBoard.appendChild(card);
        }

        function handleCardClick(event) {
            if (event.target.classList.contains('card')) {
                onCardClick(event.target);
                if (memoryGame.gameFinished) {
                    gameBoard.removeEventListener('click', handleCardClick);
                }
            }
        }

        gameBoard.addEventListener('click', handleCardClick);

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
            console.log(document.getElementById('player2-container'))
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
        const cardIndex = event.textContent - 1
        if (memoryGame.buttonsStates[cardIndex] === true) {    // if already opened
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
        const cardOne = memoryGame.currentSelection[0].textContent
        const cardTwo = memoryGame.currentSelection[1].textContent

        log["cardsNumber"] = `opens card ${cardOne} and ${cardTwo}`;
        log["success"] = memoryGame.success ? "True" : "False";
        memoryGame.gameLog.push(log); // getting the log history

        if (memoryGame.success) { // if correct, add points
            const cardIndex1 = memoryGame.currentSelection[0].textContent - 1
            const cardIndex2 = memoryGame.currentSelection[1].textContent - 1
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
        // localStorage.setItem('winner', winner);
        memoryGame.winner = winner

        // localStorage.setItem('winner-points', winnerPoints);
        memoryGame.winnerPoints = winnerPoints
        // localStorage.setItem('gameLog', JSON.stringify(memoryGame.gameLog));


        savedData.winner = memoryGame.winner
        savedData.points = memoryGame.winnerPoints
        const supabase = createClient('https://fqmawwzhogveaypwhxmd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxbWF3d3pob2d2ZWF5cHdoeG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNTM4NjQsImV4cCI6MjAzNzgyOTg2NH0.njz-zhNI6JEK1frjirCEdKjnVRByEUbUyGHeGNrn0G0')
        console.log('Supabase Instance: ', supabase)

        const insertWinnerAndPoints = async () => {
            const {data: gameData, error: gameLogError} = await supabase
                .from('game')
                .insert(savedData)
                .select();

            if (gameLogError) {
                console.error('Error inserting game logs:', gameLogError.message);
                console.error('Error details:', gameLogError);
                return;
            }

            let insertedIds = [];
            if (gameData) {
                insertedIds = gameData.map(item => item.id);  // get the id of the add row
                console.log('Inserted game log IDs:', insertedIds);
            } else {
                console.log('No data returned from game-logs insert.');
            }
            logInsert(insertedIds[0]) // pas the id to the insert log
        };
        insertWinnerAndPoints();

        const logInsert = async (gameId) => {
            memoryGame.gameLog.map((item) => item.foreignKey = gameId)  //add the foreign key which equals the game id
            const {data: logData, error: logError} = await supabase
                .from('logs')
                .insert(memoryGame.gameLog)
                .select();

            if (logError) {
                console.error('Error inserting logs:', logError.message);
                console.error('Error details:', logError);
                return;
            }

            if (logData) {
                const logInsertedIds = logData.map(item => item.id);
                console.log('Inserted log IDs:', logInsertedIds);
            } else {
                console.log('No data returned from logs insert.');
            }
        }
        timeoutId = setTimeout(() => {
            const event = new Event('gameFinished');
            document.dispatchEvent(event);
            clearTimeout(timeoutId)
        }, 1000);
    }
}