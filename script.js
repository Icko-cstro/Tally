const tableContainer = document.getElementById("table-container");
const rowsInput = document.getElementById("rows");
const applyRowsBtn = document.getElementById("applyRows");
const resetAllBtn = document.getElementById("resetAll");
const totalCountEl = document.getElementById("totalCount");

const subjectText = document.getElementById("subjectText");
const sectionText = document.getElementById("sectionText");

let rowCount = parseInt(localStorage.getItem("rowCount")) || 40;
let counts = JSON.parse(localStorage.getItem("counts")) || Array(rowCount).fill(0);

rowsInput.value = rowCount;

// Load subject & section
subjectText.textContent = localStorage.getItem("subject") || "Math";
sectionText.textContent = localStorage.getItem("section") || "A1";

// Save state
function saveState() {
  localStorage.setItem("rowCount", rowCount);
  localStorage.setItem("counts", JSON.stringify(counts));
  localStorage.setItem("subject", subjectText.textContent);
  localStorage.setItem("section", sectionText.textContent);
}

// Build table
function buildTable() {
  tableContainer.innerHTML = "";

  let column;
  counts.forEach((count, i) => {
    if (i % 10 === 0) {
      column = document.createElement("div");
      column.className = "column";

      const header = document.createElement("div");
      header.className = "table-header";
      header.innerHTML = `
        <div>No.</div>
        <div>Tally</div>
        <div>Add</div>
        <div>Minus</div>
      `;
      column.appendChild(header);
      tableContainer.appendChild(column);
    }

    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div>${i + 1}</div>
      <div class="count">${count}</div>
      <button class="btn add">➕</button>
      <button class="btn minus">➖</button>
    `;

    row.querySelector(".add").addEventListener("click", () => {
      counts[i]++;
      saveState();
      buildTable();
    });
    row.querySelector(".minus").addEventListener("click", () => {
      if (counts[i] > 0) counts[i]--;
      saveState();
      buildTable();
    });

    column.appendChild(row);
  });

  // Update total
  const total = counts.reduce((a, b) => a + b, 0);
  totalCountEl.textContent = total;
}

// Apply rows
applyRowsBtn.addEventListener("click", () => {
  rowCount = parseInt(rowsInput.value);
  counts = Array(rowCount).fill(0);
  saveState();
  buildTable();
});

// Reset all
resetAllBtn.addEventListener("click", () => {
  counts = Array(rowCount).fill(0);
  saveState();
  buildTable();
});

// Save subject & section when edited
subjectText.addEventListener("input", saveState);
sectionText.addEventListener("input", saveState);

// Initial render
buildTable();
