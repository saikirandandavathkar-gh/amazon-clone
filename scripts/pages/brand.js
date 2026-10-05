
import { loadNavbar } from "../components/navbar.js";
import { getBrandProducts } from "../services/brandService.js";
import { categoriesData } from "../data/categoriesData.js";
import { initCartButtons, showSignInIndicator } from "../components/cartButtons.js";
import {
    currentUserKey,
    buyNowProductKey
} from "../config/storageKeys.js";

function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    return element;
}


function createPageElements() {
    const navbarContainer = document.createElement("div");
    navbarContainer.id = "navbar-container";

    const pageTitle = document.createElement("h2");
    pageTitle.id = "pageTitle";
    

    const productList = document.createElement("div");
    productList.id = "productList";
    productList.classList.add("products-list");

    document.body.append(navbarContainer, pageTitle, productList);

    return { navbarContainer, pageTitle, productList };
}

function createProductCard(product, category, brand) {
    const card = createElementWithClass("div", "samsung-product-card");

    const imageSection = createElementWithClass("div", "product-image-section");

    const imageLink = document.createElement("a");
    imageLink.href = `product.html?category=${encodeURIComponent(category)}&brand=${encodeURIComponent(brand)}&id=${encodeURIComponent(product.id)}`;

    const image = document.createElement("img");

    image.classList.add("samsung-product-image");
    image.alt = product.title;
    image.loading = "lazy";
    image.src = product.img;

    imageLink.append(image);
    imageSection.append(imageLink);

    const detailsSection = createElementWithClass("div", "product-details-section");

    const titleLink = createElementWithClass("a", "product-title-link");
    titleLink.href = imageLink.href;

    const title = createElementWithClass("h2", "product-title");
    title.textContent = product.title;
    titleLink.append(title);

    const rating = createElementWithClass("div", "rating");
    rating.append(document.createTextNode(`⭐ ${product.rating} `));

    const reviews = document.createElement("span");
    reviews.textContent = `(${product.reviews} reviews)`;
    rating.append(reviews);

    const bought = createElementWithClass("p", "bought");
    bought.textContent = product.bought;

    const priceSection = createElementWithClass("div", "price-section");

    const dealPrice = createElementWithClass("span", "deal-price");
    dealPrice.textContent = product.price;

    const mrp = createElementWithClass("span", "mrp");
    mrp.append(document.createTextNode("M.R.P. "));

    const oldPrice = createElementWithClass("span", "old-price");
    oldPrice.textContent = product.mrp;

    mrp.append(oldPrice);
    priceSection.append(dealPrice, mrp);

    const delivery = createElementWithClass("p", "delivery");
    delivery.textContent = "🚚 Free Delivery";

    const aboutTitle = document.createElement("h3");
    aboutTitle.textContent = "About this item";

    const features = createElementWithClass("ul", "features");

    product.features.forEach(feature => {
        const featureItem = document.createElement("li");
        featureItem.textContent = feature;
        features.append(featureItem);
    });

    const actions = createElementWithClass("div", "product-actions");

    const addCartButton = createElementWithClass("button", "add-cart-btn");
    addCartButton.type = "button";
    addCartButton.textContent = "Add to Cart";
    addCartButton.dataset.category = category;
    addCartButton.dataset.brand = brand;
    addCartButton.dataset.productId = product.id;
    addCartButton.dataset.title = product.title;
    addCartButton.dataset.price = product.price;
    addCartButton.dataset.img = product.img;
    addCartButton.dataset.rating = product.rating;
    addCartButton.dataset.reviews = product.reviews;

    const buyNowButton = createElementWithClass("button", "buy-now-btn");
    buyNowButton.type = "button";
    buyNowButton.textContent = "Buy Now";

    buyNowButton.addEventListener("click", () => {

        const currentUser = JSON.parse(
            localStorage.getItem(currentUserKey)
        );

        if (!currentUser) {
            showSignInIndicator();
            return;
        }

        sessionStorage.setItem(
            buyNowProductKey,
            JSON.stringify({
                productId: product.id,
                category: category,
                brand: brand,
                title: product.title,
                price: product.price,
                img: product.img,
                rating: product.rating,
                reviews: product.reviews,
                quantity: 1
            })
        );

        window.location.href = "checkout.html";
    });

    actions.append(addCartButton, buyNowButton);

    detailsSection.append(titleLink, rating, bought, priceSection, delivery, aboutTitle, features, actions);
    card.append(imageSection, detailsSection);

    return card;
}

function formatCategoryName(category) {
    return categoriesData.find(categoryData => categoryData.value === category)?.label || category;
}

function getSingularCategory(categoryName) {
    if (categoryName.endsWith("ies")) return categoryName.slice(0, -3) + "y";
    if (categoryName.endsWith("ches")) return categoryName.slice(0, -2);
    if (categoryName.endsWith("shes")) return categoryName.slice(0, -2);
    if (categoryName.endsWith("s")) return categoryName.slice(0, -1);
    return categoryName;
}

function renderProducts(productList, pageTitle) {
    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");
    const brand = params.get("brand");

    const products = getBrandProducts(category, brand);

    if (products.length === 0) {
        pageTitle.textContent = "Products";

        const notFound = createElementWithClass("div", "not-found");

        const heading = document.createElement("h2");
        heading.textContent = "Products not found";

        const message = document.createElement("p");
        message.textContent = "Sorry, no products are available for this brand.";

        const homeButton = document.createElement("a");
        homeButton.href = "home.html";
        homeButton.textContent = "Go to Home";
        homeButton.classList.add("home-btn");

        notFound.append(heading, message, homeButton);
        productList.append(notFound);

        return;
    }

    const brandName = products[0].brand.charAt(0).toUpperCase() + products[0].brand.slice(1);

    const categoryName = formatCategoryName(category);

    const titleCategory = products.length === 1 ? getSingularCategory(categoryName) : categoryName;

    pageTitle.textContent = `${brandName} ${titleCategory}`;

    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const card = createProductCard(product, category, brand);
        fragment.append(card);
    });

    productList.append(fragment);
}



function initializeBrandPage() {
    const { navbarContainer, pageTitle, productList } = createPageElements();

    loadNavbar(navbarContainer);
    renderProducts(productList, pageTitle);
    initCartButtons();
}

document.addEventListener("DOMContentLoaded", initializeBrandPage);
