
import { userRegistrationKey } from "../config/storageKeys.js";

function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    return element;
}

function createSignUpPage() {
    const container = createElementWithClass("div", "signup-container");

    const logoLink = document.createElement("a");
    logoLink.href = "home.html";

    const logo = document.createElement("img");
    logo.src = "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg";
    logo.classList.add("signup-logo");
    logo.alt = "Amazon Logo";

    logoLink.append(logo);

    const signupBox = createElementWithClass("div", "signup-box");

    const title = document.createElement("h2");
    title.textContent = "Create account";

    const signupForm = document.createElement("form");
    signupForm.id = "signupForm";

    // Name
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name";
    nameInput.placeholder = "Your name";
    nameInput.autocomplete = "name";

    const nameError = createElementWithClass("p", "error-message");
    nameError.id = "nameError";

    // Email
    const emailInput = document.createElement("input");
    emailInput.type = "text";
    emailInput.id = "email";
    emailInput.placeholder = "Email";
    emailInput.autocomplete = "email";

    const emailError = createElementWithClass("p", "error-message");
    emailError.id = "emailError";

    // Country code
    const mobileContainer = createElementWithClass("div", "mobile-container");

    const countryCode = document.createElement("select");
    countryCode.id = "regCountryCode";

    const countries = [
        { code: "+91", name: "India" },
        { code: "+1", name: "USA" },
        { code: "+44", name: "UK" },
        { code: "+61", name: "Australia" },
        { code: "+81", name: "Japan" },
        { code: "+86", name: "China" },
        { code: "+971", name: "UAE" },
        { code: "+880", name: "Bangladesh" }
    ];

    countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country.code;
        option.textContent = `${country.code} ${country.name}`;
        countryCode.append(option);
    });

    countryCode.value = "+91";

    const mobileInput = document.createElement("input");
    mobileInput.type = "tel";
    mobileInput.id = "regMobile";
    mobileInput.placeholder = "Mobile number";
    mobileInput.maxLength = 10;
    mobileInput.autocomplete = "tel";

    mobileContainer.append(countryCode, mobileInput);
   

    const mobileError = createElementWithClass("p", "error-message");
    mobileError.id = "mobileError";

    // Password
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.placeholder = "Password";
    passwordInput.maxLength = 16;
    passwordInput.autocomplete = "new-password";

    const passwordError = createElementWithClass("p", "error-message");
    passwordError.id = "passwordError";

    // Confirm password
    const confirmPasswordInput = document.createElement("input");
    confirmPasswordInput.type = "password";
    confirmPasswordInput.id = "confirmPassword";
    confirmPasswordInput.placeholder = "Re-enter password";
    confirmPasswordInput.maxLength = 16;
    confirmPasswordInput.autocomplete = "new-password";

    const confirmPasswordError = createElementWithClass("p", "error-message");
    confirmPasswordError.id = "confirmPasswordError";

    // Button
    const signupButton = document.createElement("button");
    signupButton.type = "submit";
    signupButton.textContent = "Create your Amazon account";

    signupForm.append(
        nameInput,
        nameError,
        emailInput,
        emailError,
        mobileContainer,
        mobileError,
        passwordInput,
        passwordError,
        confirmPasswordInput,
        confirmPasswordError,
        signupButton
    );

    const divider = document.createElement("hr");

    const existingAccount = createElementWithClass("div", "existing-account");

    const text = document.createElement("p");
    text.textContent = "Already have an account? ";

    const signInLink = document.createElement("a");
    signInLink.href = "signIn.html";
    signInLink.textContent = "Sign in";

    text.append(signInLink);
    existingAccount.append(text);

    signupBox.append(
        title,
        signupForm,
        divider,
        existingAccount
    );

    container.append(logoLink, signupBox);

    document.body.append(container);

    signupForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const mobile = mobileInput.value.trim();
        const selectedCountryCode = countryCode.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Clear previous errors
        nameError.textContent = "";
        nameError.style.display = "none";

        emailError.textContent = "";
        emailError.style.display = "none";

        mobileError.textContent = "";
        mobileError.style.display = "none";

        passwordError.textContent = "";
        passwordError.style.display = "none";

        confirmPasswordError.textContent = "";
        confirmPasswordError.style.display = "none";

        nameInput.classList.remove("input-error");
        emailInput.classList.remove("input-error");
        mobileInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");
        confirmPasswordInput.classList.remove("input-error");

        // Name validation
        if (!name) {
            nameInput.classList.add("input-error");
            nameError.textContent = "Please enter your name.";
            nameError.style.display = "block";
            return;
        }

        // Email validation
        if (!email) {
            emailInput.classList.add("input-error");
            emailError.textContent = "Please enter your email.";
            emailError.style.display = "block";
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            emailInput.classList.add("input-error");
            emailError.textContent = "Please enter a valid email address.";
            emailError.style.display = "block";
            return;
        }

        // Country code validation
        if (!selectedCountryCode) {
            mobileInput.classList.add("input-error");
            mobileError.textContent = "Please select a country code.";
            mobileError.style.display = "block";
            return;
        }

        // Mobile validation
        if (!mobile) {
            mobileInput.classList.add("input-error");
            mobileError.textContent = "Please enter your mobile number.";
            mobileError.style.display = "block";
            return;
        }

        if (!/^\d+$/.test(mobile)) {
            mobileInput.classList.add("input-error");
            mobileError.textContent = "Mobile number must contain only digits.";
            mobileError.style.display = "block";
            return;
        }

        if (mobile.length !== 10) {
            mobileInput.classList.add("input-error");
            mobileError.textContent = "Mobile number must be exactly 10 digits.";
            mobileError.style.display = "block";
            return;
        }

        // Password validation
        if (!password) {
            passwordInput.classList.add("input-error");
            passwordError.textContent = "Please enter your password.";
            passwordError.style.display = "block";
            return;
        }

        if (password.length < 8) {
            passwordInput.classList.add("input-error");
            passwordError.textContent = "Password must be at least 8 characters.";
            passwordError.style.display = "block";
            return;
        }

        if (password.length > 16) {
            passwordInput.classList.add("input-error");
            passwordError.textContent = "Password must not exceed 16 characters.";
            passwordError.style.display = "block";
            return;
        }

        if (!/[a-z]/.test(password)) {
            passwordInput.classList.add("input-error");
            passwordError.textContent = "Password must contain at least one lowercase letter.";
            passwordError.style.display = "block";
            return;
        }

        if (!/[A-Z]/.test(password)) {
            passwordInput.classList.add("input-error");
            passwordError.textContent = "Password must contain at least one uppercase letter.";
            passwordError.style.display = "block";
            return;
        }

        if (!/\d/.test(password)) {
            passwordInput.classList.add("input-error");
            passwordError.textContent = "Password must contain at least one digit.";
            passwordError.style.display = "block";
            return;
        }

        if (!/[^A-Za-z\d]/.test(password)) {
            passwordInput.classList.add("input-error");
            passwordError.textContent = "Password must contain at least one special character.";
            passwordError.style.display = "block";
            return;
        }

        // Confirm password
        if (!confirmPassword) {
            confirmPasswordInput.classList.add("input-error");
            confirmPasswordError.textContent = "Please re-enter your password.";
            confirmPasswordError.style.display = "block";
            return;
        }

        if (password !== confirmPassword) {
            confirmPasswordInput.classList.add("input-error");
            confirmPasswordError.textContent = "Passwords do not match.";
            confirmPasswordError.style.display = "block";
            return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem(userRegistrationKey)) || [];

        // Check duplicate email
        const emailExists = users.some(
            userData => userData.email.toLowerCase() === email.toLowerCase()
        );

        if (emailExists) {
            emailInput.classList.add("input-error");
            emailError.textContent = "An account with this email already exists.";
            emailError.style.display = "block";
            return;
        }

        const fullMobile = selectedCountryCode + mobile;

         // Check duplicate mobile
        const mobileExists = users.some(
            userData => userData.mobile === fullMobile
        );

        if (mobileExists) {
            mobileInput.classList.add("input-error");
            mobileError.textContent = "An account with this mobile number already exists.";
            mobileError.style.display = "block";
            return;
        }


        const user = {
            name,
            email,
            mobile: fullMobile,
            password,
            cart: [],
            orders: [],
            favorites: []
        };

        users.push(user);

        localStorage.setItem(userRegistrationKey, JSON.stringify(users));

        window.location.href = "signIn.html";

    });
}

document.addEventListener("DOMContentLoaded", createSignUpPage);
