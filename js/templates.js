/**
 * Function displays placeholder in board (-> board.js)
 */

function displayPlaceholder() {
    if (document.getElementById('toDo').innerHTML == '') {
        document.getElementById('toDo').innerHTML = '<div class="board-progress-item-placeholder">No tasks in "to Do"</div>';
    }
    if (document.getElementById('inProgress').innerHTML == '') {
        document.getElementById('inProgress').innerHTML = '<div class="board-progress-item-placeholder">No tasks in "in Progress"</div>';
    }
    if (document.getElementById('awaitingFeedback').innerHTML == '') {
        document.getElementById('awaitingFeedback').innerHTML = '<div class="board-progress-item-placeholder">No tasks in "awaiting Feedback"</div>';
    }
    if (document.getElementById('done').innerHTML == '') {
        document.getElementById('done').innerHTML = '<div class="board-progress-item-placeholder">No tasks in "done"</div>';
    }
}


/**
 * Function removes padding progress columns in board (-> board.js)
 */

function removePadding() {
    let progressIds = ['toDo', 'awaitingFeedback', 'inProgress', 'done'];
    progressIds.forEach(progress => {
        if (document.getElementById(progress).innerHTML != '') {
            document.getElementById(progress).classList.add('remove-padding-bottom');
        } else {
            document.getElementById(progress).classList.remove('remove-padding-bottom');
        }
    });
}


/**
 * Function adds "box to drag" the "task item" inside in board (-> board.js)
 */

function addHighlightBox() {
    let progressIds = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
    progressIds.forEach(progress => {
        document.getElementById(progress).innerHTML += `<div id="drag-area-${progress}" class="drag-area"></div>`;
    });
}


/**
 * Function fills blue progress line into progess bar (calc %) in board (-> board.js)
 * 
 * @param {number} id 
 * @param {string} subtasks 
 * @param {string} subtasksDone 
 */

function fillProgressBar(id, subtasks, subtasksDone) {
    let percentDone = 100 / subtasks * subtasksDone;
    let blueBar = `<div class="board-progress-item-progressbar-filled" style="width: ${percentDone}%;">`;
    document.getElementById(`progressbar(${id})`).innerHTML = blueBar;
}


/**
 * Adds prio image beneath progress bar in task card in board (-> board.js)
 * 
 * @param {string} prio 
 * @returns {promise<string>}
 */

function setPrioImg(prio) {
    if (prio == "Urgent") {
        return `<img src="./assets/img/addtask_urgent.svg" alt="">`;
    } else if (prio == "Medium") {
        return `<img src="./assets/img/addtask_medium.svg" alt="">`;
    } else if (prio == "Low") {
        return `<img src="./assets/img/addtask_low.svg" alt="">`;
    } else {
        return '';
    }
}


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
        <div id="${title}" onclick="openTaskDialog('details', ${id})" draggable="true" ondragstart="startDragging('${id}')" class="board-progress-item">
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

function taskDetailsHTMLTemplate(taskId, title, description, category, duedate, prio) {
    let taskDetailsTemplate = /*html*/ `
        <div class="card-taskinfo-category-container">
            <div id="category-id-detailed(${taskId})" class="card-taskinfo-category category-orange">
                <h6>${category}</h6>
            </div>
        </div>
        <h2>${title}</h2>
        <div class="card-taskinfo-details">
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
            <div class="card-taskinfo-assignee-list" id="card-taskinfo-assignee-list">
            </div>
            <div class="card-taskinfo-assignee-list">
                <h6>Subtasks</h6>
                    <ul id="subTaskList">
                    </ul>
            </div>
            <div class="card-close" onclick="closeTaskDialog(); displayTasks(user.tasks);"></div>
            <div class="card-taskinfo-btns">
                <div class="card-taskinfo-btn-delete" onclick="deleteTask(${taskId})"></div>
                <div class="card-taskinfo-btn-edit" onclick="openTaskDialog('edit', ${taskId})"></div>
            </div>
        </div>

        `;
    return taskDetailsTemplate;
}

function taskDetailsAssigneeListHTMLTemplate(name, svg) {
    let taskDetailsAssigneeList = `
        <div class="card-taskinfo-row">
            <div class="contact-initials">${svg}</div>
            <h6>${name}</h6>
        </div>
    `;
    return taskDetailsAssigneeList;
}

function assigneeListHTMLTemplate(name, i) {
    let assigneeListTemplate = /*html*/ `
        <div class="assigned-user">
            <p>${name}</p>
            <img src="./assets/img/close_white.svg" alt="unassign user" onclick="deleteAssignee(${i})">
        </div>
    `;
    return assigneeListTemplate;
}