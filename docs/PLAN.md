# Banana Quest — Development Plan

> **Course:** CIS046-3 Software For Enterprise (Assignment 1)  
> **Student Pairing:** Antigravity (AI) + Student Developer  

---

## Task 1: Database Setup & Dependencies
- **Branch:** `feature/database-setup`
- **Files Touched:** `package.json`, `.gitignore`, `db.js`, `docs/REFERENCES.md`
- **Expected Outcome:** Dependencies (`better-sqlite3`, `bcryptjs`, `express-session`) installed; SQLite database (`data/banana.db`) initialized with `users` and `scores` tables; `.gitignore` properly excluding `node_modules` and `data/*.db`; initial references file created.

---

## Task 2: Authentication & Virtual Identity
- **Branch:** `feature/authentication`
- **Files Touched:** `server.js`, `routes/auth.js` (or inline auth endpoints in `server.js`), `middleware/auth.js`
- **Expected Outcome:** `express-session` configured with httpOnly cookie; endpoints for `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/me`; password hashing with `bcryptjs`; `requireLogin` middleware guarding protected routes; testable with curl or Postman. *(Milestone tag: `v0.2.0`)*

---

## Task 3: UI Foundation & Design System
- **Branch:** `feature/ui-foundation`
- **Files Touched:** `style.css`, `public/nav.js` (or `js/nav.js`), `index.html` (landing page), `login.html`, `register.html`
- **Expected Outcome:** Modern banana-themed dark UI (#14141A, #FFD93D accent) with Fredoka/Inter fonts, CSS variables, reusable cards and buttons; responsive sticky navigation bar; floating banana CSS animation; fully functional and linked Register and Login forms showing live error/success feedback.

---

## Task 4: Core Game Engine & Server-Side Validation
- **Branch:** `feature/game-core`
- **Files Touched:** `server.js`, `js/api.js`, `js/game.js`, `game.html`
- **Expected Outcome:** Protected game route; server fetches Banana API, stores solution and timestamp in session, and sends only the image URL to the browser; `POST /api/answer` validates submission on the server against session solution; 3 lives system; difficulty selection (Easy: 45s, Medium: 30s, Hard: 15s); timer countdown bar; streak bonus tracking; pop/shake visual feedback.

---

## Task 5: Score Persistence & Leaderboard
- **Branch:** `feature/save-scores-leaderboard`
- **Files Touched:** `server.js`, `js/leaderboard.js`, `leaderboard.html`
- **Expected Outcome:** `POST /api/scores` persists completed game results (score, difficulty, correct answers, timestamp) linked to authenticated user; `GET /api/leaderboard` returns top 10 scores; styled Leaderboard page displaying ranks, usernames, scores, and dates. *(Milestone tag: `v0.3.0`)*

---

## Task 6: Player Profile & Statistics
- **Branch:** `feature/profile-page`
- **Files Touched:** `server.js`, `js/profile.js`, `profile.html`
- **Expected Outcome:** `GET /api/profile` aggregates user stats (games played, high score, average score, total correct answers, recent 5 games history); styled Profile page with metric cards and recent game history table.

---

## Task 7: UI Polish, Responsive Design & Accessibility
- **Branch:** `feature/ui-polish`
- **Files Touched:** `style.css`, all HTML templates (`index.html`, `game.html`, `leaderboard.html`, `profile.html`, `login.html`, `register.html`)
- **Expected Outcome:** Polished CSS transitions, pulsing timer states, empty states for new players/leaderboard, mobile responsiveness across screen widths, friendly in-UI error banners, and unified layout.

---

## Task 8: Documentation, Theme Mapping & Release
- **Branch:** `feature/docs-release`
- **Files Touched:** `README.md`, `docs/REFERENCES.md`
- **Expected Outcome:** Complete project documentation including setup instructions, architectural diagram, and detailed mapping of the 4 assignment themes (Version Control, Event-Driven Programming, Interoperability, Virtual Identity) to specific files and line concepts for the 10-minute presentation; final verification and tag `v1.0.0`.
