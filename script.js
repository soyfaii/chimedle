// Set the href for the dynamic buttons
fetch("resources/games.json")
  .then((response) => response.json())
  .then((data) => {
    // Latest game button
    const latestGame = data[data.length - 1];
    const latestGameLink = document.getElementById("button-latest");
    latestGameLink.href = `game?id=${latestGame.id}`;
    // Random game button
    const randomGameLink = document.getElementById("button-random");
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomGame = data[randomIndex];
    randomGameLink.href = `game?id=${randomGame.id}`;
  })
  .catch((error) => console.error("Error fetching games:", error));
