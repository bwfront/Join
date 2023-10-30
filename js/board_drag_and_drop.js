let startDragPosition;

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
  let selecttasks = await getItem("tasks");
  let currentTask = selecttasks.findIndex(
    (task) => task.id === startDragPosition
  );
  selecttasks[currentTask].taskcon = con;
  await setItem("tasks", selecttasks);
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
      containers.forEach((container) => {
        container.classList.add("container-bg");
      });
    });
    dragTask.addEventListener("dragend", () => {
      dragTask.classList.remove("dragging");
      containers.forEach((container) => {
        container.classList.remove("container-bg");
      });
    });
  });
  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    container.addEventListener("dragleave", (e) => {
      e.preventDefault();
      container.classList.remove("container-bg");
    });
    container.addEventListener("drop", (e) => {
      e.preventDefault();
      const dragTask = document.querySelector(".dragging");
      if (dragTask) {
        container.appendChild(dragTask);
      }
      containers.forEach((cleanContainer) => {
        cleanContainer.classList.remove("container-bg");
      });
    });
  });
  document.addEventListener("dragexit", () => {
    containers.forEach((container) => {
      container.classList.remove("container-bg");
    });
  });
  document.addEventListener("dragend", () => {
    containers.forEach((container) => {
      container.classList.remove("container-bg");
    });
  });
}
