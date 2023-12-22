/* Board Script // ADD TASK */
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
 * The priority level for the task. Default to 'unset'.
 * @type {string}
 */
let priority = "low";
let TASKS = [];
let subtask = [];
let subtaskready = [];
let taskcon = getTaskon();
let statusPopUp = "open";

/**
 * Creates a task using input values from the DOM, then saves it to the remote storage.
 * @async
 * @returns {Promise<void>}
 */
async function createTask() {
  const tasks = (await getItem("tasks")) || [];
  const id = Date.now();
  const title = document.getElementById("task-title-input").value;
  const description = document.getElementById("task-description-input").value;
  const date = document.getElementById("task-date-input").value;
  const contact = getCheckedContacts();
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
  setTaskcon("todo");
  priority = "low";
  subtask = [];
  clearTask();
  window.location = "./board.html";
}

/**
 * Get taskcon out the local Storage
 * @returns - the selected taskcon out the localStorage
 */
function getTaskon() {
  return localStorage.getItem("selctTaskCon");
}

/**
 * @param {String} con - The Selected Container
 * Save the selected taskcon in the localStorage
 */
function setTaskcon(con) {
  localStorage.setItem("selctTaskCon", con);
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
 * Check if the Contacts Exist
 * and Update the Task Contacts
 */
async function checkContactExist() {
  const tasks = await getItem("tasks");
  const contacts = await getItem("contacts");
  const contactname = pushContactInArray(contacts);
  tasks.forEach((task) => {
    let newContact = [];
    task.contact.forEach((currencontact) => {
      if (contactname.includes(currencontact)) {
        newContact.push(currencontact);
      }
    });
    task.contact = newContact;
  });
  await setItem("tasks", tasks);
  setBoards();
}

/**
 * Put all Contact Names in Array
 * @param {Object} contacts - The Contacts
 * @returns - The Array with the Contacts Name
 */
function pushContactInArray(contacts) {
  const array = [];
  for (selectcontact of contacts) {
    array.push(selectcontact.name);
  }
  return array;
}

async function setBoard(id) {
  const tasks = await getItem("tasks");
  TASKS = tasks;
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
  const containersubtask = document.getElementById(`task-subtasks${id}`);
  if (subtask.length > 0 && containersubtask) {
    containersubtask.innerHTML = `
    <div class="subtasks-progress-container">
      <div class="subtasks-progress" id="subtasks-progress${id}" style="background-color: ${categoryColor(
      category
    )}; width: ${calculatePercentagSubtask(
      getSharedSubtasksCount(subtask, subtaskready),
      subtask.length
    )}% !important">
    </div>
    </div>
    <div class="task-subtasks-text" id="task-subtasks-text">${getSharedSubtasksCount(
      subtask,
      subtaskready
    )}/${subtask.length} Subtasks</div>
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
    container = "todo";
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
      prioEdit = "urgent";
      break;
    case "medium":
      priority = "medium";
      prioEdit = "medium";
      break;
    case "low":
      priority = "low";
      prioEdit = "low";
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
 * Return the Color for each Category
 * @param {String} category - Categeroy of the Task
 * @returns - Return the HEX Color Code
 */
function categoryColor(category) {
  switch (category) {
    case "Sales":
      return "#4B7CCC";
    case "Media":
      return "#858D99";
    case "Marketing":
      return "#FF8658";
    case "Design":
      return "#CC5948";
  }
}

/**
 * Add a subtask
 */
function addSubTask() {
  let subTaskInputElem = document.getElementById("subtask-title-input");
  let subTaskInput = subTaskInputElem.value.trim();
  if (subTaskInput !== "") {
    if (!subtask.includes(subTaskInput)) {
      document.getElementById("subtask-container").style.display = "block";
      subtask.push(subTaskInput);
      addSubtaskHTML(subTaskInput);
    } else {
      showValidationMessage(
        subTaskInputElem,
        "This subtask is already added!",
        2000
      );
    }
  }
}
/**
 * Show a validation message for a specified duration
 * @param {HTMLInputElement} inputElem - The input element to set the validation message on
 * @param {string} message - The validation message to display
 * @param {number} duration - Duration to show the validation message in milliseconds
 */
function showValidationMessage(inputElem, message, duration = 2000) {
  inputElem.setCustomValidity(message);
  inputElem.reportValidity();

  setTimeout(() => {
    inputElem.setCustomValidity("");
    inputElem.reportValidity();
  }, duration);
}

/**
 * Removes the Subtaks
 * @param {String} subTaskInput - Value of Subtask
 */
function removeSubtaskAddTask(subTaskInput) {
  const subtaskItem = document.getElementById(`subtask-${subTaskInput}`);
  if (subtaskItem) {
    subtask = subtask.filter((task) => task !== subTaskInput);
    subtaskItem.remove();
  }
  if (subtask.length == 0) {
    document.getElementById("subtask-container").style.display = "none";
  }
}

/**
 * Edit the Subtask and put in Input
 * @param {String} subTaskInput - Value of Subtask
 */
function editSubtaskAddTask(subTaskInput) {
  document.getElementById("subtask-title-input").value = subTaskInput;
  removeSubtaskAddTask(subTaskInput);
}

/**
 * Retrieves an element by its ID.
 * @param {string} elementId - The ID of the desired DOM element.
 * @returns {HTMLElement|null} - The DOM element, or null if not found.
 */
function getElementById(elementId) {
  return document.getElementById(elementId);
}

/**
 * Clears the value or selection of an input or select element.
 * @param {HTMLElement} element - The input or select DOM element.
 */
function clearElementValue(element) {
  if (element) {
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.value = "";
    } else if (element.tagName === "SELECT") {
      element.selectedIndex = 0;
    }
  }
}

/**
 * Clears all task-related input fields and other UI elements.
 */
function clearTask() {
  clearElementValue(getElementById("task-title-input"));
  clearElementValue(getElementById("task-description-input"));
  clearElementValue(getElementById("task-date-input"));
  clearElementValue(getElementById("assigned_contact"));
  clearElementValue(getElementById("task-category-input"));
  clearElementValue(getElementById("subtask-title-input"));
  const subtaskContainer = getElementById("subtask-container");
  if (subtaskContainer) {
    subtaskContainer.innerHTML = "";
  }
  clearCheckBox();
  scrollToTop();
  removePrioSelect();
  const clearbutton = getElementById("clear-button");
  if (clearbutton) {
    clearbutton.blur();
  }
}

/**
 * Remove the Selected Class from the Prio Button
 */
function removePrioSelect() {
  const buttons = document.getElementsByClassName("btn-prio");
  const buttonArray = Array.from(buttons);
  buttonArray.forEach((button) => {
    button.classList.remove("selected");
  });
}

/**
 * Scrolls the window to the top.
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/**
 * Clears the Checkboxes in Add Task
 */
function clearCheckBox() {
  const checkboxes = document.querySelectorAll(
    "#assigned_contact input[type='checkbox']"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

/**
 * Handles the search functionality for tasks.
 * It fetches tasks, filters them based on the search query, and then renders the filtered tasks on their respective boards.
 * @async
 */
async function searchTasks() {
  try {
    const result = await fetchTasksAndHandleEmptyQuery();
    if (!result) return;
    const filteredTasks = filterTasksByQuery(result.tasks, result.query);
    clearAllBoards();
    renderFilteredTasksOnBoards(filteredTasks);
  } catch (error) {
    console.error("Error in searchTasks:", error);
  }
}

/**
 * Fetch tasks from storage and handle empty search query scenarios.
 * @async
 * @returns {Object|null} Returns an object with tasks and the query or null if the query is empty.
 */
async function fetchTasksAndHandleEmptyQuery() {
  const searchQuery = document
    .getElementById("desktop-search-bar-input")
    .value.toLowerCase();
  if (!searchQuery.trim()) {
    setBoards();
    return null;
  }
  return {
    tasks: await getItem("tasks"),
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
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
  );
}

/**
 * Clears the content of all task boards.
 */
function clearAllBoards() {
  ["todo", "awaitfeedback", "inprogress", "done"].forEach((id) => {
    document.getElementById(`desktop-${id}`).innerHTML = "";
  });
}

/**
 * Renders the provided filtered tasks on their respective boards.
 * @param {Array<Object>} filteredTasks - The array of filtered task objects to render.
 */
function renderFilteredTasksOnBoards(filteredTasks) {
  filteredTasks.forEach((task) => {
    setBoardHTML(
      task.category,
      task.title,
      task.description,
      task.priority,
      `desktop-${task.taskcon}`,
      task.id
    );
    setSubtasksHTML(task.subtask, task.subtaskready, task.id, task.category);
  });
}

//dropdown
function mobileDropDownTask(id) {
  const droptaskdown = document.getElementById(`mobile-droptaskcon${id}`);
  const dropdowntaskbtn = document.getElementById(`dropdown-task${id}`);

  if (droptaskdown.style.opacity === "0" || droptaskdown.style.opacity === "") {
    droptaskdown.style.opacity = "1";
    droptaskdown.style.transform = "translateY(0)";
    droptaskdown.style.pointerEvents = "all";
    dropdowntaskbtn.style.color = "#ffffff";
  } else {
    droptaskdown.style.pointerEvents = "none";
    droptaskdown.style.opacity = "0";
    droptaskdown.style.transform = "translateY(-100px)";
    dropdowntaskbtn.style.color = "#2a3647";
  }
}

/**
 * Change the Taskcon from the task
 * @param {Number} id
 * @param {String} con
 */
async function mobileChangeCon(id, con) {
  const tasks = await getItem("tasks");
  const updatedTasks = tasks.map((task) => {
    if (task.id == id) {
      return { ...task, taskcon: con };
    }
    return task;
  });
  await setItem("tasks", updatedTasks);
  setBoards();
  statusPopUp = "open";
}

/**
 * Get contacts which you can assign a task to - ADD TASK
 *
 */
async function getContacts() {
  let data = await getItem("contacts");
  return data;
}

/**
 * Render all contacts in "Select contacts to assign"
 */
async function setContactsToAssign() {
  let data = await getContacts();
  for (let i = 0; i < data.length; i++) {
    const contact = data[i]["name"];
    document.getElementById(
      "assigned_contact"
    ).innerHTML += `<label><input type="checkbox" value="${contact}"> ${contact}</label>`;
  }
}

/**
 * Get the Contacts Assigned to the Task
 * @param {String} id - Of the Task
 */
async function innerPopUpContact(id) {
  let tasks = await getItem("tasks");
  tasks.forEach((task) => {
    if (task.id == id) {
      innerPopUpContactHTML(task.contact, id);
    }
  });
}

/**
 * Get the Background Color from the Contact Name
 * @param {Object} currentcontact
 * @returns
 */
async function contactBackgroundColor(currentcontact) {
  const contacts = await getContacts();
  const foundContact = contacts.find(
    (contact) => contact.name === currentcontact
  );
  if (foundContact) {
    return foundContact.color;
  }
}

/**
 * Splice the Initials
 * @param {String} contact
 * @returns The Initial
 */
function setContactInitial(contact) {
  let initials = contact.slice(0, 2);
  let uppercaseInitials = initials.toUpperCase();
  return uppercaseInitials;
}
