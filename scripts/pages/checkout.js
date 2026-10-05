
import { loadNavbar } from "../components/navbar.js";
import { getCurrentUser } from "../services/cartService.js";
import {
    buyNowProductKey,
    currentUserKey,
    userRegistrationKey
} from "../config/storageKeys.js";

function createElementWithClass(tagName, ...classNames) {
    const element = document.createElement(tagName);
    element.classList.add(...classNames);
    return element;
}

function createPage() {
    const navbarContainer = document.createElement("div");
    navbarContainer.id = "navbar-container";

    const checkoutPage = createElementWithClass("main", "checkout-page");

    const checkoutTitle = document.createElement("h1");
    checkoutTitle.textContent = "Checkout";

    const checkoutLayout = createElementWithClass("div", "checkout-layout");

    const deliverySection = createDeliverySection();
    const summarySection = createOrderSummary();

    checkoutLayout.append(deliverySection, summarySection);

    checkoutPage.append(checkoutTitle, checkoutLayout);

    document.body.append(navbarContainer, checkoutPage);

    return { navbarContainer };
}

function createDeliverySection() {
    const section = createElementWithClass("section", "checkout-section");

    const heading = document.createElement("h2");
    heading.textContent = "Delivery Details";

    const form = document.createElement("form");
    form.id = "checkoutForm";
    form.noValidate = true;

    const nameGroup = createFormGroup("Full Name", "customerName", "text");
    const phoneGroup = createFormGroup("Phone", "phone", "tel");
    const addressGroup = createFormGroup("Address", "deliveryAddress", "textarea");
    const cityGroup = createFormGroup("City", "city", "text");
    const stateGroup = createFormGroup("State", "state", "text");
    const pincodeGroup = createFormGroup("PIN Code", "pincode", "text");

    const formRow = createElementWithClass("div", "checkout-form-row");

    formRow.append(cityGroup, stateGroup, pincodeGroup);

    const paymentSection = createPaymentSection();

    const placeOrderButton = document.createElement("button");
    placeOrderButton.type = "submit";
    placeOrderButton.classList.add("place-order-btn");
    placeOrderButton.textContent = "Place Order";

    form.append(
        nameGroup,
        phoneGroup,
        addressGroup,
        formRow,
        paymentSection,
        placeOrderButton
    );

    form.addEventListener("submit", handleCheckout);

    section.append(heading, form);

    return section;
}

function createFormGroup(labelText, inputId, inputType) {
    const group = createElementWithClass("div", "form-group");

    const label = document.createElement("label");
    label.htmlFor = inputId;
    label.textContent = labelText;

    let input;

    if (inputType === "textarea") {
        input = document.createElement("textarea");
        input.rows = 4;
    } else {
        input = document.createElement("input");
        input.type = inputType;
    }

    input.id = inputId;
    input.name = inputId;
    input.autocomplete = "off";
    input.classList.add("checkout-input");

    if (inputId === "customerName") {
        input.maxLength = 50;
    }

    if (inputId === "deliveryAddress") {
        input.maxLength = 150;
    }

    if (inputId === "city" || inputId === "state") {
        input.maxLength = 50;
    }

    if (inputId === "phone" || inputId === "pincode") {
        input.inputMode = "numeric";
        input.pattern = "[0-9]*";
        input.maxLength = inputId === "phone" ? 10 : 6;

        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "");
        });
    }

    const error = document.createElement("small");
    error.classList.add("field-error");
    error.id = `${inputId}Error`;

    group.append(label, input, error);

    return group;
}

