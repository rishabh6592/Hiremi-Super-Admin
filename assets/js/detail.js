/* ==========================================================================
   Hiremi Super Admin — detail.js
   Powers detail.html. Every dashboard card links here with a ?type=… param;
   this file looks up the matching config (title, columns, demo rows) so one
   page + table renderer can serve every section instead of hand-building a
   separate page for each card.
   ========================================================================== */

(function () {
  const USER_COLUMNS = [
    { key: "uid", label: "UID No." },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone No." },
    { key: "whatsapp", label: "WhatsApp No." },
    { key: "gender", label: "Gender" },
    { key: "degree", label: "Degree" },
    { key: "birthplace", label: "Birthplace State" },
    { key: "college", label: "College Name" },
    { key: "collegeState", label: "College State" },
    { key: "passingYear", label: "Passing Year" },
    { key: "createdAt", label: "Account Created" },
  ];

  const HR_COLUMNS = [
    { key: "uid", label: "UID No." },
    { key: "name", label: "Name" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone No." },
    { key: "designation", label: "Designation" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Added On" },
  ];

  const CATEGORY_COLUMNS = [
    { key: "category", label: "Category" },
    { key: "count", label: "Total Users" },
  ];

  const OPP_COLUMNS = [
    { key: "title", label: "Role / Title" },
    { key: "company", label: "Company" },
    { key: "location", label: "Location" },
    { key: "openings", label: "Openings" },
    { key: "postedOn", label: "Posted On" },
  ];

  const QUERY_COLUMNS = [
    { key: "queryId", label: "Query ID" },
    { key: "subject", label: "Subject" },
    { key: "raisedBy", label: "Raised By" },
    { key: "status", label: "Status" },
    { key: "resolvedOn", label: "Resolved On" },
  ];

  function buildOppRows(count, title, seed) {
    const CITIES = ["Hyderabad", "Bengaluru", "Pune", "Chennai", "Mumbai", "Delhi NCR", "Remote"];
    return Array.from({ length: count }, (_, i) => ({
      title: `${title} ${i + 1}`,
      company: HiremiData.COMPANIES[i % HiremiData.COMPANIES.length],
      location: CITIES[(i + (seed || 0)) % CITIES.length],
      openings: 3 + (i % 12),
      postedOn: `Mar ${(i % 28) + 1}, 2025`,
    }));
  }

  function buildQueryRows(count, resolved) {
    const SUBJECTS = ["Login issue", "Verification delay", "Payment not reflecting", "Profile update", "App crash", "Certificate download", "OTP not received"];
    return Array.from({ length: count }, (_, i) => ({
      queryId: `QRY-${String(i + 1).padStart(4, "0")}`,
      subject: SUBJECTS[i % SUBJECTS.length],
      raisedBy: `User ${i + 1}`,
      status: resolved ? "Resolved" : i % 4 === 0 ? "Resolved" : "Pending",
      resolvedOn: resolved || i % 4 === 0 ? `Mar ${(i % 28) + 1}, 2025` : "--",
    }));
  }

  function liveCount(fallback, statKey) {
    if (statKey && window.HiremiStats) {
      const value = window.HiremiStats.computeStat(statKey);
      if (value !== null) return value;
    }
    return fallback;
  }

  function usersType(title, subtitle, count, prefix, statKey) {
    return {
      title,
      subtitle,
      columns: USER_COLUMNS,
      actionLabel: "View",
      rows: () => HiremiData.buildUserRows(liveCount(count, statKey), prefix),
    };
  }

  function hrType(title, subtitle, count, prefix, statKey) {
    return {
      title,
      subtitle,
      columns: HR_COLUMNS,
      actionLabel: "View",
      rows: () => HiremiData.buildHrRows(liveCount(count, statKey), prefix),
    };
  }

  function categoryType(title, subtitle, list, seedTotal) {
    return {
      title,
      subtitle,
      columns: CATEGORY_COLUMNS,
      actionLabel: "View",
      rows: () => HiremiData.buildCategoryRows(list, seedTotal),
    };
  }

  const CONFIGS = {
    "total-accounts": usersType("Total Accounts Created", "Every account created on Hiremi, verified or not.", 4336, "acc", "total-accounts"),

    "hiremi360-unimentor-internship": usersType("Unimentor + Internship", "Students enrolled across the Unimentor and Internship tracks.", 5420, "uim", "hiremi360-unimentor-internship"),
    "hiremi360-unimentor": usersType("Unimentor Program", "Students enrolled in the Unimentor mentorship program.", 4890, "uni", "hiremi360-unimentor"),
    "hiremi360-corporate": usersType("Corporate Launchpad", "Students enrolled in the Corporate Launchpad program.", 4160, "cor", "hiremi360-corporate"),
    "hiremi360-mocktests": usersType("Mock Tests", "Students who have attempted Hiremi mock tests.", 5980, "mck", "hiremi360-mocktests"),
    "hiremi360-projecthub": usersType("Live Project Hub", "Students active in the Live Project Hub.", 3540, "lph", "hiremi360-projecthub"),

    "hr-verified": hrType("Verified Recruiters", "HR recruiters whose company accounts are verified.", 8420, "hrv", "hr-verified"),
    "hr-not-verified": hrType("Not Verified Recruiters", "HR recruiters awaiting company verification.", 2860, "hrn", "hr-not-verified"),
    "hr-registered": hrType("Registered Recruiters", "All HR recruiters registered on Hiremi.", 11280, "hrr", "hr-registered"),
    "hr-approval": hrType("Post Approval", "Job posts submitted by recruiters, pending or approved.", 6740, "hrp", "hr-approval"),
    "hr-demo-1": hrType("Demo Section", "Placeholder HR breakdown — demo data.", 4120, "hd1", "hr-demo-1"),
    "hr-demo-2": hrType("Demo Section", "Placeholder HR breakdown — demo data.", 3960, "hd2", "hr-demo-2"),

    "female-verified": usersType("Female Users — Verified", "Verified female user accounts.", 1240, "fev", "female-verified"),
    "female-not-verified": usersType("Female Users — Not Verified", "Female accounts pending verification.", 480, "fen", "female-not-verified"),
    "male-verified": usersType("Male Users — Verified", "Verified male user accounts.", 1690, "mav", "male-verified"),
    "male-not-verified": usersType("Male Users — Not Verified", "Male accounts pending verification.", 640, "man", "male-not-verified"),

    "domain": categoryType("Interested Domain", "User count by area of interest.", HiremiData.DOMAINS, 380),
    "degree": categoryType("Degree", "User count by degree.", HiremiData.DEGREES, 420),
    "college-state": categoryType("College State", "User count by college state.", HiremiData.STATES, 150),
    "branch": categoryType("Branch", "User count by branch.", HiremiData.BRANCHES, 300),
    "passing-year": categoryType("Passing Year", "User count by passing year.", HiremiData.PASSING_YEARS.map(String), 500),
    "birth-place": categoryType("Birth Place", "User count by birthplace state.", HiremiData.STATES, 130),

    "opp-internships": {
      title: "Internships",
      subtitle: "Open internship listings across companies.",
      columns: OPP_COLUMNS,
      actionLabel: "View",
      rows: () => buildOppRows(liveCount(2450, "opp-internships"), "Internship", 0),
    },
    "opp-freshers": {
      title: "Freshers Job",
      subtitle: "Open fresher job listings across companies.",
      columns: OPP_COLUMNS,
      actionLabel: "View",
      rows: () => buildOppRows(liveCount(4180, "opp-freshers"), "Fresher Role", 1),
    },
    "opp-experienced": {
      title: "Experienced Job",
      subtitle: "Open listings for experienced hires.",
      columns: OPP_COLUMNS,
      actionLabel: "View",
      rows: () => buildOppRows(liveCount(1920, "opp-experienced"), "Experienced Role", 2),
    },
    "seek-internships": {
      title: "Internship Seekers",
      subtitle: "Candidates currently seeking internships.",
      columns: USER_COLUMNS,
      actionLabel: "View",
      rows: () => HiremiData.buildUserRows(liveCount(2260, "seek-internships"), "sin"),
    },
    "seek-freshers": {
      title: "Fresher Job Seekers",
      subtitle: "Candidates currently seeking fresher roles.",
      columns: USER_COLUMNS,
      actionLabel: "View",
      rows: () => HiremiData.buildUserRows(liveCount(3870, "seek-freshers"), "sfr"),
    },
    "seek-experienced": {
      title: "Experienced Job Seekers",
      subtitle: "Candidates currently seeking experienced roles.",
      columns: USER_COLUMNS,
      actionLabel: "View",
      rows: () => HiremiData.buildUserRows(liveCount(1780, "seek-experienced"), "sex"),
    },

    "resolved-queries": {
      title: "Resolved Queries",
      subtitle: "Support queries and their resolution status.",
      columns: QUERY_COLUMNS,
      actionLabel: "View",
      rows: () => buildQueryRows(liveCount(860, "total-queries"), false),
    },

    "analytics": {
      title: "Analytics",
      subtitle: "Month-on-month growth across accounts, verification and downloads.",
      columns: [
        { key: "month", label: "Month" },
        { key: "newAccounts", label: "New Accounts" },
        { key: "verified", label: "Verified" },
        { key: "downloads", label: "App Downloads" },
      ],
      actionLabel: "View",
      rows: () => {
        const MONTHS = ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"];
        return MONTHS.map((month, i) => ({
          month,
          newAccounts: 120 + i * 14,
          verified: 80 + i * 11,
          downloads: 300 + i * 27,
        }));
      },
    },

    "companies": {
      title: "Total Companies",
      subtitle: "Companies with recruiter accounts on Hiremi.",
      columns: [
        { key: "name", label: "Company Name" },
        { key: "recruiters", label: "Recruiters" },
        { key: "jobsPosted", label: "Jobs Posted" },
        { key: "status", label: "Status" },
      ],
      actionLabel: "View",
      rows: () => {
        const total = liveCount(238, "companies-total");
        return Array.from({ length: total }, (_, i) => ({
          name: `${HiremiData.COMPANIES[i % HiremiData.COMPANIES.length]}${i >= HiremiData.COMPANIES.length ? ` ${Math.floor(i / HiremiData.COMPANIES.length) + 1}` : ""}`,
          recruiters: 2 + (i % 15),
          jobsPosted: 5 + (i % 40),
          status: i % 5 === 0 ? "Pending" : "Active",
        }));
      },
    },

    "project-report": {
      title: "Project Report",
      subtitle: "Generated reports across accounts, verification and programs.",
      columns: [
        { key: "reportName", label: "Report Name" },
        { key: "generatedOn", label: "Generated On" },
        { key: "records", label: "Records" },
        { key: "status", label: "Status" },
      ],
      actionLabel: "Download",
      rows: () => {
        const REPORTS = ["Account Growth", "Verification Summary", "State-wise Downloads", "Hiremi 360 Enrollment", "HR Recruiter Activity", "Opportunity Fill Rate", "Query Resolution"];
        return REPORTS.map((reportName, i) => ({
          reportName,
          generatedOn: `Jul ${(i % 28) + 1}, 2026`,
          records: 200 + i * 73,
          status: i % 3 === 0 ? "Processing" : "Ready",
        }));
      },
    },

    "admin-setting": {
      title: "Admin Setting",
      subtitle: "Super Admin and staff accounts with dashboard access.",
      columns: [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "email", label: "Email" },
        { key: "lastLogin", label: "Last Login" },
      ],
      actionLabel: "Manage",
      rows: () => {
        const ADMINS = [
          { name: "Super Admin", role: "Owner" },
          { name: "Priya Sharma", role: "Verification Manager" },
          { name: "Rahul Mehta", role: "HR Operations" },
          { name: "Ananya Iyer", role: "Support Lead" },
          { name: "Karthik Rao", role: "Content Manager" },
        ];
        return ADMINS.map((admin, i) => ({
          ...admin,
          email: `${admin.name.toLowerCase().replace(/\s+/g, ".")}@hiremi.com`,
          lastLogin: `Jul ${28 - i}, 2026 · 0${9 + i}:15`,
        }));
      },
    },
  };

  function init() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const config = CONFIGS[type];

    const titleEl = document.getElementById("pageTitle");
    const subtitleEl = document.getElementById("pageSubtitle");
    const countEl = document.getElementById("pageCount");
    const headEl = document.getElementById("dataTableHead");

    if (!config) {
      titleEl.innerHTML = `Section not found <span class="count" id="pageCount">(0)</span>`;
      subtitleEl.textContent = "This section doesn't have any data configured yet.";
      headEl.innerHTML = "";
      window.TABLE_CONFIG = { rows: [], columns: [], actionLabel: "View" };
      return;
    }

    const rows = config.rows();

    titleEl.innerHTML = `${config.title} <span class="count" id="pageCount">(${rows.length})</span>`;
    subtitleEl.textContent = config.subtitle;

    const headCells = [`<th>S.No.</th>`]
      .concat(config.columns.map((col) => `<th>${col.label}</th>`))
      .concat([`<th>Action</th>`])
      .join("");
    headEl.innerHTML = `<tr>${headCells}</tr>`;

    window.TABLE_CONFIG = {
      rows,
      columns: config.columns,
      actionLabel: config.actionLabel || "View",
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
