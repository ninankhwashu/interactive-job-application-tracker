let jobForm = document.getElementById("job-form");
let jobTableBody = document.querySelector("#job-table tbody");
let statusFilter = document.getElementById("status-filter");
let applicationsSection = document.getElementById("job-list");

let jobs = [];
try {
  let storedJobs = localStorage.getItem("jobs");
  jobs = storedJobs ? JSON.parse(storedJobs) : [];
} catch (err) {
  console.error("Error parsing jobs from localStorage:", err);
  jobs = [];
}

jobForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let title = document.getElementById("job-title").value.trim();
  let company = document.getElementById("company-name").value.trim();
  let status = document.getElementById("job-status").value;

  if (!title || !company) {
    showAlert("Please fill in all fields.", "error");
    return;
  }

  let newJob = { title, company, status };
  jobs.push(newJob);

  localStorage.setItem("jobs", JSON.stringify(jobs));

  jobForm.reset();

  updateJobList();

  showAlert("Job added successfully!", "success");
  applicationsSection.scrollIntoView({ behavior: "smooth" });
});

function updateJobList() {
  jobTableBody.innerHTML = "";

  let filteredJobs = jobs.filter((job) => {
    return statusFilter.value === "All" || job.status === statusFilter.value;
  });

  filteredJobs.forEach((job, index) => {
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
    removeButton.className = "remove-job";

    removeButton.addEventListener("click", () => {
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

    jobTableBody.appendChild(row);
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
    background-color: ${type === "success" ? "#2ecc71" : "#e74c3c"};
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    font-weight: bold;
    z-index: 1000;
    opacity: 0;
    animation: fadeInOut 3s ease forwards;
  `;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

statusFilter.addEventListener("change", updateJobList);

updateJobList();
