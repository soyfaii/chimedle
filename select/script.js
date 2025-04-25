import LocalStorageManager from "../js/managers/LocalStorageManager.js";

const gamesList = document.querySelector("ol");

fetch("../resources/games.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((game) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `../game?id=${game.id}`;
      link.textContent = `${game.id}`;
      link.className = "link-button level-button";
      // Make the color background match the game state
      const saveFile = LocalStorageManager.loadGameState(game.id);
      const gameState = (() => {
        if (saveFile) {
          const try1 = saveFile.try1;
          const try2 = saveFile.try2;
          const try3 = saveFile.try3;
          if (
            try1 == "guessedAll" ||
            try2 == "guessedAll" ||
            try3 == "guessedAll"
          ) {
            return "guessedAll";
          } else if (
            try1 == "guessedGame" ||
            try2 == "guessedGame" ||
            try3 == "guessedGame"
          ) {
            return "guessedGame";
          } else if (try3 == "failed") {
            return "failed";
          } else {
            return null;
          }
        } else {
          return null;
        }
      })();
      if (gameState == "guessedAll" || gameState == "guessedGame") {
        link.className += " green-bg";
      } else if (gameState == "failed") {
        link.className += " red-bg";
      } else {
        link.className += "";
      }
      if (gameState == "guessedAll") {
        link.className += " button-star";
      }
      listItem.appendChild(link);
      gamesList.appendChild(listItem);
    });
  })
  .catch((error) => console.error("error fetching games:", error));
