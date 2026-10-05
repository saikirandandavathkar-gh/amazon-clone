import { getLogo } from "../services/logoService.js";
import { getLocation } from "../services/locationService.js";
import { getCategories } from "../services/categoryService.js";
import { getNavigation } from "../services/navigationService.js";
import { getSearch, searchProducts } from "../services/searchService.js";
import { currentUserKey } from "../config/storageKeys.js";

// Element name and class
function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);   // element created
    element.classList.add(className);   // added class
    return element;
}


/* =========================
   STEP 2 - LOGO
========================= */

function createLogo() {

    const data = getLogo();  // get logo data from service

    const logo = createElementWithClass("a", "logo");   // anchor element with class
    logo.id = "navbarLogo";
    logo.href = data.link;

    const image = document.createElement("img");  // image element
    image.src = data.image;
    image.classList.add("logo-img");
    image.alt = data.alt;

    const suffix = document.createElement("span");   // span element
    suffix.textContent = data.suffix;

    logo.append(image, suffix);

    return logo;
}


/* =========================
   STEP 3 - LOCATION
========================= */

function createLocation() {

    const data = getLocation();  // get location data from service

    const location = createElementWithClass("div", "location");  // div element with class
    location.id = "navbarLocation";

    const icon = document.createElement("i");   // icon eleemnt
    icon.classList.add(data.iconStyle, data.icon, "location-icon");  // fontAwesome website icon

    const content = document.createElement("div");   // div element

    const smallText = createElementWithClass("span", "small-text");  // span element with class
    smallText.textContent = data.label;

    const boldText = createElementWithClass("span", "bold-text");  // span element with class
    boldText.textContent = data.country;

    content.append(smallText, boldText);

    location.append(icon, content);

    return location;
}


/* =========================
   STEP 4 - CATEGORIES
========================= */

function createCategories() {
    const categories = getCategories();

    const select = createElementWithClass("select", "search-category");
    select.id = "searchCategory";

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.value;
        option.textContent = category.label;
        select.append(option);
    });

    select.value = "All";

    select.addEventListener("change", () => {
        const event = new CustomEvent("categoryChange", {
            detail: { category: select.value }
        });

        document.dispatchEvent(event);
    });

    return select;
}


/* =========================
   STEP 5 - SEARCH
========================= */
function createSearch() {
    const searchContainer = createElementWithClass("div", "search-container");
    searchContainer.id = "navbarSearch";

    const category = createCategories();
    const data = getSearch();

    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.classList.add("search-box");
    searchBox.id = "searchBox";
    searchBox.placeholder = data.placeholder;
    searchBox.autocomplete = "off";

    const searchButton = document.createElement("button");
    searchButton.type = "button";
    searchButton.classList.add("search-btn");
    searchButton.id = "searchButton";

    const searchIcon = document.createElement("i");
    searchIcon.classList.add(data.iconStyle, data.icon);

    searchButton.append(searchIcon);

    const suggestions = createElementWithClass("div", "search-suggestions");
    suggestions.id = "searchSuggestions";

    searchContainer.append(category, searchBox, searchButton, suggestions);

    function showSuggestions() {
        suggestions.replaceChildren();

        const query = searchBox.value.trim();
        const selectedCategory = category.value;

        if (query.length < 2) {
            suggestions.style.display = "none";
            return;
        }

        const products = searchProducts(query, selectedCategory);
        const matchingProducts = products.slice(0, 8);

        if (matchingProducts.length === 0) {
            const noResult = createElementWithClass("div", "no-search-result");
            noResult.textContent = "No products found";
            suggestions.append(noResult);
            suggestions.style.display = "block";
            return;
        }

        matchingProducts.forEach(product => {
            const suggestion = createElementWithClass("a", "search-suggestion");
            suggestion.href = `product.html?category=${encodeURIComponent(product.category)}&brand=${encodeURIComponent(product.brand)}&id=${encodeURIComponent(product.id)}`;

            const title = createElementWithClass("span", "suggestion-title");
            title.textContent = product.title;

            const price = createElementWithClass("span", "suggestion-price");
            price.textContent = product.price;

            suggestion.append(title, price);
            suggestions.append(suggestion);
        });

        suggestions.style.display = "block";
    }

    searchBox.addEventListener("input", showSuggestions);

    category.addEventListener("change", showSuggestions);

    searchButton.addEventListener("click", () => {
        const query = searchBox.value.trim();

        if (query.length < 2) {
            return;
        }

        const selectedCategory = category.value;

        window.location.href = `searchPage.html?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`;
    });

    searchBox.addEventListener("keydown", event => {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();

        const query = searchBox.value.trim();

        if (query.length < 2) {
            return;
        }

        const selectedCategory = category.value;

        window.location.href = `searchPage.html?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`;
    });

    searchContainer.addEventListener("click", event => {
        event.stopPropagation();
    });

    document.addEventListener("click", () => {
        suggestions.style.display = "none";
    });

    return searchContainer;
}




