let actualContact;


/**
 * Adds a new contact to the user's contact list.
 */
function addContact() {
    let nameField = document.getElementById('name').value;
    let emailField = document.getElementById('email').value;
    let phoneField = document.getElementById('phone').value;
    let svg = createSVGForUser(nameField);

    let newContact = {
        'id': Date.now(),
        'name': nameField,
        'email': emailField,
        'phone': phoneField,
        'monogram': svg.outerHTML
    }

    user.contacts.push(newContact);
    setItem('users', users); // allgemeiner Schlüssel für alles ;)
    showContactList();
    showContent('hide', 'add-contact', 'd-none');
    resetAddContactInputs();
}


/**
 * Resets the input fields for adding a new contact.s
 */
function resetAddContactInputs() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
}


/**
 * Deletes a contact from the user's contact list.
 */
function deleteContact() {
    const index = user.contacts.findIndex(contact => contact.id === actualContact);
    if (index !== -1) {
        user.contacts.splice(index, 1);
        closeContact();
        showContactList();
        updateUser();
    } else {
        console.error("Contact not found");
    }
}



/**
 * Populates input fields with contact details for editing.
 */
function editContact() {
    contact = user.contacts.find(contact => contact.id === actualContact);
    document.getElementById('edit-name').value = contact.name;
    document.getElementById('edit-email').value = contact.email;
    document.getElementById('edit-phone').value = contact.phone;
    showContent('show', 'edit-contact', 'd-none');
}


/**
 * Saves edited contact details and updates the contact list.
 */
function saveContact() {
    let name = document.getElementById('edit-name').value;
    let email = document.getElementById('edit-email').value;
    let phone = document.getElementById('edit-phone').value;
    let monogram = createSVGForUser(name);
    contact.name = name;
    contact.email = email;
    contact.phone = phone;
    contact.monogram = monogram.outerHTML;

    setItem('users', users); // General key for everything ;)
    showContactList();
    showContent('hide', 'edit-contact', 'd-none');
    showContact(contact.id);
}


/**
 * Displays the user's contact list.
 */
function showContactList() {
    let contacts = user.contacts;
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    let contactList = document.getElementById('contact-list');
    contactList.innerHTML = ''; // Clear the current contacts

    let currentHeader = '';
    generateContactList(contacts, contactList, currentHeader);
}


/**
 * Generates and populates a contact list based on provided contact data.
 *
 * @param {Array} contacts -> The array of contacts to display.
 * @param {HTMLElement} contactList -> The container element for the contact list.
 * @param {string} currentHeader -> The current header for grouping contacts.
 */
function generateContactList(contacts, contactList, currentHeader) {
    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        let firstLetter = contact.name.charAt(0).toUpperCase();

        addFirstLetterToList(firstLetter, currentHeader, contactList);
        generateContactForList(contact, index, contactList);
    }
}

/**
 * Adds a header element to a contact list if the specified first letter does not
 * already exist as a header in the list.
 *
 * @param {string} firstLetter - The first letter to check and potentially add as a header.
 * @param {string} currentHeader - The current header in the contact list.
 * @param {HTMLElement} contactList - The HTML element representing the contact list.
 * @returns {void} - This function does not return any value.
 *
 * @example
 * // Usage example:
 * const firstLetter = 'A';
 * const currentHeader = 'B'; // Current header in the contact list
 * const contactList = document.getElementById('contact-list'); // Assuming 'contact-list' is the ID of the contact list element
 * addFirstLetterToList(firstLetter, currentHeader, contactList);
 */
function addFirstLetterToList(firstLetter, currentHeader, contactList) {
    const existingHeaders = contactList.getElementsByClassName('contact-header');
    console.log('existingHeaders', existingHeaders);
    const headerExists = Array.from(existingHeaders).some(header => header.innerText === firstLetter);
    if (!headerExists) {
        currentHeader = firstLetter;
        let headerElement = document.createElement('div');
        headerElement.classList.add('contact-header');
        headerElement.innerText = currentHeader;
        contactList.appendChild(headerElement);
    }
}


/**
 * Generates and appends a contact element to the contact list.
 *
 * @param {Object} contact -> The contact object containing name, email, and monogram.
 * @param {number} index -> The index of the contact.
 * @param {HTMLElement} contactList -> The container element for the contact list.
 */
function generateContactForList(contact, index, contactList) {
    let name = contact.name;
    let email = contact.email;
    let monogram = contact.monogram;

    let html = contactTemplate(contact.id, name, email, monogram);
    contactList.innerHTML += html;
}


/**
 * Displays detailed information for a contact.
 *
 * @param {number} index -> The index of the contact to display.
 */
function showContact(id) {
    let contact = user.contacts.find(contact => contact.id === id);
    fillDetailedView(contact);
    document.getElementById('contact-content').classList.remove('d-none');
    showMobileContact();
    actualContact = contact.id;
}



/**
 * Fills the detailed view with contact information.
 * 
 * @param {Object} contact -> The contact object containing name, email, phone, and monogram.
 */
function fillDetailedView(contact) {
    let showContactMonogram = document.getElementById('detailed-view-monogram');
    let showContactName = document.getElementById('detailed-view-contact-name');
    let showContactEmail = document.getElementById('detailed-view-contact-email');
    let showContactPhone = document.getElementById('detailed-view-contact-phone');

    showContactMonogram.innerHTML = contact.monogram;
    showContactName.innerHTML = contact.name;
    showContactEmail.innerHTML = contact.email;
    showContactPhone.innerHTML = contact.phone;
}


/**
 * Deletes a contact and provides a success message for mobile view.
 */
function mobileDelete() {
    deleteContact();
    showContent('hide', 'options-mobile', 'd-none');
    showContent('hide', 'contact-content', 'd-none');
    showMessage('./assets/img/delete_white.svg', 'contact successfully deleted');
}


/* ==========================================================================
   CSS Class hide functions
   ========================================================================== */

/**
 * Closes the contact details view.
 */
function closeContact() {
    showContent('hide', 'contact-content', 'd-none');
    showContent('hide', 'options-mobile', 'contact-content-mobile-d-none');
    showContent('show', 'contact-list-btn-mobile', 'contact-content-mobile-d-none');
}


/**
 * Displays contact details for mobile view.
 */
function showMobileContact() {
    showContent('hide', 'contact-list-btn-mobile', 'contact-content-mobile-d-none');
    showContent('show', 'contact-content', 'contact-content-mobile-d-none');
}


/* ==========================================================================
   HTML Template functions
   ========================================================================== */

/**
 * Generates an HTML template for displaying a contact item.
 *
 * @param {number} index -> The index of the contact item.
 * @param {string} name -> The name of the contact.
 * @param {string} email -> The email address of the contact.
 * @param {string} monogram -> The monogram for the contact.
 * @returns {string} -> The HTML template for the contact item.
 */
function contactTemplate(id, name, email, monogram) {
    return /*html*/ `   
        <div class="c-l-item" onclick="showContact(${id})">
            <div class="c-monogram">${monogram}</div>
            <div class="column-flex-start">
                <div class="row-8px">
                    <h6 class="name">${name}</h6>
                </div>
                <p class="link contact-mail">${email}</p>
            </div>
        </div>`;
}




/* ==========================================================================
   Functions to execute on load
   ========================================================================== */

/**
 * Initializes the contacts feature by fetching user data and displaying the contact list.
 *
 * @async
 */
async function initContacts() {
    await getActualUserData();
    showContactList();
}


initContacts();