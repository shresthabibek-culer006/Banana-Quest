// Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1.

/**
 * Banana Quest — Core Game Engine
 * Themes: Event-Driven Programming, Virtual Identity, Interoperability
 */

// Game Configuration and State
const CONFIG = {
  timeLimits: { easy: 45, medium: 30, hard: 15 },
  basePoints: { easy: 10, medium: 20, hard: 30 },
  streakBonus: 5
};

let gameState = {
  score: 0,
  streak: 0,
  lives: 3,
  correctAnswers: 0,
  difficulty: "medium",
  remainingTime: 30,
  totalTime: 30,
  timerInterval: null,
  isSubmitting: false,
  isPlaying: false
};

// DOM Element References
let setupScreen, gameScreen, gameOverScreen;
let startGameBtn, answerForm, answerInput, submitAnswerBtn, endGameBtn, playAgainBtn;
let scoreVal, streakVal, timerVal, timerBar, livesContainer;
let puzzleSpinner, puzzleImg, statusMsg;
let finalScoreVal, finalSolvedVal, finalDiffVal, gameOverReason;

// EVENT: Initialize DOM references and event listeners once document is ready
document.addEventListener("DOMContentLoaded", () => {
  setupScreen = document.getElementById("setupScreen");
  gameScreen = document.getElementById("gameScreen");
  gameOverScreen = document.getElementById("gameOverScreen");

  startGameBtn = document.getElementById("startGameBtn");
  answerForm = document.getElementById("answerForm");
  answerInput = document.getElementById("answerInput");
  submitAnswerBtn = document.getElementById("submitAnswerBtn");
  endGameBtn = document.getElementById("endGameBtn");
  playAgainBtn = document.getElementById("playAgainBtn");

  scoreVal = document.getElementById("scoreVal");
  streakVal = document.getElementById("streakVal");
  timerVal = document.getElementById("timerVal");
  timerBar = document.getElementById("timerBar");
  livesContainer = document.getElementById("livesContainer");

  puzzleSpinner = document.getElementById("puzzleSpinner");
  puzzleImg = document.getElementById("puzzleImg");
  statusMsg = document.getElementById("statusMsg");

  finalScoreVal = document.getElementById("finalScoreVal");
  finalSolvedVal = document.getElementById("finalSolvedVal");
  finalDiffVal = document.getElementById("finalDiffVal");
  gameOverReason = document.getElementById("gameOverReason");

  // EVENT: Select difficulty level by clicking difficulty cards
  const diffCards = document.querySelectorAll(".diff-card");

  function updateDifficultyUI(diff) {
    diffCards.forEach((card) => {
      const cardDiff = card.getAttribute("data-diff");
      const btn = card.querySelector(".diff-select-btn");
      if (cardDiff === diff) {
        card.classList.add("selected");
        if (btn) {
          btn.classList.add("active");
          btn.textContent = "✓ Selected";
        }
      } else {
        card.classList.remove("selected");
        if (btn) {
          btn.classList.remove("active");
          const title = card.querySelector(".diff-title");
          btn.textContent = `Select ${title ? title.textContent.trim() : cardDiff}`;
        }
      }
    });

    if (startGameBtn) {
      if (diff === "easy") {
        startGameBtn.innerHTML = "START APPRENTICE QUEST 🌴";
        startGameBtn.style.background = "linear-gradient(135deg, #00E676, #00B0FF)";
      } else if (diff === "hard") {
        startGameBtn.innerHTML = "ENTER SILVERBACK INFERNO 🔥";
        startGameBtn.style.background = "linear-gradient(135deg, #FF1744, #FF9100)";
      } else {
        startGameBtn.innerHTML = "START QUEST 🍌";
        startGameBtn.style.background = "linear-gradient(135deg, #FFD600, #FF9100)";
      }
    }
  }

  diffCards.forEach((card) => {
    card.addEventListener("click", () => {
      const diff = card.getAttribute("data-diff") || "medium";
      gameState.difficulty = diff;
      updateDifficultyUI(diff);
    });
  });

  // Initialize medium selection on page load
  updateDifficultyUI("medium");

  // EVENT: Start game button click initiates active game round
  if (startGameBtn) {
    startGameBtn.addEventListener("click", startNewGame);
  }

  // EVENT: Handle form submission for answering puzzle
  if (answerForm) {
    answerForm.addEventListener("submit", handleAnswerSubmit);
  }

  // EVENT: Surrender / End game button click
  if (endGameBtn) {
    endGameBtn.addEventListener("click", () => {
      endGame("You decided to cash in and end the round.");
    });
  }

  // EVENT: Play again button restarts game setup
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
      gameOverScreen.style.display = "none";
      setupScreen.style.display = "block";
    });
  }
});

