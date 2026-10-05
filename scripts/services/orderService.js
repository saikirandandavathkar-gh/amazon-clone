import { userRegistrationKey, currentUserKey } from "../config/storageKeys.js";


export function getCurrentUser() {
    const currentUser = localStorage.getItem(currentUserKey);

    return currentUser ? JSON.parse(currentUser) : null;
}

export function getUserOrders() {
    const currentUser = getCurrentUser();

    return currentUser?.orders || [];
}

export function cancelOrder(orderId, reason) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return false;
    }

    const orders = currentUser.orders || [];

    const order = orders.find(orderData => orderData.id === orderId);

    if (!order || order.cancelled) {
        return false;
    }

    order.cancelled = true;
    order.status = "Cancelled";
    order.cancellationReason = reason;

    updateUser(currentUser);

    return true;
}

function updateUser(updatedUser) {
    const users = JSON.parse(localStorage.getItem(userRegistrationKey)) || [];

    const userIndex = users.findIndex(
        userData => userData.email.toLowerCase() === updatedUser.email.toLowerCase()
    );

    if (userIndex === -1) {
        return;
    }

    users[userIndex] = updatedUser;

    localStorage.setItem(userRegistrationKey, JSON.stringify(users));
    localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));
}