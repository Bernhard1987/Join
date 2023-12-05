let searchTermAssignee;
let filteredAssignees;
let dropdownInput;
let dropdownList;
let dropdownBoxEventListenerStarted = false;


/**
 * Selects the relevant HTML elements for displaying assigned users and updates them.
 */
function selectAssigneeElements() {
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
    let assigneeInput;
    if (taskMode == 'add') {
        assigneeInput = document.getElementById('addtask-assign-new-user');
    } else {
        assigneeInput = document.getElementById('edittask-assign-new-user');
    }

    if (assignedUsers.indexOf(contactId) == -1) {
        assignedUsers.push(contactId);
    }
    assigneeInput.value = '';
    selectAssigneeElements();
}


/**
 * Lists assigned users and updates the corresponding HTML element.
 * Adds a placeholder if no assignedUsers were found.
 */
function listAssignedUsersBox() {
    let assignedUsersBox;
    if (taskMode == 'add') {
        assignedUsersBox = document.getElementById('addtask-assigned-users-box');
    } else {
        assignedUsersBox = document.getElementById('edittask-assigned-users-box');
    }

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

    contactsDropDown.innerHTML = '';
    contactsDropDown.innerHTML += `<li onclick="addNewAssignee('${user.id}')">${user.name}</li>`;

    for (let i = 0; i < contacts.length; i++) {
        const contactName = contacts[i].name;
        const contactId = contacts[i].id;
        contactsDropDown.innerHTML +=
            `<li onclick="addNewAssignee(${contactId})">${contactName}</li>`;
    }
}


/**
 * Selects the relevant HTML elements for the dropdown based on the editing mode.
 */
function selectDropdownBoxElement() {
    if (taskMode == 'add') {
        dropdownInput = document.getElementById('addtask-assign-new-user');
        dropdownList = document.getElementById('addtask-assigned-dropdown-list');
    } else if (taskMode == 'edit') {
        dropdownInput = document.getElementById('edittask-assign-new-user');
        dropdownList = document.getElementById('edittask-assigned-dropdown-list');
    }
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
 * Starts eventListeners for dropdownBox. First eventListener Toggles the visibility, 
 * second eventListener closes the dropdown if user clicks outside of it. Third
 * eventListener handles the selection of dropdown items.
 */
function selectDropdownBox() {
    if (!dropdownBoxEventListenerStarted) {
        selectDropdownBoxElement();

        dropdownInput.addEventListener('click', function () {
            if (dropdownList.style.display === 'none' || dropdownList.style.display === '') {
                dropdownList.style.display = 'block';
                dropdownBoxEventListenerStarted = true;
            } else {
                dropdownList.style.display = 'none';
            }
        });

        document.addEventListener('click', function (event) {
            if (!dropdownInput.contains(event.target) && !dropdownList.contains(event.target)) {
                dropdownList.style.display = 'none';
                dropdownBoxEventListenerStarted = false;
            }
        });

        dropdownList.addEventListener('click', function (event) {
            if (event.target.tagName === 'LI') {
                dropdownList.style.display = 'none';
                dropdownBoxEventListenerStarted = false;
            }
        });
    }
}