const width = window.innerWidth; // width of the screen
const height = window.innerHeight; // height of the screen
const squareSize = 20; // size of square width and height in px
const container = document.getElementById("container"); // container squares are put in
const squaresHorizontal = Math.floor((width * 0.5) / squareSize); // number of squares across
const squaresVertical = Math.floor((height * 0.5) / squareSize); // number of squares up and down
const totalSquares = squaresHorizontal * squaresVertical; // total number of squares on board

var bombSquares = []; // which squares have bombs, 0 no bomb, 1 bomb
var squareNumbers = []; // numbers on squares representing number of bombs around that square
var needRemoved = []; // what squares need to be removed because no bomb around them or next to square without bomb
var instruction = false; // are the instructions displayed
var squareColor = []; // what color is each square
var bombsLeft = [0, 0]; // how many bombs are there and how many flags have been placed
var flagPlaced = []; // does square have a flag on it
var startTime = new Date().getTime();
var currentTime = new Date().getTime();

// size container to fit squares
container.style.width = `${Math.floor((width * 0.5) / squareSize) * squareSize}px`;
container.style.height = `${Math.floor((height * 0.5) / squareSize) * squareSize}px`;

createSquares();
placeBombs();
findNumbers();
completeExamples();


// create and color the squares
function createSquares() {
  for (let i = 0; i < totalSquares; i++) {
    const div = document.createElement("div");
    div.classList.add("backgroundTiles");

    // off set so that it is always checkers
    let offSet = 1;
    if (Math.floor(i / squaresHorizontal) % 2 != 0 && squaresHorizontal % 2 == 0) {
      offSet = 0;
    }

    // apply colors
    if ((i + offSet) % 2 == 0) {
      div.style.backgroundColor = `rgb(${0}, ${102}, ${0})`;
      squareColor[i] = `rgb(${0}, ${102}, ${0})`;
    } else {
      div.style.backgroundColor = `rgb(${0}, ${230}, ${0})`;
      squareColor[i] = `rgb(${0}, ${230}, ${0})`;
    }
    div.id = i;
    // check if tile is clicked
    div.addEventListener("click", tileClick);
    // place flag
    div.addEventListener("contextmenu", placeFlag);
    document.getElementById("container").appendChild(div);
  }
}

// deside which squares bombs are going to be on 11% are bombs
function placeBombs() {
  for (let i = 0; i < totalSquares; i++) {
    // first 10% are bombs rest not
    if (i < totalSquares * 0.11) {
      bombSquares[i] = 1;
      bombsLeft[0]++;
    } else {
      bombSquares[i] = 0;
    }
  }
  // randomize bomb position
  for (let i = bombSquares.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bombSquares[i], bombSquares[j]] = [bombSquares[j], bombSquares[i]];
  }
}

// find out how many bombs are around any given square
function findNumbers() {
  for (let i = 0; i < totalSquares; i++) {
    // if bomb on that square do not need to find how many bombs are around it
    if (bombSquares[i] == 0) {
      squareNumbers[i] = 0;
      // left, can not be on left column
      if (bombSquares[i - 1] == 1 && i % squaresHorizontal != 0) {
        squareNumbers[i]++;
      }
      // right, can not be on right column
      if (bombSquares[i + 1] == 1 && (i + 1) % squaresHorizontal != 0) {
        squareNumbers[i]++;
      }
      // top left, can not be on top row or left column
      if (bombSquares[i - squaresHorizontal - 1] == 1 && i % squaresHorizontal != 0 && i >= squaresHorizontal) {
        squareNumbers[i]++;
      }
      // top, can not be on top row
      if (bombSquares[i - squaresHorizontal] == 1 && i >= squaresHorizontal) {
        squareNumbers[i]++;
      }
      // top right, can not be on top row or right column
      if (bombSquares[i - squaresHorizontal + 1] == 1 && (i + 1) % squaresHorizontal != 0 && i >= squaresHorizontal) {
        squareNumbers[i]++;
      }
      // bottom left, can not be on bottom row or left column
      if (bombSquares[i + squaresHorizontal - 1] == 1 && i % squaresHorizontal != 0 && i <= ((squaresHorizontal - 1) * squaresVertical)) {
        squareNumbers[i]++;
      }
      // bottom, can not be on bottom row
      if (bombSquares[i + squaresHorizontal] == 1 && i <= ((squaresHorizontal - 1) * squaresVertical)) {
        squareNumbers[i]++;
      }
      // bottom right, can not be on bottom row or right column
      if (bombSquares[i + squaresHorizontal + 1] == 1 && (i + 1) % squaresHorizontal != 0 && i <= ((squaresHorizontal - 1) * squaresVertical)) {
        squareNumbers[i]++;
      }
    } else {
      squareNumbers[i] = "";
    }
    squareNumbers[i] = "<pre>" + squareNumbers[i] + "</pre>";
  }
}

