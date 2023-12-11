let filteredTasks = [];
let searchTerm;
tasks = [];

let currentDraggedElement = 0;

/* ==========================================================================
   Load task functions
   ========================================================================== */

/**
 * This function is responsible for getting the data of actual logged in user and executing the function displayTasks()
 * 
 * @param {array} user.tasks - includes all user tasks in JSON format
 */
async function initTasks() {
    await getActualUserData();
    await selectDropdownBoxElement();
    displayTasks(user.tasks);
}


/**
 * This function resets all task item list columns and executes loadTasks() function.
 * 
 * @param {array} tasks - includes all user tasks in JSON format
 */
function displayTasks(tasks) {
    if (document.getElementById('toDo')) {
        document.getElementById('toDo').innerHTML = '';
        document.getElementById('inProgress').innerHTML = '';
        document.getElementById('awaitingFeedback').innerHTML = '';
        document.getElementById('done').innerHTML = '';
        loadTasks(tasks);
    }
}


/**
 * Loads tasks to board overview.
 * 
 * @param {JSON} tasks - includes all user tasks
 */
function loadTasks(tasks) {
    tasks.forEach(task => {
        let id = task.id;
        let title = task.title;
        let description = task.description;
        let category = task.category;
        let svg = getAllSVGsForTask(task);
        let prio = task.prio;
        let subtasks = task.subtasks.length;
        let subtasksDone = countDoneSubtasks(task.subtasksdone);
        let status = task.status;
        document.getElementById(`${status}`).innerHTML += taskHTMLTemplate(id, category, title, description, prio, svg, subtasks, subtasksDone);

        checkProgressBar(id, subtasks, subtasksDone);
        colorizeCategory(category, id, 'loadTasks');
    });
    removePadding();
    displayPlaceholder();
    addHighlightBox();
}


/**
 * This function checks if progress bar is necessary
 * 
 * @param {number} id -> actual user id
 * @param {array} subtasks -> Includes subtasks in JSON format
 * @param {array} subtasksDone -> Includes subtask state (done = true, notdone = false -> boolean)
 */
function checkProgressBar(id, subtasks, subtasksDone) {
    if (subtasks !== 0) {
        fillProgressBar(id, subtasks, subtasksDone);
    } else {
        document.getElementById(`show-progress-bar(${id})`).classList.add('d-none');
    }
}


/**
 * This function counts completed subtasks
 * 
 * @param {array} subtasksDone -> Includes subtask state (done = true, notdone = false -> boolean)
 * @returns {promise<number>} -> Number of finished subtasks
 */
function countDoneSubtasks(subtasksDone) {
    let subTasksDoneCount = 0;
    subtasksDone.forEach(subtaskDone => {
        if (subtaskDone == 'done') {
            subTasksDoneCount++;
        }
    });
    return subTasksDoneCount;
}


/* ==========================================================================
   Task detail functions
   ========================================================================== */

/**
 * This function shows the details of the task
 * 
 * @param {number} id -> Task id
 */
async function showTaskDetails(id) {
    let idInArray = user.tasks.findIndex(task => task.id == id);
    let title = user.tasks[idInArray].title;
    let description = user.tasks[idInArray].description;
    let assignedto = user.tasks[idInArray].assignedto;
    let category = user.tasks[idInArray].category;
    let duedate = user.tasks[idInArray].duedate;
    let prio = user.tasks[idInArray].prio;
    let taskDetails = document.getElementById('cardTaskDetails');

    taskDetails.innerHTML = taskDetailsHTMLTemplate(idInArray, title, description, category, duedate, prio);

    let taskDetailsAssigneeList = document.getElementById('card-taskinfo-assignee-list');
    taskDetailsAssigneeList.innerHTML = generateTaskDetailsAssigneeList(assignedto);

    listSubtasks(idInArray);
    subtaskCheckboxCheck(idInArray);
    taskprioImageIntoId(prio);

    colorizeCategory(category, idInArray, 'showTaskDetails');
}

/**
 * Generates The List of assignees and the belonging svgs.
 * 
 * @param {array} assignedto 
 * @returns 
 */
