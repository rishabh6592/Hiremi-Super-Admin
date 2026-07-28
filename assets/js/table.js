/* ==========================================================================
   Hiremi Super Admin — table.js
   Generic paginated/searchable table renderer. Each page provides a
   `window.TABLE_CONFIG` object before this script runs (see the individual
   *-users.html pages for examples), so the markup + rendering logic only
   has to live in one place.
   ========================================================================== */

/* ---- Shared "View" detail modal -----------------------------------------
   Every listing page renders an action button (View / Edit / Manage /
   Download) per row via TABLE_CONFIG. This builds one modal per page,
   lazily, and wires a click handler onto each action button so clicking it
   actually surfaces that row's full data instead of doing nothing.
   ---------------------------------------------------------------------- */
function hiremiEnsureDetailModal() {
  let backdrop = document.getElementById("viewModalBackdrop");
  if (backdrop) return backdrop;

  backdrop = document.createElement("div");
  backdrop.className = "view-modal-backdrop";
  backdrop.id = "viewModalBackdrop";
  backdrop.innerHTML = `
    <div class="view-modal" role="dialog" aria-modal="true" aria-labelledby="viewModalTitle">
      <div class="view-modal__head">
        <h3 id="viewModalTitle">Record Details</h3>
        <button type="button" class="view-modal__close" aria-label="Close">&times;</button>
      </div>
      <div class="view-modal__body" id="viewModalBody"></div>
    </div>`;
  document.body.appendChild(backdrop);

  function close() {
    backdrop.classList.remove("show");
  }
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector(".view-modal__close").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  return backdrop;
}

function hiremiPrettifyKey(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function hiremiOpenDetailModal(row, columns, heading) {
  const backdrop = hiremiEnsureDetailModal();
  const title = document.getElementById("viewModalTitle");
  const body = document.getElementById("viewModalBody");

  title.textContent = row.name || row.state || row.title || row.reportName || row.category || heading || "Record Details";

  const cols = columns && columns.length ? columns : Object.keys(row).map((key) => ({ key, label: hiremiPrettifyKey(key) }));
  body.innerHTML = cols
    .map((col) => {
      const label = col.label || hiremiPrettifyKey(col.key);
      const value = row[col.key];
      return `<div class="view-modal__row"><span>${label}</span><span>${value === undefined || value === null || value === "" ? "--" : value}</span></div>`;
    })
    .join("");

  backdrop.classList.add("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const config = window.TABLE_CONFIG;
  if (!config) return;

  const rowsPerPage = config.rowsPerPage || 8;
  let currentPage = 1;
  let query = "";

  const tableBody = document.getElementById("dataTableBody");
  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("searchBtn");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const pageNumbers = document.getElementById("pageNumbers");
  const pageInput = document.getElementById("page-input");
  const goBtn = document.querySelector(".go-btn");

  function getFiltered() {
    if (!query) return config.rows;
    const q = query.toLowerCase();
    return config.rows.filter((row) =>
      config.columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(q))
    );
  }

  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * rowsPerPage;
    const pageRows = filtered.slice(start, start + rowsPerPage);

    if (pageRows.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="${config.columns.length + 2}" class="empty-state">No matching records found.</td></tr>`;
    } else {
      tableBody.innerHTML = pageRows
        .map((row, i) => {
          const cells = config.columns
            .map((col) => `<td>${row[col.key] ?? "--"}</td>`)
            .join("");
          return `<tr><td>${start + i + 1}</td>${cells}<td><button type="button" class="view-btn" data-row-index="${i}">${config.actionLabel || "View"}</button></td></tr>`;
        })
        .join("");

      tableBody.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const row = pageRows[Number(btn.dataset.rowIndex)];
          if (row) hiremiOpenDetailModal(row, config.columns, config.actionLabel);
        });
      });
    }

    renderPageNumbers(totalPages);
  }

  function renderPageNumbers(totalPages) {
    if (!pageNumbers) return;
    const pages = [];
    const windowSize = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + windowSize - 1);
    startPage = Math.max(1, endPage - windowSize + 1);

    for (let p = startPage; p <= endPage; p++) pages.push(p);

    pageNumbers.innerHTML = pages
      .map((p) => `<button type="button" class="page-btn${p === currentPage ? " active" : ""}" data-page="${p}">${p}</button>`)
      .join("");

    pageNumbers.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentPage = Number(btn.dataset.page);
        render();
      });
    });
  }

  searchBtn?.addEventListener("click", () => {
    query = searchInput.value.trim();
    currentPage = 1;
    render();
  });

  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      query = searchInput.value.trim();
      currentPage = 1;
      render();
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      render();
    }
  });

  nextBtn?.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(getFiltered().length / rowsPerPage));
    if (currentPage < totalPages) {
      currentPage += 1;
      render();
    }
  });

  goBtn?.addEventListener("click", () => {
    const target = Number(pageInput.value);
    const totalPages = Math.max(1, Math.ceil(getFiltered().length / rowsPerPage));
    if (target >= 1 && target <= totalPages) {
      currentPage = target;
      render();
    }
  });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.dataset.sort === "date") {
        config.rows = [...config.rows].reverse();
      }
      currentPage = 1;
      render();
    });
  });

  const yearIcon = document.getElementById("passingYearIcon");
  const yearDropdown = document.getElementById("passingYearDropdown");
  if (yearIcon && yearDropdown) {
    yearIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      yearDropdown.classList.toggle("show");
    });
    yearDropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const year = link.textContent.trim();
        query = year;
        searchInput.value = year;
        currentPage = 1;
        render();
        yearDropdown.classList.remove("show");
      });
    });
    document.addEventListener("click", () => yearDropdown.classList.remove("show"));
  }

  render();
});
