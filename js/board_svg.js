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
    collectedSVGs = setNumberSVG(currentListedItems, maxVisibleSVGs, collectedSVGs);

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
        } else {
            const unknownSVG = addCustomSVG('?');
            const result = addSVG(collectedSVGs, currentListedItems, maxVisibleSVGs, unknownSVG);
            collectedSVGs = result.collectedSVGs;
            currentListedItems = result.currentListedItems;
        }
    }
    return { collectedSVGs, currentListedItems };
}

/**
 * Sets the number of SVGs based on the current listed items, maximum visible SVGs, and the collected SVGs.
 *
 * @param {number} currentListedItems - The current number of listed items.
 * @param {number} maxVisibleSVGs - The maximum number of SVGs visible at a time.
 * @param {string} collectedSVGs - The currently collected SVGs as a string.
 * @returns {string} The updated collected SVGs string.
 */
function setNumberSVG(currentListedItems, maxVisibleSVGs, collectedSVGs) {
    if (currentListedItems > maxVisibleSVGs) {
        const additionalSVGs = currentListedItems - maxVisibleSVGs;
        collectedSVGs += addCustomSVG(`+${additionalSVGs}`);
    }
    return collectedSVGs;
}


/**
 * Adds an SVG to the collected SVGs based on the current listed items, maximum visible SVGs, and a monogram.
 *
 * @param {string} collectedSVGs - The currently collected SVGs as a string.
 * @param {number} currentListedItems - The current number of listed items.
 * @param {number} maxVisibleSVGs - The maximum number of SVGs visible at a time.
 * @param {string} monogram - The monogram to be added as an SVG.
 * @returns {Object} An object containing the updated collected SVGs string and the incremented currentListedItems.
 */
function addSVG(collectedSVGs, currentListedItems, maxVisibleSVGs, monogram) {
    if (currentListedItems < maxVisibleSVGs) {
        collectedSVGs += monogram;
    }
    currentListedItems++;
    return { collectedSVGs, currentListedItems };
}


/**
 * This is the svg template for additional number svg.
 * 
 * @param {number} result 
 * @returns 
 */
function addCustomSVG(result) {
    let additionalSVG = `
    <svg width="100%" height="100%" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#000000"></circle>
        <text x="50" y="60" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
            ${result}
        </text>
    </svg>
    `;
    return additionalSVG;
}