function generateTaskDetailsAssigneeList(assignedto) {
    let taskDetailsAssigneeList = '';
    for (let i = 0; i < assignedto.length; i++) {
        const assignedUserId = assignedto[i];
        const foundContact = user.contacts.find(contact => contact.id === assignedUserId);
        if (foundContact) {
            taskDetailsAssigneeList += taskDetailsAssigneeListHTMLTemplate(foundContact.name, foundContact.monogram);
        } else if (assignedUserId === actualUser) {
            taskDetailsAssigneeList += taskDetailsAssigneeListHTMLTemplate('You', user.svg);
        } else {
            taskDetailsAssigneeList += taskDetailsAssigneeListHTMLTemplate(`Deleted (id: ${assignedUserId})`, addCustomSVG('?'));
        }
    }
    return taskDetailsAssigneeList;
}


/**
 * Adds prio graphic to task details
 * 
 * @param {string} prio 
 */
function taskprioImageIntoId(prio) {
    if (prio == 'Urgent') {
        document.getElementById('prio-graphic').src = 'assets/img/addtask_urgent.svg';
    } else if (prio == 'Medium') {
        document.getElementById('prio-graphic').src = 'assets/img/addtask_medium.svg';
    } else {
        document.getElementById('prio-graphic').src = 'assets/img/addtask_low.svg';
    }
}


/**
 * Generates list of subtasks for task details
 * 
 * @param {number} taskId 
 * @returns {promise<string>}
 */
function listSubtasks(taskId) {
    let subtasks = user.tasks[taskId].subtasks;
    let subTaskList = document.getElementById('subTaskList');
    subTaskList.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        subTaskList.innerHTML += /*html*/ `
        <li>
            <input type="checkbox" id="subtaskCheck(${i})" onclick="changeCheckedStatus(${taskId},${i})">
            <p>${subtask}</p>
        </li>`;
    }
    return subTaskList;
}


/**
 * Generates/show subtasks list in edit state
 * 
 * @param {number} taskId 
 */
function listEditSubtasks(taskId) {
    let subtasks = user.tasks[taskId].subtasks;
    let subTaskList = document.getElementById('editSubtasksList');
    subTaskList.innerHTML = '';

    subtasks.forEach((subtask, index) => {
        let subtaskElement = document.createElement('li');
        subtaskElement.innerHTML += /*html*/ `<div id="subtask${index}_editSubtasksList">${subtask}</div>`;
        subtaskElement.innerHTML += getSubtaskTemplate(index, 'editSubtasksList');
        subtaskElement.classList.add('d-flex-space-between');
        subTaskList.appendChild(subtaskElement);
    });
}


/**
 * This function changes checked status of subtasks (done)
 * 'subtasksDone = subtasksDone.splice(subtaskId, 1, subtaskdone);' -> exchange old value with new value -> save it
 * 
 * @param {number} taskId 
 * @param {number} subtaskId 
 */
function changeCheckedStatus(taskId, subtaskId) {
    let subtasksDone = user.tasks[taskId].subtasksdone;
    const subtaskCheck = document.getElementById(`subtaskCheck(${subtaskId})`);

    if (subtaskCheck.checked == false) {
        subtaskdone = 'notdone';
    } else if (subtaskCheck.checked == true) {
        subtaskdone = 'done';
    }
    subtasksDone = subtasksDone.splice(subtaskId, 1, subtaskdone);
    updateUser();
}


/**
 * Function show right checkbox if status is 'true'
 * 
 * @param {number} taskId 
 */
function subtaskCheckboxCheck(taskId) {
    let subtasksDone = user.tasks[taskId].subtasksdone;

    for (let i = 0; i < subtasksDone.length; i++) {
        const subtaskDone = subtasksDone[i];
        const subtaskCheck = document.getElementById(`subtaskCheck(${i})`);

        if (subtaskDone == 'done') {
            subtaskCheck.checked = true;
        }
    }
}


/* ==========================================================================
   Drag and Drop
   ========================================================================== */

/**
 * Enables 'startDragging' for drag functionality (documentation W3Schools)
 * 
 * @param {number} id 
 */
function startDragging(id) {
    currentDraggedElement = user.tasks.findIndex(task => task.id == id);
}


/**
 * Enables the drop itself (documentation W3Schools)
 * 
 * @param {any} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Executes functions after drop 
 * 
 * @param {string} status 
 */
async function moveTo(status) {
    user.tasks[currentDraggedElement].status = status;

    await updateUser();
    setTimeout(() => {
        initTasks();
    }, 100); //otherwise it works irregularly, although "await" is set
}


/* ==========================================================================
   Search
   ========================================================================== */

