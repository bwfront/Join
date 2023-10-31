/**
 * Index of the Task
 */
let currentTaskEdit;
/**
 * Values of the current Task in Edit
 */
let elementid = {};

/**
 * Changed Prio in Edit
 */
let prioEdit;

/**
 * Current Container e.g ToDo, In progress etc.
 */
let currenttaskcon;

/**
 * Stores the subtask in Edit
 */
let subtaskEdit = [];
/**
 * current ready subtasks in Edit array
 */
let subtaskEditReady = [];
/**
 * Get the data from the clicked Task
 * @param {number} id
 */
async function openTask(id) {
  let tasks = await getItem("tasks");
  let task = tasks.find((task) => task.id === id);
  innerTaskPopUp(task);
  innerPopUpFooter(id);
  openTaskPopUp();
  setContactNameInPopUp(id);
}
/**
 * Give getTaskPopUpHTMl the data and htmlid
 * @param {Array} task
 */
function innerTaskPopUp(task) {
  getTaskPopUpHTML("title", task.title);
  getTaskPopUpHTML("category", task.category);
  categoryColorPopUp(task.category);
  getTaskPopUpHTML("date", task.date);
  getTaskPopUpHTML("description", task.description);
  getTaskPopUpPrioHTML("priority", task.priority);
  getTaskPopUpSubtask(task.subtask, task.id);
}

/**
 * Style the Task PopUp Category Color
 * @param {String} category - The current Category
 */
