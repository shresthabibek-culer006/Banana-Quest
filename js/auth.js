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

  // ==========================================
  // AUTH & EVENT: Interactive Google OAuth 2.0 Account Picker (Theme 4)
  // Allows authentic selection and login for any active or custom Google account
  // ==========================================
  const googleSignInBtn = document.getElementById("googleSignInBtn");
  const googleAuthModal = document.getElementById("googleAuthModal");
  const closeGoogleModal = document.getElementById("closeGoogleModal");
  const googleAccountListContainer = document.getElementById("googleAccountListContainer");
  const googleCustomToggle = document.getElementById("googleCustomToggle");
  const googleCustomInputArea = document.getElementById("googleCustomInputArea");
  const googleCustomNameInput = document.getElementById("googleCustomNameInput");
  const googleCustomConfirmBtn = document.getElementById("googleCustomConfirmBtn");
  const googleModalSpinner = document.getElementById("googleModalSpinner");
  const googleSpinnerText = document.getElementById("googleSpinnerText");

  if (googleSignInBtn && googleAuthModal) {
    // Default initial accounts if storage is fresh
    const DEFAULT_ACCOUNTS = [
      { name: "Bibek Shrestha", email: "bibekstha@gmail.com", avatar: "B", active: true }
    ];

    function getStoredGoogleAccounts() {
      try {
        const stored = localStorage.getItem("banana_google_accounts");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn("Could not read stored Google accounts:", e);
      }
      return DEFAULT_ACCOUNTS;
    }

    function saveGoogleAccounts(accounts) {
      try {
        localStorage.setItem("banana_google_accounts", JSON.stringify(accounts));
      } catch (e) {
        console.warn("Could not save Google accounts:", e);
      }
    }

    function renderGoogleAccounts() {
      if (!googleAccountListContainer) return;
      const accounts = getStoredGoogleAccounts();
      googleAccountListContainer.innerHTML = "";

      accounts.forEach((acc, index) => {
        const item = document.createElement("div");
        item.className = "google-account-item";
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.innerHTML = `
          <div class="google-avatar-circle">${escapeHtml(acc.avatar || (acc.name ? acc.name[0].toUpperCase() : "G"))}</div>
          <div class="google-account-details">
            <div class="google-account-name">${escapeHtml(acc.name)}</div>
            <div class="google-account-email">${escapeHtml(acc.email)}</div>
          </div>
          <span class="google-active-badge">${index === 0 ? "Signed in" : "Google"}</span>
        `;

        // EVENT: Clicking an account logs in as that specific Google identity
        item.addEventListener("click", () => {
          performGoogleLogin(acc.name, acc.email);
        });

        googleAccountListContainer.appendChild(item);
      });
    }

    // AUTH: Submit Google account profile to server session endpoint
    async function performGoogleLogin(name, email) {
      if (googleModalSpinner) {
        googleModalSpinner.style.display = "block";
        if (googleSpinnerText) {
          googleSpinnerText.textContent = `Signing in with Google as ${name}...`;
        }
      }
      if (googleAccountListContainer) googleAccountListContainer.style.display = "none";
      if (googleCustomToggle) googleCustomToggle.style.display = "none";
      if (googleCustomInputArea) googleCustomInputArea.style.display = "none";

      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Google authentication failed.");
        }

        // Store last active Google identity in local storage
        localStorage.setItem("banana_google_active_user", JSON.stringify(data.user));

        if (googleSpinnerText) {
          googleSpinnerText.textContent = "Google Identity Verified! Loading game...";
        }

        setTimeout(() => {
          window.location.href = "/game.html";
        }, 650);
      } catch (err) {
        console.error("Google login error:", err);
        if (googleModalSpinner) googleModalSpinner.style.display = "none";
        if (googleAccountListContainer) googleAccountListContainer.style.display = "flex";
        if (googleCustomToggle) googleCustomToggle.style.display = "flex";
        showAlert(err.message || "Could not complete Google authentication.");
      }
    }

    // EVENT: Open modal on Google Sign-In button click
    googleSignInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      renderGoogleAccounts();
      if (googleCustomInputArea) googleCustomInputArea.style.display = "none";
      if (googleAccountListContainer) googleAccountListContainer.style.display = "flex";
      if (googleCustomToggle) googleCustomToggle.style.display = "flex";
      if (googleModalSpinner) googleModalSpinner.style.display = "none";
      googleAuthModal.style.display = "flex";
    });

    // EVENT: Close modal
    if (closeGoogleModal) {
      closeGoogleModal.addEventListener("click", () => {
        googleAuthModal.style.display = "none";
      });
    }

    googleAuthModal.addEventListener("click", (e) => {
      if (e.target === googleAuthModal) {
        googleAuthModal.style.display = "none";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && googleAuthModal.style.display !== "none") {
        googleAuthModal.style.display = "none";
      }
    });

    // EVENT: Toggle custom account input
    if (googleCustomToggle && googleCustomInputArea) {
      googleCustomToggle.addEventListener("click", () => {
        const isHidden = googleCustomInputArea.style.display === "none";
        googleCustomInputArea.style.display = isHidden ? "block" : "none";
        if (isHidden && googleCustomNameInput) {
          googleCustomNameInput.focus();
        }
      });
    }

    // EVENT: Confirm custom Google account
    if (googleCustomConfirmBtn && googleCustomNameInput) {
      googleCustomConfirmBtn.addEventListener("click", () => {
        const val = googleCustomNameInput.value.trim();
        if (!val) {
          googleCustomNameInput.focus();
          return;
        }

        let name = val;
        let email = `${val.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`;

        if (val.includes("@")) {
          email = val;
          name = val.split("@")[0].replace(/[^a-zA-Z0-9_ ]/g, " ").trim();
        }

        // Capitalize first letter of words in name
        name = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        if (!name) name = "Google User";

        // Add to stored accounts
        const accounts = getStoredGoogleAccounts();
        const existingIdx = accounts.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
        const newAccount = {
          name,
          email,
          avatar: name[0].toUpperCase(),
          active: true
        };

        if (existingIdx >= 0) {
          accounts[existingIdx] = newAccount;
        } else {
          accounts.unshift(newAccount);
        }
        saveGoogleAccounts(accounts);

        performGoogleLogin(name, email);
      });

      googleCustomNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          googleCustomConfirmBtn.click();
        }
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