// some of the examples have mini pictures that need to be made
function completeExamples() {
  const host = document.getElementById("containerForExample");
  const example = host.attachShadow({ mode: "open"});
  // the example 'field' is 5 x 5
  for (let i = 0; i < 25; i++) {
    const div = document.createElement("div");
    div.style.width = `${20}px`;
    div.style.height = `${20}px`;
    div.style.backgroundColor = `rgb(${153}, ${255}, ${153})`;
    div.style.textAlign = "center";
    // create the senerio I want for the example, remove some squares put bomb on another put numbers on others
    if (i < 6 || i == 10 || i == 15 || i == 20) {
      div.innerHTML = "";
    } else if (i > 5 && i < 10 || i == 11 || i == 16 || i == 21) {
      div.innerHTML = "1";
      if (i == 6) {
        div.innerHTML = "<b>1</b>";
      }
    } else if (i == 12) {
      div.style.backgroundColor = `rgb(${0}, ${153}, ${255})`;
    } else {
      if (i % 2 == 0) {
        div.style.backgroundColor = `rgb(${0}, ${230}, ${0})`;
      } else {
        div.style.backgroundColor = `rgb(${0}, ${102}, ${0})`;
      }
    }
    example.appendChild(div);
  }
}

// when player clicks square reveal square
function tileClick(i) {
  i = i.currentTarget.id;
  let currentElement = document.getElementById(i);
  if (bombSquares[i] == 1 && flagPlaced[i] != true) {
    currentElement.style.backgroundColor = `rgb(${255}, ${0}, ${0})`;
    lost();
  } else if (flagPlaced[i] != true) {
    currentElement.style.backgroundColor = `rgb(${153}, ${255}, ${153})`;
    if (squareNumbers[i] == "<pre>0</pre>") {
      removeBlankSquares(i);
      squareNumbers[i] = "";
      var checkSquaresInterval = setInterval(checkBlank, 1);
    }
    currentElement.innerHTML = squareNumbers[i];
    currentElement.removeEventListener("click", tileClick);
    currentElement.removeEventListener("contextmenu", placeFlag);
  }
}

// if player clicks a bomb loose
function lost() {
  for (let i = 0; i < totalSquares; i++) {
    document.getElementById(i).removeEventListener("click", tileClick);
    document.getElementById(i).removeEventListener("contextmenu", placeFlag);
    if (bombSquares[i] == true) {
      document.getElementById(i).style.backgroundColor = `rgb(${255}, ${0}, ${0})`;
    }
  }
  text("You lost");
  clearInterval(timeInterval);
}

// check for win
function checkWin() {
  let win = 0;
  for (let i = 0 ; i < totalSquares; i++) {
    if (!(document.getElementById(i).style.backgroundColor == `rgb(${153}, ${255}, ${153})` || bombSquares[i] == 1)) {
      win++;
    }
  }
  if (win == 0) {
    winGame();
  }
}

// check if player wins
function winGame() {
  for (let i = 0; i < totalSquares; i++) {
    document.getElementById(i).removeEventListener("click", tileClick);
    document.getElementById(i).removeEventListener("contextmenu", placeFlag);
  }
  text("You Win!");
  clearInterval(timeInterval);
}

// if player right clicks on a square place or remove flag from it
function placeFlag(i) {
  i.preventDefault();
  i = i.currentTarget.id;
  if (flagPlaced[i] == true) {
    document.getElementById(i).style.backgroundColor = squareColor[i];
    flagPlaced[i] = false;
    bombsLeft[1]--;
  } else {
    document.getElementById(i).style.backgroundColor = `rgb(${0}, ${153}, ${255})`;
    flagPlaced[i] = true;
    bombsLeft[1]++;
  }
}

// check if squares need to be removed after clicking on a square with no bombs next to it
function checkBlank() {
  if (needRemoved.length > 0) {
    removeSquare(needRemoved[0]);
  } else {
    clearInterval(checkSquaresInterval);
  }
}

