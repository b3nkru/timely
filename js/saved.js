// Retrieve existing schedules from localStorage or initialize an empty array
const schedules = JSON.parse(localStorage.getItem("schedules")) || [];
const calendarContainer = document.getElementById("calendarContainer");

// Function to display schedules in a calendar view
function displaySchedules() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Clear previous calendar
  calendarContainer.innerHTML = "";

  // Create the calendar structure
  daysOfWeek.forEach((day) => {
    const dayContainer = document.createElement("div");
    dayContainer.classList.add("day-container");
    dayContainer.innerHTML = `
      <h3>${day}</h3>
      <div class="class-list" id="classList-${day}"></div>
    `;
    calendarContainer.appendChild(dayContainer);
  });

  // Populate the calendar with schedules
  schedules.forEach((schedule) => {
    schedule.daysOfWeek.forEach((day) => {
      const classListContainer = document.getElementById(`classList-${day}`);
      if (classListContainer) {
        const classItem = document.createElement("div");
        classItem.classList.add("class-item");
        classItem.innerHTML = `
          <strong>${schedule.name}</strong>
          <p>${schedule.startTime} - ${schedule.endTime}</p>
        `;
        classListContainer.appendChild(classItem);
      }
    });
  });
}

// Display schedules on page load
displaySchedules();

// Handle "Clear Schedules" button click
document.getElementById("clearSchedulesButton").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all saved schedules?")) {
    localStorage.removeItem("schedules");
    alert("All schedules have been cleared.");
    location.reload(); // Refresh the page to reflect changes
  }
});

