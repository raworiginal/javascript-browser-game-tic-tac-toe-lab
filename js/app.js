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
// const scores = {
//   X: 1,
//   O: -1,
//   tie: 0,
// };
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
    console.log(winner);
    checkTie();
    switchTurn();
    console.log(`the current turn is ${turn}`);
    render();
    if (mode === "vsComputer") {
      computerTurn();
      winner = checkWinner();
      checkTie();
      switchTurn();
      console.log(`the current turn is ${turn}`);
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
  let winState = false;
  winningCombos.forEach((combo) => {
    if (!board[combo[0]]) return;
    if (
      board[combo[0]] === board[combo[1]] &&
      board[combo[0]] === board[combo[2]]
    ) {
      winState = true;
    }
  });
  return winState;
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
  // if (winner || tie) return;
  // let availableSpaces = [];
  // board.forEach((space, idx) => {
  //   if (!space) {
  //     availableSpaces.push(idx);
  //   }
  // });
  // let computerChoiceIdx = math.randomInt(availableSpaces.length - 1);
  // let computerChoice = availableSpaces[computerChoiceIdx];
  const result = minimax(board, false);
  const move = result.move;
  if (move !== undefined) {
    console.log("working", move);
    placePiece(move);
  } else {
    console.log("Not working");
    console.log(result);
  }
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

function minimax(board, isMaximizing) {
  const winner = checkWinner();
  // console.log(winner);
  if (winner && turnIdx === 0) return { score: 1 };
  if (winner && turnIdx === 1) return { score: -1 };
  if (tie) return { score: 0 };
  // const testBoard = [...board];
  let bestMove;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let [idx, space] of board.entries()) {
      if (space === "") {
        board[idx] = turns[0];
        const result = minimax(board, false);
        // console.log(result);
        board[idx] = "";
        // switchTurn();
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = idx;
          console.log(bestScore);
        }
      }
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    for (let [idx, space] of board.entries()) {
      if (space === "") {
        board[idx] = turns[1];
        const result = minimax(board, true);
        // console.log(result);
        board[idx] = "";
        console.log(board);
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = idx;
        }
      }
      // switchTurn();
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