// deside what squares need to be removed, all squares around square without bomb on it need to be removed
function removeBlankSquares(i) {
  let j;
  i = Number(i);
  // left, can not be on left column
  if (i % squaresHorizontal != 0) {
    j = i - 1;
    if (squareNumbers[j] != "" && !(needRemoved.includes(j)) && j < totalSquares) {
      needRemoved[needRemoved.length] = j;
    }
  }
  // right, can not be on right column
  if ((i + 1) % squaresHorizontal != 0) {
    j = i + 1;
    if (squareNumbers[j] != "" && !(needRemoved.includes(j)) && j < totalSquares) {
      needRemoved[needRemoved.length] = j;
    }
  }
  // top left, can not be on top row or left column
  if (i % squaresHorizontal != 0 && i >= squaresHorizontal) {
    let j = i - squaresHorizontal - 1;
    if (squareNumbers[j] != "" && !(needRemoved.includes(j)) && j < totalSquares) {
      needRemoved[needRemoved.length] = j;
    }
  }
  // top, can not be on top row
  if (i >= squaresHorizontal) {
    j = i - squaresHorizontal;
    if (squareNumbers[j] != "" && !(needRemoved.includes(j)) && j < totalSquares) {
      needRemoved[needRemoved.length] = j;
    }
  }
  // top right, can not be on top row or right column
  if ((i + 1) % squaresHorizontal != 0 && i >= squaresHorizontal) {
    j = i - squaresHorizontal + 1;
    if (squareNumbers[j] != "" && !(needRemoved.includes(j)) && j < totalSquares) {
      needRemoved[needRemoved.length] = j;
    }
  }
  // bottom left, can not be on bottom row or left column
  if (i % squaresHorizontal != 0 && i <= ((squaresHorizontal - 1) * squaresVertical)) {
    j = i + squaresHorizontal - 1;
    if (squareNumbers[j] != "" && !(needRemoved.includes(j)) && j < totalSquares) {
      needRemoved[needRemoved.length] = j;
    }
  }
  // bottom, can not be on bottom row
  if (i <= ((squaresHorizontal - 1) * squaresVertical)) {
    j = i + squaresHorizontal;
    if (squareNumbers[j] != "" && !(needRemoved.includes(j)) && j < totalSquares) {
      needRemoved[needRemoved.length] = j;
    }
  }
  // bottom right, can not be on bottom row or right column
  if ((i + 1) % squaresHorizontal != 0 && i <= ((squaresHorizontal - 1) * squaresVertical)) {
    j = i + squaresHorizontal + 1;
    if (squareNumbers[j] != "" && !(needRemoved.includes(j)) && j < totalSquares) {
      needRemoved[needRemoved.length] = j;
    }
  }
}

// remove all squares that need to be removed because they have no bombs around them
function removeSquare(i) {
  document.getElementById(i).style.backgroundColor = `rgb(${153}, ${255}, ${153})`;
  if (squareNumbers[i] == "<pre>0</pre>") {
    removeBlankSquares(i);
    squareNumbers[i] = "";
  }
  document.getElementById(i).innerHTML = squareNumbers[i];
  needRemoved.splice(0, 1);
  document.getElementById(i).removeEventListener("click", tileClick);
  document.getElementById(i).removeEventListener("contextmenu", placeFlag);
  if (flagPlaced[i] == true) {
    bombsLeft[1]--;
    flagPlaced[i] = false;
  }
}

// show and hide instructions
document.getElementById("cover").style.display = "none";
document.getElementById("coverText").style.display = "none";
function instructions() {
  if (instruction == true) {
    document.getElementById("cover").style.display = "none";
    document.getElementById("coverText").style.display = "none";
    document.getElementById("instructions").innerHTML = "Instructions";
    instruction = false;
  } else {
    document.getElementById("cover").style.display = "";
    document.getElementById("coverText").style.display = "";
    document.getElementById("instructions").innerHTML = "Back";
    instruction = true;
  }
}

// display amount of time and flags placed
var timeInterval = setInterval(display, 1000);
display();
function display() {
  checkWin();
  currentTime = new Date().getTime();
  let time = currentTime - startTime;
  time = Math.floor(time / 1000);
  document.getElementById("displayText").innerHTML = "Flags placed " + bombsLeft[0] + "/" + bombsLeft[1] + "<br>" + time + "s";
}

// display text
function text(text) {
  document.getElementById("text1").innerHTML = text;
  document.getElementById("text2").innerHTML = text;
  document.getElementById("text3").innerHTML = text;
  document.getElementById("text4").innerHTML = text;
}

// prevent the menu from showing up when right clicking
document.addEventListener("contextmenu", removeContentMenu);
function removeContentMenu(e) {
  e.preventDefault();
}
