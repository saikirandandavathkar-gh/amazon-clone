
import { loadNavbar, updateCartCount } from "../components/navbar.js";

import {
    getCurrentUser,
    getUserCart
} from "../services/cartService.js";



import {
    userRegistrationKey,
    currentUserKey,
    buyNowProductKey
} from "../config/storageKeys.js";

function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    return element;
}

function createPage() {
    const navbarContainer = document.createElement("div");
    navbarContainer.id = "navbar-container";

    const cartPage = createElementWithClass(
        "main",
        "cart-page"
    );

    const title = document.createElement("h1");
    title.textContent = "Shopping Cart";

    const cartContainer = document.createElement("div");
    cartContainer.id = "cartContainer";

    cartPage.append(
        title,
        cartContainer
    );

    document.body.append(
        navbarContainer,
        cartPage
    );

    return {
        navbarContainer,
        cartContainer
    };
}

function createSignInMessage() {
    const message = createElementWithClass(
        "div",
        "cart-login-message"
    );

    const heading = document.createElement("h2");
    heading.textContent = "Please sign in";

    const text = document.createElement("p");
    text.textContent =
        "Sign in to see your shopping cart.";

    const signInButton = document.createElement("a");
    signInButton.href = "signIn.html";
    signInButton.textContent = "Sign in";

    message.append(
        heading,
        text,
        signInButton
    );

    return message;
}

function createEmptyCart() {
    const emptyCart = createElementWithClass(
        "div",
        "empty-cart"
    );

    const heading = document.createElement("h2");
    heading.textContent = "Your cart is empty";

    const text = document.createElement("p");
    text.textContent =
        "Add products to your cart to see them here.";

    const continueShopping = document.createElement("a");
    continueShopping.href = "home.html";
    continueShopping.textContent = "Continue Shopping";

    emptyCart.append(
        heading,
        text,
        continueShopping
    );

    return emptyCart;
}

function getProductURL(product) {
    const params = new URLSearchParams({
        category: product.category,
        brand: product.brand,
        id: product.productId
    });

    return `product.html?${params.toString()}`;
}

function createCartItem(cartProduct) {

    const item = createElementWithClass(
        "div",
        "cart-item"
    );

    /* =========================
       IMAGE
    ========================= */

    const imageSection = createElementWithClass(
        "div",
        "cart-image"
    );

    const imageLink = document.createElement("a");
    imageLink.href = getProductURL(cartProduct);

    const image = document.createElement("img");
    image.src = cartProduct.img;
    image.alt = cartProduct.title;
    image.loading = "lazy";

    imageLink.append(image);
    imageSection.append(imageLink);

    /* =========================
       DETAILS
    ========================= */

    const details = createElementWithClass(
        "div",
        "cart-details"
    );

    const title = document.createElement("h2");

    const titleLink = document.createElement("a");
    titleLink.href = getProductURL(cartProduct);
    titleLink.textContent = cartProduct.title;

    title.append(titleLink);

    const rating = createElementWithClass(
        "div",
        "cart-rating"
    );

    rating.textContent =
        `⭐ ${cartProduct.rating || ""} ` +
        `(${cartProduct.reviews || 0} reviews)`;

    const price = createElementWithClass(
        "p",
        "cart-price"
    );

    price.textContent = cartProduct.price;

    const delivery = document.createElement("p");
    delivery.textContent = "🚚 Free Delivery";

    const quantity = createElementWithClass(
        "p",
        "cart-quantity"
    );

    quantity.textContent =
        `Quantity: ${cartProduct.quantity || 1}`;

    /* =========================
       ACTIONS
    ========================= */

    const actions = createElementWithClass(
        "div",
        "cart-actions"
    );

    /* REMOVE */

    const removeButton = createElementWithClass(
        "button",
        "remove-cart-btn"
    );

    removeButton.type = "button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
        removeProduct(cartProduct);
    });

    /* BUY NOW */

    /* BUY NOW */

    const buyNowButton = createElementWithClass(
        "button",
        "cart-buy-now-btn"
    );

    buyNowButton.type = "button";
    buyNowButton.textContent = "Buy Now";

    buyNowButton.addEventListener("click", () => {

        const currentUser = getCurrentUser();

        if (!currentUser) {
            return;
        }

        sessionStorage.setItem(
            buyNowProductKey,
            JSON.stringify({
                productId: cartProduct.productId,
                category: cartProduct.category,
                brand: cartProduct.brand,
                title: cartProduct.title,
                price: cartProduct.price,
                img: cartProduct.img,
                rating: cartProduct.rating,
                reviews: cartProduct.reviews,
                quantity: cartProduct.quantity || 1
            })
        );

        window.location.href = "checkout.html";
    });

    actions.append(
        removeButton,
        buyNowButton
    );

    /* =========================
       APPEND DETAILS
    ========================= */

    details.append(
        title,
        rating,
        price,
        delivery,
        quantity,
        actions
    );

    item.append(
        imageSection,
        details
    );

    return item;
}

function removeProduct(product) {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    if (!Array.isArray(currentUser.cart)) {
        return;
    }

    currentUser.cart = currentUser.cart.filter(
        cartProduct =>
            !(
                String(cartProduct.productId) ===
                    String(product.productId) &&

                cartProduct.category ===
                    product.category &&

                cartProduct.brand ===
                    product.brand
            )
    );

    const users =
        JSON.parse(
            localStorage.getItem(userRegistrationKey)
        ) || [];

    const userIndex = users.findIndex(
        userData =>
            userData.email.toLowerCase() ===
            currentUser.email.toLowerCase()
    );

    if (userIndex === -1) {
        return;
    }

    users[userIndex] = currentUser;

    localStorage.setItem(
        userRegistrationKey,
        JSON.stringify(users)
    );

    localStorage.setItem(
        currentUserKey,
        JSON.stringify(currentUser)
    );

    updateCartCount();

    renderCart();
}

function renderCart() {

    const cartContainer =
        document.getElementById("cartContainer");

    if (!cartContainer) {
        return;
    }

    cartContainer.replaceChildren();

    const currentUser = getCurrentUser();

    /* =========================
       USER NOT SIGNED IN
    ========================= */

    if (!currentUser) {
        cartContainer.append(
            createSignInMessage()
        );

        return;
    }

    /* =========================
       EMPTY CART
    ========================= */

    const cart = getUserCart();

    if (cart.length === 0) {
        cartContainer.append(
            createEmptyCart()
        );

        return;
    }

    /* =========================
       CART PRODUCTS
    ========================= */

    const cartItems = createElementWithClass(
        "div",
        "cart-items"
    );

    const fragment =
        document.createDocumentFragment();

    cart.forEach(cartProduct => {

        const cartItem =
            createCartItem(cartProduct);

        fragment.append(cartItem);
    });

    cartItems.append(fragment);

    cartContainer.append(cartItems);
}

function initializeCartPage() {

    const {
        navbarContainer
    } = createPage();

    loadNavbar(navbarContainer);

    renderCart();
}

document.addEventListener( "DOMContentLoaded", initializeCartPage);
