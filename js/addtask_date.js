/**
 * Give the Date Picker the min Value
 */
document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById("task-date-input").min = formattedDate;
  });