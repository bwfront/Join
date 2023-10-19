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
let priority = "unset";

let startDragPosition;

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
  let taskcon = "todo";
  const task = {
    id,
    title,
    description,
    date,
    contact,
    category,
    priority,
    taskcon,
  };
  tasks.push(task);
  await setItem("tasks", tasks);
  priority = "low";

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
    });
  } else {
    inputEmptyHTML(id);
  }
  dragLoader();
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
 * Delete a task
 * * @param {number} id - Task ID.
 */

async function deleteTask(id) {
  const tasks = await getItem("tasks");
  const updatedTasks = tasks.filter((task) => task.id !== id);
  await setItem("tasks", updatedTasks);
  setBoards();
  closeTaskPopUp();
}

/**
 * this function adds a subtask
 */

function addSubTask() {
  let subTaskInput = document.getElementById("subtask-title-input").value;

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

/**
 * Sets the ID of the task being dragged.
 * @param {number} id - Task ID.
 */
function startDragging(id) {
  startDragPosition = id;
}

/**
 * Moves the task to a specified board container.
 * @async
 * @param {string} con - Target board container identifier.
 * @returns {Promise<void>}
 */
async function moveTo(con) {
  let task = await getItem("tasks");
  task[startDragPosition].taskcon = con;
  await setItem("tasks", task);
  setBoards();
}

/**
 * Sets the ID of the task being dragged.
 * @param {number} id - Task ID.
 */
function startDragging(id) {
  startDragPosition = id;
}

/**
 * Moves the task to a specified board container.
 * @async
 * @param {string} con - Target board container identifier.
 * @returns {Promise<void>}
 */
async function moveTo(con) {
  let task = await getItem("tasks");
  task[startDragPosition].taskcon = con;
  await setItem("tasks", task);
  setBoards();
}

/**
 * Initializes drag-and-drop functionality for tasks on the board.
 */
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
  dragDropFun(dragTasks, containers);
}

/**
 * Sets up drag-and-drop behavior for tasks and their containers.
 * @param {NodeList} dragTasks - List of draggable tasks.
 * @param {Array} containers - Array of task board containers.
 */
function dragDropFun(dragTasks, containers) {
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
      const afterElement = getDragAfterElement(container, e.clientY);
      const dragTask = document.querySelector(".dragging");
      if (afterElement == null) {
        container.appendChild(dragTask);
      } else {
        container.insertBefore(dragTask, afterElement);
      }
    });
  });
}

/**
 * Determines the drag position relative to other tasks in the container.
 * @param {Element} container - Board section containing tasks.
 * @param {number} y - Current y-coordinate of the dragged task.
 * @returns {Element|null} - The draggable task element immediately below the current y-coordinate.
 */
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

/**
 * Get the data from to clicked Task
 * @param {number} id
 */
async function openTask(id) {
  let tasks = await getItem("tasks");
  let task = tasks[id];
  innerTaskPopUp(task);
  innerPopUpFooter(id);
  openTaskPopUp();
}

/**
 * Give getTaskPopUpHTMl the data and htmlid
 * @param {Array} task
 */
function innerTaskPopUp(task) {
  getTaskPopUpHTML("title", task.title);
  getTaskPopUpHTML("date", task.date);
  getTaskPopUpHTML("description", task.description);
  getTaskPopUpPrioHTML("priority", task.priority);
  //getTaskPopUpHTML('contact', task.contact);
  //getTaskPopUpHTML('subtask', task.subtask);
}

function innerPopUpFooter(id) {
  document.getElementById("popup-footer").innerHTML = ` 
  <div class="popup-delete" onclick="deleteTask(${id})"><img class="popup-delete-img" src="./assets/img/deletepopup.png" alt="delete" onclick="deleteTask(${id})">Delete</div>
  |
  <div class="popup-edit" onclick="editTask(${id})"><img class="popup-edit-img" src="./assets/img/editpopup.png" alt="edit">Edit</div>`;
}

/**
 * Inner the data from the array in the PopUp
 * @param {String} htmlid - The HTML id="htmlid" from the object
 * @param {Array} task - The Array from the clicked Task
 */
function getTaskPopUpHTML(htmlid, task) {
  document.getElementById(`popup-${htmlid}`).innerHTML = task;
}

/**
 * Set Display to flex and add Slide In Animation class
 */
function openTaskPopUp() {
  const popupbackground = document.getElementById(
    "desktop-task-popup-container"
  );
  const popupconatiner = document.getElementById("desktop-task-popup");
  popupbackground.style.display = "flex";
  popupconatiner.classList.remove("popup-slideout");
  popupconatiner.classList.add("popup-slidein");
}
function getTaskPopUpPrioHTML(htmlid, task) {
  document.getElementById(
    `popup-${htmlid}`
  ).innerHTML = `${task} <img class="popup-prio-img" id="popup-prio-img" src="./assets/img/prio${task}.png"
  alt="priority">`;
}

/**
 * Set Display to none and add Slide Out Animation class
 */
function closeTaskPopUp() {
  const popupbackground = document.getElementById(
    "desktop-task-popup-container"
  );
  const popupconatiner = document.getElementById("desktop-task-popup");
  popupconatiner.classList.remove("popup-slidein");
  popupconatiner.classList.add("popup-slideout");
  setTimeout(() => {
    popupbackground.style.display = "none";
  }, 300);
}
