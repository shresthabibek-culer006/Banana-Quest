// Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1.

/**
 * Shared Dynamic Navigation Bar
 * Handles authentication status detection, dynamic link rendering, and logout event.
 */

// EVENT: DOMContentLoaded initializes navigation state
document.addEventListener("DOMContentLoaded", async () => {
  const navContainer = document.getElementById("navbarRoot");
  if (!navContainer) return;

  const currentPath = window.location.pathname;

  try {
    // AUTH: Query server session for current Virtual Identity status
    const response = await fetch("/api/me");
    const data = await response.json();
    const isLoggedIn = data.loggedIn;
    const user = data.user;

    navContainer.innerHTML = `
      <nav class="navbar">
        <div class="container nav-container">
          <a href="/index.html" class="brand">
            <span class="brand-icon">🍌</span>
            <span>Banana Quest</span>
          </a>
          <ul class="nav-links">
            ${isLoggedIn ? `
              <li><span class="user-badge">👤 ${escapeHtml(user.username)}</span></li>
              <li><a href="/game.html" class="nav-link ${currentPath.includes('game') ? 'active' : ''}">Play</a></li>
              <li><a href="/leaderboard.html" class="nav-link ${currentPath.includes('leaderboard') ? 'active' : ''}">Leaderboard</a></li>
              <li><a href="/profile.html" class="nav-link ${currentPath.includes('profile') ? 'active' : ''}">Profile</a></li>
              <li><a href="#" id="logoutBtn" class="nav-link">Logout</a></li>
            ` : `
              <li><a href="/index.html" class="nav-link ${currentPath === '/' || currentPath.includes('index') ? 'active' : ''}">Home</a></li>
              <li><a href="/leaderboard.html" class="nav-link ${currentPath.includes('leaderboard') ? 'active' : ''}">Leaderboard</a></li>
              <li><a href="/login.html" class="nav-link ${currentPath.includes('login') ? 'active' : ''}">Sign In</a></li>
              <li><a href="/register.html" class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Register</a></li>
            `}
          </ul>
        </div>
      </nav>
    `;

    // EVENT: Handle user logout click
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          // AUTH: Post to logout endpoint to destroy server session and clear cookie
          const res = await fetch("/api/auth/logout", { method: "POST" });
          if (res.ok) {
            window.location.href = "/login.html";
          }
        } catch (err) {
          console.error("Logout error:", err);
        }
      });
    }
  } catch (error) {
    console.error("Failed to load navigation status:", error);
  }
});

// Helper: Escape HTML to prevent XSS injection
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
