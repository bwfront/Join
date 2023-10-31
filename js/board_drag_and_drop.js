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
 * Adds a background style to an array of container elements.
 * @param {Array<HTMLElement>} containers - The list of container elements.
 */
function addBgToContainers(containers) {
  containers.forEach((container) => container.classList.add("container-bg"));
}

/**
 * Removes the background style from an array of container elements.
 * @param {Array<HTMLElement>} containers - The list of container elements.
 */
function removeBgFromContainers(containers) {
  containers.forEach((container) => container.classList.remove("container-bg"));
}

/**
 * Handles the drag end event for a task.
 * @param {HTMLElement} dragTask - The task element that ended the drag.
 * @param {Array<HTMLElement>} containers - The list of container elements.
 */
function handleDragStart(dragTask, containers) {
  dragTask.classList.add("dragging");
  addBgToContainers(containers);
}

/**
 * Handles the drag over event for a container.
 * Prevents default behavior to allow the drop operation.
 * @param {DragEvent} event - The drag event.
 */
function handleDragEnd(dragTask, containers) {
  dragTask.classList.remove("dragging");
  removeBgFromContainers(containers);
}

/**
 * Handles the drop event for a container.
 * @param {HTMLElement} container - The container where the task was dropped.
 * @param {DragEvent} event - The drop event.
 * @param {Array<HTMLElement>} containers - The list of container elements.
 */
function handleDragOver(event) {
  event.preventDefault();
}

/**
 * Handles the drop event for a container.
 * @param {HTMLElement} container - The container where the task was dropped.
 * @param {DragEvent} event - The drop event.
 * @param {Array<HTMLElement>} containers - The list of container elements.
 */
function handleDrop(container, event, containers) {
  event.preventDefault();
  const draggingTask = document.querySelector(".dragging");
  if (draggingTask) {
    container.appendChild(draggingTask);
  }
  removeBgFromContainers(containers);
}

/**
 * Sets up drag event listeners for the given tasks.
 * @param {NodeList|Array<Element>} dragTasks - The list of draggable task elements.
 * @param {NodeList|Array<Element>} containers - The list of container elements.
 */
function setupDragEventListenersForTasks(dragTasks, containers) {
  dragTasks.forEach((dragTask) => {
    dragTask.addEventListener("dragstart", () =>
      handleDragStart(dragTask, containers)
    );
    dragTask.addEventListener("dragend", () =>
      handleDragEnd(dragTask, containers)
    );
  });
}

/**
 * Sets up drop event listeners for the given containers.
 * @param {NodeList|Array<Element>} containers - The list of container elements.
 */
function setupDropEventListenersForContainers(containers) {
  containers.forEach((container) => {
    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", (e) =>
      handleDrop(container, e, containers)
    );
  });
}

/**
 * Sets up a drag end event listener for the document which removes backgrounds from containers.
 * @param {NodeList|Array<Element>} containers - The list of container elements.
 */
function setupDragEndListenerForDocument(containers) {
  document.addEventListener("dragend", () =>
    removeBgFromContainers(containers)
  );
}

/**
 * Initializes all drag and drop event listeners for tasks and containers.
 * @param {NodeList|Array<Element>} dragTasks - The list of draggable task elements.
 * @param {NodeList|Array<Element>} containers - The list of container elements.
 */
function dragDropFun(dragTasks, containers) {
  setupDragEventListenersForTasks(dragTasks, containers);
  setupDropEventListenersForContainers(containers);
  setupDragEndListenerForDocument(containers);
}
