let jobForm = document.querySelector("#job-form");
let jobTable = document.querySelector("#job-table tbody");
let statusFilter = document.querySelector("#status-filter");
let applicationsSection = document.querySelector("#job-list");

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

jobForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let title = document.querySelector("#job-title").value;
  let company = document.querySelector("#company-name").value;
  let status = document.querySelector("#job-status").value;

  jobs.push({ title, company, status });

  localStorage.setItem("jobs", JSON.stringify(jobs));

  jobForm.reset();

  updateJobList();
  showAlert("Job added successfully!", "success");

  applicationsSection.scrollIntoView({ behavior: "smooth" });
});

function updateJobList() {
  jobTable.innerHTML = "";

  let filteredJobs = jobs.filter(function (job) {
    if (statusFilter.value === "All") return true;
    return job.status === statusFilter.value;
  });

  filteredJobs.forEach(function (job, index) {
    let row = document.createElement("tr");

    let titleCell = document.createElement("td");
    titleCell.textContent = job.title;

    let companyCell = document.createElement("td");
    companyCell.textContent = job.company;

    let statusCell = document.createElement("td");
    statusCell.textContent = job.status;

    let actionsCell = document.createElement("td");
    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-job");
    removeButton.addEventListener("click", function () {
      jobs.splice(index, 1);
      localStorage.setItem("jobs", JSON.stringify(jobs));
      updateJobList();
      showAlert("Job removed successfully!", "error");
    });

    actionsCell.appendChild(removeButton);
    row.appendChild(titleCell);
    row.appendChild(companyCell);
    row.appendChild(statusCell);
    row.appendChild(actionsCell);

    jobTable.appendChild(row);
  });
}

function showAlert(message, type) {
  let alert = document.createElement("div");
  alert.textContent = message;
  alert.className = `alert alert-${type}`;
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#2ecc71" : "#e74c3c"};
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: bold;
    z-index: 1000;
    opacity: 0;
    animation: fadeInOut 3s ease forwards;
  `;
  document.body.appendChild(alert);

  setTimeout(() => alert.remove(), 3000);
}

statusFilter.addEventListener("change", updateJobList);

updateJobList();
