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
  // Destroy server-side session record
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Could not log out. Please try again." });
    }
    // Clear client-side cookie
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
// INTEROPERABILITY: BANANA API PROXY
// ==========================================

// INTEROP: Proxies external Banana API requests to prevent browser CORS restrictions
app.get("/api/puzzle", requireLogin, async (req, res) => {
  try {
    const response = await fetch("http://marcconrad.com/uob/banana/api.php");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Banana API error:", error);
    res.status(502).json({ error: "Could not reach the Banana API." });
  }
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`Banana Quest running at http://localhost:${PORT}`);
});

module.exports = { app, server };
