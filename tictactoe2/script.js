const cells = document.querySelectorAll(".cell");
// const statusText = document.querySelector("#statusText");
// const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

let xHistory = [];
let oHistory = [];
let blinkingIndex = null;
let nextBlinkingIndex = null;
let lastPlayer = null;
let xToDim = null;
let oToDim = null;

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    // Listen for click anywhere on the screen to restart the game
    document.addEventListener("click", restartGameOnClick);
    // Listen for click to toggle fullscreen
    document.addEventListener("dblclick", toggleFullscreen);  // Using double-click for fullscreen toggle
    running = true;
}

function cellClicked() {
    const cellIndex = Number(this.getAttribute("cellIndex"));

    if (options[cellIndex] !== "" || !running || blinkingIndex === cellIndex) {
        return;
    }

    // Remove blinking cell before placing a new one
    if (blinkingIndex !== null) {
        options[blinkingIndex] = "";
        const blinkingCell = cells[blinkingIndex].querySelector("p");
        blinkingCell.textContent = "";
        blinkingCell.classList.remove("dimmed");
        blinkingIndex = null;
    }

    updateCell(this, cellIndex);
    trackPlayerHistory(cellIndex);
    checkWinner();
}

function trackPlayerHistory(cellIndex) {
    const history = currentPlayer === "X" ? xHistory : oHistory;

    history.push(cellIndex);

    if (history.length > 2) {
        const oldestIndex = history.shift();
        if (currentPlayer === "X") {
            xToDim = oldestIndex;
        } else {
            oToDim = oldestIndex;
        }
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    const cellText = cell.querySelector("p");
    cellText.textContent = currentPlayer;
}

function changePlayer() {
    // Dim the oldest move of the player who just played
    if (currentPlayer === "X" && oToDim !== null) {
        const oCell = cells[oToDim].querySelector("p");
        oCell.classList.add("dimmed");
        blinkingIndex = oToDim;
        oToDim = null;
    } else if (currentPlayer === "O" && xToDim !== null) {
        const xCell = cells[xToDim].querySelector("p");
        xCell.classList.add("dimmed");
        blinkingIndex = xToDim;
        xToDim = null;
    }

    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    // statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        }
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        // Delay the stopping of the game and the winner announcement by 1 second
        setTimeout(() => {
            // statusText.textContent = `${currentPlayer} wins!`;
            running = false;
        }, 100);  // 100 milliseconds = 1 second
    }

    else if (!options.includes("")) {
        setTimeout(() => {
            // statusText.textContent = `Draw!`;
            running = false;
        }, 100);  // 100 milliseconds = 1 second
    } else {
        changePlayer();
    }
}

function restartGame() {
    // Check if the game is running before restarting
    if (running) return;

    xHistory = [];
    oHistory = [];
    blinkingIndex = null;
    xToDim = null;
    oToDim = null;

    cells.forEach(cell => {
        const cellText = cell.querySelector("p");
        cellText.textContent = "";
        cellText.classList.remove("dimmed");
    });

    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    // statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function restartGameOnClick(event) {
    // Only restart if the game has ended and the click is outside the cells
    const target = event.target;

    // Restart the game when clicking anywhere outside the cells
    if (!running && !target.classList.contains("cell")) {
        restartGame();
    }
}

// Function to toggle fullscreen mode on double-click
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
}
