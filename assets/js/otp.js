document.addEventListener("DOMContentLoaded", () => {
  HiremiAuth.redirectIfAuthed();

  const pending = HiremiAuth.getPendingLogin();
  if (!pending) {
    // No login in progress — send back to the login screen.
    window.location.replace("index.html");
    return;
  }

  const otpTarget = document.getElementById("otpTarget");
  if (pending.email) {
    const [user, domain] = pending.email.split("@");
    const masked = user.length > 2 ? user[0] + "*".repeat(user.length - 2) + user[user.length - 1] : user;
    otpTarget.textContent = `An OTP was sent to ${masked}@${domain}`;
  }

  const boxes = Array.from(document.querySelectorAll(".otp-box"));
  const form = document.getElementById("otpForm");
  const otpMessage = document.getElementById("otpMessage");
  const resendLink = document.getElementById("resendOtp");
  const resendTimer = document.getElementById("resendTimer");

  boxes[0].focus();

  boxes.forEach((box, index) => {
    box.addEventListener("input", () => {
      box.value = box.value.replace(/[^0-9]/g, "");
      if (box.value && index < boxes.length - 1) {
        boxes[index + 1].focus();
      }
      clearError();
    });

    box.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !box.value && index > 0) {
        boxes[index - 1].focus();
      }
    });

    box.addEventListener("paste", (event) => {
      const pasted = (event.clipboardData || window.clipboardData).getData("text").trim();
      if (/^\d+$/.test(pasted)) {
        event.preventDefault();
        pasted
          .slice(0, boxes.length)
          .split("")
          .forEach((digit, i) => {
            if (boxes[i]) boxes[i].value = digit;
          });
        boxes[Math.min(pasted.length, boxes.length) - 1].focus();
      }
    });
  });

  function clearError() {
    boxes.forEach((b) => b.classList.remove("input-error"));
    otpMessage.hidden = true;
  }

  function showError(message) {
    boxes.forEach((b) => b.classList.add("input-error"));
    otpMessage.textContent = message;
    otpMessage.hidden = false;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = boxes.map((b) => b.value).join("");

    if (code.length < 6) {
      showError("Please enter the full 6-digit code.");
      return;
    }

    if (code !== HiremiAuth.DEMO_OTP) {
      showError("Incorrect OTP. Please try again.");
      boxes.forEach((b) => (b.value = ""));
      boxes[0].focus();
      return;
    }

    HiremiAuth.setSession({ email: pending.email, name: "Super Admin", loggedInAt: Date.now() });
    HiremiAuth.clearPendingLogin();
    window.location.href = "dashboard.html";
  });

  // Resend cooldown
  let seconds = 30;
  resendLink.setAttribute("aria-disabled", "true");
  const countdown = setInterval(() => {
    seconds -= 1;
    resendTimer.textContent = `(${seconds}s)`;
    if (seconds <= 0) {
      clearInterval(countdown);
      resendTimer.textContent = "";
      resendLink.removeAttribute("aria-disabled");
    }
  }, 1000);
  resendTimer.textContent = `(${seconds}s)`;

  resendLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (resendLink.getAttribute("aria-disabled") === "true") return;
    boxes.forEach((b) => (b.value = ""));
    boxes[0].focus();
    clearError();
    seconds = 30;
    resendLink.setAttribute("aria-disabled", "true");
    const again = setInterval(() => {
      seconds -= 1;
      resendTimer.textContent = `(${seconds}s)`;
      if (seconds <= 0) {
        clearInterval(again);
        resendTimer.textContent = "";
        resendLink.removeAttribute("aria-disabled");
      }
    }, 1000);
  });
});
