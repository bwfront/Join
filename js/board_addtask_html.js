/**
 * Renders a task on the board.
 * @param {string} category - Task category.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} prio - Task priority.
 * @param {string} idcon - DOM element ID for the container.
 * @param {number} id - Task ID.
 */
async function setBoardHTML(category, title, description, prio, idcon, id) {
  const todo = document.getElementById(idcon);
  if (todo) {
    todo.innerHTML += `
    <div class="task" id="task" draggable="true" ondragstart="startDragging(${id})">
    <div class="task-heading-con">
        <span class="category" id="category" style="background-color: ${categoryColor(
          category
        )}">${category}</span>
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
          <div class="task-profile" id="task-profile-${id}">
              
          </div>
          <div id="task-important"><img src="./assets/img/prio${prio}.png" alt="important"></div>
      </div>
    </div>
  </div>
  `;
  }
  innerPopUpContact(id);
}

/**
 * Add Subtask HTML
 */
function addSubtaskHTML(subTaskInput) {
  const subTaskList = document.getElementById("subtask-container");
  const subTaskItemHTML = `
    <div class="subtask-list" id="subtask-${subTaskInput}">
      <div class="subtask-list-hover">
        <div>- ${subTaskInput}</div>
        <div class="subtask-buttons">
            <img onclick="removeSubtaskAddTask('${subTaskInput}')" src="./assets/img/deletepopup.png" alt="delete">
            <img onclick="editSubtaskAddTask('${subTaskInput}')" src="./assets/img/editpopup.png" alt="edit">
        </div>
      </div>
  </div>`;
  subTaskList.innerHTML += subTaskItemHTML;
  document.getElementById("subtask-title-input").value = "";
}
