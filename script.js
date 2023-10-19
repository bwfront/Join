/* Board Script // ADD TASK */
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
let priority = "low";

let subtask = [];
let subtaskready = [];
let taskcon = "todo";

/**
 * Creates a task using input values from the DOM, then saves it to the remote storage.
 * @async
 * @returns {Promise<void>}
 */
async function createTask() {
  const tasks = (await getItem("tasks")) || [];
  const id = tasks.length;
  const title = document.getElementById("task-title-input").value;
  const description = document.getElementById("task-description-input").value;
  const date = document.getElementById("task-date-input").value;
  const contact = document.getElementById("assigned_contact").value;
  const category = document.getElementById("task-category-input").value;
  const task = {
    id,
    title,
    description,
    date,
    contact,
    category,
    priority,
    taskcon,
    subtask,
    subtaskready,
  };
  tasks.push(task);
  await setItem("tasks", tasks);
  priority = "low";
  subtask = [];
  document.getElementById("task-form").reset();
}

/**
 * Saves an item to remote storage.
 * @async
 * @param {string} key - Key to store the item under.
 * @param {*} value - Value to store.
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
 * Sets up the boards for task management.
 */
function setBoards() {
  setBoard("todo");
  setBoard("awaitfeedback");
  setBoard("inprogress");
  setBoard("done");
}
/**
 * Retrieves and displays tasks from remote storage.
 * @async
 * @param {string} id - Identifier for the task board section (e.g. 'todo', 'inprogress').
 * @returns {Promise<void>}
 */
async function setBoard(id) {
  const tasks = await getItem("tasks");
  let todo = tasks.filter((t) => t["taskcon"] == id);
  document.getElementById(`desktop-${id}`).innerHTML = "";
  if (todo && todo.length > 0) {
    todo.forEach((task) => {
      setBoardHTML(
        task.category,
        task.title,
        task.description,
        task.priority,
        `desktop-${id}`,
        task.id
      );
      setSubtasksHTML(task.subtask, task.subtaskready, task.id);
    });
  } else {
    inputEmptyHTML(id);
  }
  dragLoader();
}

/**
 * Checks if Subtask exist and Implement them
 * @param {Array} subtask - Subtask Array
 * @param {Array} subtaskready - Subtask with the checked Subtasks
 */
function setSubtasksHTML(subtask, subtaskready, id) {
  if (subtask.length > 0) {
    document.getElementById(`task-subtasks${id}`).innerHTML = `
    <div class="subtasks-progress></div>
    <div class="task-subtasks-text" id="task-subtasks-text">${getSharedSubtasksCount(
      subtask,
      subtaskready
    )}/${subtask.length} Subtasks</div>
    `;
  }
}

/**
 * Filter subtaskArray to only include subtasks that are also in subtaskReadyArray
 * @param {Array} subtaskArray - Subtask Array
 * @param {Array} subtaskReadyArray - Subtask with the checked Subtasks
 * @returns
 */
function getSharedSubtasksCount(subtaskArray, subtaskReadyArray) {
  const sharedSubtasks = subtaskArray.filter((subtask) =>
    subtaskReadyArray.includes(subtask)
  );
  return sharedSubtasks.length;
}

/**
 * Give the Empty Container with the id the content and innner it in the Container
 * @param {string} id - Identifier for the task board section (e.g. 'todo', 'inprogress').
 */
function inputEmptyHTML(id) {
  let container;
  if (id == "todo") {
    container = "To Do";
  } else if (id == "awaitfeedback") {
    container = "Await feedback";
  } else if (id == "inprogress") {
    container = "In progress";
  } else if (id == "done") {
    container = "Done";
  }
  document.getElementById(
    `desktop-${id}`
  ).innerHTML = `<div class="desktop-todo-empty">No Task ${container}</div>`;
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
 * @param {Element} clickedButton
 */
function getPrio(prio, clickedButton) {
  const buttons = document.querySelectorAll(".btn-prio");

  switch (prio) {
    case "urgent":
      priority = "urgent";
      break;
    case "medium":
      priority = "medium";
      break;
    case "low":
      priority = "low";
      break;
    default:
      priority = "low";
  }

  buttons.forEach((button) => {
    button.classList.remove("selected");
  });

  clickedButton.classList.add("selected");
}

/**
 * Renders a task on the board.
 * @param {string} category - Task category.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} prio - Task priority.
 * @param {string} idcon - DOM element ID for the container.
 * @param {number} id - Task ID.
 */
function setBoardHTML(category, title, description, prio, idcon, id) {
  const todo = document.getElementById(idcon);
  todo.innerHTML += `
  <div class="task" id="task" draggable="true" ondragstart="startDragging(${id})" onclick="openTask(${id})">
  <span class="category" id="category">${category}</span>
  <div class="task-heading" id="task-heading">${title}</div>
  <div class="task-description" id="task-description">${description}</div>
  <div class="task-subtasks" id="task-subtasks${id}">
  </div>
  <div class="task-footer" id="task-footer">
      <div class="task-profile" id="task-profile">
          <div class="profile" id="profile">US</div>
      </div>
      <div id="task-important"><img src="./assets/img/prio${prio}.png" alt="important"></div>
  </div>
</div>
`;
}

/**
 * this function adds a subtask
 */

function addSubTask() {
  let subTaskInput = document.getElementById("subtask-title-input").value;
  if (subTaskInput !== "") {
    subtask.push(subTaskInput);
  }
  if (subTaskInput.trim() !== "") {
    const subTaskList = document.getElementById("subtask-container");

    const subTaskItemHTML = `
      <div class="subtask-list">
        <input type="checkbox" />
        <span>${subTaskInput}</span>
      </div>
    `;

    subTaskList.innerHTML += subTaskItemHTML;

    document.getElementById("subtask-title-input").value = "";
  }
}

/*
 * this function clears the inputs
 */
function clearTask() {
  const titleInput = document.getElementById("task-title-input");
  const descriptionInput = document.getElementById("task-description-input");
  const dateInput = document.getElementById("task-date-input");
  const assignedContact = document.getElementById("assigned_contact");
  const categoryInput = document.getElementById("task-category-input");
  const subtaskTitleInput = document.getElementById("subtask-title-input");
  const subtaskContainer = document.getElementById("subtask-container");

  titleInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  assignedContact.selectedIndex = 0;
  categoryInput.selectedIndex = 0;
  subtaskTitleInput.value = "";
  subtaskContainer.innerHTML = "";
}