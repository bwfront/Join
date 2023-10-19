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
