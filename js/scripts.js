document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    //welcome page
    const entryForm = document.createElement('form');           //create the html dynamically
    entryForm.className = 'form-container hidden'; // init with 'hidden' class
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

    const mainGame = document.createElement('div');
    mainGame.className = 'container hidden';
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

    const resultsPage = document.createElement('div');
    resultsPage.className = 'result-container hidden';
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

    function showSection(section) {
        entryForm.classList.add('hidden');
        mainGame.classList.add('hidden');
        resultsPage.classList.add('hidden');

        if (section === 'entry') {    // to show the selected , change url
            entryForm.classList.remove('hidden');
            document.title = "Welcome To Memory Game";
            history.pushState(null, "", "/entry");
        } else if (section === 'main') {
            mainGame.classList.remove('hidden');
            document.title = "Memory Game";
            history.pushState(null, "Memory Game", "/game");
        } else if (section === 'results') {
            resultsPage.classList.remove('hidden');
            document.title = "Game Results";
            history.pushState(null, "Game Results", "/results");
        }
        console.log(`Section: ${section}, Title: ${document.title}, URL: ${window.location.href}`);

    }

    showSection('entry');

    entryForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;
        document.getElementById('player-one-label').innerText = player1Name;
        document.getElementById('player-two-label').innerText = player2Name;
        showSection('main');
    });



    document.addEventListener('gameFinished', function() {  // to show results after game finished
        showSection('results');
    })


    const initEvent = new Event('gameInitialized');
    document.dispatchEvent(initEvent);
});
