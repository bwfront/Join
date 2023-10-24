/* Board Script // ADD TASK */
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
 * The priority level for the task. Default to 'unset'.
 * @type {string}
 */
let priority = 'low';

let subtask = [];
let subtaskready = [];
let taskcon = getTaskon();
let statusPopUp = 'open';

/**
 * Creates a task using input values from the DOM, then saves it to the remote storage.
 * @async
 * @returns {Promise<void>}
 */
async function createTask() {
  const tasks = (await getItem('tasks')) || [];
  const id = Date.now();
  const title = document.getElementById('task-title-input').value;
  const description = document.getElementById('task-description-input').value;
  const date = document.getElementById('task-date-input').value;
  const contact = document.getElementById('assigned_contact').value;
  const category = document.getElementById('task-category-input').value;
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
  await setItem('tasks', tasks);
  setTaskcon('todo');
  priority = 'low';
  subtask = [];
  document.getElementById('task-form').reset();
}

/**
 * Get taskcon out the local Storage
 * @returns - the selected taskcon out the localStorage
 */
function getTaskon() {
  return localStorage.getItem('selctTaskCon');
}

/**
 * @param {String} con - The Selected Container
 * Save the selected taskcon in the localStorage
 */
function setTaskcon(con) {
  localStorage.setItem('selctTaskCon', con);
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
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * Sets up the boards for task management.
 */
function setBoards() {
  setBoard('todo');
  setBoard('awaitfeedback');
  setBoard('inprogress');
  setBoard('done');
}
/**
 * Retrieves and displays tasks from remote storage.
 * @async
 * @param {string} id - Identifier for the task board section (e.g. 'todo', 'inprogress').
 * @returns {Promise<void>}
 */

let TASKS = [];

async function setBoard(id) {
  const tasks = await getItem('tasks');
  TASKS = tasks;
  let todo = tasks.filter((t) => t['taskcon'] == id);
  document.getElementById(`desktop-${id}`).innerHTML = '';
  if (todo && todo.length > 0) {
    todo.forEach((task) => {
      setBoardHTML(task.category, task.title, task.description, task.priority, `desktop-${id}`, task.id);
      setSubtasksHTML(task.subtask, task.subtaskready, task.id, task.category);
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
function setSubtasksHTML(subtask, subtaskready, id, category) {
  if (subtask.length > 0) {
    document.getElementById(`task-subtasks${id}`).innerHTML = `
    <div class="subtasks-progress-container">
      <div class="subtasks-progress" id="subtasks-progress${id}" style="background-color: ${categoryColor(category)}; width: ${calculatePercentagSubtask(
      getSharedSubtasksCount(subtask, subtaskready),
      subtask.length
    )}% !important">
    </div>
    </div>
    <div class="task-subtasks-text" id="task-subtasks-text">${getSharedSubtasksCount(subtask, subtaskready)}/${subtask.length} Subtasks</div>
    `;
  }
}

/**
 * @param {number} subtask - The ammount of the Subtasks
 * @param {number} subtaskready - The ammount of the Ready Subtasks
 * @returns
 */
function calculatePercentagSubtask(subtaskready, subtask) {
  if (subtask > 0) {
    return (subtaskready / subtask) * 100;
  }
}

/**
 * Filter subtaskArray to only include subtasks that are also in subtaskReadyArray
 * @param {Array} subtaskArray - Subtask Array
 * @param {Array} subtaskReadyArray - Subtask with the checked Subtasks
 * @returns
 */
function getSharedSubtasksCount(subtaskArray, subtaskReadyArray) {
  const sharedSubtasks = subtaskArray.filter((subtask) => subtaskReadyArray.includes(subtask));
  return sharedSubtasks.length;
}

/**
 * Give the Empty Container with the id the content and innner it in the Container
 * @param {string} id - Identifier for the task board section (e.g. 'todo', 'inprogress').
 */
function inputEmptyHTML(id) {
  let container;
  if (id == 'todo') {
    container = 'todo';
  } else if (id == 'awaitfeedback') {
    container = 'Await feedback';
  } else if (id == 'inprogress') {
    container = 'In progress';
  } else if (id == 'done') {
    container = 'Done';
  }
  document.getElementById(`desktop-${id}`).innerHTML = `<div class="desktop-todo-empty">No Task ${container}</div>`;
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
  const buttons = document.querySelectorAll('.btn-prio');

  switch (prio) {
    case 'urgent':
      priority = 'urgent';
      prioEdit = 'urgent';
      break;
    case 'medium':
      priority = 'medium';
      prioEdit = 'medium';
      break;
    case 'low':
      priority = 'low';
      prioEdit = 'low';
      break;
    default:
      priority = 'low';
  }

  buttons.forEach((button) => {
    button.classList.remove('selected');
  });

  clickedButton.classList.add('selected');
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
  <div class="task" id="task" draggable="true" ondragstart="startDragging(${id})">
  <div class="task-heading-con">
      <span class="category" id="category" style="background-color: ${categoryColor(category)}">${category}</span>
    <a class="dropdown-task" onclick="mobileDropDownTask(${id})" id="dropdown-task${id}"><</a>
    <div class="mobile-droptaskcon" id="mobile-droptaskcon${id}">
        <a>
                <div class="mobile-droptaskcon-text" onclick="mobileChangeCon(${id}, 'todo')">ToDo</div>
        </a>
        <a>
                <div class="mobile-droptaskcon-text" onclick="mobileChangeCon(${id}, 'awaitfeedback')">Await feedback</div>
        </a>
        <a>
                <div class="mobile-droptaskcon-text" onclick="mobileChangeCon(${id}, 'inprogress')">In Progress</div>
        </a>
        <a>
                <div class="mobile-droptaskcon-text" onclick="mobileChangeCon(${id}, 'done')">Done</div>
        </a>
  </div>
  </div>
  <div onclick="openTask(${id})">
    <div class="task-heading" id="task-heading">${title}</div>
    <div class="task-description" id="task-description">${description}</div>
    <div class="task-subtasks" id="task-subtasks${id}"></div>
    <div class="task-footer" id="task-footer">
        <div class="task-profile" id="task-profile">
            <div class="profile" id="profile">${setContactInitial(id)}</div>
        </div>
        <div id="task-important"><img src="./assets/img/prio${prio}.png" alt="important"></div>
    </div>
  </div>
</div>
`;
}

/**
 * Return the Color for each Category
 * @param {String} category - Categeroy of the Task
 * @returns - Return the HEX Color Code
 */
function categoryColor(category) {
  switch (category) {
    case 'Sales':
      return '#4B7CCC';
    case 'Media':
      return '#858D99';
    case 'Marketing':
      return '#FF8658';
    case 'Design':
      return '#CC5948';
  }
}

/**
 * this function adds a subtask
 */
function addSubTask() {
  let subTaskInput = document.getElementById('subtask-title-input').value;
  if (subTaskInput !== '') {
    subtask.push(subTaskInput);
  }
  if (subTaskInput.trim() !== '') {
    const subTaskList = document.getElementById('subtask-container');

    const subTaskItemHTML = `
      <div class="subtask-list">
        <input type="checkbox" />
        <span>${subTaskInput}</span>
      </div>
    `;

    subTaskList.innerHTML += subTaskItemHTML;

    document.getElementById('subtask-title-input').value = '';
  }
}

/*
 * this function clears the inputs
 */
function clearTask() {
  const titleInput = document.getElementById('task-title-input');
  const descriptionInput = document.getElementById('task-description-input');
  const dateInput = document.getElementById('task-date-input');
  const assignedContact = document.getElementById('assigned_contact');
  const categoryInput = document.getElementById('task-category-input');
  const subtaskTitleInput = document.getElementById('subtask-title-input');
  const subtaskContainer = document.getElementById('subtask-container');

  titleInput.value = '';
  descriptionInput.value = '';
  dateInput.value = '';
  assignedContact.selectedIndex = 0;
  categoryInput.selectedIndex = 0;
  subtaskTitleInput.value = '';
  subtaskContainer.innerHTML = '';
}

/**
 * Handles the search functionality for tasks.
 * It fetches tasks, filters them based on the search query, and then renders the filtered tasks on their respective boards.
 * @async
 */
async function searchTasks() {
  const result = await fetchTasksAndHandleEmptyQuery();
  if (!result) return;
  const filteredTasks = filterTasksByQuery(result.tasks, result.query);
  clearAllBoards();
  renderFilteredTasksOnBoards(filteredTasks);
}

/**
 * Fetch tasks from storage and handle empty search query scenarios.
 * @async
 * @returns {Object|null} Returns an object with tasks and the query or null if the query is empty.
 */
async function fetchTasksAndHandleEmptyQuery() {
  const searchQuery = document.getElementById('desktop-search-bar-input').value.toLowerCase();
  if (!searchQuery.trim()) {
    setBoards();
    return null;
  }
  return {
    tasks: await getItem('tasks'),
    query: searchQuery,
  };
}

/**
 * Filters tasks based on the given search query.
 * @param {Array} tasks - The array of task objects to filter.
 * @param {string} query - The search query string.
 * @returns {Array} Returns an array of filtered task objects.
 */
function filterTasksByQuery(tasks, query) {
  return tasks.filter((task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query));
}

/**
 * Clears the content of all task boards.
 */
function clearAllBoards() {
  ['todo', 'awaitfeedback', 'inprogress', 'done'].forEach((id) => {
    document.getElementById(`desktop-${id}`).innerHTML = '';
  });
}

/**
 * Renders the provided filtered tasks on their respective boards.
 * @param {Array<Object>} filteredTasks - The array of filtered task objects to render.
 */
function renderFilteredTasksOnBoards(filteredTasks) {
  filteredTasks.forEach((task) => {
    setBoardHTML(task.category, task.title, task.description, task.priority, `desktop-${task.taskcon}`, task.id);
    setSubtasksHTML(task.subtask, task.subtaskready, task.id, task.category);
  });
}

//dropdown
function mobileDropDownTask(id) {
  const droptaskdown = document.getElementById(`mobile-droptaskcon${id}`);
  const dropdowntaskbtn = document.getElementById(`dropdown-task${id}`);

  if (droptaskdown.style.opacity === '0' || droptaskdown.style.opacity === '') {
    droptaskdown.style.opacity = '1';
    droptaskdown.style.transform = 'translateY(0)';
    droptaskdown.style.pointerEvents = 'all';
    dropdowntaskbtn.style.color = '#ffffff';
  } else {
    droptaskdown.style.pointerEvents = 'none';
    droptaskdown.style.opacity = '0';
    droptaskdown.style.transform = 'translateY(-100px)';
    dropdowntaskbtn.style.color = '#2a3647';
  }
}

/**
 * Change the Taskcon from the task
 * @param {Number} id
 * @param {String} con
 */
async function mobileChangeCon(id, con) {
  const tasks = await getItem('tasks');
  const updatedTasks = tasks.map((task) => {
    if (task.id == id) {
      return { ...task, taskcon: con };
    }
    return task;
  });
  await setItem('tasks', updatedTasks);
  setBoards();
  statusPopUp = 'open';
}

/**
 * Get contacts which you can assign a task to - ADD TASK
 *
 */
async function getContacts() {
  let data = await getItem('contacts');
  return data;
}

/**
 * Render all contacts in "Select contacts to assign"
 */
async function setContactsToAssign() {
  let data = await getContacts();
  for (let i = 0; i < data.length; i++) {
    const contact = data[i]['name'];
    document.getElementById('assigned_contact').innerHTML += `<option value="${contact}">${contact}</option>`;
  }
}

/**
 *
 * @param {Number} id
 * @returns {String} Returns the first to characters of the assigned contact.
 */
function setContactInitial(id) {
  let tasks = TASKS;
  for (i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task['id'] === id) {
      let contact = task['contact'];
      let initials = contact.slice(0, 2);
      let uppercaseInitials = initials.toUpperCase();
      return uppercaseInitials;
    }
  }
}
