let subtasks = [];
let subtasksdone = [];
let assignedUsers = [];
let prio = 'Urgent';
let taskMode = 'add'; // 'add' oder 'edit'
let taskToEdit;
let taskProgressState;
const intervalID = setInterval(setMinDate, 100);

/**
 * Provides functionality for add task page
 */
async function initAddTaskPage() {
    await init();
    taskProgressState = 'toDo';
    taskMode = 'add';
    selectAssigneeElements();
}

/**
 * Adds a new task to the user's task list and updates the user data.
 *
 * @async
 */
async function addNewTask() {
    taskMode = 'add';
    let newTask = newTaskContent();

    user.tasks.push(newTask);
    updateUser();
    actionsNewTaskDependsLocation();
    resetForm('add');
    subtasks = [];
    showMessage('./assets/img/board.svg', 'Task added to Board!');
}

/**
 * Returns data structure for a new Task.
 */
function newTaskContent() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('categorySelect').value;
    let assignedto = assignedUsers;
    let duedate = document.getElementById('duedate').value;
    let id = Date.now();

    let newTask = {
        "title": title,
        "description": description,
        "category": category,
        "assignedto": assignedto,
        "duedate": duedate,
        "prio": prio,
        "subtasks": subtasks,
        "subtasksdone": subtasksdone,
        "status": taskProgressState,
        "id": id
    }
    return newTask;
}

/**
 * Actions after new task is created, depending on location
 */
function actionsNewTaskDependsLocation() {
    if (window.location.href.indexOf('board') != -1) {
        closeCard('addTaskBox');
        initTasks();
        selectAssigneeElements();
    } else {
        window.location.href = 'board.html';
    }
}


/**
 * Creates a new subtask for a given list.
 *
 * @param {string} list - The identifier of the list to which the subtask should be added.
 * @throws {Error} Throws an error if the list identifier is not found.
 */
function createSubtask(list) {
    let subtask = document.getElementById(`edit-subtask_${list}`);
    let subtaskdone = 'notdone';
    if (subtask.value.trim() !== '') {
        subtasks.push(subtask.value);
        subtasksdone.push(subtaskdone);
        document.getElementById('alert').innerHTML = '';
        subtask.value = '';
    }
    else {
        document.getElementById('alert').innerHTML = 'Please enter something';
        setTimeout(() => {
            document.getElementById('alert').innerHTML = '';
        }, 3000);
    }
    actualiseSubtaskList(list);
}


/**
 * Updates the subtask list in the specified HTML element with new subtask items.
 *
 * @param {string} list - The identifier of the HTML element where the subtask list should be updated.
 */
function actualiseSubtaskList(list) {
    let subTaskList = document.getElementById(list);
    subTaskList.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        let subtaskElement = document.createElement('li');
        subtaskElement.innerHTML += /*html*/ `<div id="subtask${index}_${list}">${subtask}</div>`;
        subtaskElement.innerHTML += getSubtaskTemplate(index, list);
        subtaskElement.classList.add('d-flex-space-between');
        subTaskList.appendChild(subtaskElement);
    });
}


/**
 * Removes a subtask from the 'subtasks' array and updates the subtask list in the specified HTML element.
 *
 * @param {number} index - The index of the subtask to be removed from the 'subtasks' and 'subtasksdone' arrays.
 * @param {string} list - The identifier of the HTML element where the subtask list should be updated.
 * @throws {Error} Throws an error if the provided index is out of bounds or if updating the subtask list fails.
 */
function removeSubtask(index, list) {
    subtasks.splice(index, 1);
    subtasksdone.splice(index, 1);
    actualiseSubtaskList(list);
}


/**
 * Prepares the application to add a new task.
 */
function addTask() {
    taskProgressState = 'toDo';
    taskMode = 'add';
    assignedUsers = [];
    selectAssigneeElements();
    showTask('addTaskBox');

    document.getElementById('addSubtasksList').innerHTML = '';
}


/**
 * Prepares the application to add a new task with a specified progress state.
 *
 * @param {string} state - The progress state of the new task (e.g., 'toDo', 'inProgress', 'completed').
 */
function addTaskSmallBtn(state) {
    taskProgressState = state;
    taskMode = 'add';
    showTask('addTaskBox');
}


/**
 * Prepares the application to edit an existing task with the specified task ID.
 *
 * @param {number} taskId - The unique identifier of the task to be edited.
 * @throws {Error} Throws an error if the provided task ID is invalid or if any UI updates fail.
 */
function editTask(taskId) {
    taskMode = 'edit';
    taskToEdit = user.tasks[taskId];
    assignedUsers = taskToEdit.assignedto;
    selectAssigneeElements();

    document.getElementById('edit-title').value = taskToEdit.title;
    document.getElementById('edit-description').value = taskToEdit.description;
    document.getElementById('edit-category').value = taskToEdit.category;
    document.getElementById('edit-duedate').value = taskToEdit.duedate;
    document.getElementById('edit-progress-state').value = taskToEdit.status;
    setPrio(taskToEdit.prio, 'edit');
    document.getElementById('editSubtasksList').innerHTML = actualiseSubtaskList('editSubtasksList');
    listEditSubtasks(taskId);
    subtasks = user.tasks[taskId].subtasks;

    showContent('hide', 'cardTaskDetails', 'd-none');
    showContent('show', 'editTaskBox', 'd-none');
    showContent('show', 'cardBgr', 'd-none');
}


/**
 * Saves the edited task with updated information.
 */
