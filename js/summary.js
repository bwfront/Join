/**
 * The token used for accessing the remote storage.
 * @constant {string}
 */
const STORAGE_TOKEN = "NQLX2MG4FBWCAU5TJ0U1IBY5YYSHNRXWPTWRDE2N";
/**
 * The URL used for accessing the remote storage API
 * @constant {String}
 */
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Global Variables for the different task counters
 *
 */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let tasks = [];
let urgentTaskCounter;
let urgentTaskDate = [];
let deadline = [];
let doneTasks;
let todo;
let tasksInBoard;
let tasksInProgress;
let tasksInAwaitingFeedback;
let users = [];
let today = new Date();
let hour = today.getHours();

/**
 * Initializes the summary by calling functions to fetch tasks and set counters.
 */

async function initSummary() {
  await getAllTasks("tasks");
  await setTaskCounters();
  await getUserNameForGreeting();
  setUserInitials();
  setGreetFormula();
}

/**
 * Fetches tasks data from the server.
 *
 * @param {string} key - The key for the data to fetch.
 */

async function getAllTasks(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  let json = await response.json();
  tasks = JSON.parse(json.data.value);
}

/**
 * Sets counters for different task categories.
 */
function setTaskCounters() {
  setTodo();
  setTaskDone();
  checkAndSetPrio();
  setTasksInBoard();
  setTaskInProgress();
  setTaskAwaitingFeedback();
}

/**
 * Sets the count of tasks in the 'todo' category and updates the DOM.
 */

function setTodo() {
  todo = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task["taskcon"] == "todo") {
      todo++;
    }
  }

  document.getElementById("tasks-todo").innerHTML = `${todo}`;
}

/**
 * Checks and sets the count of urgent priority tasks, as well as upcoming deadlines.
 */

function checkAndSetPrio() {
  urgentTaskCounter = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task["priority"] == "urgent" && task["taskcon"] != "done") {
      urgentTaskCounter++;
      urgentTaskDate.push(task["date"]);
    }
  }
  setUpcomingDeadline();
  document.getElementById("urgent-task-counter").innerHTML = urgentTaskCounter;
}

/**
 * Sets the count of tasks in the 'done' category and updates the DOM.
 */

function setTaskDone() {
  doneTasks = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]["taskcon"];
    if (task == ["done"]) {
      doneTasks++;
    }
  }
  document.getElementById("done-task-counter").innerHTML = `${doneTasks}`;
}

/**
 * Sets the upcoming deadline information based on the urgent tasks.
 */

function setUpcomingDeadline() {
  for (let i = 0; i < urgentTaskDate.length; i++) {
    const date = urgentTaskDate[i];
    deadline.push(parseInt(date.replaceAll("-", "")));
  }
  let nextDeadlineAsString;
  let nextDeadline = Math.min.apply(null, deadline);
  nextDeadlineAsString = nextDeadline.toString();
  let currentMonth = nextDeadlineAsString.substring(4, 6);
  let monthNameAsString = MONTHS[currentMonth - 1];
  let currentDay = nextDeadlineAsString.slice(-2);
  let currentYear = nextDeadlineAsString.slice(0, 4);
  let container = document.getElementById("urgent-date-container");
  if (monthNameAsString == undefined) {
    container.innerHTML = ``;
  } else {
    container.innerHTML = `${monthNameAsString} ${currentDay}, ${currentYear} `;
  }
}

/**
 * Sets the count of tasks currently in the board and updates the DOM.
 */

function setTasksInBoard() {
  tasksInBoard = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]["taskcon"];
    if (task != "done" || task) {
      tasksInBoard++;
    }
  }
  document.getElementById("tasks-in-board").innerHTML = `${tasksInBoard}`;
}

/**
 * Sets the count of tasks in progress and updates the DOM.
 */

function setTaskInProgress() {
  tasksInProgress = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]["taskcon"];
    if (task == "inprogress") {
      tasksInProgress++;
    }
  }
  document.getElementById("tasks-in-progress").innerHTML = `${tasksInProgress}`;
}

/**
 * Sets the count of tasks awaiting feedback and updates the DOM.
 */

function setTaskAwaitingFeedback() {
  tasksInAwaitingFeedback = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]["taskcon"];
    if (task == "awaitfeedback") {
      tasksInAwaitingFeedback++;
    }
  }
  document.getElementById("tasks-await-feedback").innerHTML = `${tasksInAwaitingFeedback}`;
}

/**
 * Sets the current name of the user to the greeting message
 */
async function getUserNameForGreeting() {
  let currentUserEmail = localStorage.getItem("email");
  await getData("users");
  //console.log(currentUserEmail);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (currentUserEmail === user["email"]) {
      document.getElementById("greeting-name").innerHTML = user["name"];
      localStorage.setItem("name", user["name"]);
    }
  }
}

/**
 *
 * @param {string} key - They key here ist 'users'
 * Getting all userdatas
 */

async function getData(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  let response = await fetch(url);
  let json = await response.json();
  users = JSON.parse(json.data.value);
}

/**
 * Sets the correct formula based on the actual time of the day.
 */

function setGreetFormula() {
  let container = document.getElementById("greeting-formula");
  if (hour >= 18 && hour >= 0) {
    container.innerHTML = "Good evening,";
  } else if (hour >= 12 && hour <= 18) {
    container.innerHTML = "Good afternoon,";
  } else if (hour >= 6 && hour <= 12) {
    container.innerHTML = "Good morning,";
  } else if (hour >= 0 && hour <= 6) {
    container.innerHTML = "Good night,";
  }
}
