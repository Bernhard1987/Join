let actualContact;


/**
 * Adds a new contact to the user's contact list.
 *
 * @function addContact
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
 * Resets the input fields for adding a new contact.
 *
 * @function resetAddContactInputs
 */

function resetAddContactInputs() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
}


/**
 * Deletes a contact from the user's contact list.
 *
 * @function deleteContact
 */

function deleteContact() {
    contact = user.contacts.find(contact => contact.id === actualContact);
    user.contacts.splice(contact, 1);
    closeContact();
    showContactList();
    updateUser();
}


/**
 * Populates input fields with contact details for editing.
 *
 * @function editContact
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
 *
 * @function saveContact
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
 *
 * @function showContactList
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
 * @function generateContactList
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
 * Adds a header element to the contact list for a new grouping letter.
 *
 * @function addFirstLetterToList
 * @param {string} firstLetter -> The first letter of a contact's name.
 * @param {string} currentHeader -> The current header letter.
 * @param {HTMLElement} contactList -> The container element for the contact list.
 */

function addFirstLetterToList(firstLetter, currentHeader, contactList) {
    if (firstLetter !== currentHeader) {
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
 * @function generateContactForList
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
 * @function showContact
 * @param {number} index -> The index of the contact to display.
 */

function showContact(id) {
    let contact = user.contacts.find(contact => contact.id === id);
    fillDetailedView(contact);
    document.getElementById('contact-detailed-info').classList.remove('d-none');
    showMobileContact();
    actualContact = contact.id;
}



/**
 * Fills the detailed view with contact information.
 *
 * @function fillDetailedView
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
 *
 * @function mobileDelete
 */

function mobileDelete() {
    deleteContact(); 
    showContent('hide', 'options-mobile', 'd-none'); 
    showContent('hide', 'contact-content', 'd-none'); 
    showMessage('assets/img/delete_white.svg', 'contact successfully deleted');
}


/* ==========================================================================
   CSS Class hide functions
   ========================================================================== */

/**
 * Closes the contact details view.
 *
 * @function closeContact
 */

function closeContact() {
    showContent('hide', 'contact-content', 'contact-content-mobile-d-none');
    showContent('hide', 'options-mobile', 'contact-content-mobile-d-none');
    showContent('show', 'contact-list-btn-mobile', 'contact-content-mobile-d-none');
}


/**
 * Displays contact details for mobile view.
 *
 * @function showMobileContact
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
 * @function contactTemplate
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
 * @function initContacts
 * @async
 */

async function initContacts() {
    await getActualUserData();
    showContactList();
}


initContacts();