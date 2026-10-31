// Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1.

/**
 * Client API Service
 * Themes: Interoperability (HTTP REST communication with Express proxy) & Virtual Identity (Session cookies)
 */

// INTEROP: Fetch random puzzle from Express proxy (which interacts with external Banana API)
async function fetchPuzzle(difficulty = "medium") {
  const response = await fetch(`/api/puzzle?difficulty=${encodeURIComponent(difficulty)}`);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP ${response.status}: Failed to fetch puzzle`);
  }
  return await response.json();
}

// INTEROP & AUTH: Submit user answer to server-side validator where solution is kept securely
async function submitAnswer(answer) {
  const response = await fetch("/api/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP ${response.status}: Failed to verify answer`);
  }

  return await response.json();
}