/**
 * Initializes a new game session
 */
function startNewGame() {
  gameState.score = 0;
  gameState.streak = 0;
  gameState.lives = 3;
  gameState.correctAnswers = 0;
  gameState.isSubmitting = false;
  gameState.isPlaying = true;
  gameState.totalTime = CONFIG.timeLimits[gameState.difficulty] || 30;

  updateHUD();

  setupScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  gameScreen.style.display = "block";

  loadPuzzle();
}

/**
 * Updates the game HUD (Score, Streak, Lives)
 */
function updateHUD() {
  scoreVal.textContent = gameState.score;
  streakVal.textContent = `${gameState.streak}x`;

  // Render lives bananas
  const lifeItems = livesContainer.querySelectorAll(".life-item");
  lifeItems.forEach((item, index) => {
    if (index < gameState.lives) {
      item.classList.remove("lost");
    } else {
      item.classList.add("lost");
    }
  });
}

/**
 * INTEROP: Fetches a puzzle from Express server proxy (Banana API)
 */
async function loadPuzzle() {
  clearInterval(gameState.timerInterval);
  gameState.isSubmitting = false;

  // Show loading spinner while proxy fetches external Banana API image
  puzzleImg.style.display = "none";
  puzzleSpinner.style.display = "flex";
  answerInput.value = "";
  answerInput.disabled = true;
  submitAnswerBtn.disabled = true;

  statusMsg.className = "game-status-msg info";
  statusMsg.textContent = "Loading puzzle from Banana API...";

  try {
    const data = await fetchPuzzle(gameState.difficulty);

    // INTEROP: Display puzzle image from Banana API response
    puzzleImg.src = data.question;
    puzzleImg.onload = () => {
      puzzleSpinner.style.display = "none";
      puzzleImg.style.display = "block";
      answerInput.disabled = false;
      submitAnswerBtn.disabled = false;
      answerInput.focus();

      statusMsg.className = "game-status-msg info";
      statusMsg.textContent = "What number replaces the missing digit?";

      startTimer();
    };
  } catch (error) {
    console.error("Failed to load puzzle:", error);
    statusMsg.className = "game-status-msg error";
    statusMsg.textContent = "Could not contact Banana API. Retrying in 2s...";
    setTimeout(loadPuzzle, 2000);
  }
}

/**
 * Starts the countdown timer
 */
function startTimer() {
  clearInterval(gameState.timerInterval);
  gameState.remainingTime = gameState.totalTime;
  updateTimerUI();

  // EVENT: Timer tick event fired every 100 milliseconds
  const intervalMs = 100;
  gameState.timerInterval = setInterval(() => {
    if (!gameState.isPlaying) {
      clearInterval(gameState.timerInterval);
      return;
    }

    gameState.remainingTime -= intervalMs / 1000;

    if (gameState.remainingTime <= 0) {
      clearInterval(gameState.timerInterval);
      gameState.remainingTime = 0;
      updateTimerUI();
      handleTimeout();
    } else {
      updateTimerUI();
    }
  }, intervalMs);
}

/**
 * Updates the visual timer bar and text
 */
function updateTimerUI() {
  const percentage = Math.max(0, (gameState.remainingTime / gameState.totalTime) * 100);
  timerBar.style.width = `${percentage}%`;
  timerVal.textContent = `${Math.ceil(gameState.remainingTime)}s`;

  if (percentage <= 25) {
    timerBar.className = "timer-bar danger";
  } else if (percentage <= 50) {
    timerBar.className = "timer-bar warning";
  } else {
    timerBar.className = "timer-bar";
  }
}

/**
 * EVENT: Handles user answer submission
 */
