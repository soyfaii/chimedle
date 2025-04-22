const gameId = new URLSearchParams(window.location.search).get("id");

var game = null;

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
    if (guess.toLowerCase().includes(possibleAnswer.toLowerCase())) {
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
