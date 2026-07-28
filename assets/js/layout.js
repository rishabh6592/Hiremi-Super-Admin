/* ==========================================================================
   Hiremi Super Admin — layout.js
   Injects the shared topbar + sidebar into every page from one template,
   so the navigation only has to be edited in a single place.
   ========================================================================== */

(function () {
  const NAV_SECTIONS = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", icon: "ri-dashboard-line", href: "dashboard.html", key: "dashboard" },
        { label: "Analytics", icon: "ri-line-chart-line", href: "detail.html?type=analytics", key: "analytics" },
        { label: "App Download Status", icon: "ri-download-2-line", href: "app-download-status.html", key: "app-download" },
        {
          label: "User Status",
          icon: "ri-user-3-line",
          key: "user-status",
          children: [
            { label: "Verified Users", href: "verified-users.html", key: "verified-users" },
            { label: "Under Verification", href: "under-verification.html", key: "under-verification" },
            { label: "Not Verified Users", href: "not-verified-users.html", key: "not-verified-users" },
            { label: "Rejected Users", href: "rejected-users.html", key: "rejected-users" },
          ],
        },
      ],
    },
    {
      title: "Organization",
      items: [
        { label: "Total Companies", icon: "ri-building-line", href: "detail.html?type=companies", key: "companies" },
        { label: "Total HR Recruiters", icon: "ri-team-line", href: "detail.html?type=hr-registered", key: "hr" },
      ],
    },
    {
      title: "Hiremi 360 Program",
      items: [
        { label: "Training + Internship", icon: "ri-graduation-cap-line", href: "detail.html?type=hiremi360-unimentor-internship", key: "training" },
        { label: "Unimentor Program", icon: "ri-lightbulb-line", href: "detail.html?type=hiremi360-unimentor", key: "unimentor" },
        { label: "Corporate Launchpad", icon: "ri-rocket-line", href: "detail.html?type=hiremi360-corporate", key: "corporate" },
        { label: "Mock Tests", icon: "ri-file-list-3-line", href: "detail.html?type=hiremi360-mocktests", key: "mock-tests" },
        { label: "Live Project Hub", icon: "ri-code-s-slash-line", href: "detail.html?type=hiremi360-projecthub", key: "project-hub" },
      ],
    },
    {
      title: "More",
      items: [
        { label: "Project Report", icon: "ri-bar-chart-box-line", href: "detail.html?type=project-report", key: "project-report" },
        { label: "Admin Setting", icon: "ri-settings-3-line", href: "detail.html?type=admin-setting", key: "admin-setting" },
      ],
    },
  ];

  function iconFor(key) {
    return key;
  }

  function buildSidebarHTML(activeKey) {
    let html = "";
    NAV_SECTIONS.forEach((section) => {
      html += `<div class="sidebar__section-title">${section.title}</div><ul class="sidebar__list">`;
      section.items.forEach((item) => {
        if (item.children) {
          const isOpenGroup = item.children.some((c) => c.key === activeKey);
          html += `
            <li class="sidebar__group" data-open="${isOpenGroup}">
              <button type="button" class="sidebar__group-toggle" aria-expanded="${isOpenGroup}">
                <span class="sidebar__toggle-label"><i class="${item.icon}"></i>${item.label}</span>
                <i class="ri-arrow-down-s-line chevron"></i>
              </button>
              <ul class="sidebar__submenu">
                ${item.children
                  .map(
                    (child) => `<li><a class="sidebar__link${child.key === activeKey ? " is-active" : ""}" href="${child.href}">${child.label}</a></li>`
                  )
                  .join("")}
              </ul>
            </li>`;
        } else {
          html += `<li><a class="sidebar__link${item.key === activeKey ? " is-active" : ""}" href="${item.href}"><i class="${item.icon}"></i>${item.label}</a></li>`;
        }
      });
      html += `</ul>`;
    });
    return html;
  }

  function buildTopbarHTML() {
    const session = window.HiremiAuth ? window.HiremiAuth.getSession() : null;
    const name = (session && session.name) || "Super Admin";
    const initials = name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return `
      <button class="topbar__menu-btn" id="sidebarToggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <i class="ri-menu-line"></i>
      </button>
      <a href="dashboard.html" class="topbar__logo">
        <img src="assets/images/hiremi-logo.png" alt="Hiremi" />
      </a>
      <div class="topbar__search">
        <i class="ri-search-line"></i>
        <input type="search" placeholder="Search" aria-label="Search" />
      </div>
      <div class="topbar__actions">
        <button class="topbar__icon-btn" aria-label="Notifications">
          <i class="ri-notification-3-line"></i>
          <span class="dot"></span>
        </button>
        <div class="topbar__profile">
          <div class="topbar__avatar">${initials || "SA"}</div>
          <div class="topbar__profile-text">
            <strong>Super Admin</strong>
            <span>${name}</span>
          </div>
        </div>
        <button class="topbar__logout" id="logoutBtn">
          <i class="ri-logout-box-r-line"></i><span>Logout</span>
        </button>
      </div>
    `;
  }

  function init() {
    const shell = document.querySelector(".app-shell");
    if (!shell) return;

    const activeKey = shell.dataset.active || "";

    const topbar = document.createElement("header");
    topbar.className = "topbar";
    topbar.innerHTML = buildTopbarHTML();

    const sidebar = document.createElement("nav");
    sidebar.className = "sidebar";
    sidebar.setAttribute("aria-label", "Primary");
    sidebar.innerHTML = buildSidebarHTML(activeKey);

    const backdrop = document.createElement("div");
    backdrop.className = "sidebar__backdrop";

    shell.prepend(backdrop);
    shell.prepend(sidebar);
    shell.prepend(topbar);

    // Mobile drawer toggle
    const toggleBtn = topbar.querySelector("#sidebarToggle");
    function closeDrawer() {
      shell.classList.remove("sidebar-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
    function openDrawer() {
      shell.classList.add("sidebar-open");
      toggleBtn.setAttribute("aria-expanded", "true");
    }
    toggleBtn.addEventListener("click", () => {
      shell.classList.contains("sidebar-open") ? closeDrawer() : openDrawer();
    });
    backdrop.addEventListener("click", closeDrawer);

    // Submenu toggles
    sidebar.querySelectorAll(".sidebar__group-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.closest(".sidebar__group");
        const isOpen = group.dataset.open === "true";
        group.dataset.open = String(!isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    // Close drawer when a link is clicked (mobile)
    sidebar.querySelectorAll("a.sidebar__link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 1080) closeDrawer();
      });
    });

    // Logout
    const logoutBtn = topbar.querySelector("#logoutBtn");
    logoutBtn.addEventListener("click", () => {
      if (window.HiremiAuth) window.HiremiAuth.logout();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