async function handleAnswerSubmit(e) {
  if (e) e.preventDefault();

  if (gameState.isSubmitting || !gameState.isPlaying) return;

  const rawAnswer = answerInput.value.trim();
  if (rawAnswer === "") {
    statusMsg.className = "game-status-msg error";
    statusMsg.textContent = "Please enter a numeric answer.";
    return;
  }

  clearInterval(gameState.timerInterval);
  gameState.isSubmitting = true;
  answerInput.disabled = true;
  submitAnswerBtn.disabled = true;

  try {
    // AUTH / INTEROP: Submit answer to server-side validator
    const result = await submitAnswer(rawAnswer);
    processAnswerResult(result);
  } catch (error) {
    console.error("Verification error:", error);
    statusMsg.className = "game-status-msg error";
    statusMsg.textContent = "Error checking answer. Please retry.";
    gameState.isSubmitting = false;
    answerInput.disabled = false;
    submitAnswerBtn.disabled = false;
  }
}

/**
 * Handles expiration of the round timer
 */
async function handleTimeout() {
  if (gameState.isSubmitting || !gameState.isPlaying) return;
  gameState.isSubmitting = true;
  answerInput.disabled = true;
  submitAnswerBtn.disabled = true;

  try {
    // Submit -999 as sentinel value for expired timer
    const result = await submitAnswer(-999);
    processAnswerResult(result);
  } catch (err) {
    console.error("Timeout reporting error:", err);
    processAnswerResult({ correct: false, timeout: true, solution: "?" });
  }
}

/**
 * Evaluates the response from server answer validator
 */
function processAnswerResult(result) {
  if (result.correct) {
    // Correct Answer Logic
    gameState.streak++;
    gameState.correctAnswers++;

    const base = CONFIG.basePoints[gameState.difficulty] || 20;
    const bonus = (gameState.streak - 1) * CONFIG.streakBonus;
    const gainedPoints = base + bonus;
    gameState.score += gainedPoints;

    updateHUD();

    statusMsg.className = "game-status-msg success pop-anim";
    statusMsg.textContent = `Correct! 🍌 +${gainedPoints} pts${gameState.streak > 1 ? ` (${gameState.streak}x Streak!)` : ''}`;

    setTimeout(loadPuzzle, 1000);
  } else {
    // Incorrect Answer or Timeout Logic
    gameState.streak = 0;
    gameState.lives--;

    updateHUD();

    // Trigger visual shake feedback
    gameScreen.classList.add("shake-anim");
    setTimeout(() => gameScreen.classList.remove("shake-anim"), 450);

    statusMsg.className = "game-status-msg error";
    if (result.timeout) {
      statusMsg.textContent = `Time's up! ⏰ Solution was ${result.solution}. -1 Life`;
    } else {
      statusMsg.textContent = `Wrong! ❌ Solution was ${result.solution}. -1 Life`;
    }

    if (gameState.lives <= 0) {
      setTimeout(() => {
        endGame("All 3 lives were lost!");
      }, 1200);
    } else {
      setTimeout(loadPuzzle, 1500);
    }
  }
}

/**
 * Concludes game session, displays final scores, and prepares score persistence
 */
async function endGame(reason = "Game Over") {
  gameState.isPlaying = false;
  clearInterval(gameState.timerInterval);

  finalScoreVal.textContent = gameState.score;
  finalSolvedVal.textContent = gameState.correctAnswers;
  finalDiffVal.textContent = gameState.difficulty;
  gameOverReason.textContent = reason;

  gameScreen.style.display = "none";
  gameOverScreen.style.display = "block";
  gameOverScreen.classList.add("pop-anim");

  // Persist score to server via POST /api/scores
  saveScoreToServer(gameState.score, gameState.difficulty, gameState.correctAnswers);
}

/**
 * AUTH & EVENT: Automatically saves the final score to SQLite database
 */
async function saveScoreToServer(score, difficulty, correctAnswers) {
  try {
    let saveNotice = document.getElementById("scoreSaveNotice");
    if (!saveNotice) {
      saveNotice = document.createElement("p");
      saveNotice.id = "scoreSaveNotice";
      saveNotice.style.fontSize = "0.92rem";
      saveNotice.style.margin = "0.8rem 0";
      gameOverReason.after(saveNotice);
    }
    saveNotice.style.color = "var(--banana-yellow)";
    saveNotice.textContent = "Saving score to leaderboard...";

    const response = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: score,
        difficulty: difficulty,
        correct_answers: correctAnswers
      })
    });

    if (response.ok) {
      saveNotice.style.color = "var(--success-green)";
      saveNotice.textContent = "Score saved to leaderboard! 🏆";
    } else {
      saveNotice.style.color = "var(--error-red)";
      saveNotice.textContent = "Could not record score to leaderboard.";
    }
  } catch (err) {
    console.error("Failed to save score:", err);
  }
}
