/* ==========================================================================
   Hiremi Super Admin — stats.js
   Single source of truth for every headline number shown on the dashboard.
   Numbers aren't frozen — each key has a base value and a small per-minute
   growth rate, measured from the visitor's first visit (persisted in
   localStorage), so counts keep climbing the longer/more often someone
   uses the dashboard — and the same numbers stay in sync between the
   dashboard cards and their matching detail.html tables.
   ========================================================================== */

(function (window) {
  const STORAGE_KEY = "hiremiStatsStartedAt";

  function getStartTime() {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* localStorage unavailable (e.g. file:// in some browsers) — fall back to session-only growth */
    }
    if (!stored) {
      stored = String(Date.now());
      try {
        window.localStorage.setItem(STORAGE_KEY, stored);
      } catch (e) {
        /* ignore */
      }
    }
    return Number(stored);
  }

  const START = getStartTime();

  // base = starting count, perMinute = how much it grows per minute of usage
  //
  // Account-verification group is kept internally consistent on purpose:
  // verified + under-verification + not-verified + rejected === total-accounts
  // (same for their perMinute rates), and female-total + male-total ===
  // total-accounts too, so the numbers never contradict each other across
  // the dashboard, detail pages and listing tables.
  const REGISTRY = {
    "total-accounts": { base: 4336, perMinute: 1.9 },
    "verified-users": { base: 2840, perMinute: 1.2 },
    "under-verification": { base: 860, perMinute: 0.4 },
    "not-verified-users": { base: 540, perMinute: 0.25 },
    "rejected-users": { base: 96, perMinute: 0.05 },

    "hiremi360-unimentor-internship": { base: 5420, perMinute: 2.2 },
    "hiremi360-unimentor": { base: 4890, perMinute: 1.9 },
    "hiremi360-corporate": { base: 4160, perMinute: 1.6 },
    "hiremi360-mocktests": { base: 5980, perMinute: 2.4 },
    "hiremi360-projecthub": { base: 3540, perMinute: 1.3 },

    "hr-verified": { base: 8420, perMinute: 3.4 },
    "hr-not-verified": { base: 2860, perMinute: 1.1 },
    "hr-registered": { base: 11280, perMinute: 4.3 },
    "hr-approval": { base: 6740, perMinute: 2.6 },
    "hr-demo-1": { base: 4120, perMinute: 1.6 },
    "hr-demo-2": { base: 3960, perMinute: 1.5 },

    "female-total": { base: 1840, perMinute: 0.8 },
    "male-total": { base: 2496, perMinute: 1.1 },
    "female-verified": { base: 1240, perMinute: 0.5 },
    "female-not-verified": { base: 480, perMinute: 0.2 },
    "male-verified": { base: 1690, perMinute: 0.7 },
    "male-not-verified": { base: 640, perMinute: 0.3 },

    "opp-internships": { base: 2450, perMinute: 1.0 },
    "opp-freshers": { base: 4180, perMinute: 1.7 },
    "opp-experienced": { base: 1920, perMinute: 0.8 },
    "seek-internships": { base: 2260, perMinute: 0.9 },
    "seek-freshers": { base: 3870, perMinute: 1.6 },
    "seek-experienced": { base: 1780, perMinute: 0.75 },

    "resolved-queries": { base: 612, perMinute: 0.35 },
    "total-queries": { base: 860, perMinute: 0.5 },

    "companies-total": { base: 238, perMinute: 0.12 },
  };

  function computeStat(key) {
    const cfg = REGISTRY[key];
    if (!cfg) return null;
    const minutesElapsed = (Date.now() - START) / 60000;
    return Math.round(cfg.base + cfg.perMinute * minutesElapsed);
  }

  function formatNumber(n) {
    return n.toLocaleString("en-IN");
  }

  // Wires up every [data-stat="key"] element on the page: sets its text now,
  // then keeps it refreshed every few seconds so the dashboard visibly
  // ticks upward while it's open, without needing a page reload.
  function bindLiveStats(root, intervalMs) {
    const scope = root || document;
    function refresh() {
      scope.querySelectorAll("[data-stat]").forEach((el) => {
        const value = computeStat(el.dataset.stat);
        if (value !== null) el.textContent = formatNumber(value);
      });
    }
    refresh();
    return window.setInterval(refresh, intervalMs || 5000);
  }

  window.HiremiStats = { computeStat, formatNumber, bindLiveStats };
})(window);
