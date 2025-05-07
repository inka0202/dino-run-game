document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm");

  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const confirmError = document.getElementById("confirm-error");
  const matchError = document.getElementById("match-error");

  const API_BASE = "http://localhost:5000/api/auth";

  // Toggle password visibility
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      target.type = target.type === "password" ? "text" : "password";
    });
  });

  // Input validation styles
  const setValid = (input, errorElem, message = "") => {
    input.classList.remove("invalid");
    input.classList.add("valid");
    errorElem.textContent = message;
  };

  const setInvalid = (input, errorElem, message) => {
    input.classList.remove("valid");
    input.classList.add("invalid");
    errorElem.textContent = message;
  };

  //Auto-clean errors when changing fields
  emailInput.addEventListener("input", () => {
    emailError.textContent = "";
    emailInput.classList.remove("invalid", "valid");
  });

  passwordInput.addEventListener("input", () => {
    passwordError.textContent = "";
    passwordInput.classList.remove("invalid", "valid");
  });

  confirmInput.addEventListener("input", () => {
    confirmError.textContent = "";
    confirmInput.classList.remove("invalid", "valid");
    matchError.textContent = "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    let valid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setInvalid(emailInput, emailError, "Invalid email format.");
      valid = false;
    } else {
      setValid(emailInput, emailError);
    }

    // Password strength
    const passwordValid =
      password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
    if (!passwordValid) {
      setInvalid(
        passwordInput,
        passwordError,
        "Min. 8 characters, incl. 1 uppercase & 1 number"
      );
      valid = false;
    } else {
      setValid(passwordInput, passwordError);
    }

    // Confirm password
    if (confirm.length === 0) {
      setInvalid(confirmInput, confirmError, "Please confirm password.");
      valid = false;
    } else {
      setValid(confirmInput, confirmError);
    }

    // Match check
    if (password !== confirm) {
      matchError.textContent = "Passwords do not match.";
      confirmInput.classList.remove("valid");
      confirmInput.classList.add("invalid");
      valid = false;
    } else {
      matchError.textContent = "";
    }

    if (!valid) return;

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created! Please log in.");
        window.location.href = "login.html";
      } else {
        matchError.textContent = data.message || "Registration failed.";
      }
    } catch (err) {
      matchError.textContent = "Network error. Try again later.";
    }
  });
});