function createPaymentSection() {
    const paymentSection = createElementWithClass("div", "payment-section");

    const heading = document.createElement("h3");
    heading.textContent = "Payment Method";

    const paymentOptions = createElementWithClass("div", "payment-options");

    const cod = createPaymentOption("cod", "Cash on Delivery");
    const upi = createPaymentOption("upi", "UPI");
    const card = createPaymentOption("card", "Credit / Debit Card");

    paymentOptions.append(cod, upi, card);

    const paymentInputs = paymentOptions.querySelectorAll(
        'input[name="paymentMethod"]'
    );

    paymentInputs.forEach(input => {
        input.addEventListener("change", () => {
            if (input.value === "upi") {
                showPaymentPopup("upi");
            }

            if (input.value === "card") {
                showPaymentPopup("card");
            }
        });
    });

    const error = document.createElement("small");
    error.id = "paymentError";
    error.classList.add("field-error");

    paymentSection.append(heading, paymentOptions, error);

    return paymentSection;
}

function createPaymentOption(value, text) {
    const label = createElementWithClass("label", "payment-option");

    const input = document.createElement("input");

    input.type = "radio";
    input.name = "paymentMethod";
    input.value = value;
    input.checked = value === "cod";

    const span = document.createElement("span");
    span.textContent = text;

    label.append(input, span);

    return label;
}

function showPaymentPopup(type) {
    const overlay = document.createElement("div");
    overlay.classList.add("payment-popup-overlay");

    const popup = document.createElement("div");
    popup.classList.add("payment-popup");

    const icon = document.createElement("div");
    icon.classList.add("payment-popup-icon");
    icon.textContent = "!";

    const heading = document.createElement("h2");
    heading.textContent = "Service Not Available";

    const message = document.createElement("p");

    if (type === "upi") {
        message.textContent =
            "This UPI payment service is not available currently";
    }

    if (type === "card") {
        message.textContent =
            "This credit/debit payment service is not available currently";
    }

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";

    closeButton.addEventListener("click", () => {
        overlay.remove();
    });

    popup.append(icon, heading, message, closeButton);
    overlay.append(popup);
    document.body.append(overlay);
}

function createOrderSummary() {
    const section = createElementWithClass(
        "section",
        "checkout-section",
        "order-summary"
    );

    const heading = document.createElement("h2");
    heading.textContent = "Order Summary";

    const productContainer = document.createElement("div");
    productContainer.id = "checkoutProduct";

    const product = getCheckoutProduct();

    if (!product) {
        const message = document.createElement("p");
        message.classList.add("no-checkout-product");
        message.textContent = "No product selected for checkout.";

        productContainer.append(message);
    } else {
        productContainer.append(createSummaryProduct(product));
    }

    section.append(heading, productContainer);

    return section;
}

function getCheckoutProduct() {
    const product = sessionStorage.getItem(buyNowProductKey);

    if (!product) {
        return null;
    }

    try {
        return JSON.parse(product);
    } catch (error) {
        console.error("Invalid checkout product:", error);
        return null;
    }
}

function createSummaryProduct(product) {
    const container = createElementWithClass("div", "summary-product");

    const image = document.createElement("img");
    image.src = product.img;
    image.alt = product.title;

    const details = createElementWithClass(
        "div",
        "summary-product-details"
    );

    const title = document.createElement("h3");
    title.textContent = product.title;

    const rating = document.createElement("p");
    rating.classList.add("summary-rating");
    rating.textContent =
        `⭐ ${product.rating} (${product.reviews} reviews)`;

    const price = document.createElement("p");
    price.classList.add("summary-price");
    price.textContent = product.price;

    const delivery = document.createElement("p");
    delivery.classList.add("summary-delivery");
    delivery.textContent = "🚚 Free Delivery";

    const quantity = document.createElement("p");
    quantity.classList.add("summary-quantity");
    quantity.textContent = `Quantity: ${product.quantity || 1}`;

    details.append(title, rating, price, delivery, quantity);
    container.append(image, details);

    return container;
}

