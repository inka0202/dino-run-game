document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const serverMessage = document.getElementById("serverMessage");
  const togglePassword = document.getElementById("toggle-password");

  const API_BASE = "http://localhost:5000/api/auth";
  // Toggle password visibility
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      target.type = target.type === "password" ? "text" : "password";
    });
  });

  // Validate email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous errors
    emailError.textContent = "";
    passwordError.textContent = "";
    serverMessage.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let valid = true;

    // Email validation
    if (!isValidEmail(email)) {
      emailError.textContent = "Please enter a valid email.";
      valid = false;
    }

    // Password validation
    if (password.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters.";
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        serverMessage.textContent = data.message || "Login failed.";
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);
      // Redirect to account mode game
      window.location.href = "gameA.html";
    } catch (err) {
      serverMessage.textContent = "Server error. Please try again.";
    }
  });
});
