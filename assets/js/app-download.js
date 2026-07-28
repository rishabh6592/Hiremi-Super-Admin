document.addEventListener("DOMContentLoaded", () => {
  const rows = HiremiData.buildStateRows();
  const tbody = document.getElementById("stateTableBody");

  const STATE_COLUMNS = [
    { key: "state", label: "State Name" },
    { key: "verified", label: "Verified Users" },
    { key: "notVerified", label: "Non-Verified Users" },
    { key: "downloads", label: "App Downloads" },
  ];

  function render(data) {
    tbody.innerHTML = data
      .map(
        (row, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${row.state}</td>
          <td>${row.verified.toLocaleString()}</td>
          <td>${row.notVerified.toLocaleString()}</td>
          <td>${row.downloads.toLocaleString()}</td>
          <td><button type="button" class="view-btn" data-row-index="${i}">View</button></td>
        </tr>`
      )
      .join("");

    tbody.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = data[Number(btn.dataset.rowIndex)];
        if (row && window.hiremiOpenDetailModal) window.hiremiOpenDetailModal(row, STATE_COLUMNS);
      });
    });
  }

  render(rows);

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const metric = btn.dataset.metric;
      const sorted = metric ? [...rows].sort((a, b) => b[metric] - a[metric]) : rows;
      render(sorted);
    });
  });

  document.querySelector(".download-btn")?.addEventListener("click", () => {
    alert("This demo button would trigger the app download / share link in production.");
  });
});
