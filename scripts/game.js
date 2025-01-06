document.addEventListener("DOMContentLoaded", function () {
    let editedPlayer = 0;
    let activePlayer = 0;
    let currentRound = 1;
    let gameIsOver = false;
  
    const players = [
      { name: "Player 1", symbol: "X" },
      { name: "Player 2", symbol: "O" },
    ];
  
    const playerconfigoverlay = document.getElementById("config-overlay");
    const backdrop = document.getElementById("backdrop");
    const editeplayer1 = document.getElementById("edit-player-1-btn");
    const editeplayer2 = document.getElementById("edit-player-2-btn");
    const closeplayerconfig = document.getElementById("cancel-config");
    const form = document.querySelector("#config-overlay form");
    const configerrors = document.getElementById("config-errors");
    const startnewgameelement = document.getElementById("start-game-btn");
    const gameareaelement = document.getElementById("active-game");
    const gamefeildelements = document.querySelectorAll("#game-board li");
    const winnerOutputElement = document.querySelector("#game-over span");
    const activePlayerNameElement = document.getElementById("active-player-name");
  
    let gameBoard = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  
    function openplayerconfig(event) {
      const clickedButton = event.target.closest("button");
      if (!clickedButton) {
        console.error("Button not found!");
        return;
      }
      editedPlayer = +clickedButton.dataset.playerId;
  
      playerconfigoverlay.style.display = "block";
      backdrop.style.display = "block";
    }
  
    editeplayer1.addEventListener("click", openplayerconfig);
    editeplayer2.addEventListener("click", openplayerconfig);
  
    function cancelplayerconfig() {
      playerconfigoverlay.style.display = "none";
      backdrop.style.display = "none";
      form.firstElementChild.classList.remove("error");
      configerrors.textContent = "";
    }
  
    closeplayerconfig.addEventListener("click", cancelplayerconfig);
    backdrop.addEventListener("click", cancelplayerconfig);
  
    function savePlayerconfig(event) {
      event.preventDefault();
      const formdata = new FormData(form);
      const enteredPlayerName = formdata.get("playername").trim();
  
      if (!enteredPlayerName) {
        form.firstElementChild.classList.add("error");
        configerrors.textContent = "Please enter a valid player name";
        return;
      }
  
      const updatedPlayerDataElement = document.getElementById(
        `player-${editedPlayer}-data`
      );
  
      if (updatedPlayerDataElement) {
        const playerNameElement = updatedPlayerDataElement.querySelector("h3");
        playerNameElement.textContent = enteredPlayerName;
        players[editedPlayer - 1].name = enteredPlayerName;
      }
  
      cancelplayerconfig();
    }
  
    form.addEventListener("submit", savePlayerconfig);
  
    function startnewgame() {
      activePlayer = 0;
      currentRound = 1;
      gameIsOver = false;
      gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
      gameareaelement.style.display = "block";
      activePlayerNameElement.textContent = players[activePlayer].name;
  
      for (const gamefeildelement of gamefeildelements) {
        gamefeildelement.textContent = "";
        gamefeildelement.classList.remove("disabled");
      }
  
      document.getElementById("game-over").style.display = "none";
    }
  
    startnewgameelement.addEventListener("click", startnewgame);
  
    function switchPlayer() {
      activePlayer = activePlayer === 0 ? 1 : 0;
      activePlayerNameElement.textContent = players[activePlayer].name;
    }
  
    function checkForGameOver() {
      for (let i = 0; i < 3; i++) {
        // Check rows
        if (
          gameBoard[i][0] &&
          gameBoard[i][0] === gameBoard[i][1] &&
          gameBoard[i][1] === gameBoard[i][2]
        ) {
          return gameBoard[i][0];
        }
  
        // Check columns
        if (
          gameBoard[0][i] &&
          gameBoard[0][i] === gameBoard[1][i] &&
          gameBoard[1][i] === gameBoard[2][i]
        ) {
          return gameBoard[0][i];
        }
      }
  
      // Check diagonals
      if (
        gameBoard[0][0] &&
        gameBoard[0][0] === gameBoard[1][1] &&
        gameBoard[1][1] === gameBoard[2][2]
      ) {
        return gameBoard[0][0];
      }
  
      if (
        gameBoard[0][2] &&
        gameBoard[0][2] === gameBoard[1][1] &&
        gameBoard[1][1] === gameBoard[2][0]
      ) {
        return gameBoard[0][2];
      }
  
      if (currentRound === 9) {
        return "draw";
      }
  
      return null;
    }
  
    function endGame(winner) {
      gameIsOver = true;
      document.getElementById("game-over").style.display = "block";
  
      if (winner === "draw") {
        winnerOutputElement.textContent = "It's a draw!";
      } else {
        winnerOutputElement.textContent = players[activePlayer].name;
      }
    }
  
    function selectGameField(event) {
      const selectedField = event.target;
      const selectedRow = selectedField.dataset.row - 1;
      const selectedColumn = selectedField.dataset.col - 1;
  
      if (gameBoard[selectedRow][selectedColumn] !== "" || gameIsOver) {
        return;
      }
  
      selectedField.textContent = players[activePlayer].symbol;
      selectedField.classList.add("disabled");
      gameBoard[selectedRow][selectedColumn] = players[activePlayer].symbol;
  
      const winner = checkForGameOver();
      if (winner) {
        endGame(winner);
        return;
      }
  
      currentRound++;
      switchPlayer();
    }
  
    gamefeildelements.forEach((field, index) => {
      field.dataset.row = Math.floor(index / 3) + 1;
      field.dataset.col = (index % 3) + 1;
      field.addEventListener("click", selectGameField);
    });
  });
  