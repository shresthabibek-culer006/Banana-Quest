// Game logic and event handlers (event-driven programming)
let currentSolution = null;
let score = 0;

const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const answerInput = document.getElementById("answerInput");
const puzzleImg = document.getElementById("puzzleImg");
const controls = document.getElementById("controls");
const message = document.getElementById("message");
const scoreEl = document.getElementById("score");

async function loadPuzzle() {
  message.textContent = "Loading...";
  try {
    const puzzle = await fetchPuzzle();
    console.log(puzzle);
    puzzleImg.src = puzzle.question;       // image link from the API
    currentSolution = Number(puzzle.solution);
    puzzleImg.style.display = "block";
    controls.style.display = "block";
    answerInput.value = "";
    message.textContent = "What number replaces the missing digit?";
  } catch (error) {
    console.error(error);
    message.textContent = "Error: " + error.message;
  }
}

// Event: player clicks Start / Next
startBtn.addEventListener("click", loadPuzzle);

// Event: player submits an answer
submitBtn.addEventListener("click", () => {
  if (Number(answerInput.value) === currentSolution) {
    score++;
    scoreEl.textContent = score;
    message.textContent = "Correct! 🍌";
    setTimeout(loadPuzzle, 1000);
  } else {
    message.textContent = "Wrong, try again.";
  }
});

// Event: pressing Enter also submits
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitBtn.click();
});