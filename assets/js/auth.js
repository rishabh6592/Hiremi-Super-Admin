/* ==========================================================================
   Hiremi Super Admin — auth.js
   Lightweight client-side authentication for a static front-end demo.

   Flow:
     index.html (login) -> otp.html (verification) -> dashboard.html
   Session is stored in localStorage so protected pages can guard themselves
   by calling HiremiAuth.requireAuth() at the top of the page.

   NOTE: this is a front-end only simulation (no server). For production
   this should be swapped for real authentication against a backend API.
   ========================================================================== */

(function (window) {
  const SESSION_KEY = "hiremi_session";
  const PENDING_KEY = "hiremi_pending_login";
  const DEMO_EMAIL = "admin@hiremi.com";
  const DEMO_PASSWORD = "Hiremi@123";
  const DEMO_OTP = "123456";

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(data) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getPendingLogin() {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setPendingLogin(data) {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(data));
  }

  function clearPendingLogin() {
    sessionStorage.removeItem(PENDING_KEY);
  }

  function isAuthenticated() {
    return !!getSession();
  }

  /**
   * Call at the top of any protected page. Redirects to login if there is
   * no active session.
   */
  function requireAuth() {
    if (!isAuthenticated()) {
      window.location.replace("index.html");
    }
  }

  /**
   * Call at the top of the login page. If already authenticated, skip
   * straight to the dashboard.
   */
  function redirectIfAuthed() {
    if (isAuthenticated()) {
      window.location.replace("dashboard.html");
    }
  }

  function logout() {
    clearSession();
    clearPendingLogin();
    window.location.href = "index.html";
  }

  window.HiremiAuth = {
    DEMO_EMAIL,
    DEMO_PASSWORD,
    DEMO_OTP,
    getSession,
    setSession,
    clearSession,
    getPendingLogin,
    setPendingLogin,
    clearPendingLogin,
    isAuthenticated,
    requireAuth,
    redirectIfAuthed,
    logout,
  };
})(window);
