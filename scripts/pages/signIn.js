
import { userRegistrationKey, currentUserKey } from "../config/storageKeys.js";

function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    return element;
}

function createLoginPage() {
    const container = createElementWithClass("div", "login-container");

    const logoLink = document.createElement("a");
    logoLink.href = "home.html";

    const logo = document.createElement("img");
    logo.src = "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg";
    logo.classList.add("login-logo");
    logo.alt = "Amazon Logo";

    logoLink.append(logo);

    const loginBox = createElementWithClass("div", "login-box");

    const title = document.createElement("h2");
    title.textContent = "Sign in";

    const loginForm = document.createElement("form");
    loginForm.id = "loginForm";

    const emailInput = document.createElement("input");
    emailInput.type = "text";
    emailInput.id = "email";
    emailInput.placeholder = "Email or mobile phone number";
    emailInput.autocomplete = "username";

    const emailError = createElementWithClass("p", "error-message");
    emailError.id = "emailError";

    const passwordContainer = createElementWithClass("div", "password-container");

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.placeholder = "Password";
    passwordInput.autocomplete = "current-password";

    const passwordIcon = document.createElement("i");
    passwordIcon.classList.add("fa-solid", "fa-eye", "password-eye");
    passwordIcon.setAttribute("aria-label", "Show password");
    passwordIcon.setAttribute("role", "button");
    passwordIcon.tabIndex = 0;

    passwordContainer.append(passwordInput, passwordIcon);

    passwordIcon.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";
        passwordIcon.classList.toggle("fa-eye", !isPassword);
        passwordIcon.classList.toggle("fa-eye-slash", isPassword);
        passwordIcon.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });

    const passwordError = createElementWithClass("p", "error-message");
    passwordError.id = "passwordError";

    const loginButton = document.createElement("button");
    loginButton.type = "submit";
    loginButton.textContent = "Sign in";

    const forgot = createElementWithClass("div", "forgot");

    const forgotPassword = document.createElement("a");
    forgotPassword.href = "forgotPassword.html";
    forgotPassword.textContent = "Forgot password?";

    forgot.append(forgotPassword);

    loginForm.append(
        emailInput,
        emailError,
        passwordContainer,
        passwordError,
        loginButton,
        forgot
    );

    const divider = document.createElement("hr");

    const newAccount = createElementWithClass("div", "new-account");

    const newCustomer = document.createElement("p");
    newCustomer.textContent = "New to Amazon? ";

    const signUpButton = document.createElement("a");
    signUpButton.href = "signUp.html";
    signUpButton.textContent = "Create your Amazon account";

    newCustomer.append(signUpButton);
    newAccount.append(newCustomer);

    loginBox.append(
        title,
        loginForm,
        divider,
        newAccount
    );

    container.append(logoLink, loginBox);

    document.body.append(container);

    loginForm.addEventListener("submit", event => {
            event.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            emailError.textContent = "";
            emailError.style.display = "none";
            passwordError.textContent = "";
            passwordError.style.display = "none";

            emailInput.classList.remove("input-error");
            passwordInput.classList.remove("input-error");

            if (!email) {
                emailInput.classList.add("input-error");
                emailError.textContent = "Please enter your email or mobile phone number.";
                emailError.style.display = "block";
                return;
            }

            if (!password) {
                passwordInput.classList.add("input-error");
                passwordError.textContent = "Please enter your password.";
                passwordError.style.display = "block";
                return;
            }

            const users = JSON.parse(localStorage.getItem(userRegistrationKey)) || [];

            const user = users.find(
                userData =>
                    (userData.email.toLowerCase() === email.toLowerCase() || userData.mobile === email) &&
                    userData.password === password
            );

            if (!user) {
                emailInput.classList.add("input-error");
                passwordInput.classList.add("input-error");
                passwordError.textContent = "Invalid email/mobile number or password.";
                passwordError.style.display = "block";
                return;
            }

            localStorage.setItem(currentUserKey, JSON.stringify(user));

            window.location.href = "home.html";
        });

    
}

document.addEventListener("DOMContentLoaded", createLoginPage);
