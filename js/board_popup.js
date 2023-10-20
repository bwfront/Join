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
  getTaskPopUpSubtask(task.subtask, task.id);
  //getTaskPopUpHTML('contact', task.contact);
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
  let currentTask = tasks[idTask].subtaskready;
  if (status == "checked") {
    currentTask.push(subtaskvalue);
  }
  if (status == "unchecked") {
    const index = currentTask.indexOf(subtaskvalue);
    if (index > -1) {
      currentTask.splice(index, 1);
    }
  }
  tasks[idTask].subtaskready = currentTask;
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
  let currentTaskReadySubtasks = tasks[idTask].subtaskready;
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
 * Edit a task
 * * @param {number} id - Task ID.
 */
async function editTask(id) {
    const popup = document.getElementById('task-popup');
    const editpopup = document.getElementById('edit-task-container');
    popup.style.display = 'none';
    editpopup.style.display = 'unset';



    const tasks = await getItem("tasks");
    const selectTask = tasks[id];
    console.log(tasks);

    
    
    
    
    //await setItem("tasks", updatedTasks);

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
  const popup = document.getElementById('task-popup');
  const editpopup = document.getElementById('edit-task-container');
  popup.style.display = 'unset';
  editpopup.style.display = 'none';
}
