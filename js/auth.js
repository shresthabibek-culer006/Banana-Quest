// Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1.

/**
 * Authentication Form Handlers
 * Theme: Virtual Identity & Event-Driven Form Handling
 */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const alertBox = document.getElementById("alertBox");

  function showAlert(msg, isError = true) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = isError ? "alert alert-error" : "alert alert-success";
    alertBox.style.display = "block";
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.style.display = "none";
  }

  // EVENT: Login form submission handler
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlert();

      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");
      const submitBtn = document.getElementById("submitBtn");

      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      if (!username || !password) {
        showAlert("Please fill in both username and password.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Signing In...";

      try {
        // AUTH: Transmit credentials over HTTP to server login endpoint
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
          showAlert(data.error || "Login failed. Please check your credentials.");
          submitBtn.disabled = false;
          submitBtn.textContent = "Sign In";
          return;
        }

        showAlert("Login successful! Redirecting...", false);
        setTimeout(() => {
          window.location.href = "/game.html";
        }, 600);
      } catch (err) {
        console.error("Login network error:", err);
        showAlert("Network error. Could not reach authentication server.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Sign In";
      }
    });
  }

  // EVENT: Register form submission handler
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlert();

      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");
      const confirmInput = document.getElementById("confirmPassword");
      const submitBtn = document.getElementById("submitBtn");

      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;

      if (!username || !password || !confirmPassword) {
        showAlert("All fields are required.");
        return;
      }

      if (username.length < 3 || username.length > 20) {
        showAlert("Username must be between 3 and 20 characters.");
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showAlert("Username can only contain letters, numbers, and underscores.");
        return;
      }

      if (password.length < 6) {
        showAlert("Password must be at least 6 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        showAlert("Passwords do not match.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Creating Account...";

      try {
        // AUTH: Submit registration data for bcrypt hashing & persistence in SQLite
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
          showAlert(data.error || "Registration failed.");
          submitBtn.disabled = false;
          submitBtn.textContent = "Create Account";
          return;
        }

        showAlert("Account created successfully! Redirecting to game...", false);
        setTimeout(() => {
          window.location.href = "/game.html";
        }, 700);
      } catch (err) {
        console.error("Registration network error:", err);
        showAlert("Network error. Could not reach server.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Create Account";
      }
    });
  }
});
