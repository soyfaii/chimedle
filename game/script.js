import LocalStorageManager from "../js/managers/LocalStorageManager.js";

const gameId = new URLSearchParams(window.location.search).get("id");

var game = null;

const saveFile = LocalStorageManager.loadGameState(gameId);

var tries = 0;
var maxTries = 3;
var gameState = "playing";

if (!gameId) {
  window.location.href = "../select/";
}

// Get the game
fetch("../resources/games.json")
  .then((response) => response.json())
  .then((data) => {
    game = data.find((g) => g.id == gameId);
    if (!game) {
      window.location.href = "../select/";
    } else {
      showGame(game);
    }
    // Set the href for the next game button
    const nextGameLink = document.getElementById("button-next");
    const nextGameId = parseInt(gameId) + 1;
    const nextGame = data.find((g) => g.id == nextGameId);
    if (nextGame) {
      nextGameLink.href = `?id=${nextGameId}`;
    } else {
      nextGameLink.style.display = "none";
    }
    // Load the saved game state (if any)
    if (saveFile) {
      const try1 = saveFile.try1;
      const try2 = saveFile.try2;
      const try3 = saveFile.try3;

      // Set the displayed tries
      [try1, try2, try3].forEach((tryResult, index) => {
        const tryElement = document.getElementById(`try${index + 1}`);
        if (tryResult === "guessedAll") {
          tryElement.textContent = "⭐️";
        } else if (tryResult === "guessedGame") {
          tryElement.textContent = "✅";
        } else if (tryResult === "failed") {
          tryElement.textContent = "❌";
        }
      });

      // Set game state
      if (
        try1 == "guessedAll" ||
        try2 == "guessedAll" ||
        try3 == "guessedAll"
      ) {
        gameState = "guessedAll";
      } else if (
        try1 == "guessedGame" ||
        try2 == "guessedGame" ||
        try3 == "guessedGame"
      ) {
        gameState = "guessedGame";
      } else if (try3 == "failed") {
        gameState = "lost";
      } else {
        gameState = "playing";
      }

      // Set the tries
      [try1, try2, try3].forEach((tryResult) => {
        if (
          tryResult == "guessedAll" ||
          tryResult == "guessedGame" ||
          tryResult == "failed"
        ) {
          tries++;
        }
      });

      // Refill and disable form inputs if game is over or they were guessed
      if (gameState == "guessedAll") {
        document.getElementById("guess").value = game.game[0];
        document.getElementById("time").value = game.sound[0];
        document.getElementById("guess").disabled = true;
        document.getElementById("time").disabled = true;
        document.getElementById("submit").disabled = true;
      } else if (gameState == "guessedGame") {
        document.getElementById("guess").value = game.game[0];
        document.getElementById("guess").disabled = true;
        if (tries > 2) {
          document.getElementById("time").value = `💡 ${game.sound[0]}`;
          document.getElementById("time").disabled = true;
          document.getElementById("submit").disabled = true;
        }
      } else if (gameState == "lost") {
        document.getElementById("guess").disabled = true;
        document.getElementById("time").disabled = true;
        document.getElementById("submit").disabled = true;
        document.getElementById("time").value = `💡 ${game.sound[0]}`;
      }

      // Set comment and answer display
      refreshComment();
      if (
        gameState == "guessedAll" ||
        gameState == "guessedGame" ||
        gameState == "lost"
      ) {
        showAnswer();
      }
    }
  })
  .catch((error) => {
    console.error("Error fetching game:", error);
  });

function showGame(game) {
  document.title = `game #${game.id} — Chimedle`;
  const titleElement = document.querySelector("h2");
  titleElement.textContent = `game #${game.id}`;
  const audioElement = document.getElementById("audio");
  audioElement.src = "../resources/audio/game" + game.id + ".wav";
  audioElement.load();
}

function checkGameGuess(guess) {
  var result = false;
  const possibleAnswers = game.game;
  possibleAnswers.forEach((possibleAnswer) => {
    if (guess.toLowerCase() === possibleAnswer.toLowerCase()) {
      result = true;
    }
  });
  return result;
}

