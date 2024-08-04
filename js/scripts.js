import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import {gameJs} from "./game.js";
import {resultsJs} from "./results.js";

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
            document.addEventListener('gameInitialized', function() {
             const player1Name = document.getElementById('player1').value;
            const player2Name = document.getElementById('player2').value;
            localStorage.setItem('player1Name', player1Name);
            localStorage.setItem('player2Name', player2Name);
})
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
            resultsJs()
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
