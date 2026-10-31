// Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1.

/**
 * Banana Quest Server
 * Architecture: Distributed System (Express Server + SQLite DB + Banana API + Client)
 * Themes covered: Interoperability (HTTP API proxy), Virtual Identity (Sessions & Bcrypt), Event-driven
 */

// Third-party dependencies (documented in docs/REFERENCES.md)
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const db = require("./db");
const { requireLogin, requirePageLogin } = require("./middleware/auth");

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AUTH: Session configuration for Virtual Identity management
// Uses HTTP-only cookies to prevent client-side script access (mitigating XSS session theft)
app.use(
  session({
    name: "banana.sid",
    secret: "banana-quest-enterprise-secret-key-assignment-1",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Secure: browser JavaScript cannot read this cookie
      sameSite: "lax", // Protects against Cross-Site Request Forgery (CSRF)
      maxAge: 1000 * 60 * 60 * 24 // 24-hour session lifetime
    }
  })
);

// Protected HTML Page Routes (AUTH: must be declared BEFORE express.static to enforce auth)
app.get("/game.html", requirePageLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "game.html"));
});

app.get("/leaderboard.html", requirePageLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "leaderboard.html"));
});

app.get("/profile.html", requirePageLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "profile.html"));
});

// Serve static assets (HTML, CSS, client JS)
app.use(express.static(__dirname));

// ==========================================
// VIRTUAL IDENTITY & AUTHENTICATION ENDPOINTS
// ==========================================

// AUTH: Register a new user with username and password
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation: sanitize and verify minimum lengths
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      return res.status(400).json({ error: "Username must be between 3 and 20 characters." });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return res.status(400).json({ error: "Username can only contain letters, numbers, and underscores." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // AUTH: Check if username already exists in SQLite using a parameterised query
    const existingUser = db.prepare("SELECT id FROM users WHERE username = ?").get(trimmedUsername);
    if (existingUser) {
      return res.status(409).json({ error: "Username is already taken." });
    }

    // AUTH: Hash password with bcrypt before storage (salt rounds = 10)
    // Never store plain text passwords in the database
    const passwordHash = await bcrypt.hash(password, 10);

    // AUTH: Parameterised insert prevents SQL injection
    const stmt = db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
    const result = stmt.run(trimmedUsername, passwordHash);

    // AUTH: Establish session upon successful registration (automatic login)
    req.session.user = {
      id: Number(result.lastInsertRowid),
      username: trimmedUsername
    };

    return res.status(201).json({
      message: "Registration successful.",
      user: req.session.user
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error during registration." });
  }
});

// AUTH: Log in an existing user and create a session
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const trimmedUsername = username.trim();

    // AUTH: Parameterised SQL query prevents SQL injection attacks
    const user = db.prepare("SELECT id, username, password_hash FROM users WHERE username = ?").get(trimmedUsername);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // AUTH: Compare supplied password against hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // AUTH: Store virtual identity securely in server-side session
    req.session.user = {
      id: user.id,
      username: user.username
    };

    return res.json({
      message: "Login successful.",
      user: req.session.user
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error during login." });
  }
});

// AUTH: Destroy session and clear cookie on logout
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Could not log out. Please try again." });
    }
    res.clearCookie("banana.sid");
    return res.json({ message: "Logged out successfully." });
  });
});

// AUTH: Retrieve current session status and authenticated user identity
app.get("/api/me", (req, res) => {
  if (req.session && req.session.user) {
    return res.json({
      loggedIn: true,
      user: req.session.user
    });
  }
  return res.json({
    loggedIn: false,
    user: null
  });
});

// ==========================================
// INTEROPERABILITY & CORE GAME LOGIC
// ==========================================

