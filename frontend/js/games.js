const startGameButton = document.getElementById("startGameButton");
const resetGameButton = document.getElementById("resetGameButton");
const lowerBound = document.getElementById("lowerBound");
const upperBound = document.getElementById("upperBound");
const guessSection = document.getElementById("guessSection");
const guessPrompt = document.getElementById("guessPrompt");
const boundaryInfo = document.getElementById("boundaryInfo");
const feedbackMessage = document.getElementById("feedbackMessage");
const tooLowButton = document.getElementById("tooLowButton");
const correctButton = document.getElementById("correctButton");
const tooHighButton = document.getElementById("tooHighButton");

let currentLow = null;
let currentHigh = null;
let currentGuess = null;
let gameActive = false;

startGameButton.addEventListener("click", startGame);
resetGameButton.addEventListener("click", resetGame);
tooLowButton.addEventListener("click", () => submitResponse("too low"));
correctButton.addEventListener("click", () => submitResponse("correct"));
tooHighButton.addEventListener("click", () => submitResponse("too high"));

function setGameSection(visible) {
    guessSection.style.display = visible ? "block" : "none";
}

function setMessage(message, isError = false) {
    feedbackMessage.textContent = message;
    feedbackMessage.style.color = isError ? "red" : "black";
}

function resetGame() {
    currentLow = null;
    currentHigh = null;
    currentGuess = null;
    gameActive = false;
    setGameSection(false);
    setMessage("");
    lowerBound.value = "";
    upperBound.value = "";
}

async function startGame() {
    const low = Number(lowerBound.value);
    const high = Number(upperBound.value);

    if (Number.isNaN(low) || Number.isNaN(high)) {
        setMessage("Please enter valid numbers for both bounds.", true);
        return;
    }

    if (low > high) {
        setMessage("Lower bound must be less than or equal to upper bound.", true);
        return;
    }

    const response = await fetch("http://localhost:8080/api/game/start", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ low, high })
    });

    const data = await response.json();
    if (data.error) {
        setMessage(data.message || "Unable to start the game.", true);
        return;
    }

    currentLow = data.low;
    currentHigh = data.high;
    currentGuess = data.guess;
    gameActive = true;
    setGameSection(true);
    updateGameDisplay(data.message);
}

async function submitResponse(feedback) {
    if (!gameActive) {
        setMessage("Start the game first.", true);
        return;
    }

    const response = await fetch("http://localhost:8080/api/game/respond", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            low: currentLow,
            high: currentHigh,
            guess: currentGuess,
            feedback
        })
    });

    const data = await response.json();
    if (data.error) {
        setMessage(data.message || "Invalid response.", true);
        return;
    }

    currentLow = data.low;
    currentHigh = data.high;
    currentGuess = data.guess;
    gameActive = !data.finished;
    updateGameDisplay(data.message, data.finished);
}

function updateGameDisplay(message, finished = false) {
    const boundaryText = finished
        ? `Final range: ${currentLow} to ${currentHigh}`
        : `Current range: ${currentLow} to ${currentHigh}`;

    guessPrompt.textContent = message;
    boundaryInfo.textContent = boundaryText;
    setMessage("");

    tooLowButton.disabled = finished;
    correctButton.disabled = finished;
    tooHighButton.disabled = finished;
}