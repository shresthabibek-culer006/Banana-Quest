const API_URL = "/api/puzzle";

async function fetchPuzzle() {
  const response = await fetch(API_URL);
  return await response.json();
}   