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
            <svg class="banana-nav-svg" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="80" cy="80" r="70" fill="url(#bananaNavGlow)" opacity="0.6"/>
              <path d="M42 118C52 128 85 132 115 106C132 91 138 68 135 48C134 42 128 40 124 44C118 50 102 62 82 72C60 82 46 98 42 118Z" fill="url(#bananaNavGrad)" stroke="#D48800" stroke-width="3"/>
              <path d="M48 114C56 122 84 124 108 102C122 90 127 72 126 56C112 68 96 78 76 86C58 94 50 104 48 114Z" fill="#FFF9C4" opacity="0.5"/>
              <path d="M135 48L144 38C145 37 144 34 142 34C138 34 133 36 129 40L124 44" fill="#689F38"/>
              <rect x="85" y="55" width="22" height="15" rx="5" fill="#14141A" stroke="#FFE082" stroke-width="2" transform="rotate(-18 85 55)"/>
              <rect x="106" y="48" width="22" height="15" rx="5" fill="#14141A" stroke="#FFE082" stroke-width="2" transform="rotate(-18 106 48)"/>
              <line x1="102" y1="52" x2="108" y2="50" stroke="#FFE082" stroke-width="2.5"/>
              <defs>
                <radialGradient id="bananaNavGlow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stop-color="#FFD54F" stop-opacity="0.6"/>
                  <stop offset="100%" stop-color="#FF9800" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="bananaNavGrad" x1="42" y1="120" x2="135" y2="45" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#FF9800"/>
                  <stop offset="50%" stop-color="#FFEB3B"/>
                  <stop offset="100%" stop-color="#FFF59D"/>
                </linearGradient>
              </defs>
            </svg>
            <span>Banana Quest</span>
          </a>
          <ul class="nav-links">
            ${isLoggedIn ? `
              <li><span class="user-badge">${user.provider === 'google' ? '🌐 ' : '👤 '}${escapeHtml(user.username)}</span></li>
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
