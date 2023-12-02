/**
 * Returns multiple collected svgs to loadTasks Function.
 * 
 * @var {number} maxVisibleSVGs Here you can adjust displayed svgs (numbered svg excluded)
 * @param {id} task 
 * @returns 
 */
function getAllSVGsForTask(task) {
    const maxVisibleSVGs = 7;
    let collectedSVGs = '';
    let currentListedItems = 0;
    const taskAssignedTo = task.assignedto;

    const findSVGs = findSVGsForContactsAndUser(maxVisibleSVGs, collectedSVGs, currentListedItems, taskAssignedTo);
    collectedSVGs = findSVGs.collectedSVGs;
    currentListedItems = findSVGs.currentListedItems;

    collectedSVGs = setNumberSVG(currentListedItems, taskAssignedTo, collectedSVGs);

    return collectedSVGs;
}


/**
 * Checks all contacts and current user to find belonging svgs.
 * adds +1 to currentListedItems if one contact or the user is found.
 * 
 * @param {number} maxVisibleSVGs 
 * @param {string} collectedSVGs 
 * @param {number} currentListedItems 
 * @param {array} taskAssignedTo 
 * @returns 
 */
function findSVGsForContactsAndUser(maxVisibleSVGs, collectedSVGs, currentListedItems, taskAssignedTo) {
    for (let i = 0; i < taskAssignedTo.length; i++) {
        const assignedUserId = taskAssignedTo[i];
        const foundContact = user.contacts.find(contact => contact.id === assignedUserId);
        if (foundContact) {
            const result = addSVG(collectedSVGs, currentListedItems, maxVisibleSVGs, foundContact.monogram);
            collectedSVGs = result.collectedSVGs;
            currentListedItems = result.currentListedItems;
        } else if (assignedUserId === actualUser) {
            const result = addSVG(collectedSVGs, currentListedItems, maxVisibleSVGs, user.svg);
            collectedSVGs = result.collectedSVGs;
            currentListedItems = result.currentListedItems;
        }
    }
    return { collectedSVGs, currentListedItems };
}


/**
 * Checks if currentListedItems is smaller than taskAssignedTo.length. If so,
 * the subtracted number is provided to addNumberSVG() function.
 * 
 * @param {number} currentListedItems 
 * @param {array} taskAssignedTo 
 * @param {string} collectedSVGs 
 * @returns 
 */
function setNumberSVG(currentListedItems, taskAssignedTo, collectedSVGs) {
    if (currentListedItems < taskAssignedTo.length) {
        const additionalSVGs = taskAssignedTo.length - currentListedItems;
        collectedSVGs += addNumberSVG(additionalSVGs);
    }
    return collectedSVGs;
}


/**
 * Sets the number of additional assignees if maxVisibleSVGs in getAllSVGsForTask() is higher than
 * selected value.
 * 
 * @param {*} collectedSVGs 
 * @param {*} currentListedItems 
 * @param {*} maxVisibleSVGs 
 * @param {*} monogram 
 * @returns 
 */
function addSVG(collectedSVGs, currentListedItems, maxVisibleSVGs, monogram) {
    if (currentListedItems < maxVisibleSVGs) {
        collectedSVGs += monogram;
        currentListedItems++;
    }
    return { collectedSVGs, currentListedItems };
}


/**
 * This is the svg template for additional number svg.
 * 
 * @param {number} result 
 * @returns 
 */
function addNumberSVG(result) {
    let additionalSVG = `
    <svg width="100%" height="100%" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#000000"></circle>
        <text x="50" y="60" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
            +${result}
        </text>
    </svg>
    `;
    return additionalSVG;
}