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

let tasks = [];
let urgentTaskCounter;

async function initSummary() {
  await getAllTasks('tasks');
  setTaskCounters();
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
    if (task['priority'] == 'urgent') {
      urgentTaskCounter++;
    }
  }
  document.getElementById('urgent-task-counter').innerHTML = urgentTaskCounter;
}