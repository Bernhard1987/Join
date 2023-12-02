/**
 * Sets the priority level and updates the corresponding user interface elements.
 * 
 * @param {string} selectedPrio - The priority level to be set.
 * @param {string} addOrEdit - A string specifying whether the priority is being set in an "Add" or "Edit" context.
 */
function setPrio(selectedPrio, addOrEdit) {
    prio = selectedPrio;
    let acutalPrioIds = selectPrioIdSet(addOrEdit);
    selectCorrectBtn(selectedPrio, acutalPrioIds);
}


/**
 * Selects the set of priority button and image IDs based on the context (add or edit).
 *
 * @param {string} addOrEdit - A string specifying whether the function is used in an "Add" or "Edit" context.
 * @returns {Array<string>} An array of priority button and image IDs to work with based on the context.
 */
function selectPrioIdSet(addOrEdit) {
    let actualPrioIds = [];

    if (addOrEdit == 'edit') {
        actualPrioIds = ['edit-btnUrgent', 'edit-imgPrioUrgent', 'edit-btnMedium', 'edit-imgPrioMedium', 'edit-btnLow', 'edit-imgPrioLow'];
    } else if (addOrEdit == 'add') {
        actualPrioIds = ['btnUrgent', 'imgPrioUrgent', 'btnMedium', 'imgPrioMedium', 'btnLow', 'imgPrioLow'];
    }

    return actualPrioIds;
}


/**
 * Selects the correct button based on the selected priority and updates
 * the priority using the provided actual priority IDs.
 *
 * @param {string} selectedPrio - The selected priority, which can be one of 'Urgent', 'Medium', or 'Low'.
 * @param {Array<string>} acutalPrioIds - An array of actual priority IDs to be updated.
 * @returns {void}
 */
function selectCorrectBtn(selectedPrio, acutalPrioIds) {
    if (selectedPrio == 'Urgent') {
        updatePriority(acutalPrioIds, 'urgent');;
    }
    if (selectedPrio == 'Medium') {
        updatePriority(acutalPrioIds, 'medium');;
    }
    if (selectedPrio == 'Low') {
        updatePriority(acutalPrioIds, 'low');;
    }
}


/**
 * Updates the priority display based on the specified priority value.
 *
 * @param {string[]} acutalPrioIds - An array of HTML element IDs associated with priority display elements.
 * @param {string} priority - The priority value to set, which can be 'urgent', 'medium', or 'low'.
 * @returns {void}
 */
function updatePriority(acutalPrioIds, priority) {
    if (priority === 'urgent') {
        showContent('hide', acutalPrioIds[0], 'addtask-priority-urgent');
        document.getElementById(acutalPrioIds[1]).src = './assets/img/addtask_urgent_white.svg';
        showContent('show', acutalPrioIds[2], 'addtask-priority-medium');
        document.getElementById(acutalPrioIds[3]).src = './assets/img/addtask_medium.svg';
        showContent('show', acutalPrioIds[4], 'addtask-priority-low');
        document.getElementById(acutalPrioIds[5]).src = './assets/img/addtask_low.svg';
    } else if (priority === 'medium') {
        showContent('show', acutalPrioIds[0], 'addtask-priority-urgent');
        document.getElementById(acutalPrioIds[1]).src = './assets/img/addtask_urgent.svg';
        showContent('hide', acutalPrioIds[2], 'addtask-priority-medium');
        document.getElementById(acutalPrioIds[3]).src = './assets/img/addtask_medium_white.svg';
        showContent('show', acutalPrioIds[4], 'addtask-priority-low');
        document.getElementById(acutalPrioIds[5]).src = './assets/img/addtask_low.svg';
    } else if (priority === 'low') {
        showContent('show', acutalPrioIds[0], 'addtask-priority-urgent');
        document.getElementById(acutalPrioIds[1]).src = './assets/img/addtask_urgent.svg';
        showContent('show', acutalPrioIds[2], 'addtask-priority-medium');
        document.getElementById(acutalPrioIds[3]).src = './assets/img/addtask_medium.svg';
        showContent('hide', acutalPrioIds[4], 'addtask-priority-low');
        document.getElementById(acutalPrioIds[5]).src = './assets/img/addtask_low_white.svg';
    }
}