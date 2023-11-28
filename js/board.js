let filteredTasks = [];
let searchTerm;
if (document.getElementById('search'))
    searchTerm = document.getElementById('search').value
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
 * This function is responsible for generation all task items in board task item list. It uses forEach-method to iterate through all JSONs, that are inside of the array tasks.
 * It calls taskHTMLTemplate with all data in the JSON, separated to many variables. This function returns with a complete generated task item.
 * Inside the forEach method, after the new item element was generated, it executes checkProgressBar() and colorizeCategory(), which are responsible for showing or hiding subtask 
 * progressbar and coloring the category div.
 * After forEach, more functions are called: 
 * removePadding() is there to remove padding for list column, for the case one column isn't empty
 * displayPlaceholder() displays a hint when one column stays empty
 * addHighlightBox() adds another div to each column, which is invisible and only gets visible if an item is dragged to specific column
 * 
 * @param {*} tasks - includes all user tasks in JSON format
 */

function loadTasks(tasks) {
    tasks.forEach(task => {
        let id = task.id;
        let title = task.title;
        let description = task.description;
        let category = task.category;
        let svg = getAllSVGs(task);
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

function getAllSVGs(task) {
    let collectedSVGs = '';
    const taskAssignedTo = task.assignedto;
    for (let i = 0; i < taskAssignedTo.length; i++) {
        const assignedUserId = taskAssignedTo[i];
        const foundContact = user.contacts.find(contact => contact.id === assignedUserId);
        if (foundContact) {
            collectedSVGs += foundContact.monogram;
        } else if (assignedUserId === actualUser) {
            collectedSVGs += user.svg;
        }
    }
    console.log(collectedSVGs);
    return collectedSVGs;
}

/**
 * This function checks if progress bar is necessary
 * 
 * If -> show progress bar -> execute function 'fillProgressBar'
 * Else -> hide progress bar
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
 * 'let idInArray' -> '.findIndex' returns position in array
 * 
 * '(task => task.id == id);' In this function, a single element task is passed 
 * as a parameter and it is checked whether the id property of the task object is equal to the value of id.
 * If this condition is met, the function returns true, otherwise it returns false.
 * 
 * Variables for 'taskDetailsHTMLTemplate' function
 * 
 * @param {number} id -> Task id
 */

async function showTaskDetails(id) {
    let idInArray = user.tasks.findIndex(task => task.id == id);
    let title = user.tasks[idInArray].title;
    let description = user.tasks[idInArray].description;
    let assignedto = user.tasks[idInArray].assignedto;
    let svg = user.svg;
    let category = user.tasks[idInArray].category;
    let duedate = user.tasks[idInArray].duedate;
    let prio = user.tasks[idInArray].prio;
    let taskDetails = document.getElementById('cardTaskDetails');

    taskDetails.innerHTML = taskDetailsHTMLTemplate(idInArray, title, description, assignedto, svg, category, duedate, prio);
    listSubtasks(idInArray);
    subtaskCheckboxCheck(idInArray);
    showTask('cardTaskDetails');
    taskprioImageIntoId(prio);

    colorizeCategory(category, idInArray, 'showTaskDetails');
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
 * This function retrieves the user's tasks and filters them based on a provided search term.
 * It then displays the filtered tasks using the 'displayTasks' function.
 *
 * @function
 * @throws {Error} Throws an error if 'document.getElementById' or 'displayTasks' is undefined.
 */

function filterTasks() {
    searchTerm = document.getElementById('search').value.toLowerCase();
    filteredTasks = [];  // Resetting the filteredTasks array
    if (searchTerm != '') {
        user.tasks.forEach(task => {
            if (task.title.toLowerCase().includes(searchTerm)) {
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
 * This function removes 'display none' css class form tasks (pop up/dialog + background)
 * 
 * @param {string} divIdToShow 
 */

function showTask(divIdToShow) {
    let taskBox = document.getElementById(divIdToShow);
    let card = document.getElementById('cardBgr');
    taskBox.classList.remove('d-none');
    card.classList.remove('d-none');
}


/**
 * Adds 'display none' css class
 * 
 * @param {number} cardid 
 */

function closeCard(cardid) {
    showContent('hide', cardid, 'd-none');
    showContent('hide', 'cardBgr', 'd-none');
    initTasks();
}


/* ==========================================================================
   HTML template functions
   ========================================================================== */

/**
 * Function displays placeholder
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
 * Function removes padding progress columns
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
 * Function adds "box to drag" the "task item" inside
 */

function addHighlightBox() {
    let progressIds = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
    progressIds.forEach(progress => {
        document.getElementById(progress).innerHTML += `<div id="drag-area-${progress}" class="drag-area"></div>`;
    });
}


/**
 * Function fills blue progress line into progess bar (calc %)
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
 * Adds prio image beneath progress bar in task card
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


/* ==========================================================================
   Functions to execute on load
   ========================================================================== */

initTasks();