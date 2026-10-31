// Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1.

/**
 * Authentication Middleware
 * Theme: Virtual Identity & Access Control
 * 
 * Protects endpoints and pages from unauthorized access using the server-side session.
 */

// AUTH: Enforce authentication on API endpoints (returns 401 JSON)
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required. Please log in." });
}

// AUTH: Enforce authentication on HTML page routes (redirects browser to login)
function requirePageLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login.html');
}

module.exports = {
  requireLogin,
  requirePageLogin
};