function checkSoundGuess(guess) {
  var result = false;
  const possibleAnswers = game.sound;
  possibleAnswers.forEach((possibleAnswer) => {
    console.log(guess);
    console.log(possibleAnswer);
    console.log(guess.toLowerCase().includes(possibleAnswer.toLowerCase()));
    if (
      guess.toLowerCase().includes(possibleAnswer.toLowerCase()) &&
      !guess.startsWith("💡")
    ) {
      result = true;
    }
  });
  return result;
}

const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", function () {
  const gameGuess = document.getElementById("guess").value;
  const soundGuess = document.getElementById("time").value;

  if (checkGameGuess(gameGuess)) {
    if (checkSoundGuess(soundGuess)) {
      scoreAllCorrect();
    } else {
      scoreGameCorrect();
    }
  } else {
    scoreIncorrect();
  }
  refreshComment();
  saveGame();
});

function scoreAllCorrect() {
  const try1 = document.getElementById("try1");
  const try2 = document.getElementById("try2");
  const try3 = document.getElementById("try3");

  gameState = "guessedAll";

  if (tries == 0) {
    try1.textContent = "⭐️";
  } else if (tries == 1) {
    try2.textContent = "⭐️";
  } else if (tries == 2) {
    try3.textContent = "⭐️";
  }
  document.getElementById("guess").disabled = true;
  document.getElementById("time").disabled = true;
  document.getElementById("submit").disabled = true;
  tries++;
  showAnswer();
}

function scoreGameCorrect() {
  const try1 = document.getElementById("try1");
  const try2 = document.getElementById("try2");
  const try3 = document.getElementById("try3");

  gameState = "guessedGame";

  if (tries == 0) {
    try1.textContent = "✅";
  } else if (tries == 1) {
    try2.textContent = "✅";
  } else if (tries == 2) {
    try3.textContent = "✅";
  }
  document.getElementById("guess").disabled = true;
  tries++;
  showAnswer();
}

function scoreIncorrect() {
  const try1 = document.getElementById("try1");
  const try2 = document.getElementById("try2");
  const try3 = document.getElementById("try3");

  if (tries == 0) {
    try1.textContent = "❌";
  } else if (tries == 1) {
    try2.textContent = "❌";
    document.getElementById("time").value = `💡 ${game.sound[0]}`;
    document.getElementById("time").disabled = true;
  } else if (tries == 2) {
    try3.textContent = "❌";
    document.getElementById("guess").disabled = true;
    document.getElementById("time").disabled = true;
    document.getElementById("submit").disabled = true;
    gameState = "lost";
    showAnswer();
  }
  tries++;
}

function refreshComment() {
  document.getElementById("comment").textContent = (() => {
    if (gameState == "playing") {
      if (tries == 0) {
        return "what do you think it is?";
      } else if (tries == 1) {
        return "wrong! you have two tries left.";
      } else if (tries == 2) {
        return "nope! one try left!";
      }
      return "what do you think it is?";
    } else if (gameState == "guessedGame") {
      if (tries < 3) {
        return "you guessed the game! now try to go for the name of the sound!";
      } else {
        return "you guessed the game! no more tries left.";
      }
    } else if (gameState == "guessedAll") {
      return "you guessed everything! congratulations!";
    } else if (gameState == "lost") {
      return "nice try! the game was:";
    }
  })();
}

function showAnswer() {
  document.getElementById("answer-container").style.display = "block";
  document.getElementById("answer-label").textContent = game.game[0];
}

function saveGame() {
  const try1Element = document.getElementById("try1").textContent;
  const try2Element = document.getElementById("try2").textContent;
  const try3Element = document.getElementById("try3").textContent;

  const try1 =
    try1Element === "⭐️"
      ? "guessedAll"
      : try1Element === "✅"
      ? "guessedGame"
      : try1Element === "❌"
      ? "failed"
      : null;
  const try2 =
    try2Element === "⭐️"
      ? "guessedAll"
      : try2Element === "✅"
      ? "guessedGame"
      : try2Element === "❌"
      ? "failed"
      : null;
  const try3 =
    try3Element === "⭐️"
      ? "guessedAll"
      : try3Element === "✅"
      ? "guessedGame"
      : try3Element === "❌"
      ? "failed"
      : null;

  LocalStorageManager.saveGameState(gameId, try1, try2, try3);
}
