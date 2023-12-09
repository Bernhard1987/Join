/* ==========================================================================
   General functions that don't belong to other js files
   ========================================================================== */

/**
 * Initializes the web application.
 */

async function init() {
    checkLogin();
    if (isLoggedIn()) {
        await includeHTML();
        setActiveLink();
        await displayUserSVG();
        showMenu();
    }
}


/**
 * Displays a message with an icon for a limited duration.
 *
 * @param {string} icon -> The path to the message icon image.
 * @param {string} text -> The text content of the message.
 */
function showMessage(icon, text) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<img class="" src="${icon}">`
    messageDiv.innerHTML += '<br>';
    messageDiv.innerHTML += text;
    messageDiv.classList.remove('d-none');

    setTimeout(function () {
        messageDiv.classList.add('d-none');
    }, 6000); // 6000 milliseconds are equal to 6 seconds
}


/**
 * Shows or hides an HTML element by adding or removing a CSS class.
 *
 * @param {string} showOrHide -> The action to show or hide the element ('show' or 'hide').
 * @param {string} classId -> The ID of the HTML element to modify.
 * @param {string} actualClass -> The CSS class to add or remove.
 */
function showContent(showOrHide, classId, actualClass) {
    if (showOrHide === 'show') {
        document.getElementById(classId).classList.remove(actualClass);
    } else if (showOrHide === 'hide') {
        document.getElementById(classId).classList.add(actualClass);
    }
}


/**
 * Shows or hides an HTML element by adding or removing a CSS class.
 *
 * @param {string} showOrHide -> The action to show or hide the element ('show' or 'hide').
 * @param {string} classId -> The ID of the HTML element to modify.
 * @param {string} actualClass -> The CSS class to add or remove.
 */
function showMenu() {
    let menu = document.getElementById('accountnav');
    let monogram = document.getElementById('account-img-container');
    monogram.addEventListener('mouseleave', function () {
        menu.classList.remove('open');
    });
    monogram.addEventListener('mouseenter', function () {
        menu.classList.add('open');
    });
}


/**
 * Checks if a user is logged in and redirects to the index page if not.
 */
function checkLogin() {
    let partiallyPath = window.location.pathname.split('/');
    let pageName = partiallyPath[partiallyPath.length - 1];
    if (!(pageName === 'index.html' ||
        pageName === 'privacy-policy.html' ||
        pageName === 'legal-notice.html')) {

        if (isLoggedIn()) {
            return;
        } else {
            window.location.href = "index.html";
        }

    }
}

function isLoggedIn() {
    if (localStorage.getItem('actualUser')) {
        return true;
    } else if (sessionStorage.getItem('actualUser')) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Sets the active state for menu links based on the current page URL.
 */
function setActiveLink() {
    if (window.location.href.indexOf('summary') != -1) {
        document.getElementById('summaryMenu').classList.add('active');
        document.getElementById('summaryNavMobile').classList.add('active');
    }
    if (window.location.href.indexOf('board') != -1) {
        document.getElementById('boardMenu').classList.add('active');
        document.getElementById('boardNavMobile').classList.add('active');
    }
    if (window.location.href.indexOf('add_task') != -1) {
        document.getElementById('addTaskMenu').classList.add('active');
        document.getElementById('addTaskNavMobile').classList.add('active');
    }
    if (window.location.href.indexOf('contacts') != -1) {
        document.getElementById('contactsMenu').classList.add('active');
        document.getElementById('contactsNavMobile').classList.add('active');
    }
    if (window.location.href.indexOf('privacy-policy') != -1) {
        document.getElementById('privacyMenu').classList.add('active');
        document.getElementById('privacyMenu').classList.add('active-undernav');
    }
    if (window.location.href.indexOf('legal-notice') != -1) {
        document.getElementById('legalMenu').classList.add('active');
        document.getElementById('legalMenu').classList.add('active-undernav');
    }
}


/**
 * Adds the 'active' class to the menu item corresponding to the current page.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
        const currentPathname = window.location.pathname;
        const currentPage = currentPathname.substring(currentPathname.lastIndexOf('/') + 1);
        const menuItems = document.querySelectorAll('.menuitem');
        menuItems.forEach(menuItem => {
            const link = menuItem.getAttribute('href');
            if (link === currentPage) {
                menuItem.classList.add('active');
            }
        });
    }, 100);
});


/* ==========================================================================
   W3 HTML include
   ========================================================================== */

/**
 * Includes HTML content from external files into specified elements.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


/**
 * Navigates the user either back in history or to the "index.html" page based on the login status.
 *
 * If the user is logged in, it navigates back in the browser history. 
 * If the user is not logged in, it redirects to the "index.html" page.
 */
function chooseNav() {
    if (checkLogin) {
        window.history.back()
    } else {
        window.location.href = "index.html";
    }
}