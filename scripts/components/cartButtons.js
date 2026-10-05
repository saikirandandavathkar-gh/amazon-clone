
import { addToCart, getUserCart } from "../services/cartService.js";
import { currentUserKey } from "../config/storageKeys.js";
import { updateCartCount } from "../components/navbar.js";

export function showSignInIndicator() {
    const existingIndicator = document.querySelector(".login-indicator");

    if (existingIndicator) {
        existingIndicator.remove();
    }

    const indicator = document.createElement("div");
    indicator.classList.add("login-indicator");
    indicator.textContent = "Please sign in";

    const accountSection = document.querySelector(".account-dropdown");

    if (accountSection) {
        accountSection.append(indicator);
    }

    setTimeout(() => {
        indicator.remove();
    }, 3000);
}

export function initCartButtons() {
    const buttons = document.querySelectorAll(".add-cart-btn");

    buttons.forEach(button => {
        const currentUser = JSON.parse(
            localStorage.getItem(currentUserKey)
        );

        if (currentUser) {
            const cart = getUserCart();

            const productAlreadyInCart = cart.some(
                cartProduct =>
                    cartProduct.productId === button.dataset.productId &&
                    cartProduct.category === button.dataset.category &&
                    cartProduct.brand === button.dataset.brand
            );

            if (productAlreadyInCart) {
                button.textContent = "Go to Cart";
                button.dataset.cartState = "added";
            }
        }

        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const currentUser = JSON.parse(
                localStorage.getItem(currentUserKey)
            );

            if (!currentUser) {
                showSignInIndicator();
                return;
            }

            if (button.dataset.cartState === "added") {
                window.location.href = "cart.html";
                return;
            }

            const product = {
                id: button.dataset.productId,
                category: button.dataset.category,
                brand: button.dataset.brand,
                title: button.dataset.title,
                price: button.dataset.price,
                img: button.dataset.img,
                rating: button.dataset.rating,
                reviews: button.dataset.reviews
            };

            const added = addToCart(product);

            if (!added) {
                showSignInIndicator();
                return;
            }

            button.textContent = "Go to Cart";
            button.dataset.cartState = "added";

            updateCartCount();
        });
    });
}
