import { getProducts } from "../services/productService.js";
import { categoriesData } from "../data/categoriesData.js";

// Function to create an element with a class

function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    return element;
}



// Function to create product card

function createProductCard(product, category) {
    const link = createElementWithClass("a", "product-link");

    link.href =
        `brand.html?category=${encodeURIComponent(category)}&brand=${encodeURIComponent(product.brand)}`;

    const card = createElementWithClass("div", "product-card");

    const image = document.createElement("img");
    image.alt = product.name;
    image.loading = "lazy";
    image.src = product.img;

    const name = createElementWithClass("p", "product-name");
    name.textContent = product.name;

    const price = createElementWithClass("p", "product-price");
    price.textContent = product.price;

    card.append(image, name, price);
    link.append(card);

    return link;
}


// Function to create one product section

function createProductSection(category, products) {
    const section = createElementWithClass("section", "products-section");

    section.id = `${category}Section`;

    const sectionTitle = categoriesData.find(categoryData => categoryData.value === category)?.label || category;

    const title = createElementWithClass("h2", "section-title");
    title.textContent = sectionTitle;

    const wrapper = createElementWithClass("div", "products-wrapper");

    const leftButton = createElementWithClass("button", "scroll-btn");
    leftButton.classList.add("left");
    leftButton.type = "button";
    leftButton.textContent = "❮";

    const row = createElementWithClass("div", "products-row");

    const rightButton = createElementWithClass("button", "scroll-btn");
    rightButton.classList.add("right");
    rightButton.type = "button";
    rightButton.textContent = "❯";

    products.forEach(product => {
        const productCard = createProductCard(product, category);
        row.append(productCard);
    });

    wrapper.append(leftButton, row, rightButton);
    section.append(title, wrapper);

    setupScroll(row, leftButton, rightButton);

    return section;
}


// Function to handle horizontal scrolling

function setupScroll(row, leftButton, rightButton) {
    function updateButtons() {
        const maxScroll = row.scrollWidth - row.clientWidth;

        leftButton.style.display = row.scrollLeft > 5 ? "block" : "none";
        rightButton.style.display = maxScroll > 5 && row.scrollLeft < maxScroll - 5 ? "block" : "none";
    }

    leftButton.addEventListener("click", () => {
        row.scrollBy({ left: -300, behavior: "smooth" });
    });

    rightButton.addEventListener("click", () => {
        row.scrollBy({ left: 300, behavior: "smooth" });
    });

    row.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    updateButtons();
}


// Function to create all product sections

function createProductSections() {
    const products = getProducts();
    const fragment = document.createDocumentFragment();

    Object.entries(products).forEach(([category, productArray]) => {
        const section = createProductSection(category, productArray);
        fragment.append(section);
    });

    return fragment;
}


// Load product sections

export function loadProductSections(container) {
    const productSections = createProductSections();
    container.append(productSections);

    document.addEventListener("categoryChange", event => {
        const selectedCategory = event.detail.category;

        Object.entries(getProducts()).forEach(([category]) => {
            const section = document.getElementById(`${category}Section`);

            section.style.display = selectedCategory === "All" || selectedCategory === category ? "block" : "none";
        });
    });
}