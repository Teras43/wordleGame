/** Variables for the specified html sections of the page */
const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");

/** Winning Wordle Word */
let wordle;
/** Function to get the Wordle word from the API. */
const getWordle = () => {
  fetch("https://petalite-equal-clef.glitch.me/word")
    .then((response) => response.json())
    .then((json) => {
      wordle = json.toUpperCase();
    })
    .catch((err) => console.log(err));
};
getWordle();

/** Pseudo keyboard on page (Array) */
const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "DELETE",
  "ENTER",
];

/** Layout of the wordle game squares. */
const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

/** Creates the div (or "letter square") for the game (with CSS classes / ids) */
guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guessRow-" + guessRowIndex + "-tile-" + guessIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

/** Creates buttons for the pseudo keyboard on screen */
keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
  if (key === "M" || key === "L" || key === "P") {
    const lineBreak = document.createElement("div");
    lineBreak.setAttribute("class", "flex-break");
    keyboard.append(lineBreak);
  }
});

/** Handles any events that the player will incur. */
const handleClick = (key) => {
  if (!isGameOver) {
    if (key === "DELETE") {
      deleteLetter();
      return;
    } else if (key === "ENTER") {
      checkRow();
      return;
    }
    if (currentTile < 5 && currentRow < 6) {
      addLetter(key);
    }
  }
};

let highlightTile = document.getElementById(
  "guessRow-" + currentRow + "-tile-" + currentTile
);
highlightTile.style.border = "2px solid white";

/** Sets the letter squares of the game to the letter guessed. */
const addLetter = (letter) => {
  const tile = document.getElementById(
    "guessRow-" + currentRow + "-tile-" + currentTile
  );
  tile.textContent = letter;
  guessRows[currentRow][currentTile] = letter;
  tile.setAttribute("data", letter);
  tile.style.border = "2px solid #3a3a3c";
  currentTile++;
  if (currentTile < 5) {
    const nextTile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    nextTile.style.border = "2px solid white";
  }
};

/** Removes the letter currently being put into the game for checking against the wordle word. */
const deleteLetter = () => {
  if (currentTile > 0) {
    const currentHighlightTile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    currentHighlightTile.style.border = "2px solid #3a3a3c";
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
    const newHighlightTile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    newHighlightTile.style.border = "2px solid white";
  }
};

/** Takes the current spot of the guess and checks to make sure a 5 letter world has been created. */
const checkRow = () => {
  const guess = guessRows[currentRow].join("");

  if (currentTile > 4) {
    // fetch(`http://localhost:8000/check/?word=${guess}`)
    //   .then((res) => res.json())
    //   .then((json) => {
    //     console.log(json);
    //     if (json == "Entry word not found") {
    //        showMessage('word not in list')
    //        return
    //     } else {
    //        /** Here is where the below code would go if the api was active. */
    //     }
    //   }).catch(err => console.log(err));

    flipTile();
    if (wordle === guess) {
      showMessage("Amazing!");
      isGameOver = true;
    } else {
      if (currentRow >= 5) {
        isGameOver = true;
        showMessage("Game Over");
        return;
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
        const nextRowTile = document.getElementById(
          "guessRow-" + currentRow + "-tile-" + currentTile
        );
        nextRowTile.style.border = "2px solid white";
      }
    }
  }
};

/** Display of the winning or losing message on the screen. */
const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  if (message !== "Game Over") {
    setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
  }
};

/** Function that adds the class to change the color of the key on the pseudo keyboard. */
const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

/** Function used when guessing a letter to flip and color the tile to find out if the letter is correct, close or wrong. */
const flipTile = () => {
  /** Holds the entire row of tiles selected. */
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
  /** Variable to manipulate the wordle and remove words from it. */
  let checkWordle = wordle;
  /** Array to push guesses into, as well as colors assigned to them. */
  const guess = [];

  /** Collects all the data into one spot. */
  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });
  });

  /** Checks current index in wordle to see if the wordle letter matches the current letter input. Then removes letter from the 'checkWordle' */
  guess.forEach((guess, index) => {
    if (guess.letter === wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  /** Checks current index in wordle to see if the wordle contains the current letter input. Then removes letter from the 'checkWordle' */
  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });

  /** Below code was used previous before I gathered all information to work with first. */
  /** Checks the wordle word for the letter in each box, will then change the background color to one of three things depending on whether the letter is in the correct spot, exists at all, or isn't part of the word. */
  // rowTiles.forEach((tile, index) => {
  // const dataLetter = tile.getAttribute("data");

  // setTimeout(() => {
  // tile.classList.add("flip");
  // if (dataLetter === wordle[index]) {
  //   tile.classList.add("green-overlay");
  //   addColorToKey(dataLetter, "green-overlay");
  // } else if (wordle.includes(dataLetter)) {
  //   tile.classList.add("yellow-overlay");
  //   addColorToKey(dataLetter, "yellow-overlay");
  // } else {
  //   tile.classList.add("grey-overlay");
  //   addColorToKey(dataLetter, "grey-overlay");
  // }
  // }, 500 * index);
  // });
};
