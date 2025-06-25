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
/*------------------------ Cached Element References ------------------------*/
const squareEls = document.querySelectorAll(".sqr");
const msgEl = document.querySelector("#message");
const gameBoard = document.querySelector(".board");
const resetBtn = document.querySelector("#reset");

/*-------------------------------- Functions --------------------------------*/
function init() {
  board = new Array(9).fill("");
  turnIdx = 0;
  turn = turns[turnIdx];
  winner = false;
  tie = false;
  msg;
  render();
}
function handleClick(event) {
  const squareIndex = event.target.id;
  if (board[squareIndex]) return;
  if (winner || tie) return;
  placePiece(squareIndex);
  checkWinner();
  checkTie();
  switchTurn();
  render();
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
  if (!winner && !tie) {
    message = `It is ${turn}'s turn`;
  } else if (tie) {
    message = "It is a tie.";
  } else if (winner) {
    message = `The winner is ${turn}`;
  }
  msgEl.textContent = message;
}

function placePiece(index) {
  board[index] = turn;
  updateBoard();
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
  console.log(tie);
}
function switchTurn() {
  if (winner || tie) return;
  turnIdx = (turnIdx + 1) % 2; //switches between zero and 1
  turn = turns[turnIdx];
}

/*----------------------------- Event Listeners -----------------------------*/
resetBtn.addEventListener("click", (event) => {
  init();
});
gameBoard.addEventListener("click", handleClick);

init();