function validateForm() {
    let isValid = true;

    clearErrors();

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("deliveryAddress").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    const payment = document.querySelector(
        'input[name="paymentMethod"]:checked'
    );

    if (!name) {
        showError("customerName", "Name is required.");
        isValid = false;
    } else if (name.length < 3) {
        showError(
            "customerName",
            "Name must contain at least 3 characters."
        );
        isValid = false;
    } else if (!/^[A-Za-z ]+$/.test(name)) {
        showError(
            "customerName",
            "Name should contain only letters."
        );
        isValid = false;
    }

    if (!phone) {
        showError("phone", "Phone number is required.");
        isValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
        showError(
            "phone",
            "Enter a valid 10-digit phone number."
        );
        isValid = false;
    }

    if (!address) {
        showError("deliveryAddress", "Address is required.");
        isValid = false;
    } else if (address.length < 10) {
        showError(
            "deliveryAddress",
            "Address must contain at least 10 characters."
        );
        isValid = false;
    }

    if (!city) {
        showError("city", "City is required.");
        isValid = false;
    } else if (!/^[A-Za-z ]+$/.test(city)) {
        showError(
            "city",
            "City should contain only letters."
        );
        isValid = false;
    }

    if (!state) {
        showError("state", "State is required.");
        isValid = false;
    } else if (!/^[A-Za-z ]+$/.test(state)) {
        showError(
            "state",
            "State should contain only letters."
        );
        isValid = false;
    }

    if (!pincode) {
        showError("pincode", "PIN Code is required.");
        isValid = false;
    } else if (!/^\d{6}$/.test(pincode)) {
        showError(
            "pincode",
            "PIN Code must contain 6 digits."
        );
        isValid = false;
    }

    if (!payment) {
        document.getElementById("paymentError").textContent =
            "Please select a payment method.";

        isValid = false;
    }

    return isValid;
}

function showError(inputId, message) {
    const error = document.getElementById(`${inputId}Error`);

    if (error) {
        error.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll(".field-error").forEach(error => {
        error.textContent = "";
    });
}

function handleCheckout(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "signIn.html";
        return;
    }

    const product = getCheckoutProduct();

    if (!product) {
        alert("No product selected.");
        return;
    }

    const payment = document.querySelector(
        'input[name="paymentMethod"]:checked'
    );

    const order = {
        id: `ORD${Date.now()}`,
        product: product,
        deliveryDetails: {
            name: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("deliveryAddress").value.trim(),
            city: document.getElementById("city").value.trim(),
            state: document.getElementById("state").value.trim(),
            pincode: document.getElementById("pincode").value.trim()
        },
        paymentMethod: payment.value,
        status: "Ordered",
        cancelled: false,
        createdAt: new Date().toISOString()
    };

    if (!Array.isArray(currentUser.orders)) {
        currentUser.orders = [];
    }

    currentUser.orders.push(order);

    removeOrderedProductFromCart(currentUser, product);

    localStorage.setItem(
        currentUserKey,
        JSON.stringify(currentUser)
    );

    const users =
        JSON.parse(localStorage.getItem(userRegistrationKey)) || [];

    const userIndex = users.findIndex(
        userData =>
            userData.email.toLowerCase() ===
            currentUser.email.toLowerCase()
    );

    if (userIndex !== -1) {
        users[userIndex] = currentUser;

        localStorage.setItem(
            userRegistrationKey,
            JSON.stringify(users)
        );
    }

    sessionStorage.removeItem(buyNowProductKey);

    window.location.href = "order.html";
}

function removeOrderedProductFromCart(currentUser, product) {
    if (!Array.isArray(currentUser.cart)) {
        return;
    }

    currentUser.cart = currentUser.cart.filter(
        cartProduct =>
            !(
                String(cartProduct.productId) === String(product.productId) &&
                cartProduct.category === product.category &&
                cartProduct.brand === product.brand
            )
    );
}

function initializeCheckoutPage() {
    const { navbarContainer } = createPage();
    loadNavbar(navbarContainer);
}

document.addEventListener(
    "DOMContentLoaded",
    initializeCheckoutPage
);
