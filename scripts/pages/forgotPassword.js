import { userRegistrationKey } from "../config/storageKeys.js";

function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    return element;
}

function createForgotPasswordPage() {
    const container = createElementWithClass("div", "forgot-password-container");

    const logoLink = document.createElement("a");
    logoLink.href = "home.html";

    const logo = document.createElement("img");
    logo.src = "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg";
    logo.classList.add("forgot-password-logo");
    logo.alt = "Amazon Logo";

    logoLink.append(logo);

    const box = createElementWithClass("div", "forgot-password-box");

    const title = document.createElement("h2");
    title.textContent = "Forgot Password";

    const form = document.createElement("form");
    form.id = "forgotPasswordForm";

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "forgotUsername";
    usernameInput.placeholder = "Email or mobile number";
    usernameInput.autocomplete = "username";

    const usernameError = createElementWithClass("p", "error-message");
    usernameError.id = "usernameError";

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "newPassword";
    passwordInput.placeholder = "New Password";
    passwordInput.maxLength = 16;
    passwordInput.autocomplete = "new-password";

    const passwordError = createElementWithClass("p", "error-message");
    passwordError.id = "passwordError";

    const resetButton = document.createElement("button");
    resetButton.type = "submit";
    resetButton.textContent = "Reset Password";

    const signInContainer = createElementWithClass("div", "sign-in-link");

    const signInText = document.createElement("p");
    signInText.textContent = "Remembered your password? ";

    const signInLink = document.createElement("a");
    signInLink.href = "signIn.html";
    signInLink.textContent = "Sign in";

    signInText.append(signInLink);
    signInContainer.append(signInText);

    form.append(
        usernameInput,
        usernameError,
        passwordInput,
        passwordError,
        resetButton
    );

    box.append(
        title,
        form,
        signInContainer
    );

    container.append(
        logoLink,
        box
    );

    document.body.append(container);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const newPassword = passwordInput.value;

        clearErrors(usernameInput, usernameError, passwordInput, passwordError);

        if (!username) {
            showError(usernameInput, usernameError, "Please enter your email or mobile number.");
            return;
        }

        if (!newPassword) {
            showError(passwordInput, passwordError, "Please enter your new password.");
            return;
        }

        if (newPassword.length < 8) {
            showError(passwordInput, passwordError, "Password must be at least 8 characters.");
            return;
        }

        if (newPassword.length > 16) {
            showError(passwordInput, passwordError, "Password must not exceed 16 characters.");
            return;
        }

        if (!/[a-z]/.test(newPassword)) {
            showError(passwordInput, passwordError, "Password must contain at least one lowercase letter.");
            return;
        }

        if (!/[A-Z]/.test(newPassword)) {
            showError(passwordInput, passwordError, "Password must contain at least one uppercase letter.");
            return;
        }

        if (!/\d/.test(newPassword)) {
            showError(passwordInput, passwordError, "Password must contain at least one number.");
            return;
        }

        if (!/[^A-Za-z\d]/.test(newPassword)) {
            showError(passwordInput, passwordError, "Password must contain at least one special character.");
            return;
        }

        const updated = updateUserPassword(username, newPassword);

        if (!updated) {
            showError(usernameInput, usernameError, "Email or mobile number does not match our records.");
            return;
        }

        usernameInput.value = "";
        passwordInput.value = "";

        showResetPopup(
            "Your password has been updated successfully. Please sign in with your new password.",
            true
        );
    });
}

function clearErrors(usernameInput, usernameError, passwordInput, passwordError) {
    usernameInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");

    usernameError.textContent = "";
    usernameError.style.display = "none";

    passwordError.textContent = "";
    passwordError.style.display = "none";
}

function showError(input, errorElement, message) {
    input.classList.add("input-error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

function updateUserPassword(username, newPassword) {
    const users = JSON.parse(localStorage.getItem(userRegistrationKey)) || [];

    const enteredValue = username.trim().toLowerCase();

    const userIndex = users.findIndex(userData => {
        const email = String(userData.email || "").trim().toLowerCase();
        const mobile = String(userData.mobile || "").trim().toLowerCase();

        return email === enteredValue || mobile === enteredValue;
    });

    if (userIndex === -1) {
        return false;
    }

    users[userIndex].password = newPassword;

    localStorage.setItem(
        userRegistrationKey,
        JSON.stringify(users)
    );

    return true;
}

function showResetPopup(message, success = false) {
    const oldPopup = document.getElementById("resetPasswordPopup");

    if (oldPopup) {
        oldPopup.remove();
    }

    const overlay = createElementWithClass("div", "reset-password-popup-overlay");
    overlay.id = "resetPasswordPopup";

    const popup = createElementWithClass("div", "reset-password-popup");

    const heading = document.createElement("h2");
    heading.textContent = success ? "Success" : "Error";

    const messageElement = document.createElement("p");
    messageElement.textContent = message;

    const okButton = document.createElement("button");
    okButton.type = "button";
    okButton.id = "resetPopupOk";
    okButton.textContent = "OK";

    popup.append(
        heading,
        messageElement,
        okButton
    );

    overlay.append(popup);
    document.body.append(overlay);

    okButton.addEventListener("click", () => {
        overlay.remove();

        if (success) {
            window.location.href = "signIn.html";
        }
    });
}

document.addEventListener("DOMContentLoaded", createForgotPasswordPage);