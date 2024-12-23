let jobForm = document.querySelector("#job-form");
let jobTable = document.querySelector("#job-table tbody");
let statusFilter = document.querySelector("#status-filter");

let jobs = [];

jobForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let title = document.querySelector("#job-title").value;
  let company = document.querySelector("#company-name").value;
  let status = document.querySelector("#job-status").value;

  jobs.push({ title, company, status });

  jobForm.reset();

  updateJobList();
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
      updateJobList();
    });

    actionsCell.appendChild(removeButton);
    row.appendChild(titleCell);
    row.appendChild(companyCell);
    row.appendChild(statusCell);
    row.appendChild(actionsCell);

    jobTable.appendChild(row);
  });
}

statusFilter.addEventListener("change", updateJobList);
