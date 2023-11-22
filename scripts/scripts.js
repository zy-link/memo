"use strict";

const game = {
    isClickable: false,
    gameMoves: 0,
    gameMatches: 0,
    gameMode: 'nothing',

    firstSelection: null,
    firstSelectionValue: null,
    cellValues: null,

    gameTitle: 'Memory Game',
    setGameTitle: $('#game-title'),

    currentScreen: 'input-player-section',
    gameSection: $('#game-section'),
    gameScreen: $('.game-screen'),

    inputName: $('#input-player-name'),
    selectLevel: $('#select-level'),
    gameStartButton: $('#start-game-button'),

    displayName: $('#player-name'),
    displayMoves: $('#player-score'),
    helpButton: $('#help-button'),
    quitGameButton: $('#quit-game-button'),

    gameQuitButton: $('#quit-game'),
    gameRestartButton: $('#restart-game'),

    gameAlert: $('#alert-info'),
    gameHelpInfo: $('#help-info'),
    gameQuitRestart: $('#quit-or-restart'),

    gameResultInfo: $('#game-result'),

    levelEasy: ['images/number1.svg', 'images/number2.svg', 'images/number3.svg', 'images/number4.svg', 'images/number5.svg', 'images/number6.svg', 'images/number7.svg', 'images/number8.svg', 'images/number1.svg', 'images/number2.svg', 'images/number3.svg', 'images/number4.svg', 'images/number5.svg', 'images/number6.svg', 'images/number7.svg', 'images/number8.svg'],
    levelMiddle: ['images/number1.svg', 'images/number2.svg', 'images/number3.svg', 'images/number4.svg', 'images/letterA.svg', 'images/letterB.svg', 'images/letterC.svg', 'images/letterD.svg', 'images/number1.svg', 'images/number2.svg', 'images/number3.svg', 'images/number4.svg', 'images/letterA.svg', 'images/letterB.svg', 'images/letterC.svg', 'images/letterD.svg'],
    levelHard: ['images/number1.svg', 'images/number2.svg', 'images/letterA.svg', 'images/letterB.svg', 'images/image1.svg', 'images/image2.svg', 'images/image3.svg', 'images/image4.svg', 'images/number1.svg', 'images/number2.svg', 'images/letterA.svg', 'images/letterB.svg', 'images/image1.svg', 'images/image2.svg', 'images/image3.svg', 'images/image4.svg'],

    gameBackgroundSound: document.getElementById('mainBackgroundGame'),
    gameMatchSound: document.getElementById('matchCell'),
    gameNotMatchSound: document.getElementById('notMatchCell'),
    gameWinSound: document.getElementById('winGame'),

    switchScreen: function (currentScreen) {
        game.gameScreen.hide();
        $(currentScreen).show();
        game.currentScreen = currentScreen;
    },

    displayPlayerName: function () {
        game.displayName.text('Player: ' + game.inputName.val());
    },

    displayPlayerMoves: function () {
        game.displayMoves.text('Moves: ' + game.gameMoves);
    },

    gameAlertInfo: function () {
        this.gameAlert.modal('show');
    },

    gameLoad: function () {
        if (game.inputName.val() !== '' && game.selectLevel.val() !== 'nothing') {
            game.switchScreen('#game-data');
            game.displayPlayerName();
            game.displayPlayerMoves();
            game.gameSection.show();
            game.gameBackgroundSound.play();
        } else {
            game.gameAlertInfo();
        }

        game.gameMode = game.selectLevel.val();

        switch (game.gameMode) {
            case 'easy':
                game.cellValues = game.shuffleCard(game.levelEasy.slice());
                break;
            case 'middle':
                game.cellValues = game.shuffleCard(game.levelMiddle.slice());
                break;
            case 'hard':
                game.cellValues = game.shuffleCard(game.levelHard.slice());
                break;
        }

        for (let i = 0; i < game.levelEasy.length; i++) {
            const cell = document.getElementById('cell_' + i);
            cell.onclick = game.clickCardToPair.bind(cell);
            game.isClickable = true;
        }
    },

    clickCardToPair: function () {
        if (!game.isClickable) {
            return;
        }

        game.gameMoves++;

        let currentCellValue = game.cellValues[this.id.substring(5)];

        for (let i = 0; i < game.levelEasy.length; i++) {
            document.getElementById('cell_' + i).src = 'images/cardCover.svg';
        }

        switch (game.gameMode) {
            case 'easy':
            case 'middle':
            case 'hard':
                this.innerHTML = "<img src='" + currentCellValue + "'/>";
                break;
        }

        game.displayPlayerMoves();

        if (game.firstSelection == null) {
            game.firstSelection = this;
            game.firstSelectionValue = currentCellValue;
            this.onclick = null;
            return;
        }

        if (currentCellValue == game.firstSelectionValue) {
            this.onclick = null;
            game.firstSelection = null;
            game.firstSelectionValue = null;
            game.gameMatchSound.play();
            game.gameMatches++;
            game.isClickable = false;

            if (game.gameMatches == 8) {
                game.gameResultInfo.text('Finished!');
                game.gameWinSound.play();
                game.quitRestartGame();
            }

            setTimeout(function () {
                game.isClickable = true;
            }, 1000);

            return;
        } else {
            game.isClickable = false;
            setTimeout(function () {
                game.firstSelection.onclick = game.clickCardToPair.bind(game.firstSelection);
                game.firstSelection.innerHTML = "<img src='images/cardCover.svg'/>";
                game.firstSelection = null;
                game.firstSelectionValue = null;
                this.innerHTML = "<img src='images/cardCover.svg'/>";
                game.isClickable = true;
            }.bind(this), 1000);
        }

        game.gameNotMatchSound.play();
    },

    shuffleCard: function (array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    helpGame: function () {
        game.gameHelpInfo.modal('show');
    },

    quitRestartGame: function () {
        game.gameQuitRestart.modal('show');
    },

    quitGame: function () {
        game.switchScreen('#input-player-section');
        game.gameSection.hide();
        game.inputName.val('');
        game.selectLevel.val('nothing');
        game.gameMode = 'nothing';
        game.gameMoves = 0;
        game.gameMatches = 0;
        game.firstSelection = null;
        game.firstSelectionValue = null;
        game.cellValues = null;
        game.gameBackgroundSound.pause();
        game.gameWinSound.pause();
        game.gameWinSound.currentTime = 0;
        game.gameBackgroundSound.currentTime = 0;

        for (let i = 0; i < game.levelEasy.length; i++) {
            let cell = document.getElementById('cell_' + i);
            cell.innerHTML = "<img src='images/cardCover.svg'/>";
            cell.onclick = game.clickCardToPair.bind(cell);
        }
    },

    restartGame: function () {
        for (let i = 0; i < game.levelEasy.length; i++) {
            let cell = document.getElementById('cell_' + i);
            cell.innerHTML = "<img src='images/cardCover.svg'/>";
            cell.onclick = game.clickCardToPair.bind(cell);
        }

        switch (game.gameMode) {
            case "easy":
                game.cellValues = game.shuffleCard(game.levelEasy.slice());
                break;
            case "middle":
                game.cellValues = game.shuffleCard(game.levelMiddle.slice());
                break;
            case "hard":
                game.cellValues = game.shuffleCard(game.levelHard.slice());
                break;
        }

        game.gameMoves = 0;
        game.gameMatches = 0;
        game.displayPlayerMoves();
        game.gameQuitRestart.modal('hide');
    },

    init: function () {
        game.setGameTitle.text(game.gameTitle);
        game.gameSection.hide();

        game.switchScreen('#input-player-section');

        game.gameStartButton.on('click', () => {
            game.gameLoad();
        });

        game.quitGameButton.on('click', () => {
            game.gameResultInfo.text('Restart Game Or Quit Game');
            game.quitRestartGame();
        });

        game.helpButton.on('click', () => {
            game.helpGame();
        });

        game.gameQuitButton.on('click', () => {
            game.quitGame();
        });

        game.gameRestartButton.on('click', () => {
            game.restartGame();
        });
    }
}

$().ready(() => {
    game.init();
});