/* =========================
   STEP 6 - SIGN IN
========================= */

function createAccount() {
    const data = getNavigation().account;
    const account = createElementWithClass("div", "nav-item");
    account.classList.add("account-dropdown");
    account.id = data.id;

    const currentUser = JSON.parse(localStorage.getItem(currentUserKey));

    const smallText = createElementWithClass("span", "small-text");
    smallText.textContent = currentUser ? `Hello, ${currentUser.name}` : data.smallText;

    const boldText = createElementWithClass("span", "bold-text");
    boldText.textContent = currentUser ? "Account & Lists" : data.boldText;

    const icon = document.createElement("i");
    icon.classList.add(data.iconStyle, data.icon);

    boldText.append(icon);

    const dropdown = createElementWithClass("div", "dropdown-menu");
    dropdown.id = "accountDropdown";

    if (currentUser) {
        const logoutButton = document.createElement("button");
        logoutButton.type = "button";
        logoutButton.textContent = "Logout";
        logoutButton.classList.add("logout-button");

        logoutButton.addEventListener("click", event => {
            event.stopPropagation();

            localStorage.removeItem(currentUserKey);

            window.location.href = "home.html";
        });

        dropdown.append(logoutButton);
    }

    account.append(smallText, boldText, dropdown);

    account.addEventListener("click", () => {
        if (!currentUser) {
            window.location.href = "signIn.html";
        }
    });

    return account;
}




/* =========================
   STEP 7 - ORDERS
========================= */

function createOrders() {

    const data = getNavigation().orders;  // get orders data from service

    const orders = createElementWithClass("a", "nav-item");  // anchor element with class
    orders.href = data.link;

    const smallText = createElementWithClass("span", "small-text");  // span element with class
    smallText.textContent = data.smallText;

    const boldText = createElementWithClass("span", "bold-text");   // span element with class
    boldText.textContent = data.boldText;

    orders.append(smallText, boldText);

    return orders;
}


/* =========================
   STEP 8 - CART
========================= */

function createCart() {
    const cart = document.createElement("a");

    cart.href = "cart.html";
    cart.classList.add("cart");

    const cartIcon = document.createElement("i");

    cartIcon.classList.add(
        "fa-solid",
        "fa-cart-shopping"
    );

    const cartText = document.createElement("span");

    cartText.classList.add("bold-text");
    cartText.textContent = "Cart";

    const cartCount = document.createElement("span");

    cartCount.id = "cartCount";
    cartCount.classList.add("cart-count");

    cart.append(
        cartIcon,
        cartText,
        cartCount
    );

    updateCartCount(cartCount);

    return cart;
}


export function updateCartCount(cartCount = null) {

    if (!cartCount) {
        cartCount =
            document.getElementById("cartCount");
    }

    if (!cartCount) {
        return;
    }

    const currentUser = JSON.parse(
        localStorage.getItem(currentUserKey)
    );

    if (!currentUser) {
        cartCount.textContent = "";
        cartCount.style.display = "none";
        return;
    }

    const cart = currentUser.cart || [];

    const totalQuantity = cart.reduce(
        (total, product) =>
            total + (product.quantity || 1),
        0
    );

    if (totalQuantity > 0) {

        cartCount.textContent = totalQuantity;
        cartCount.style.display = "flex";

    } else {

        cartCount.textContent = "";
        cartCount.style.display = "none";
    }
}



/* =========================
   NAVIGATION
========================= */

function createNavigation() {

    const navigation = createElementWithClass("div", "nav-links");  // div container with class
    navigation.id = "navbarNavigation";

    const account = createAccount();  // calling account section
    const orders = createOrders();    // calling order section
    const cart = createCart();        // calling cart section

    navigation.append(account, orders, cart);

    return navigation;
}


/* =========================
   COMPLETE NAVBAR
========================= */

function createNavbar() {

    const header = createElementWithClass("header", "navbar");   // header element with class

    const logo = createLogo();   // calling logo section
    const location = createLocation();   // calling location section
    const search = createSearch();        // calling search section which includes category and serachBox
    const navigation = createNavigation();   // calling logo naviagation section which includes signIn, orders, cart

    header.append(logo, location, search, navigation);

    return header;
}


/* =========================
   LOAD NAVBAR
========================= */

export function loadNavbar(navbarContainer) {

    const navbarStructure = createNavbar();   // calling the function

    navbarContainer.append(navbarStructure);
}