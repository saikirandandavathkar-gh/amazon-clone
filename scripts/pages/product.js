import { loadNavbar } from "../components/navbar.js";
import { getProduct } from "../services/brandService.js";
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

function setImageSource(image, imagePath) {
    const extensions = [".jpeg", ".jpg", ".png", ".webp", ".avif"];
    let index = 0;
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(imagePath);

    if (hasExtension) {
        image.src = imagePath;
        return;
    }

    function tryNextExtension() {
        if (index >= extensions.length) {
            console.error("Image not found:", imagePath);
            return;
        }

        image.src = imagePath + extensions[index];
        index++;
        image.onerror = tryNextExtension;
    }

    tryNextExtension();
}

function createPageElements() {
    const navbarContainer = document.createElement("div");
    navbarContainer.id = "navbar-container";

    const productContainer = document.createElement("div");
    productContainer.id = "product-container";

    document.body.append(navbarContainer, productContainer);

    return { navbarContainer, productContainer };
}

function createProductImage(product) {
    const imageSection = createElementWithClass("div", "product-image-section");

    const image = document.createElement("img");
    image.classList.add("product-image");
    image.src = product.img;
    image.alt = product.title;

    setImageSource(image, product.img);

    imageSection.append(image);

    return imageSection;
}

function createProductDetails(product, category, brand) {
    const detailsSection = createElementWithClass("div", "product-details-section");

    const title = createElementWithClass("h1", "product-title");
    title.textContent = product.title;

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

    const aboutTitle = document.createElement("h2");
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

    const buyNowButton = createElementWithClass(
        "button",
        "buy-now-btn"
    );

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

    const benefits = createElementWithClass("div", "product-benefits");

    const freeDelivery = document.createElement("p");
    freeDelivery.textContent = "✓ Free Delivery";

    const warranty = document.createElement("p");
    warranty.textContent = "✓ 1 Year Warranty";

    const payOnDelivery = document.createElement("p");
    payOnDelivery.textContent = "✓ Pay on Delivery";

    benefits.append(freeDelivery, warranty, payOnDelivery);

    actions.append(addCartButton, buyNowButton, benefits);

    detailsSection.append(title, rating, bought, priceSection, delivery, aboutTitle, features, actions);

    return detailsSection;
}

function createProduct(product, category, brand) {
    const productCard = createElementWithClass("div", "product-card");

    const imageSection = createProductImage(product);
    const detailsSection = createProductDetails(product, category, brand);

    productCard.append(imageSection, detailsSection);

    return productCard;
}

function renderProduct(productContainer) {
    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");
    const brand = params.get("brand");
    const id = params.get("id");

    const product = getProduct(id);

    if (!product) {
        const notFound = createElementWithClass("div", "not-found");

        const heading = document.createElement("h2");
        heading.textContent = "Product not found";

        const message = document.createElement("p");
        message.textContent = "Sorry, this product is not available.";

        const homeButton = document.createElement("a");
        homeButton.href = "home.html";
        homeButton.textContent = "Go to Home";
        homeButton.classList.add("home-btn");

        notFound.append(heading, message, homeButton);
        productContainer.append(notFound);

        return;
    }

    const productElement = createProduct(product, category, brand);

    productContainer.append(productElement);
}

function initializeProductPage() {
    const { navbarContainer, productContainer } = createPageElements();

    loadNavbar(navbarContainer);
    renderProduct(productContainer);
    initCartButtons();
}

document.addEventListener("DOMContentLoaded", initializeProductPage);