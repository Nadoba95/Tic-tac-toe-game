"use strict";

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATION = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");

const winner = document.querySelector("[data-winner]");
const winningSign = document.querySelector(".winning-sign-img");
const winningMessageText = document.querySelector(".winning-message-text");

const winningMessageElement = document.querySelector(".winning-message-fixed");
const restartMessageElement = document.querySelector(".restart-game-fixed");
const newMenuElement = document.querySelector(".new-menu");
const containerElement = document.querySelector(".container");

const resultXElement = document.querySelector(".result-cell__number--x");
const resultOElement = document.querySelector(".result-cell__number--o");
const tieElement = document.querySelector(".result-cell__number--tie");
const signElement = document.querySelector(".header__switch__player");
const backgroundX = document.querySelector(".x-sign-bg");
const backgroundO = document.querySelector(".o-sign-bg");

const playerX = document.querySelector(".result-cell__text--x");
const playerO = document.querySelector(".result-cell__text--o");

const btnShowRestartMessage = document.getElementById("btn-restart");
const btnNextRound = document.getElementById("next-round");
const btnCancel = document.getElementById("cancel");
const btnRestart = document.getElementById("restart");
const btnNewGame = document.getElementById("new-game");
const btnVsCPU = document.getElementById("vsCPU");
const btnQuit = document.getElementById("quit");

let circleTurn = false;
let vsComputer = null;
let x = 0;
let o = 0;
let tie = 0;

function startGame() {
  circleTurn = false;
  signElement.style.backgroundImage = "url(./images/SVG/icon-x.svg)";

  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.addEventListener("click", handleClick, { once: true });
  });

  setBoardHoverClass();
  hideWinningMessage();
  hideRestartMessage();

  if (!backgroundX.classList.contains("active")) {
    const timer = setTimeout(() => {
      computerTurn(X_CLASS);
      return () => clearTimeout(timer);
    }, 100);
  }
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

  placeMark(cell, currentClass);
  checkGameStatus(currentClass);

  if (vsComputer) {
    if (backgroundX.classList.contains("active")) {
      if (circleTurn) {
        const timer = setTimeout(() => {
          computerTurn(CIRCLE_CLASS);
          return () => clearTimeout(timer);
        }, 300);
      }
    } else {
      if (!circleTurn) {
        const timer = setTimeout(() => {
          computerTurn(X_CLASS);
          return () => clearTimeout(timer);
        }, 300);
      }
    }
  }
}

function computerTurn(currentClass) {
  const emptyCells = [...cellElements].filter((cell) => {
    return (
      !cell.classList.contains(X_CLASS) &&
      !cell.classList.contains(CIRCLE_CLASS)
    );
  });

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  placeMark(randomCell, currentClass);
  checkGameStatus(currentClass);
}

function checkGameStatus(currentClass) {
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    winner.style.display = "none";
    winningSign.style.display = "none";
    winningMessageText.innerHTML = "ROUND TIED";
    winningMessageText.style.color = "#a8bfc9";

    tie++;
    tieElement.innerHTML = `${tie}`;
  } else {
    winner.style.display = "block";
    winningSign.style.display = "block";
    winningMessageText.innerHTML = "TAKES THE ROUND";
    circleTurn
      ? (winner.innerHTML = `${playerO.innerHTML} WINS!`)
      : (winner.innerHTML = `${playerX.innerHTML} WINS!`);
    circleTurn
      ? (winningMessageText.style.color = "#f2b137")
      : (winningMessageText.style.color = "#31c3bd");
    circleTurn
      ? (winningSign.style.backgroundImage = "url(./images/SVG/icon-o.svg)")
      : (winningSign.style.backgroundImage = "url(./images/SVG/icon-x.svg)");

    circleTurn ? o++ : x++;
    circleTurn
      ? (resultOElement.innerHTML = `${o}`)
      : (resultXElement.innerHTML = `${x}`);
  }

  showWinningMessage();
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;

  circleTurn
    ? (signElement.style.backgroundImage = "url(./images/SVG/icon-o.svg)")
    : (signElement.style.backgroundImage = "url(./images/SVG/icon-x.svg)");
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);

  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATION.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function showWinningMessage() {
  winningMessageElement.classList.remove("hidden");
}

function hideWinningMessage() {
  winningMessageElement.classList.add("hidden");
}

function showRestartMessage() {
  restartMessageElement.classList.remove("hidden");
}

function hideRestartMessage() {
  restartMessageElement.classList.add("hidden");
}

function restartRound() {
  tie = 0;
  x = 0;
  o = 0;
  resultXElement.innerHTML = 0;
  resultOElement.innerHTML = 0;
  tieElement.innerHTML = 0;

  startGame();
}

function pickX(e) {
  const element = e.target;
  if (element.matches(".x-sign") || element.matches(".x-sign-bg")) {
    backgroundO.classList.remove("active");
    backgroundX.classList.add("active");
  }
}

function pickO(e) {
  const element = e.target;
  if (element.matches(".o-sign") || element.matches(".o-sign-bg")) {
    backgroundX.classList.remove("active");
    backgroundO.classList.add("active");
  }
}

function newGame() {
  vsComputer = false;
  newMenuElement.classList.add("hidden");
  containerElement.classList.remove("hidden");

  if (backgroundX.classList.contains("active")) {
    playerX.innerHTML = `PLAYER 1`;
    playerO.innerHTML = `PLAYER 2`;
  } else {
    playerX.innerHTML = `PLAYER 2`;
    playerO.innerHTML = `PLAYER 1`;
  }

  startGame();
}

function quitGame() {
  hideWinningMessage();
  containerElement.classList.add("hidden");
  newMenuElement.classList.remove("hidden");
  restartRound();
}

function startVsCPU() {
  newGame();

  if (backgroundX.classList.contains("active")) {
    playerX.innerHTML = `PLAYER`;
    playerO.innerHTML = `CPU`;
  } else {
    playerX.innerHTML = `CPU`;
    playerO.innerHTML = `PLAYER`;
  }

  vsComputer = true;
}

btnShowRestartMessage.addEventListener("click", showRestartMessage);
btnCancel.addEventListener("click", hideRestartMessage);
btnRestart.addEventListener("click", restartRound);
btnNextRound.addEventListener("click", startGame);
backgroundX.addEventListener("click", pickX);
backgroundO.addEventListener("click", pickO);
btnQuit.addEventListener("click", quitGame);
btnNewGame.addEventListener("click", newGame);
btnVsCPU.addEventListener("click", startVsCPU);
