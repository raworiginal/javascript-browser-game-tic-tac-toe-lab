/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const turns = ["☠️", "🥷"];

/*---------------------------- Variables (state) ----------------------------*/
let turnIdx;
let turn;
let msg;
let board;
let winner;
let tie;
let mode = null;
let computerPlay;
/*------------------------ Cached Element References ------------------------*/
const squareEls = document.querySelectorAll(".sqr");
const msgEl = document.querySelector("#message");
const gameBoard = document.querySelector(".board");
const resetBtn = document.querySelector("#reset");
const btnGrid = document.querySelector(".buttons-grid");
const vsBtns = document.querySelectorAll(".versus");

/*-------------------------------- Functions --------------------------------*/
function init() {
  board = new Array(9).fill("");
  turnIdx = 0;
  turn = turns[turnIdx];
  winner = false;
  tie = false;
  msg = "Please choose a mode";
  mode = null;
  render();
}

function handleClick(event) {
  if (mode) {
    playerTurn(event);
    checkWinner();
    checkTie();
    switchTurn();
    render();
    if (mode === "vsComputer") {
      computerTurn();

      checkWinner();
      checkTie();
      switchTurn();
      render();
    }
  }
}

function render() {
  updateBoard();
  updateMessage();
}
function updateBoard() {
  squareEls.forEach((sqr) => {
    sqr.textContent = board[sqr.id];
  });
}
function updateMessage() {
  if (!mode) {
    msg = "Please choose a mode";
  } else if (!winner && !tie) {
    msg = `It is ${turn}'s turn`;
  } else if (tie) {
    msg = "It is a tie.";
  } else if (winner) {
    msg = `The winner is ${turn}`;
  }
  msgEl.textContent = msg;
}

function placePiece(index) {
  board[index] = turn;
  // updateBoard();
}

function checkWinner() {
  winningCombos.forEach((combo) => {
    if (!board[combo[0]]) return;
    if (
      board[combo[0]] === board[combo[1]] &&
      board[combo[0]] === board[combo[2]]
    ) {
      winner = true;
    }
  });
}

function checkTie() {
  if (winner) return;
  if (board.includes("")) return;
  tie = true;
}

function switchTurn() {
  if (winner || tie) return;
  turnIdx = (turnIdx + 1) % 2; // switches between 0 and 1
  turn = turns[turnIdx];
}
function swapBtns() {
  vsBtns.forEach((btn) => {
    btn.classList.toggle("hidden");
  });
  resetBtn.classList.toggle("hidden");
}
function computerTurn() {
  if (winner || tie) return;
  let availableSpaces = [];
  board.forEach((space, idx) => {
    if (!space) {
      availableSpaces.push(idx);
    }
  });
  let computerChoiceIdx = math.randomInt(availableSpaces.length - 1);
  let computerChoice = availableSpaces[computerChoiceIdx];
  placePiece(computerChoice);
}

function playerTurn(event) {
  const squareIndex = event.target.id;
  if (board[squareIndex]) return;
  if (winner || tie) return;
  placePiece(squareIndex);
}
function pause(ms) {
  let now = Date.now();
  console.log(now);
  const end = now + ms;
  while (now < end) {
    now = Date.now();
  }
}
/*----------------------------- Event Listeners -----------------------------*/
btnGrid.addEventListener("click", (event) => {
  if (event.target.id === "reset") {
    init();
    swapBtns();
  }
  if (event.target.classList.contains("versus")) {
    console.log(event.target);
    if (event.target.id === "vs-player") {
      mode = "vsPlayer";
    } else {
      mode = "vsComputer";
    }
    render();
    console.log(mode);
    swapBtns();
  }
});
gameBoard.addEventListener("click", handleClick);

init();