// INTEROP & AUTH: Fetch puzzle from Banana API, store solution in session, send ONLY question URL to browser
app.get("/api/puzzle", requireLogin, async (req, res) => {
  try {
    const difficulty = ["easy", "medium", "hard"].includes(req.query.difficulty)
      ? req.query.difficulty
      : "medium";

    // INTEROP: Express server acts as proxy to Banana API, bypassing browser CORS restrictions
    const response = await fetch("http://marcconrad.com/uob/banana/api.php");
    if (!response.ok) {
      throw new Error(`Banana API responded with status ${response.status}`);
    }
    const data = await response.json();

    // AUTH / SECURITY: The solution and issued timestamp are stored exclusively in the server-side session.
    // The browser client NEVER receives data.solution, ensuring the answer cannot be inspected in DevTools.
    req.session.currentPuzzle = {
      solution: Number(data.solution),
      issuedAt: Date.now(),
      difficulty: difficulty
    };

    return res.json({
      question: data.question,
      difficulty: difficulty
    });
  } catch (error) {
    console.error("Banana API proxy error:", error);
    return res.status(502).json({ error: "Could not reach the Banana API." });
  }
});

// AUTH & EVENT: Verify user's submitted answer against session-stored solution and check elapsed time
app.post("/api/answer", requireLogin, (req, res) => {
  try {
    const activePuzzle = req.session.currentPuzzle;
    if (!activePuzzle) {
      return res.status(400).json({ error: "No active puzzle found. Please request a new puzzle." });
    }

    const { answer } = req.body;
    const userAnswer = Number(answer);
    const solution = activePuzzle.solution;
    const difficulty = activePuzzle.difficulty || "medium";

    // Check elapsed time using timestamp recorded when puzzle was issued
    const timeLimits = { easy: 45, medium: 30, hard: 15 };
    const allowedSeconds = (timeLimits[difficulty] || 30) + 2; // +2s grace margin for network roundtrip
    const elapsedSeconds = (Date.now() - activePuzzle.issuedAt) / 1000;
    const isTimeout = elapsedSeconds > allowedSeconds;

    // Invalidate the session puzzle immediately so the solution cannot be re-used
    req.session.currentPuzzle = null;

    const isCorrect = !isTimeout && userAnswer === solution;

    return res.json({
      correct: isCorrect,
      timeout: isTimeout,
      solution: solution,
      elapsedSeconds: Math.round(elapsedSeconds * 10) / 10
    });
  } catch (error) {
    console.error("Answer verification error:", error);
    return res.status(500).json({ error: "Internal error checking answer." });
  }
});

// ==========================================
// SCORE PERSISTENCE & LEADERBOARD ENDPOINTS
// ==========================================

// AUTH & DATA: Persist completed game score linked to authenticated user
app.post("/api/scores", requireLogin, (req, res) => {
  try {
    const userId = req.session.user.id;
    const { score, difficulty, correct_answers } = req.body;

    const parsedScore = Math.max(0, parseInt(score, 10) || 0);
    const parsedCorrect = Math.max(0, parseInt(correct_answers, 10) || 0);
    const validDifficulty = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium";

    // AUTH: Parameterised SQL query prevents SQL injection attacks
    const stmt = db.prepare(`
      INSERT INTO scores (user_id, score, difficulty, correct_answers)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(userId, parsedScore, validDifficulty, parsedCorrect);

    return res.status(201).json({
      message: "Score saved successfully.",
      scoreId: Number(result.lastInsertRowid)
    });
  } catch (error) {
    console.error("Score save error:", error);
    return res.status(500).json({ error: "Could not save game score." });
  }
});

// AUTH & DATA: Retrieve top 10 players ranked by their best score
app.get("/api/leaderboard", requireLogin, (req, res) => {
  try {
    // Top 10 distinct players by their single highest score
    const stmt = db.prepare(`
      SELECT 
        u.username,
        MAX(s.score) AS high_score,
        s.difficulty,
        s.correct_answers,
        s.created_at
      FROM scores s
      JOIN users u ON s.user_id = u.id
      GROUP BY u.id
      ORDER BY high_score DESC, s.created_at ASC
      LIMIT 10
    `);
    const leaderboard = stmt.all();

    return res.json({
      leaderboard: leaderboard.map((row, index) => ({
        rank: index + 1,
        username: row.username,
        score: row.high_score,
        difficulty: row.difficulty,
        correct_answers: row.correct_answers,
        date: row.created_at
      }))
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return res.status(500).json({ error: "Could not load leaderboard data." });
  }
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`Banana Quest running at http://localhost:${PORT}`);
});

module.exports = { app, server };
