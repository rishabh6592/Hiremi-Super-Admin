/* ==========================================================================
   Hiremi Super Admin — data.js
   Sample/demo data generators shared by the listing pages. Swap these for
   real API calls when a backend is wired up — every page only depends on
   the shape of the returned rows, not on how they're produced.
   ========================================================================== */

(function (window) {
  const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
    "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ];
  const DEGREES = ["Agricultural Science", "Computer Science", "Mechanical Engineering", "Commerce", "Electronics"];
  const COLLEGES = ["OIST", "ABC Institute of Tech", "Sunrise College", "Metro University", "Delta Polytechnic"];
  const COMPANIES = ["Zenith Softwares", "Bluepeak Technologies", "Orbit Consulting", "Nimbus Retail", "Vertex Logistics", "Skyline Finserv"];
  const DESIGNATIONS = ["HR Executive", "Talent Acquisition Lead", "HR Manager", "Recruiter", "HRBP"];
  const DOMAINS = ["Web Development", "Data Science", "Digital Marketing", "UI/UX Design", "Cloud Computing", "Cybersecurity", "Mobile App Development", "Business Analytics"];
  const BRANCHES = ["Computer Science", "Information Technology", "Electronics & Communication", "Mechanical", "Civil", "Electrical", "Chemical", "Biotechnology"];
  const PASSING_YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

  function pad(n, len) {
    return String(n).padStart(len, "0");
  }

  function buildUserRows(count, statusPrefix) {
    const rows = [];
    for (let i = 1; i <= count; i++) {
      rows.push({
        uid: `${(statusPrefix || "USR").slice(0, 3).toUpperCase()}-${pad(i, 4)}`,
        name: `User ${i}`,
        email: `user${i}@mail.com`,
        phone: `9165${pad(i, 6)}`,
        whatsapp: `9165${pad(i, 6)}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        degree: DEGREES[i % DEGREES.length],
        birthplace: STATES[i % STATES.length],
        college: COLLEGES[i % COLLEGES.length],
        collegeState: STATES[(i + 1) % STATES.length],
        passingYear: 2020 + (i % 5),
        createdAt: `Jan ${(i % 28) + 1}, 2025 · 15:59`,
      });
    }
    return rows;
  }

  function buildStateRows() {
    return STATES.map((state, i) => {
      const verified = 200 + i * 37;
      const notVerified = 60 + i * 11;
      const downloads = verified + notVerified + i * 5;
      return {
        state,
        verified,
        notVerified,
        downloads,
      };
    });
  }

  function buildHrRows(count, prefix) {
    const rows = [];
    for (let i = 1; i <= count; i++) {
      rows.push({
        uid: `${(prefix || "HR").slice(0, 3).toUpperCase()}-${pad(i, 4)}`,
        name: `Recruiter ${i}`,
        company: COMPANIES[i % COMPANIES.length],
        email: `recruiter${i}@mail.com`,
        phone: `8871${pad(i, 6)}`,
        designation: DESIGNATIONS[i % DESIGNATIONS.length],
        status: i % 3 === 0 ? "Pending" : "Active",
        createdAt: `Feb ${(i % 28) + 1}, 2025 · 11:20`,
      });
    }
    return rows;
  }

  function buildCategoryRows(list, seedTotal) {
    return list.map((label, i) => ({
      category: label,
      count: (seedTotal || 400) + i * 53,
    }));
  }

  window.HiremiData = {
    buildUserRows, buildStateRows, buildHrRows, buildCategoryRows,
    STATES, DEGREES, COLLEGES, COMPANIES, DESIGNATIONS, DOMAINS, BRANCHES, PASSING_YEARS,
  };
})(window);
