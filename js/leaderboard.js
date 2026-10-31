// Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1.

/**
 * Leaderboard Client Controller
 * Themes: Event-Driven Programming & Interoperability / Virtual Identity
 */

// EVENT: Fetch and render leaderboard when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  const loadingEl = document.getElementById("leaderboardLoading");
  const tableContainer = document.getElementById("tableContainer");
  const tbody = document.getElementById("leaderboardBody");
  const emptyState = document.getElementById("leaderboardEmpty");

  try {
    // AUTH: Fetch top scores from server SQLite database via REST endpoint
    const response = await fetch("/api/leaderboard");

    if (response.status === 401) {
      window.location.href = "/login.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Failed to load leaderboard: HTTP ${response.status}`);
    }

    const data = await response.json();
    const list = data.leaderboard || [];

    loadingEl.style.display = "none";

    if (list.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    // Populate rows
    tbody.innerHTML = list.map((item) => {
      let rankHtml = `<span class="rank-badge">${item.rank}</span>`;
      if (item.rank === 1) rankHtml = `<span class="rank-badge rank-1">🥇 1</span>`;
      else if (item.rank === 2) rankHtml = `<span class="rank-badge rank-2">🥈 2</span>`;
      else if (item.rank === 3) rankHtml = `<span class="rank-badge rank-3">🥉 3</span>`;

      const formattedDate = item.date ? new Date(item.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      }) : "-";

      return `
        <tr>
          <td>${rankHtml}</td>
          <td><strong>${escapeHtml(item.username)}</strong></td>
          <td>
            <span style="color: var(--banana-yellow); font-family: var(--font-display); font-size: 1.15rem; font-weight: 700;">
              ${item.score}
            </span>
          </td>
          <td><span class="badge-diff ${item.difficulty}">${item.difficulty}</span></td>
          <td>${item.correct_answers}</td>
          <td style="color: var(--text-muted); font-size: 0.88rem;">${formattedDate}</td>
        </tr>
      `;
    }).join("");

    tableContainer.style.display = "block";
  } catch (error) {
    console.error("Leaderboard error:", error);
    loadingEl.innerHTML = `
      <p style="color: var(--error-red);">Failed to load leaderboard scores. Please refresh or try again later.</p>
    `;
  }
});

// Helper: Escape HTML strings to protect against XSS injection
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
