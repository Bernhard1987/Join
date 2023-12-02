/**
 * Switches between two forms by toggling their visibility.
 *
 * @param {string} form1 -> The ID of the form to hide.
 * @param {string} form2 -> The ID of the form to display.
 */
function changeForm(form1, form2) {
    let nodisplay = document.getElementById(form1);
    let display = document.getElementById(form2);
    nodisplay.classList.add('d-none');
    display.classList.remove('d-none');
    checkActualForm(form1, form2);
}


/**
 * Updates the visibility of signup button based on the active form.
 *
 * @param {string} form1 -> The ID of the form that was hidden.
 * @param {string} form2 -> The ID of the form that is active.
 */
function checkActualForm(form1, form2) {
    if (form1 == 'login') {
        document.getElementById('signup-btn').classList.add('d-none');
    }
    else if (form1 == 'signup') {
        document.getElementById('signup-btn').classList.remove('d-none');
    }
    if (form2 == 'login') {
        document.getElementById('signup-btn').classList.remove('d-none');
    }
}


/**
 * Resets the user's password based on the provided email and new password.
 */
function resetPassword() {
    let email = document.getElementById('pwResetEmail').value;
    let password = document.getElementById('passwordReset').value;
    let passwordConfirm = document.getElementById('passwordConfirmReset').value;
    let notice = document.getElementById('supportingTextReset');
    comparePasswordsForResetPassword(password, passwordConfirm, email, notice);
}


/**
 * Compares and resets the password for a user if passwords match.
 *
 * @param {string} password -> The new password.
 * @param {string} passwordConfirm -> The confirmation of the new password.
 * @param {string} email -> The user's email address.
 * @param {HTMLElement} notice -> The notice element to display feedback.
 */
function comparePasswordsForResetPassword(password, passwordConfirm, email, notice) {
    if(password == passwordConfirm) {
        let user = users.find(user => user.email == email);
        updatePassword(user, password);
        notice.classList.add('d-none');
        changeForm('reset_pw', 'login');
        showMessage('../assets/img/check.svg','Password changed!');
    }
    else {
        notice.classList.remove('d-none');
    }
}


/**
 * Disables or enables a button based on the status of a checkbox.
 */
function disableButton() {
    let signupbtn = document.getElementById('signup-confirm');
    if (checkPolicy.checked) {
        signupbtn.disabled = false;
    }
    else {
        signupbtn.disabled = true;
    }
}