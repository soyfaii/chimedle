import LocalStorageManager from "../js/managers/LocalStorageManager.js";

document
  .getElementById("button-delete-data")
  .addEventListener("click", function () {
    if (confirm("are you sure you want to delete all game data?")) {
      LocalStorageManager.clearAllGameStates();
      alert("all game data has been deleted.");
    }
  });
