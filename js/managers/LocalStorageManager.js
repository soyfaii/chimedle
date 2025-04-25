export default class LocalStorageManager {
  static saveGameState(gameId, try1, try2, try3) {
    const gameStateKey = `gameState_${gameId}`;
    const data = {
      try1: try1,
      try2: try2,
      try3: try3,
    };
    localStorage.setItem(gameStateKey, JSON.stringify(data));
    console.log(`Game state for game ID ${gameId} saved.`);
  }

  static loadGameState(gameId) {
    const gameStateKey = `gameState_${gameId}`;
    const data = localStorage.getItem(gameStateKey);
    if (data) {
      const parsedData = JSON.parse(data);
      console.log(`Game state for game ID ${gameId} loaded.`);
      return parsedData;
    } else {
      console.log(`No saved game state found for game ID ${gameId}.`);
      return null;
    }
  }

  static clearGameState(gameId) {
    const gameStateKey = `gameState_${gameId}`;
    localStorage.removeItem(gameStateKey);
    console.log(`Game state for game ID ${gameId} cleared.`);
  }

  static clearAllGameStates() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("gameState_")) {
        localStorage.removeItem(key);
      }
    });
    console.log("All game states cleared.");
  }
}
