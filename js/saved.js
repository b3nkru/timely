// Retrieve existing schedules from localStorage or initialize an empty array
const schedules = JSON.parse(localStorage.getItem("schedules")) || [];
const calendarContainer = document.getElementById("calendarContainer");

// Helper function to convert "HH:MM" to minutes since midnight
function parseTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper to format "HH:MM" (24h) to "h:MM AM/PM"
function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

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

  // Collect classes per day, then sort by start time before rendering
  const classesByDay = {};
  daysOfWeek.forEach(day => classesByDay[day] = []);

  schedules.forEach((schedule) => {
    schedule.daysOfWeek.forEach((day) => {
      if (classesByDay[day] !== undefined) {
        classesByDay[day].push(schedule);
      }
    });
  });

  daysOfWeek.forEach((day) => {
    const classListContainer = document.getElementById(`classList-${day}`);
    const dayClasses = classesByDay[day].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

    if (dayClasses.length === 0) {
      classListContainer.innerHTML = `<p class="no-classes">No classes</p>`;
      return;
    }

    dayClasses.forEach((schedule) => {
      const classItem = document.createElement("div");
      classItem.classList.add("class-item");
      classItem.innerHTML = `
        <strong>${schedule.name}</strong>
        <p>${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}</p>
      `;
      classListContainer.appendChild(classItem);
    });
  });
}

// Display schedules on page load
displaySchedules();

// Handle "Clear Schedules" button click
document.getElementById("clearSchedulesButton").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all saved schedules?")) {
    localStorage.removeItem("schedules");
    location.reload();
  }
});
