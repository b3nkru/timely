// Retrieve existing schedules from localStorage or initialize an empty array
let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

// Handle form submission to save the schedule
document.getElementById("scheduleForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get input values from the form
  const scheduleName = document.getElementById("scheduleName").value.trim();
  const daysOfWeek = Array.from(document.querySelectorAll('input[name="day"]:checked')).map(cb => cb.value);
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  // Validate input
  if (!scheduleName || daysOfWeek.length === 0 || !startTime || !endTime) {
    alert("Please fill out all fields and select at least one day!");
    return;
  }

  // Convert times to comparable values
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (start >= end) {
    alert("Start time must be before end time!");
    return;
  }

  // Check for overlapping schedules
  for (const day of daysOfWeek) {
    const existingSchedulesForDay = schedules.filter(schedule => schedule.daysOfWeek.includes(day));
    for (const existingSchedule of existingSchedulesForDay) {
      const existingStart = parseTime(existingSchedule.startTime);
      const existingEnd = parseTime(existingSchedule.endTime);

      if (
        (start >= existingStart && start < existingEnd) || // Start overlaps
        (end > existingStart && end <= existingEnd) || // End overlaps
        (start <= existingStart && end >= existingEnd) // Full overlap
      ) {
        alert(`Conflict detected: ${scheduleName} overlaps with ${existingSchedule.name} on ${day}.`);
        return;
      }
    }
  }

  // Add the new schedule
  const newSchedule = {
    name: scheduleName,
    daysOfWeek: daysOfWeek, // Days the course occurs
    startTime: startTime,
    endTime: endTime,
  };
  schedules.push(newSchedule);

  // Save the updated schedules array to localStorage
  localStorage.setItem("schedules", JSON.stringify(schedules));

  // Clear the form fields
  document.getElementById("scheduleName").value = "";
  document.querySelectorAll('input[name="day"]').forEach(cb => cb.checked = false);
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";

  // Notify the user and redirect to the Saved Schedules page
  alert("Schedule saved successfully!");
  location.href = "saved.html";
});

// Helper function to convert "HH:MM" to minutes since midnight
function parseTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}