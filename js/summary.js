/**
 * The token used for accessing the remote storage.
 * @constant {string}
 */
const STORAGE_TOKEN = '0BPXH9KOB3KK14LPEUWH02NBW7QT7YIO3LQDS7R4';
/**
 * The URL used for accessing the remote storage API
 * @constant {String}
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Global Variables for the different task counters
 *
 */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let tasks = [];
let urgentTaskCounter;
let urgentTaskDate = [];
let deadline = [];
let doneTasks;

async function initSummary() {
  await getAllTasks('tasks');
  setTaskCounters();
  setTaskDone();
}

async function getAllTasks(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  let json = await response.json();
  tasks = JSON.parse(json.data.value);
}

function setTaskCounters() {
  checkAndSetPrio();
  document.getElementById('tasks-todo').innerHTML = tasks.length;
}

function checkAndSetPrio() {
  urgentTaskCounter = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task['priority'] == 'urgent' && task['taskcon'] != 'done') {
      urgentTaskCounter++;
      urgentTaskDate.push(task['date']);
    }
  }
  setUpcomingDeadline();
  document.getElementById('urgent-task-counter').innerHTML = urgentTaskCounter;
}

function setTaskDone() {
  doneTasks = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]['taskcon'];
    if (task == ['done']) {
      doneTasks++;
    }
  }
  document.getElementById('done-task-counter').innerHTML = `${doneTasks}`;
}

function setUpcomingDeadline() {
  //if (tasks[i]['priority'] != 'urgendt' || tasks[i]['taskcon'] != 'done')
  for (let i = 0; i < urgentTaskDate.length; i++) {
    const date = urgentTaskDate[i];
    deadline.push(parseInt(date.replaceAll('-', '')));
  }
  let nextDeadlineAsString;
  let nextDeadline = Math.min.apply(null, deadline);
  nextDeadlineAsString = nextDeadline.toString();
  let currentMonth = nextDeadlineAsString.substring(4, 6);
  let monthNameAsString = MONTHS[currentMonth - 1];
  let currentDay = nextDeadlineAsString.slice(-2);
  let currentYear = nextDeadlineAsString.slice(0, 4);
  document.getElementById('urgent-date-container').innerHTML = `${monthNameAsString} ${currentDay}, ${currentYear} `;
}
