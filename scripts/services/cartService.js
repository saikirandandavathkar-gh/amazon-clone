import { userRegistrationKey, currentUserKey } from "../config/storageKeys.js";


export function getCurrentUser() {
    const currentUser = localStorage.getItem(currentUserKey);
    return currentUser ? JSON.parse(currentUser) : null;
}

export function getUserCart() {
    const currentUser = getCurrentUser();
    return currentUser?.cart || [];
}


export function addToCart(product) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return false;
    }

    if (!Array.isArray(currentUser.cart)) {
        currentUser.cart = [];
    }

    const existingProduct = currentUser.cart.find(
        cartProduct =>
            cartProduct.productId === product.id &&
            cartProduct.category === product.category &&
            cartProduct.brand === product.brand
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        currentUser.cart.push({
            productId: product.id,
            category: product.category,
            brand: product.brand,
            title: product.title,
            price: product.price,
            img: product.img,
            rating: product.rating,
            reviews: product.reviews,
            quantity: 1
        });
    }

    updateUser(currentUser);

    return true;
}

function updateUser(updatedUser) {
    const users = JSON.parse(localStorage.getItem(userRegistrationKey)) || [];

    const userIndex = users.findIndex(
        userData => userData.email.toLowerCase() === updatedUser.email.toLowerCase()
    );

    if (userIndex === -1) return;

    users[userIndex] = updatedUser;

    localStorage.setItem(userRegistrationKey, JSON.stringify(users));
    localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));
}