# Banana Quest — Third-Party References & Dependencies

This project relies on the following third-party libraries, services, and external resources. Each item is documented in accordance with the assignment guidelines for CIS046-3 Software For Enterprise.

---

### 1. Express
- **Package / Version:** `express` (^5.3.0)
- **Author / Source:** OpenJS Foundation / npm (`https://expressjs.com`)
- **Purpose:** Minimalist web application framework for Node.js. Used to serve static assets, define RESTful API routes, manage middleware pipelines, and proxy external API requests to prevent CORS browser restrictions.

---

### 2. better-sqlite3
- **Package / Version:** `better-sqlite3`
- **Author / Source:** Joshua Wise / npm (`https://github.com/WiseLibs/better-sqlite3`)
- **Purpose:** Fast, synchronous SQLite3 library for Node.js. Used for reliable, parameterised SQL database management, storing user accounts and game score history in local file `data/banana.db`.

---

### 3. bcryptjs
- **Package / Version:** `bcryptjs`
- **Author / Source:** Daniel Wirtz / npm (`https://github.com/dcodeIO/bcrypt.js`)
- **Purpose:** Optimized bcrypt password hashing algorithm implementation in pure JavaScript. Used to securely hash and salt user passwords before storing them in the SQLite database, ensuring plain-text passwords are never saved.

---

### 4. express-session
- **Package / Version:** `express-session`
- **Author / Source:** Express Community / npm (`https://github.com/expressjs/session`)
- **Purpose:** Server-side session middleware for Express. Manages virtual user identity through signed, HTTP-only session cookies (`banana.sid`), storing authenticated user IDs, puzzle solutions, and game round state server-side.

---

### 5. Banana API
- **Author / Source:** Dr. Marc Conrad, University of Bedfordshire (`http://marcconrad.com/uob/banana/api.php`)
- **Purpose:** External RESTful puzzle service providing random math puzzle images and their corresponding numerical solutions in JSON format. Used to test interoperability and proxy architecture.

---

### 6. Google Fonts
- **Source:** Google Fonts (`https://fonts.google.com`)
- **Fonts Used:** `Fredoka` (display/headings) & `Inter` (body copy)
- **Purpose:** Typography styling for modern, approachable user experience.
