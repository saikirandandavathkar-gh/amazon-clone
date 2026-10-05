
import { loadNavbar } from "../components/navbar.js";
import { searchProducts } from "../services/searchService.js";
import { initCartButtons, showSignInIndicator } from "../components/cartButtons.js";
import { currentUserKey, buyNowProductKey } from "../config/storageKeys.js";

function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    return element;
}

function getSearchParameters() {
    const params = new URLSearchParams(window.location.search);

    return {
        query: params.get("q") || "",
        category: params.get("category") || "All"
    };
}

function createPage() {
    const navbarContainer = document.createElement("div");
    navbarContainer.id = "navbar-container";

    const searchPage = createElementWithClass("main", "search-page");

    const searchTitle = createElementWithClass("h1", "search-title");
    searchTitle.id = "searchTitle";

    const resultCount = createElementWithClass("p", "result-count");
    resultCount.id = "resultCount";

    const searchResults = createElementWithClass("div", "search-results");
    searchResults.id = "searchResults";

    searchPage.append(searchTitle, resultCount, searchResults);
    document.body.append(navbarContainer, searchPage);

    return { navbarContainer, searchTitle, resultCount, searchResults };
}

function createProductCard(product) {
    const productCard = createElementWithClass("div", "samsung-product-card");

    const imageSection = createElementWithClass("div", "product-image-section");

    const imageLink = document.createElement("a");
    imageLink.href = `product.html?category=${encodeURIComponent(product.category)}&brand=${encodeURIComponent(product.brand)}&id=${encodeURIComponent(product.id)}`;

    const image = document.createElement("img");
    image.src = product.img;
    image.alt = product.title;
    image.classList.add("samsung-product-image");

    imageLink.append(image);
    imageSection.append(imageLink);

    const detailsSection = createElementWithClass("div", "product-details-section");

    const titleLink = document.createElement("a");
    titleLink.href = `product.html?category=${encodeURIComponent(product.category)}&brand=${encodeURIComponent(product.brand)}&id=${encodeURIComponent(product.id)}`;
    titleLink.classList.add("product-title-link");

    const title = createElementWithClass("h2", "product-title");
    title.textContent = product.title;

    titleLink.append(title);

    const rating = createElementWithClass("div", "rating");

    const ratingText = document.createTextNode(`⭐ ${product.rating} `);

    const reviews = document.createElement("span");
    reviews.textContent = `(${product.reviews} reviews)`;

    rating.append(ratingText, reviews);

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

    if (Array.isArray(product.features)) {
        product.features.slice(0, 4).forEach(feature => {
            const featureItem = document.createElement("li");
            featureItem.textContent = feature;
            features.append(featureItem);
        });
    }

    const actions = createElementWithClass("div", "product-actions");

    const addCartButton = createElementWithClass("button", "add-cart-btn");
    addCartButton.type = "button";
    addCartButton.textContent = "Add to Cart";
    addCartButton.dataset.category = product.category;
    addCartButton.dataset.brand = product.brand;
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
                category: product.category,
                brand: product.brand,
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

    detailsSection.append(
        titleLink,
        rating,
        bought,
        priceSection,
        delivery,
        aboutTitle,
        features,
        actions
    );

    productCard.append(imageSection, detailsSection);

    return productCard;
}

function createNotFound(query) {
    const notFound = createElementWithClass("div", "not-found");

    const heading = document.createElement("h2");
    heading.textContent = "Products not found";

    const message = document.createElement("p");
    message.textContent = `Sorry, no products matched "${query}".`;

    notFound.append(heading, message);

    return notFound;
}

function renderResults(searchResults, query, category) {
    const results = searchProducts(query, category);

    if (results.length === 0) {
        searchResults.append(createNotFound(query));
        return results;
    }

    results.forEach(product => {
        searchResults.append(createProductCard(product));
    });

    return results;
}

function createSearchPage() {
    const { navbarContainer, searchTitle, resultCount, searchResults } = createPage();

    loadNavbar(navbarContainer);

    const { query, category } = getSearchParameters();

    searchTitle.textContent = query
        ? `Search results for "${query}"`
        : "Search Results";


    const results = renderResults(searchResults, query, category);

    resultCount.textContent = `${results.length} result${results.length !== 1 ? "s" : ""}`;

    initCartButtons();
}

document.addEventListener("DOMContentLoaded", createSearchPage);
