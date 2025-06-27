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
    winner = checkWinner();
    tie = checkTie();
    switchTurn();
    render();
    if (mode === "vsComputer") {
      computerTurn();
      winner = checkWinner();
      tie = checkTie();
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
}

function checkWinner(boardState = board) {
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return boardState[a]; // winner winner chicken dinner symbol
    }
  }
  return null;
}

function checkTie(boardState = board) {
  return !checkWinner(boardState) && !boardState.includes("");
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
  if (winner || tie || turn !== "🥷") return;
  const result = minimax([...board], true);
  const move = result.move;
  if (move !== undefined) placePiece(move);
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

function minimax(boardState, isMax) {
  const winner = checkWinner(boardState);
  if (winner === "🥷") return { score: 1 };
  if (winner === "☠️") return { score: -1 };
  const tie = checkTie(boardState);
  if (tie) return { score: 0 };
  let bestMove;
  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "🥷";
        const result = minimax(boardState, false);
        boardState[i] = "";
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = i;
        }
      }
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "☠️";
        const result = minimax(boardState, true);
        boardState[i] = "";
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = i;
        }
      }
    }
    return { score: bestScore, move: bestMove };
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