/**
 * Filters and displays tasks based on a search term.
 *
 * @throws {Error} Throws an error if 'document.getElementById' or 'displayTasks' is undefined.
 */
function filterTasks() {
    searchTerm = document.getElementById('search').value.toLowerCase();
    filteredTasks = [];  // Resetting the filteredTasks array
    if (searchTerm != '') {
        user.tasks.forEach(task => {
            if (task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm)) {
                filteredTasks.push(task);
            }
        });
    } else {
        filteredTasks = user.tasks;
    }
    displayTasks(filteredTasks);
}


/* ==========================================================================
   CSS Colorize Categories
   ========================================================================== */

/**
 * This function adds the right category to the "category patch"
 * 
 * @param {string} category 
 * @param {number} id 
 * @param {string} location 
 */
async function colorizeCategory(category, id, location) {
    let actualElementId = checkColorizeCategoryLocation(location);

    if (category == 'design') {
        document.getElementById(`${actualElementId}(${id})`).classList.add('category-orange');
    } else if (category == 'development') {
        document.getElementById(`${actualElementId}(${id})`).classList.add('category-green');
    } else if ((category == 'quality')) {
        document.getElementById(`${actualElementId}(${id})`).classList.add('category-blue');
    }
}


/**
 * Part of id of 'actualElementId'
 * 
 * @param {string} location 
 * @returns {promise<string>}
 */
function checkColorizeCategoryLocation(location) {
    let actualElementId;
    if (location == 'loadTasks') {
        actualElementId = 'category-id';
    } else if (location == 'showTaskDetails') {
        actualElementId = 'category-id-detailed';
    }
    return actualElementId;
}


/* ==========================================================================
   CSS Class hide functions
   ========================================================================== */

function openTaskDialog(containerId, taskIdOrProgressState) {
    showContent('show', 'cardBgr', 'd-none');
    if (containerId == 'add') {
        openDialogAddTask(taskIdOrProgressState);
    } else if (containerId == 'edit') {
        openDialogEditTask(taskIdOrProgressState);
    } else if (containerId == 'details') {
        openDialogTaskDetails(taskIdOrProgressState);
    }
}

function openDialogAddTask(taskIdOrProgressState) {
    document.getElementById('addtask-fly-in').classList.add('open');
    showContent('show', 'addTaskBox', 'd-none');
    addTask(taskIdOrProgressState);
}

function openDialogEditTask(taskIdOrProgressState) {
    showContent('hide', 'cardTaskDetails', 'd-none');
    editTask(taskIdOrProgressState);
        document.getElementById('edittask-fly-in').classList.add('open');
        showContent('show', 'editTaskBox', 'd-none');
}

function openDialogTaskDetails(taskIdOrProgressState) {
    console.log('openTaskDialog show details');
    document.getElementById('detailstask-fly-in').classList.add('open');
    showContent('show', 'cardTaskDetails', 'd-none');
    showTaskDetails(taskIdOrProgressState);
}

function closeTaskDialog() {
    let dialogs = ['add', 'edit', 'details'];
    for (let i = 0; i < dialogs.length; i++) {
        const dialog = dialogs[i];
        document.getElementById(`${dialog}task-fly-in`).classList.remove('open');
        document.getElementById(`${dialog}task-fly-in`).classList.add('close');
        setTimeout(() => {
            if (dialog == 'add' || dialog == 'edit') {
                showContent('hide', `${dialog}TaskBox`, 'd-none');
            } else if (dialog == 'details') {
                showContent('hide', `cardTaskDetails`, 'd-none');
            }
            document.getElementById(`${dialog}task-fly-in`).classList.remove('close');
            showContent('hide', 'cardBgr', 'd-none');
        }, 500);
    }
}

/**
 * Adds highlight effect to drag-n-drop columns
 * 
 * @param {number} id 
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}


/**
 * Remove highlight effect to drag-n-drop columns
 * @param {number} id 
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}


/**
 * Adds 'display none' css class, resets dropdown eventlistener and calls initTasks()
 * 
 * @param {number} cardid 
 */
function closeCard(cardid) {
    dropdownList.style.display = 'none';
    selectAssigneeElements();
    showContent('hide', cardid, 'd-none');
    showContent('hide', 'cardBgr', 'd-none');
    subtasks = [];
    initTasks();
}


/* ==========================================================================
   Functions to execute on load
   ========================================================================== */

initTasks();