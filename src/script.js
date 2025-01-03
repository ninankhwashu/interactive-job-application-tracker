// Grab references to DOM elements
let jobForm = document.getElementById("job-form");
let jobTableBody = document.querySelector("#job-table tbody");
let statusFilter = document.getElementById("status-filter");
let applicationsSection = document.getElementById("job-list");

// Load jobs from localStorage or initialize an empty array
let jobs = []; // Start with an empty array to initialize
try {
  let storedJobs = localStorage.getItem("jobs");
  jobs = storedJobs ? JSON.parse(storedJobs) : [];
} catch (err) {
  console.error("Error parsing jobs from localStorage:", err);
  jobs = [];
}

// Handle form submission to add a new job
jobForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the form from refreshing the whole page

  let title = document.getElementById("job-title").value.trim();
  let company = document.getElementById("company-name").value.trim();
  let status = document.getElementById("job-status").value;

  if (!title || !company) {
    showAlert("Please fill in all fields.", "error");
    return;
  }

  // Create a job object and add it to the array
  let newJob = { title, company, status };
  jobs.push(newJob);

  // Update localStorage
  localStorage.setItem("jobs", JSON.stringify(jobs));

  // Clear the form sections
  jobForm.reset();

  // Update the job list in the user interface
  updateJobList();

  // Notify the user and scroll to the list
  showAlert("Job added successfully!", "success");
  applicationsSection.scrollIntoView({ behavior: "smooth" });
});

// Function to update the job list display
function updateJobList() {
  // Clear the table
  jobTableBody.innerHTML = "";

  // Filter jobs based on selected filter
  let filteredJobs = jobs.filter((job) => {
    return statusFilter.value === "All" || job.status === statusFilter.value;
  });

  // Populate the table with filtered jobs
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

    // Add remove button functionality
    removeButton.addEventListener("click", () => {
      jobs.splice(index, 1);
      localStorage.setItem("jobs", JSON.stringify(jobs));
      updateJobList();
      showAlert("Job removed successfully!", "error");
    });

    actionsCell.appendChild(removeButton);

    // Append cells to the row
    row.appendChild(titleCell);
    row.appendChild(companyCell);
    row.appendChild(statusCell);
    row.appendChild(actionsCell);

    // Append the row to the table body
    jobTableBody.appendChild(row);
  });
}

// Function to display alerts for feedback
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

// Filter jobs when the filter changes
statusFilter.addEventListener("change", updateJobList);

// Initial rendering of the job list
updateJobList();
