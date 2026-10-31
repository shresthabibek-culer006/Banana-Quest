<!-- Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1. -->

# Banana Quest 🍌

**University of Bedfordshire**  
**Module:** CIS046-3 Software For Enterprise (Assignment 1 — 60%)  
**Student Pairing:** Antigravity (AI) + Student Developer  
**Repository:** [https://github.com/shresthabibek-culer006/Banana-Quest](https://github.com/shresthabibek-culer006/Banana-Quest)  
**Release Tag:** `v1.0.0`

---

## 1. Executive Summary

**Banana Quest** is a secure, distributed web puzzle challenge application developed as part of CIS046-3 Software For Enterprise. The project showcases an enterprise-grade distributed architecture combining a responsive browser client, an Express.js application server, a local SQLite database, and external REST API interoperability with Dr. Marc Conrad’s Banana API.

The core gameplay requires players to solve mathematical visual puzzles against an active countdown clock. To maintain fairness and enterprise security, puzzle solutions are shielded server-side in user sessions, preventing cheat inspection in browser DevTools. The platform features player authentication, 3-tier difficulty modes, streak multipliers, 3 lives, score persistence, a global leaderboard, and player profile analytics.

---

## 2. Distributed Architecture

The system is organized into a four-tier distributed model:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. BROWSER CLIENT                               │
│  HTML5 + CSS3 (Variables, Keyframes) + Vanilla JavaScript (ES6 Modules)│
│  • Pages: Landing (index), Login, Register, Game, Leaderboard, Profile │
│  • Dynamic Navigation & Event-Driven HUD Handlers                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                       HTTP / JSON (REST Requests)
                    Signed Cookies (banana.sid - httpOnly)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   2. EXPRESS APPLICATION SERVER                        │
│  Node.js (v22) + Express Framework                                     │
│  • Static Asset Delivery & Route Protection (requireLogin / PageLogin) │
│  • Session Management (express-session)                                │
│  • Answer & Elapsed Time Verification Engine                           │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
         Parameterised SQL                  HTTP GET /api.php
         (better-sqlite3)                    (JSON Response)
                   │                                 │
                   ▼                                 ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│        3. SQLITE DATABASE         │ │     4. EXTERNAL BANANA API       │
│  data/banana.db (WAL Mode)        │ │  http://marcconrad.com/uob/      │
│  • users (Bcrypt password hashes) │ │  banana/api.php                  │
│  • scores (History & analytics)   │ │  Returns visual puzzle + solution│
└───────────────────────────────────┘ └──────────────────────────────────┘
```

---

## 3. Technology Stack & Dependencies

All third-party dependencies are documented in [`docs/REFERENCES.md`](docs/REFERENCES.md):

| Component | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js (v22 LTS) | Server-side execution environment |
| **Server Framework** | Express (`^5.3.0`) | HTTP routing, static serving, and API proxy |
| **Database** | `better-sqlite3` | Synchronous, parameterised SQLite database manager |
| **Authentication** | `bcryptjs` | Salted password hashing (10 salt rounds) |
| **Session Store** | `express-session` | Stateful virtual identity and HTTP-only cookie management |
| **External API** | Banana API (Marc Conrad) | Dynamic math visual puzzles |
| **Styling & Fonts** | CSS3 + Google Fonts | Fredoka (headings) & Inter (body) |

---

## 4. Key Application Features

1. **Virtual Identity & Session Security:**
   - Registration and login with username validation (3–20 alphanumeric chars) and password enforcement (min 6 chars).
   - Passwords hashed using `bcryptjs` with salt rounds = 10; plain-text credentials are never saved.
   - Sessions signed via HTTP-only, `sameSite: lax` cookies (`banana.sid`).
   - Server-side route guards (`requireLogin` for APIs, `requirePageLogin` for pages).
2. **Anti-Cheat Banana API Proxy:**
   - The browser never contacts the external Banana API directly, avoiding Cross-Origin Resource Sharing (CORS) blocks.
   - The Express proxy stores `solution` and `issuedAt` timestamp in the server session, sending **only** the puzzle image URL to the client.
   - Answers are checked on `POST /api/answer` against the session solution and elapsed time.
3. **Gameplay Mechanics:**
   - **3 Lives System:** Hearts/bananas deplete upon wrong answers or timer expiry.
   - **3 Difficulty Tiers:** Easy (45s, 10 pts), Medium (30s, 20 pts), Hard (15s, 30 pts).
   - **Streak Multiplier:** Consecutive correct solutions grant `+5` points per streak level.
   - **Live Progress Timer Bar:** Smooth CSS/JS countdown transitioning from yellow to warning orange and danger red.
4. **Persistent Leaderboard:**
   - Completed games automatically persist to SQLite with parameterised queries.
   - Global Top 10 leaderboard displaying ranks (🥇, 🥈, 🥉 medals), usernames, high scores, difficulty badges, and dates.
5. **Player Profile & Career Statistics:**
   - Individual profile page detailing Games Played, Career High Score, Average Score, Total Solved, and the player's last 5 games history.

---

## 5. Setup & Execution Instructions

### Prerequisites
- Node.js (v20 or v22 LTS recommended)
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shresthabibek-culer006/Banana-Quest.git
   cd "Banana Quest"
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```

### Running the Application
3. Start the Express server:
   ```bash
   npm start
   ```
4. Access the web application in any modern browser:
   ```
   http://localhost:3000
   ```

---

## 6. Video Presentation Guide: Mapping Code to the 4 Marking Themes

*This section provides direct file, line, and architectural references for the 10-minute graded video presentation.*

### Theme 1: Version Control (Git, GitHub, Branching, Granularity, Modular Architecture)
- **Git Branching Strategy:**
  - `main`: Production-ready, stable code branch.
  - Granular feature branches created from `main`:
    - `feature/database-setup`: SQLite schema and dependency setup.
    - `feature/authentication`: Virtual identity, session cookie, and bcrypt endpoints.
    - `feature/ui-foundation`: Theme styling, shared navigation, and auth pages.
    - `feature/game-core`: Anti-cheat puzzle proxy, gameplay loop, lives, and timer.
    - `feature/save-scores-leaderboard`: Score persistence and top 10 ranking.
    - `feature/profile-page`: Aggregate player metrics and history.
    - `feature/ui-polish`: Responsive viewports and animations.
    - `feature/docs-release`: Documentation, testing, and final release.
- **Commit Granularity:** Every feature branch comprises small, atomic commits following the **Conventional Commits** standard (`feat:`, `chore:`, `style:`, `docs:`, `merge:`).
- **Milestone Semantic Versioning (Git Tags):**
  - `v0.1.0`: Starter proxy and prototype game.
  - `v0.2.0`: Working virtual identity, sessions, and bcrypt authentication.
  - `v0.3.0`: Functional gameplay loop, score saving, and leaderboard.
  - `v1.0.0`: Complete enterprise release with player profiles, responsive UI, and full documentation.
- **Component Organization:**
  - [`db.js`](db.js): Database initialization and SQLite schema definition.
  - [`server.js`](server.js): Server-side REST controllers, security middleware, and proxies.
  - [`middleware/auth.js`](middleware/auth.js): Isolated access control guards.
  - [`js/api.js`](js/api.js): Client-side HTTP abstraction layer.
  - [`js/game.js`](js/game.js): Event-driven gameplay engine.
  - [`js/leaderboard.js`](js/leaderboard.js) & [`js/profile.js`](js/profile.js): Dedicated presentation controllers.

---

### Theme 2: Event-Driven Programming
- **Event Generation and Dispatch:**
  - **DOM Input Events:** Form submissions (`submit` event on `#loginForm`, `#registerForm`, `#answerForm`) prevent default page reloads (`e.preventDefault()`) and initiate asynchronous workflows.
  - **Keyboard Events:** Pressing the `Enter` key inside the answer input submits the solution.
  - **Click Events:** Selection of difficulty cards (`click` event) updates active classes and changes internal round timers; surrender button (`#endGameBtn`) triggers graceful session termination.
  - **Temporal Timer Events:** JavaScript's `setInterval()` generates timer tick events every 100 milliseconds to calculate remaining time, animate the `#timerBar` width, and dispatch `handleTimeout()` if the clock hits 0.
- **Event Handling Rationale:**
  - Asynchronous event handlers (`async/await`) decouple the single-threaded JavaScript execution context from long-running network operations, ensuring the browser UI never freezes during HTTP requests to the server or Banana API.
  - Code references: Marked throughout with `// EVENT: ...` comments in [`js/game.js`](js/game.js), [`js/auth.js`](js/auth.js), [`js/nav.js`](js/nav.js), [`js/leaderboard.js`](js/leaderboard.js), and [`js/profile.js`](js/profile.js).

---

### Theme 3: Interoperability (Banana API, HTTP/JSON, CORS, and Server Proxy)
- **External System Integration:**
  - Interoperability is achieved using HTTP/REST communication exchanging JSON payloads with Dr. Marc Conrad's Banana API at `http://marcconrad.com/uob/banana/api.php`.
- **The CORS Problem & Browser Same-Origin Policy:**
  - Browsers enforce the **Same-Origin Policy (SOP)**: client-side JavaScript executing on `http://localhost:3000` is blocked from making cross-origin fetch requests to `http://marcconrad.com` unless the remote server explicitly supplies `Access-Control-Allow-Origin` headers. Because the external API does not include open CORS headers for arbitrary browser clients, direct browser requests fail with CORS violations.
- **Server-Side Proxy Solution:**
  - Express acts as a backend proxy in [`server.js`](server.js#L140-L170). Node.js backend environments are server-to-server and are **not** restricted by browser SOP/CORS rules.
- **Enterprise Anti-Cheat Security Architecture:**
  - In a standard game, sending the external API response directly to the client exposes `data.solution` in the browser's Network tab or JavaScript memory, enabling players to trivially inspect answers.
  - **Banana Quest Solution:** The Express server intercepts the API response, stores the numeric solution (`data.solution`) and an issuance timestamp (`issuedAt`) inside the server's session store, and returns **only** `question` (the image URL) to the browser.
  - When the player submits an answer to `POST /api/answer`, the server verifies the answer against the session-stored secret and checks elapsed time.
  - Code references: Marked throughout with `// INTEROP: ...` in [`server.js`](server.js) and [`js/api.js`](js/api.js).

---

### Theme 4: Virtual Identity (Authentication, Passwords, Sessions, and Alternatives)
- **Concept of Virtual Identity:**
  - Across stateless HTTP connections, virtual identity represents a persistent, verified digital persona (account ID, username, and privileges) associated with requests.
- **Password Security with `bcryptjs`:**
  - Passwords are never stored in plain text. When a user registers (`POST /api/auth/register`), the password is salted and hashed using `bcrypt.hash(password, 10)` before insertion into SQLite.
  - Salting prevents rainbow table attacks; slow hashing computational cost defends against brute-force password cracking.
- **Session Management with `express-session`:**
  - Upon successful authentication, a session record is generated server-side containing `{ user: { id, username } }`.
  - A cryptographically signed session ID cookie (`banana.sid`) is returned to the client with critical enterprise flags:
    - `httpOnly: true`: Blocks client-side JavaScript from reading the cookie, mitigating Cross-Site Scripting (XSS) session hijacking.
    - `sameSite: 'lax'`: Prevents the browser from sending the cookie in cross-site contexts, mitigating Cross-Site Request Forgery (CSRF).
- **SQL Injection Defense:**
  - Parameterised SQL prepared statements (`db.prepare('SELECT ... WHERE username = ?')`) ensure user inputs are treated as literal values rather than executable SQL code.
- **Alternative Virtual Identity Approaches for Enterprise:**
  - **Stateful Sessions vs. Stateless JSON Web Tokens (JWT):**
    - *Sessions (Current implementation):* User state is stored server-side. Advantage: easy revocation (logout immediately destroys the session). Disadvantage: requires shared session storage (e.g., Redis) when horizontally scaling across multiple server instances.
    - *JWT (JSON Web Tokens):* Cryptographically signed tokens stored entirely on the client and verified via public/private keys. Advantage: completely stateless and horizontally scalable across distributed microservices. Disadvantage: token revocation before expiration requires token blacklisting.
  - **Federated Identity & OAuth 2.0 / OpenID Connect:**
    - Delegation of authentication to trusted Identity Providers (e.g. Google Sign-In, GitHub OAuth). Eliminates password storage liability on the enterprise application and offers Multi-Factor Authentication (MFA) out of the box.
- **Code references:** Marked throughout with `// AUTH: ...` in [`server.js`](server.js), [`middleware/auth.js`](middleware/auth.js), and [`db.js`](db.js).

---

## 7. Verification & Testing Evidence

The application contains automated and manual verification covering all functional requirements:
- Automated integration test suites verified endpoints:
  - User registration, duplicate username rejection, invalid password rejection.
  - Password hashing and session cookie issuance (`httpOnly`).
  - Route protection (401 JSON for APIs, 302 redirects for HTML pages).
  - Anti-cheat puzzle proxy verification (guaranteeing `data.solution` is never sent to browser).
  - Server-side answer validation and elapsed time checking.
  - Score persistence linked to authenticated user and top-10 descending leaderboard aggregation.
  - Profile statistics aggregation and recent 5 games retrieval.

---

## 8. License & Academic Declaration

This project was built for academic assessment in **CIS046-3 Software For Enterprise** at the University of Bedfordshire.

AI assistance statement:
*Code generated with Antigravity (AI), reviewed, customized, understood, and tested by the student in accordance with assignment regulations.*
