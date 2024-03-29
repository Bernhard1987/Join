let searchTermAssignee;
let filteredAssignees;
let dropdownInput;
let dropdownList;
let dropdownBoxEventListenerStarted = false;


/**
 * Selects the relevant HTML elements for displaying assigned users and updates them.
 */
async function selectAssigneeElements() {
    await selectDropdownBoxElement();
    showAssigneeList();
    listAssignedUsersBox();
    selectDropdownBox();
}


/**
 * Adds a new assignee.
 *
 * @param {string} contactId - The ID of the contact to be added.
 */
function addNewAssignee(contactId) {
    if (assignedUsers.indexOf(contactId) == -1) {
        assignedUsers.push(contactId);
    }
    dropdownInput.value = '';
    selectAssigneeElements();
}


/**
 * Lists assigned users and updates the corresponding HTML element (addTask or editTask).
 */
function listAssignedUsersBox() {
    let assignedUsersBox;
    if (taskMode == 'add') {
        assignedUsersBox = document.getElementById('addtask-assigned-users-box');
    } else {
        assignedUsersBox = document.getElementById('edittask-assigned-users-box');
    }
    checkAssignedUsersLength(assignedUsers, assignedUsersBox);
}


/**
 * Adds a placeholder if no assignedUsers were found.
 * 
 * @param {array} assignedUsers - assignedUsers of a task
 * @param {id} assignedUsersBox  - id of html element assigned users box
 */
function checkAssignedUsersLength(assignedUsers, assignedUsersBox) {
    if (assignedUsers.length === 0) {
        assignedUsersBox.innerHTML = `
            <div class="assigned-users-placeholder">
                No assigned users yet
            </div>
        `;
    } else {
        generateAssignedUserList(assignedUsersBox);
    }
}


/**
 * Generates a list of already assigned users and updates the provided HTML element.
 * Assigned users can be contacts or the current user.
 *
 * @param {HTMLElement} assignedUsersBox - The HTML element representing the assigned users list.
 */
function generateAssignedUserList(assignedUsersBox) {
    assignedUsersBox.innerHTML = '';
    for (let i = 0; i < assignedUsers.length; i++) {
        const assignedUserId = assignedUsers[i];
        const foundContact = user.contacts.find(contact => contact.id === assignedUserId);
        if (foundContact) {
            assignedUsersBox.innerHTML += assigneeListHTMLTemplate(foundContact.name, i);
        } else if (assignedUserId === actualUser) {
            assignedUsersBox.innerHTML += assigneeListHTMLTemplate('You', i);
        } else {
            assignedUsersBox.innerHTML += assigneeListHTMLTemplate(`Deleted (id: ${assignedUserId})`, i);
        }
    }
}


/**
 * Deletes an assignee based on their index in the assigned users list.
 *
 * @param {number} i - The index of the assignee to be deleted.
 */
function deleteAssignee(i) {
    assignedUsers.splice(i, 1);
    listAssignedUsersBox();
}


/**
 * Displays the list of available assignees and updates the dropdown element.
 */
function showAssigneeList() {
    let contacts = user.contacts;
    let contactsDropDown;
    if (taskMode == 'add') {
        contactsDropDown = document.getElementById('addtask-assigned-dropdown-list');
    } else {
        contactsDropDown = document.getElementById('edittask-assigned-dropdown-list');
    }

    addAssigneeToAssigneeList(contactsDropDown, contacts);
}

function addAssigneeToAssigneeList(contactsDropDown, contacts) {
    let assigneeListInterval = setInterval(() => {
        if (contactsDropDown) {
            contactsDropDown.innerHTML = '';
            contactsDropDown.innerHTML += `<li onclick="addNewAssignee('${user.id}')">${user.name} (You)</li>`;

            for (let i = 0; i < contacts.length; i++) {
                const contactName = contacts[i].name;
                const contactId = contacts[i].id;
                contactsDropDown.innerHTML +=
                    `<li onclick="addNewAssignee(${contactId})">${contactName}</li>`;
            }
            clearInterval(assigneeListInterval);
        }
    }, 50);
}


/**
 * Selects the relevant HTML elements for the dropdown based on the task mode (add or edit).
 * Uses an interval to periodically check for the existence of the required elements.
 * The function sets global variables: `dropdownInput` and `dropdownList`.
 * 
 */
function selectDropdownBoxElement() {
    let checksetDropdownElementsInterval = setInterval(() => {
        if (taskMode == 'add') {
            dropdownInput = document.getElementById('addtask-assign-new-user');
            dropdownList = document.getElementById('addtask-assigned-dropdown-list');
        } else if (taskMode == 'edit') {
            dropdownInput = document.getElementById('edittask-assign-new-user');
            dropdownList = document.getElementById('edittask-assigned-dropdown-list');
        }
        if (dropdownInput && dropdownList) {
            clearInterval(checksetDropdownElementsInterval);
        }
    }, 10);
}


/**
 * Filters the displayed assignees based on the entered search term.
 */
function filterAssignees() {
    let listElements = dropdownList.getElementsByTagName('li');

    for (let i = 0; i < listElements.length; i++) {
        let contact = listElements[i];
        if (contact.innerHTML.toLowerCase().indexOf(dropdownInput.value.toLowerCase()) > -1) {
            listElements[i].style.display = '';
        } else {
            listElements[i].style.display = 'none';
        }
    }
}


/**
 * Is only executed if it hasn't already been executed before.
 */
function selectDropdownBox() {
    if (!dropdownBoxEventListenerStarted) {
        let eventListenerInterval = setInterval(() => {
            if (dropdownInput && dropdownList) {
                addDropdownEventListenerStart();
                addDropdownEventListenerCloseByClickAnywhere();
                addDropdownEventListenerCloseByClickOnLI();
                clearInterval(eventListenerInterval);
            }
        }, 10);

    }
}

/**
 * First eventListener for dropdownBox. Toggles the visibility.
 */
function addDropdownEventListenerStart() {
    dropdownInput.addEventListener('click', function (event) {
        event.stopImmediatePropagation();
        if (dropdownList.style.display === 'none' || dropdownList.style.display === '') {
            dropdownList.style.display = 'block';
            dropdownBoxEventListenerStarted = true;
        } else {
            dropdownList.style.display = 'none';
        }
    });
}

/**
 * Second eventListener closes the dropdown if user clicks outside of it.
 */
function addDropdownEventListenerCloseByClickAnywhere() {
    document.addEventListener('click', function (event) {
        event.stopImmediatePropagation();
        if (!dropdownInput.contains(event.target) && !dropdownList.contains(event.target)) {
            dropdownList.style.display = 'none';
            dropdownBoxEventListenerStarted = false;
        }
    });
}

/**
 * Third eventListener handles the selection of dropdown items.
 */
function addDropdownEventListenerCloseByClickOnLI() {
    dropdownList.addEventListener('click', function (event) {
        event.stopImmediatePropagation();
        if (event.target.tagName === 'LI') {
            dropdownList.style.display = 'none';
            dropdownBoxEventListenerStarted = false;
        }
    });
}