function categoryColorPopUp(category) {
  document.getElementById(`popup-category`).style.backgroundColor =
    categoryColor(category);
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
 * Check status + Register if a subtask is Ready ore not
 * @param {number} i - ID of the current Subtask
 */
function checkStatusSubtask(i, idTask) {
  const checkbox = document.getElementById(`popup-checkbox${i}`);
  const subtaskvalue = document.getElementById(`popup-subtask${i}`).innerHTML;
  if (checkbox.checked) {
    updateCheckedSubtask(subtaskvalue, idTask, "checked");
  } else {
    updateCheckedSubtask(subtaskvalue, idTask, "unchecked");
  }
}
/**
 *
 * @param {string} subtaskvalue - Value from the checked Subtask
 * @param {number} idTask - Index from the current Task
 */
async function updateCheckedSubtask(subtaskvalue, idTask, status) {
  let tasks = await getItem("tasks");

  let current = tasks.find((task) => task.id === idTask);
  let currentTask = current.subtaskready;

  if (status == "checked") {
    currentTask.push(subtaskvalue);
  }
  if (status == "unchecked") {
    const index = currentTask.indexOf(subtaskvalue);
    if (index > -1) {
      currentTask.splice(index, 1);
    }
  }
  current.subtaskready = currentTask;
  await setItem("tasks", tasks);
  setBoards();
}
/**
 * Render the Array in the PopUp
 * Checks if a Subtask is Already checked
 * @param {Array} subtaskArray - Array of Subtasks
 * @param {number} idTask - Index of the current Task
 */
async function getTaskPopUpSubtask(subtaskArray, idTask) {
  const subtakscon = document.getElementById("task-popup-subtasks");
  let tasks = await getItem("tasks");

  let currentTask = tasks.find((task) => task.id === idTask);
  let currentTaskReadySubtasks = currentTask.subtaskready;
  if (subtaskArray.length > 0) {
    subtakscon.innerHTML = ``;
  }
  for (let i = 0; i < subtaskArray.length; i++) {
    const isChecked = currentTaskReadySubtasks.includes(subtaskArray[i])
      ? "checked"
      : "";
    subtakscon.innerHTML += `<div><input id="popup-checkbox${i}" type="checkbox" ${isChecked} onclick="checkStatusSubtask(${i}, ${idTask})" placeholder="subtask"><label
      class="popup-subtask" id="popup-subtask${i}" for="popup-checkbox">${subtaskArray[i]}</label></div>`;
  }
}

/**
 * Tell the PopUp Create Task where to store the createt task
 * @param {String} container
 */
function changeInputContainer(container) {
  const con = container;
  setTimeout(() => {
    switch (con) {
      case "todo":
        taskcon = "todo";
        break;
      case "awaitfeedback":
        taskcon = "awaitfeedback";
        break;
      case "inprogress":
        taskcon = "inprogress";
        break;
      case "done":
        taskcon = "done";
        break;
    }
  }, 1000);
}

/**
 * Render the Footer including Delete and Edit buttons
 * @param {number} id - Of the current Task in the Array
 */
function innerPopUpFooter(id) {
  document.getElementById("popup-footer").innerHTML = ` 
    <div class="popup-delete" onclick="deleteTask(${id})"><img class="popup-delete-img" src="./assets/img/deletepopup.png" alt="delete" onclick="deleteTask(${id})">Delete</div>
    |
    <div class="popup-edit" onclick="editTask(${id})"><img class="popup-edit-img" src="./assets/img/editpopup.png" alt="edit">Edit</div>`;
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
 * Inital Edit task
 * * @param {number} id - Task ID.
 */
function editTask(id) {
  const popup = document.getElementById("task-popup");
  const editpopup = document.getElementById("edit-task-container");
  popup.style.display = "none";
  editpopup.style.display = "unset";
  currentTaskEdit = id;
  getEditValues(id);
}

/**
 * Load the Task array and get the Elements ID
 * @param {Number} id
 */
async function getEditValues(id) {
  const tasks = await getItem("tasks");
  let selectTask = tasks.find((task) => task.id === id);
  const title = document.getElementById("edit-title");
  const description = document.getElementById("edit-description");
  const date = document.getElementById("task-date-input");
  const prio = document.getElementById(`prio-${selectTask.priority}`);
  const category = document.getElementById("edit-category");
  const categoryselected = document.getElementById("task-category-input");
  const contact = document.getElementById("edit-contact");
  const contactselected = document.getElementById("assigned_contact");
  const subtasks = document.getElementById("edit-subtask-container");
  elementid = {
    title,
    description,
    date,
    prio,
    category,
    categoryselected,
    contact,
    contactselected,
    subtasks,
  };
  innerEditValues(elementid, selectTask);
}

/**
 * Inner the Data from getEditValues
 * @param {Object} elementid - The Element ID in the HTML Code
 * @param {Array} selectTask - The Array from the current Selected Task
 */
function innerEditValues(elementid, selectTask) {
  prioEdit = selectTask.priority;
  currenttaskcon = selectTask.taskcon;
  subtaskEditReady = selectTask.subtaskready;
  elementid.title.value = selectTask.title;
  elementid.description.innerHTML = selectTask.description;
  elementid.date.value = selectTask.date;
  elementid.prio.classList.add("selected");
  elementid.category.innerHTML = selectTask.category;
  elementid.categoryselected.value = selectTask.category;
  elementid.contactselected.value = selectTask.contact;
  setContactCheckbox(selectTask);
  editSubtasksStore(elementid, selectTask);
}

/**
 * Check if Subtaks there and Store them in a diffrent Array
 * if not import there are no subtasks
 * @param {Object} elementid
 * @param {Array} selectTask
 */
function editSubtasksStore(elementid, selectTask) {
  elementid.subtasks.innerHTML = ``;
  if (selectTask.subtask != 0) {
    subtaskEdit = [...selectTask.subtask];
    renderEditSubtasks();
  } else {
    elementid.subtasks.innerHTML += `There are no Subtaks`;
  }
}

/**
 * Add a Subtask to the Task
 */
function addEditSubtask() {
  const subtaskValue = document.getElementById("subtask-title-input");
  const trimmedValue = subtaskValue.value.trim();
  if (trimmedValue !== "") {
    if (!subtaskEdit.includes(trimmedValue)) {
      subtaskEdit.push(trimmedValue);
      subtaskValue.value = "";
      elementid.subtasks.innerHTML = "";
      renderEditSubtasks();
    } else {
      showValidationMessage(subtaskValue, "This subtask is already added!", 2000);
    }
  }
}

/**
 * Delete the Subtask with the Index
 * @param {Number} id - The Index from the delete Subtask
 */
function deleteEditSubtask(id) {
  subtaskEdit.splice(id, 1);
  elementid.subtasks.innerHTML = "";
  renderEditSubtasks();
}

/**
 * Render the Subtasks
 */
function renderEditSubtasks() {
  for (let i = 0; i < subtaskEdit.length; i++) {
    elementid.subtasks.innerHTML += `<div class="edit-subtask-con"><li>${subtaskEdit[i]}</li><img src="./assets/img/deletepopup.png" alt="delete" onclick="deleteEditSubtask(${i})"></div>`;
  }
}

/**
 * Set the Values in the Edit PopUp
 */
async function setEditValue() {
  let selecttasks = await getItem("tasks");
  let title = elementid.title.value;
  let description = elementid.description.value;
  let date = elementid.date.value;
  let id = currentTaskEdit;
  let priority = prioEdit;
  let taskcon = currenttaskcon;
  let category = elementid.categoryselected.value;
  let contact = getCheckedContacts();
  let subtask = subtaskEdit;
  let subtaskready = subtaskEditReady;
  let currentEditValues = {
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

  let taskIndex = selecttasks.findIndex((task) => task.id === currentTaskEdit);
  selecttasks[taskIndex] = currentEditValues;
  setItem("tasks", selecttasks);
  closeTaskPopUp();
}

/**
 * Set Display to flex and add Slide In Animation class
 */
function openTaskPopUp() {
  const popupbackground = document.getElementById(
    "desktop-task-popup-container"
  );
  const popupconatiner = document.getElementById("desktop-task-popup");
  const body = document.getElementById("body");
  body.classList.add("no-scroll");
  popupbackground.style.display = "flex";
  popupconatiner.classList.remove("popup-slideout");
  popupconatiner.classList.add("popup-slidein");
}

/**
 *
 * @param {string} htmlid - The HTML ID
 * @param {*} task - The Priority from the Task
 */
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
  setBoards();
  const popupbackground = document.getElementById(
    "desktop-task-popup-container"
  );
  const popupconatiner = document.getElementById("desktop-task-popup");
  const subtakscon = document.getElementById("task-popup-subtasks");

  subtakscon.innerHTML = "<div>There are no Subtaks</div>";
  popupconatiner.classList.remove("popup-slidein");
  popupconatiner.classList.add("popup-slideout");
  setTimeout(() => {
    popupbackground.style.display = "none";
  }, 300);
  closeTaskPopUpRemove();
}

/**
 * Remove / Hide Elements
 */
function closeTaskPopUpRemove() {
  const popup = document.getElementById("task-popup");
  const editpopup = document.getElementById("edit-task-container");
  popup.style.display = "unset";
  editpopup.style.display = "none";
  const body = document.getElementById("body");
  body.classList.remove("no-scroll");
  document.getElementById("prio-urgent").classList.remove("selected");
  document.getElementById("prio-medium").classList.remove("selected");
  document.getElementById("prio-low").classList.remove("selected");
  document.getElementById("task-profile").innerHTML = "";
  elementid = {};
  subtaskEdit = [];
  document.getElementById("subtask-title-input").value = "";
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
 *
 * @param {Number} - The Index from the Task
 * Sets the name of the assigned contact in the Pop Up Card
 */
async function setContactNameInPopUp(id) {
  let taskId = id;
  for (let i = 0; i < TASKS.length; i++) {
    const task = TASKS[i];
    if (taskId === task["id"]) {
      let contacts = task["contact"];
      const container = document.getElementById("task-profile");
      if (contacts.length > 0) {
        for (currentcontact of contacts) {
          await innerContactNameIPopUpHTML(container, currentcontact);
        }
      } else {
        container.innerHTML = "No contacts Assigned";
      }
    }
  }
}

/**
 * Inner the Values in the Document
 * @param {htmlid} container - ID of the HTML Container
 * @param {String} currentcontact - Current Contect
 */
async function innerContactNameIPopUpHTML(container, currentcontact) {
  const bgColor = await contactBackgroundColor(currentcontact);
  container.innerHTML += `
  <div class="popup-contact-container">
    <div id="open-card-contact-initials" class="profile" id="popup-profile"style="background-color: ${bgColor}">${setContactInitial(
    currentcontact
  )}
    </div>
    <div id="open-card-contact" class="popup-contact-name">${currentcontact}</div>
  </div>`;
}

/**
 * Set the Checked Status to the Checkboxes if the Contact is Assgined
 * @param {Object} selectTask
 */
function setContactCheckbox(selectTask) {
  const checkboxes = document.querySelectorAll(
    "#assigned_contact input[type='checkbox']"
  );
  clearCheckboxes(checkboxes);
  const contacts = selectTask.contact;
  for (currentcontact of contacts) {
    checkboxes.forEach((checkbox) => {
      if (checkbox.value == currentcontact) {
        checkbox.checked = true;
      }
    });
  }
}

/**
 * Clear the Checkboxes
 * @param {Element} checkboxes
 */
function clearCheckboxes(checkboxes) {
  checkboxes.forEach((checkbox) => {
    if (checkbox.value == currentcontact) {
      checkbox.checked = false;
    }
  });
}
