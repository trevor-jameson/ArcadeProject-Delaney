const tiles = document.querySelectorAll(".tile");
const PLAYER_X = "X";
const PLAYER_O = "O";
let turn = PLAYER_X;

// REVIEW: You could use an array literal here instead [null, null, null...]
const boardState = Array(tiles.length);
boardState.fill(null);


// REVIEW: Get into the habit of setting selected html elements to local variables instead of globals.
// ...The globals won't update if you add / remove elements to the page.
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
// REVIEW: These event listeners should be added to the page in a separate function, not the global scope.
// ...Nothing's broken here, it's just best practice (important later for React)
playAgain.addEventListener("click", startNewGame);



tiles.forEach((tile) => tile.addEventListener("click", tileClick));

function setPlayerName () {
  // REVIEW: Always use the const or let keywords instead of var. Var creates bugs with unintended scoping side-effects.
    var playNameDiv = document.getElementById('playerName');
    
    playNameDiv.innerHTML = document.getElementById('playerNameInput').value;
    
  }

  // REVIEW: Good use of a reusable helper function here. The tiles HTML should be selected with .querySelectorAll()...
  // ...within the function per the above comment.
function setHoverText() {
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });

  const hoverClass = `${turn.toLowerCase()}-hover`;

  tiles.forEach((tile) => {
    if (tile.innerText == "") {
      tile.classList.add(hoverClass);
    }
  });
}

setHoverText();

function tileClick(event) {
  if (gameOverArea.classList.contains("visible")) {
    return;
  }

  const tile = event.target;
  const tileNumber = tile.dataset.index;
  // REVIEW: Always use strict equals === instead of loose equals ==
  if (tile.innerText != "") {
    return;
  }

  if (turn === PLAYER_X) {
    tile.innerText = PLAYER_X;
    // REVIEW: Subtracting by 1 will get the correct index here, but you could also do that in the cell
    // ...html elements instead by starting at data-index="0" to data-index="8"
    boardState[tileNumber - 1] = PLAYER_X;
    turn = PLAYER_O;
  } else {
    tile.innerText = PLAYER_O;
    boardState[tileNumber - 1] = PLAYER_O;
    turn = PLAYER_X;
  }

 
  setHoverText();
  checkWinner();
}

function checkWinner() {

  // REVIEW: Good use of the modern for...of loop and object deconstruction const { variable1, variable2 } = someObject
  for (const winningCombination of winningCombinations) {

    const { combo, strikeClass } = winningCombination;
    const tileValue1 = boardState[combo[0] - 1];
    const tileValue2 = boardState[combo[1] - 1];
    const tileValue3 = boardState[combo[2] - 1];

    if (
      tileValue1 != null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      strike.classList.add(strikeClass);
      gameOverScreen(tileValue1);
      return;
    }
  }


  const allTileFilledIn = boardState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    text = `Winner is ${winnerText}!`;
  }
  gameOverArea.className = "visible";
  gameOverText.innerText = text;
  // REVIEW: Was gameOverSound intended to conenct to an audio file? You could either do this with an HTML audio element or...
  // ...by using the Audio() class in JS.
  gameOverSound.play();
}

function startNewGame() {
  strike.className = "strike";
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach((tile) => (tile.innerText = ""));
  turn = PLAYER_X;
  setHoverText();
}

// REVIEW: Good use of objects to associate each combo with the class that represents those cells on the page.
const winningCombinations = [
  { combo: [1, 2, 3], strikeClass: "strike-row-1" },
  { combo: [4, 5, 6], strikeClass: "strike-row-2" },
  { combo: [7, 8, 9], strikeClass: "strike-row-3" },
  { combo: [1, 4, 7], strikeClass: "strike-column-1" },
  { combo: [2, 5, 8], strikeClass: "strike-column-2" },
  { combo: [3, 6, 9], strikeClass: "strike-column-3" },
  { combo: [1, 5, 9], strikeClass: "strike-diagonal-1" },
  { combo: [3, 5, 7], strikeClass: "strike-diagonal-2" },
];


  