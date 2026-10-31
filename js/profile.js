// Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1.

/**
 * Player Profile Controller
 * Themes: Virtual Identity, Event-Driven Programming & Enterprise Data Aggregation
 */

// EVENT: Fetch and render profile data when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const loadingEl = document.getElementById("profileLoading");
  const contentEl = document.getElementById("profileContent");

  const usernameEl = document.getElementById("profileUsername");
  const joinedDateEl = document.getElementById("profileJoinedDate");

  const statGamesPlayed = document.getElementById("statGamesPlayed");
  const statBestScore = document.getElementById("statBestScore");
  const statAvgScore = document.getElementById("statAvgScore");
  const statTotalSolved = document.getElementById("statTotalSolved");

  const recentTableWrapper = document.getElementById("recentTableWrapper");
  const recentGamesBody = document.getElementById("recentGamesBody");
  const recentGamesEmpty = document.getElementById("recentGamesEmpty");

  try {
    // AUTH: Retrieve player profile from server session and database
    const response = await fetch("/api/profile");

    if (response.status === 401) {
      window.location.href = "/login.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Profile request failed with HTTP ${response.status}`);
    }

    const data = await response.json();

    // Populate user identity details
    usernameEl.textContent = data.username;
    if (data.joinedDate) {
      joinedDateEl.textContent = new Date(data.joinedDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }

    // Populate aggregate metrics
    statGamesPlayed.textContent = data.stats.gamesPlayed;
    statBestScore.textContent = data.stats.bestScore;
    statAvgScore.textContent = data.stats.averageScore;
    statTotalSolved.textContent = data.stats.totalCorrect;

    // Populate recent 5 games
    const games = data.recentGames || [];
    if (games.length === 0) {
      recentGamesEmpty.style.display = "block";
      recentTableWrapper.style.display = "none";
    } else {
      recentGamesBody.innerHTML = games.map((game, index) => {
        const formattedDate = game.date ? new Date(game.date).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }) : "-";

        return `
          <tr>
            <td style="color: var(--text-muted); font-weight: 600;">#${index + 1}</td>
            <td>
              <span style="color: var(--banana-yellow); font-family: var(--font-display); font-weight: 700; font-size: 1.1rem;">
                ${game.score}
              </span>
            </td>
            <td><span class="badge-diff ${game.difficulty}">${game.difficulty}</span></td>
            <td>${game.correct_answers}</td>
            <td style="color: var(--text-muted); font-size: 0.88rem;">${formattedDate}</td>
          </tr>
        `;
      }).join("");

      recentTableWrapper.style.display = "block";
      recentGamesEmpty.style.display = "none";
    }

    loadingEl.style.display = "none";
    contentEl.style.display = "block";
  } catch (error) {
    console.error("Profile load error:", error);
    loadingEl.innerHTML = `
      <p style="color: var(--error-red);">Failed to load profile. Please refresh or try again later.</p>
    `;
  }
});
