const gamesList = document.querySelector("ol");

fetch("../resources/games.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((game) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `../game?id=${game.id}`;
      link.textContent = `game #${game.id}`;
      link.style.color = "inherit";
      listItem.appendChild(link);
      gamesList.appendChild(listItem);
    });
  })
  .catch((error) => console.error("error fetching games:", error));
