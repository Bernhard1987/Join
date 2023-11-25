/**
 * Generates an HTML template for a subtask item with edit and delete options (-> link to addtask.js)
 *
 * @param {number} index - The index of the subtask.
 * @param {string} list - The name or identifier of the subtask list.
 * @returns {string} - An HTML template string for a subtask item.
 */

function getSubtaskTemplate(index, list) {
    return /*html*/`
        <div id="editSubtaskInputDiv_${index}_${list}" class="d-none input-icon">
            <input id="editSubtaskInput_${index}_${list}" type="text">
            <img onclick="confirmEditSubtask(${index}, '${list}');" class="icon icon-email actionIcon" src="./assets/img/check-black.svg" alt="Bestätigen">
        </div>
        <div id="editIcons${index}_${list}">
            <img src="assets/img/edit.svg" alt="Bearbeiten" onclick="editSubtask(${index}, '${list}')" class="addtask-subtask-icon">
            <img src="assets/img/delete.svg" alt="Löschen" onclick="removeSubtask(${index}, '${list}')" class="addtask-subtask-icon">
        </div>
    `;
}


/**
 * Function generates HTML template form a task item (-> link to board.js)
 * @param {number} id 
 * @param {string} category 
 * @param {string} title 
 * @param {string} description 
 * @param {string} prio 
 * @param {string} svg 
 * @param {string} subtasks 
 * @param {string} subtasksDone 
 * @returns {promise<string>}
 */

function taskHTMLTemplate(id, category, title, description, prio, svg, subtasks, subtasksDone) {
    let taskTemplate = /*html*/ `
    <div id="${title}" onclick="showTaskDetails(${id})" draggable="true" ondragstart="startDragging('${id}')" class="board-progress-item">
        <div class="board-progress-item-category">
            <div id="category-id(${id})" class="category-btn">${category}</div>
        </div>
        <div class="board-progress-item-text-content">
            <div class="board-progress-item-headline">
                <p>${title}</p>
            </div>
            <div class="board-progress-item-description">
            ${description}
            </div>
        </div>
        <div id="show-progress-bar(${id})" class="board-progress-item-progress-row">
            <div id="progressbar(${id})" class="board-progress-item-progressbar">
            </div>
            <div class="board-progress-item-progress-counter">${subtasksDone}/${subtasks} done</div>
        </div>
        <div class="board-progress-item-assignees">
            <div class="board-progress-item-assignees-svg">
                ${svg}
            </div>
            <div class="board-progress-item-prio">
                ${setPrioImg(prio)}
            </div>
        </div>
    </div>`;
    return taskTemplate;
}


/**
 * Generates task details (-> link to board.js)
 * 
 * @param {number} taskId 
 * @param {string} title 
 * @param {string} description 
 * @param {string} assignedto 
 * @param {string} svg 
 * @param {string} category 
 * @param {string} duedate 
 * @param {string} prio 
 * @returns {promise<string>}
 */

function taskDetailsHTMLTemplate(taskId, title, description, assignedto, svg, category, duedate, prio) {
    let taskDetailsTemplate = /*html*/ `
    <div class="card-taskinfo-category-container">
        <div id="category-id-detailed(${taskId})" class="card-taskinfo-category category-orange">
            <h6>${category}</h6>
        </div>
    </div>
    <h2>${title}</h2>
    <h6>${description}</h6>
    <div class="card-taskinfo-row">
        <h6 class="card-taskinfo-sub-headline">Due date:</h6>
        <h6>${duedate}</h6>
    </div>
    <div class="card-taskinfo-row">
        <h6 class="card-taskinfo-sub-headline">Priority:</h6><h6>${prio}</h6>
        <img id="prio-graphic" src="" alt="">
    </div>
    <div class="card-taskinfo-row">
        <h6>Assigned To:</h6>
    </div>
    <div class="card-taskinfo-assignee-list">
        <div class="card-taskinfo-row">
            <div class="contact-initials">${svg}</div>
            <h6>${assignedto}</h6>
        </div>
    </div>
    <div class="card-taskinfo-assignee-list">
        <h6>Subtasks</h6>
            <ul id="subTaskList">
            </ul>
    </div>
    <div class="card-close" onclick="closeCard('cardTaskDetails')"></div>
    <div class="card-taskinfo-btns">
        <div class="card-taskinfo-btn-delete" onclick="deleteTask(${taskId})"></div>
        <div class="card-taskinfo-btn-edit" onclick="editTask(${taskId})"></div>
    </div>
    `;
    return taskDetailsTemplate;
}