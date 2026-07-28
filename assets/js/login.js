document.addEventListener("DOMContentLoaded", () => {
  HiremiAuth.redirectIfAuthed();

  const form = document.getElementById("loginForm");
  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");
  const formMessage = document.getElementById("formMessage");

  function clearError() {
    emailField.classList.remove("input-error");
    passwordField.classList.remove("input-error");
    formMessage.hidden = true;
    formMessage.textContent = "";
  }

  function showError(message) {
    emailField.classList.add("input-error");
    passwordField.classList.add("input-error");
    formMessage.textContent = message;
    formMessage.hidden = false;
  }

  emailField.addEventListener("input", clearError);
  passwordField.addEventListener("input", clearError);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    // Demo auth check — swap for a real API call in production.
    if (email.toLowerCase() !== HiremiAuth.DEMO_EMAIL || password !== HiremiAuth.DEMO_PASSWORD) {
      showError("Invalid email or password.");
      passwordField.value = "";
      return;
    }

    HiremiAuth.setPendingLogin({ email, startedAt: Date.now() });
    window.location.href = "otp.html";
  });
});
