import LocalStorageManager from "../js/managers/LocalStorageManager.js";

document
  .getElementById("button-delete-data")
  .addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all game data?")) {
      LocalStorageManager.clearAllGameStates();
      alert("All game data has been deleted.");
    }
  });
