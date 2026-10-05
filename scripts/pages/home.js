
import { loadNavbar } from "../components/navbar.js";
import { loadSlider } from "../components/slider.js";
import { loadProductSections } from "../components/productSection.js";

function createHomePage() {

    // Section 1 - Navbar
    const navbarContainer = document.createElement("div");  // div element
    navbarContainer.id = "navbar-container";

    // Section 2 - Slider
    const sliderContainer = document.createElement("div");  // div element
    sliderContainer.id = "slider-container";


    // Section 3 - Product Section
    const productSectionContainer = document.createElement("div"); // div element
    productSectionContainer.id = "product-section-container";


    document.body.append(navbarContainer, sliderContainer, productSectionContainer);


    loadNavbar(navbarContainer); // calling funciton to load nav bar
    loadSlider(sliderContainer); // calling funciton to load slider
    loadProductSections(productSectionContainer); 
}


document.addEventListener("DOMContentLoaded", () => {
    createHomePage();
});

document.addEventListener("categoryChange", event => {
    const selectedCategory = event.detail.category;

    console.log(selectedCategory);
});