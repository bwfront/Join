/* Board Script // ADD TASK */

/**
 * Delete All Tasks For now:
 * console:
 * setItem('tasks', []);
 */

/**
 * The token used for accessing the remote storage.
 * @constant {string}
 */
const STORAGE_TOKEN = "0BPXH9KOB3KK14LPEUWH02NBW7QT7YIO3LQDS7R4";
/**
 * The URL used for accessing the remote storage API
 * @constant {String}
 */
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * The priority level for the task. Default to 'unset'.
 * @type {string}
 */
let priority = "unset";

/**
 * Creates a task using input values from the DOM, then saves it to the remote storage.
 * @async
 * @returns {Promise<void>}
 */
async function createTask() {
  const title = document.getElementById("task-title-input").value;
  const description = document.getElementById("task-description-input").value;
  const date = document.getElementById("task-date-input").value;
  const contact = document.getElementById("assigned_contact").value;
  const category = document.getElementById("task-category-input").value;
  const task = { title, description, date, contact, category, priority };
  const tasks = (await getItem("tasks")) || [];
  tasks.push(task);
  await setItem("tasks", tasks);
  priority = "unset";
}

/**
 * Sets an item in the remote storage.
 * @async
 * @param {string} key - The key under which the item should be stored.
 * @param {*} value - The value to be stored.
 * @returns {Promise<void>}
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  await fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * Retrieves and renders tasks from the remote storage.
 * @async
 * @returns {Promise<void>}
 */
async function setBoard() {
  const tasks = await getItem("tasks");
  if (tasks && tasks.length > 0) {
    for await (let task of tasks) {
      setBoardHTML(task.category, task.title, task.description, task.priority);
    }
  }
  dragLoader();
}

/**
 * Retrieves an item from the remote storage.
 * @async
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<*>} - The retrieved value.
 * @throws {Error} Throws an error if the HTTP request fails.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  if (response.status === 404) {
    return [];
  }
  if (!response.ok) {
    console.error(response.status);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return JSON.parse(data.data.value);
}

/**
 * Sets the priority level based on the provided string.
 * @param {string} prio - The priority level string. Expected values: "urgent", "medium", "low".
 */
function getPrio(prio) {
  if (prio == "urgent") {
    priority = "urgent";
  } else if (prio == "medium") {
    priority = "medium";
  } else if (prio == "low") {
    priority = "low";
  } else {
    priority = "low";
  }
}

/**
 * Renders a task in the DOM.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} prio - The priority level of the task.
 */
function setBoardHTML(category, title, description, prio) {
  const todo = document.getElementById("desktop-todo");
  todo.innerHTML += `
    <div class="task" id="task" draggable="true">
        <span id="category">${category}</span>
        <div id="task-heading">${title}</div>
        <div id="task-description">${description}</div>
        <div id="task-footer">
            <div id="task-profile">
                <div id="profile">US</div>
            </div>
            <div id="task-important"><img src="./assets/img/prio${prio}.png" alt="important"></div>
        </div>
    </div>
    `;
}

/**DRAG object */

function dragLoader() {
  const dragTasks = document.querySelectorAll(".task");
  const todoContainer = document.getElementById("desktop-todo");
  const awaitContainer = document.getElementById("desktop-awaitfeedback");
  const progressContainer = document.getElementById("desktop-inprogress");
  const doneContainer = document.getElementById("desktop-done");
  const containers = [
    todoContainer,
    awaitContainer,
    progressContainer,
    doneContainer,
  ];
  dragTasks.forEach((dragTask) => {
    dragTask.addEventListener("dragstart", () => {
      dragTask.classList.add("dragging");
    });
    dragTask.addEventListener("dragend", () => {
      dragTask.classList.remove("dragging");
    });
  });
  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragTask = document.querySelector(".dragging");
      container.appendChild(dragTask);
    });
  });
}