function saveEditedTask() {
    let title = document.getElementById('edit-title').value;
    let description = document.getElementById('edit-description').value;
    let assignedto = assignedUsers;
    let duedate = document.getElementById('edit-duedate').value;
    let newPrio = prio;
    let category = document.getElementById('edit-category').value;
    let progressState = document.getElementById('edit-progress-state').value;

    taskToEdit.title = title;
    taskToEdit.description = description;
    taskToEdit.assignedto = assignedto;
    taskToEdit.duedate = duedate;
    taskToEdit.prio = newPrio;
    taskToEdit.category = category;
    taskToEdit.status = progressState;

    updateUser();
    initTasks();
    closeCard('editTaskBox');
    showMessage('./assets/img/check.svg', 'Task successfully updated!');
}


/**
 * Deletes a task with the specified task ID and performs related actions.
 *
 * @param {number} taskId - The unique identifier of the task to be deleted.
 * @throws {Error} Throws an error if the provided task ID is invalid or if any action fails.
 */
function deleteTask(taskId) {
    user.tasks.splice(taskId, 1);
    updateUser();
    closeCard('cardTaskDetails');
    initTasks();
    showMessage('./assets/img/delete_white.svg', 'Task successfully deleted!');
}


/**
 * Populates the options of select fields in the task editing interface based on user task data.
 *
 * @param {object} userTask - The user task data containing information to populate select fields.
 * @throws {Error} Throws an error if any of the select field operations fail.
 */
function selectEditTaskOptions(userTask) {
    for (let i = 0; i < selectFieldIds.length; i++) {
        const actualSelectField = selectFieldIds[i];
        let actualValueToLoad = getActualSelectField(actualSelectField, userTask);

        setOptionsInSelect(actualValueToLoad, actualSelectField);
    }
}


/**
 * Selects the appropriate subtask list element based on the current task mode.
 *
 * @returns {HTMLElement} The HTML element representing the selected subtask list.
 */
function selectSubtaskList() {
    let selectCorrectSubtaskList;
    if (taskMode == 'edit') {
        selectCorrectSubtaskList = document.getElementById('editSubtasksList');
    } else if (taskMode == 'add') {
        selectCorrectSubtaskList = document.getElementById('addSubtasksList');
    }
    return selectCorrectSubtaskList;
}


/**
 * Retrieves the actual value to load into a select field based on the select field identifier and user task data.
 *
 * @param {string} actualSelectField - The identifier of the select field to retrieve data for (e.g., 'edit-category', 'edit-assignedto').
 * @param {object} userTask - The user task data containing information to populate select fields.
 * @returns {string} The actual value to load into the specified select field.
 */
function getActualSelectField(actualSelectField, userTask) {
    if (actualSelectField == 'edit-category') {
        actualValueToLoad = userTask.category;
    } else if (actualSelectField == 'edit-assignedto') {
        actualValueToLoad = userTask.assignedto;
    }
    return actualValueToLoad;
}


/**
 * Sets the selected option in a select field based on the actual value to load.
 *
 * @param {string} actualValueToLoad - The actual value to load into the select field.
 * @param {string} actualSelectField - The identifier of the select field to set options in.
 */
function setOptionsInSelect(actualValueToLoad, actualSelectField) {
    let actualSelectFieldDocument = document.getElementById(actualSelectField);

    for (let j = 0; j < actualSelectFieldDocument.options.length; j++) {
        const actualOption = actualSelectFieldDocument.options[j];

        if (actualOption.value == actualValueToLoad) {
            document.getElementById(actualSelectField).setAttribute("selected", "true");
            break;
        } else {
            document.getElementById(actualSelectField).setAttribute("selected", "false");
        }
    }
}


/**
 * Prepares a subtask for editing within a specified list.
 *
 * @param {number} index - The index of the subtask to be edited.
 * @param {string} list - The identifier of the list containing the subtask to be edited.
 */
function editSubtask(index, list) {
    let subtask = document.getElementById(`subtask${index}_${list}`);
    let editIcons = document.getElementById(`editIcons${index}_${list}`);
    let inputDiv = document.getElementById(`editSubtaskInputDiv_${index}_${list}`);
    let input = document.getElementById(`editSubtaskInput_${index}_${list}`);
    subtask.classList.add('d-none');
    editIcons.classList.add('d-none');
    inputDiv.classList.remove('d-none');
    input.value = subtasks[index];
}


/**
 * Confirms the editing of a subtask and updates the subtask list in the specified list.
 *
 * @param {number} index - The index of the subtask being edited.
 * @param {string} list - The identifier of the list containing the subtask.
 */
function confirmEditSubtask(index, list) {
    let editedSubtask = document.getElementById(`editSubtaskInput_${index}_${list}`);
    subtasks[index] = editedSubtask.value;
    actualiseSubtaskList(list);
    editedSubtask.classList.add('d-none');
}


/**
 * Resets the form fields of either the "Add Task" or "Edit Task" form.
 *
 * @param {string} addOrEdit - A string specifying whether to reset the "Add Task" or "Edit Task" form ('add' or 'edit').
 */
function resetForm(addOrEdit) {
    if (addOrEdit == 'add') {
        document.getElementById('addTaskForm').reset();
    } else if (addOrEdit == 'edit') {
        document.getElementById('editTaskForm').reset();
    }
    dropdownList.innerHTML = '';
    dropdownInput.value = '';
    assignedUsers = [];
    subtasks = [];
    selectAssigneeElements();
}


/**
 * Sets the minimum date for an HTML input element with the ID 'duedate' to the current date.
 * Clears an interval (if defined) after setting the minimum date.
 *
 * @returns {void}
 */
function setMinDate() {
    const element = document.getElementById('duedate');

    if (element) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const currentDate = `${year}-${month}-${day}`;
        element.min = currentDate;

        clearInterval(intervalID);  // Stop the interval once the element is found and min is set
    }
}