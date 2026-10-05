import { loadNavbar } from "../components/navbar.js";
import {
    getCurrentUser,
    getUserOrders,
    cancelOrder
} from "../services/orderService.js";

function createElementWithClass(tagName, ...classNames) {
    const element = document.createElement(tagName);
    element.classList.add(...classNames);
    return element;
}

function createPage() {
    const navbarContainer = document.createElement("div");
    navbarContainer.id = "navbar-container";

    const ordersPage = createElementWithClass("main", "orders-page");

    const title = document.createElement("h1");
    title.textContent = "Returns & Orders";

    const ordersContainer = document.createElement("div");
    ordersContainer.id = "ordersContainer";

    ordersPage.append(title, ordersContainer);
    document.body.append(navbarContainer, ordersPage);

    return {
        navbarContainer,
        ordersContainer
    };
}

function createEmptyOrders(titleText, messageText, buttonText, buttonLink) {
    const emptyOrders = createElementWithClass("div", "empty-orders");

    const heading = document.createElement("h2");
    heading.textContent = titleText;

    const message = document.createElement("p");
    message.textContent = messageText;

    const button = document.createElement("a");
    button.href = buttonLink;
    button.textContent = buttonText;
    button.classList.add("continue-shopping-btn");

    emptyOrders.append(heading, message, button);

    return emptyOrders;
}

function renderOrders(ordersContainer) {
    const currentUser = getCurrentUser();

    ordersContainer.replaceChildren();

    if (!currentUser) {
        const emptyOrders = createEmptyOrders(
            "Please sign in to view your orders.",
            "Sign in to see your order history and track your purchases.",
            "Sign In",
            "signIn.html"
        );

        ordersContainer.append(emptyOrders);
        return;
    }

    const orders = getUserOrders();

    if (!Array.isArray(orders) || orders.length === 0) {
        const emptyOrders = createEmptyOrders(
            "You haven't placed any orders yet.",
            "When you place an order, you can track it and view its details here.",
            "Continue Shopping",
            "home.html"
        );

        ordersContainer.append(emptyOrders);
        return;
    }

    const ordersList = createElementWithClass(
        "div",
        "orders-list"
    );

    orders.forEach(order => {
        ordersList.append(createOrderCard(order));
    });

    ordersContainer.append(ordersList);
}

function createOrderCard(order) {
    const orderCard = createElementWithClass(
        "div",
        "order-card"
    );

    orderCard.dataset.orderId = order.id;

    const orderHeader = createOrderHeader(order);
    const orderContent = createOrderContent(order);

    orderCard.append(orderHeader, orderContent);

    return orderCard;
}

function createOrderHeader(order) {
    const header = createElementWithClass(
        "div",
        "order-header"
    );

    const headerDetails = document.createElement("div");

    const orderId = createElementWithClass(
        "div",
        "order-id"
    );

    orderId.textContent = `Order ID: ${order.id}`;

    const orderDate = createElementWithClass(
        "div",
        "order-date"
    );

    orderDate.textContent =
        `Ordered on ${formatDate(order.createdAt)}`;

    headerDetails.append(orderId, orderDate);
    header.append(headerDetails);

    return header;
}

function createOrderContent(order) {
    const content = createElementWithClass(
        "div",
        "order-content"
    );

    const imageContainer = createProductImage(order.product);
    const details = createOrderDetails(order);

    content.append(imageContainer, details);

    return content;
}

function createProductImage(product) {
    const imageContainer = createElementWithClass(
        "div",
        "order-image"
    );

    const link = document.createElement("a");
    link.href = getProductURL(product);

    const image = document.createElement("img");
    image.src = product.img;
    image.alt = product.title;

    link.append(image);
    imageContainer.append(link);

    return imageContainer;
}

function createOrderDetails(order) {
    const details = createElementWithClass(
        "div",
        "order-details"
    );

    const title = document.createElement("h2");
    title.classList.add("order-title");

    const titleLink = document.createElement("a");
    titleLink.href = getProductURL(order.product);
    titleLink.textContent = order.product.title;

    title.append(titleLink);

    const rating = createElementWithClass(
        "div",
        "order-rating"
    );

    rating.textContent =
        `⭐ ${order.product.rating} (${order.product.reviews} reviews)`;

    const price = document.createElement("p");
    price.classList.add("order-price");
    price.textContent = order.product.price;

    const status = createOrderStatus(order);

    details.append(
        title,
        rating,
        price,
        status
    );

    if (!order.cancelled) {
        details.append(createDeliveryDate(order));
    }

    details.append(createTracking(order));

    if (order.cancelled) {
        details.append(createCancellationInfo(order));
    }

    details.append(
        createDeliveryAddress(order),
        createPaymentInfo(order),
        createOrderActions(order)
    );

    return details;
}

function createOrderStatus(order) {
    const status = createElementWithClass(
        "p",
        "order-status"
    );

    if (order.cancelled) {
        status.classList.add("cancelled-status");
        status.textContent = "✕ Order Cancelled";
    } else {
        status.textContent = `✓ ${order.status}`;
    }

    return status;
}

function createDeliveryDate(order) {
    const deliveryDate = document.createElement("p");
    deliveryDate.classList.add("delivery-date");

    const estimatedDate = getEstimatedDeliveryDate(
        order.createdAt
    );

    deliveryDate.textContent = "Estimated delivery: ";

    const strong = document.createElement("strong");
    strong.textContent = formatDate(estimatedDate);

    deliveryDate.append(strong);

    return deliveryDate;
}

function getEstimatedDeliveryDate(createdAt) {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 5);

    return date;
}

function createTracking(order) {
    if (order.cancelled) {
        return createCancelledTracking();
    }

    const tracking = createElementWithClass(
        "div",
        "tracking"
    );

    const title = createElementWithClass(
        "div",
        "tracking-title"
    );

    title.textContent = "Tracking";

    const trackingLine = createElementWithClass(
        "div",
        "tracking-line"
    );

    const steps = [
        "Order Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered"
    ];

    steps.forEach((step, index) => {
        const trackingStep = createElementWithClass(
            "div",
            "tracking-step"
        );

        if (index === 0) {
            trackingStep.classList.add("completed");
        }

        const dot = createElementWithClass(
            "div",
            "tracking-dot"
        );

        const label = createElementWithClass(
            "div",
            "tracking-label"
        );

        label.textContent = step;

        trackingStep.append(dot, label);
        trackingLine.append(trackingStep);
    });

    tracking.append(title, trackingLine);

    return tracking;
}

function createCancelledTracking() {
    const tracking = createElementWithClass(
        "div",
        "tracking",
        "cancelled-tracking"
    );

    const title = createElementWithClass(
        "div",
        "tracking-title"
    );

    title.textContent = "Order Status";

    const message = createElementWithClass(
        "div",
        "cancelled-tracking-message"
    );

    message.textContent =
        "This order has been cancelled.";

    tracking.append(title, message);

    return tracking;
}

function createCancellationInfo(order) {
    const container = createElementWithClass(
        "div",
        "cancellation-info"
    );

    const title = createElementWithClass(
        "div",
        "cancellation-title"
    );

    title.textContent = "Cancellation reason";

    const reason = document.createElement("p");
    reason.textContent = order.cancellationReason || "";

    container.append(title, reason);

    return container;
}

function createDeliveryAddress(order) {
    const container = createElementWithClass(
        "div",
        "delivery-address"
    );

    const heading = document.createElement("strong");
    heading.textContent = "Delivery Address";

    const name = document.createElement("p");
    name.textContent = order.deliveryDetails?.name || "";

    const phone = document.createElement("p");
    phone.textContent = order.deliveryDetails?.phone || "";

    const address = document.createElement("p");
    address.textContent =
        order.deliveryDetails?.address || "";

    const location = document.createElement("p");

    location.textContent =
        `${order.deliveryDetails?.city || ""}, ` +
        `${order.deliveryDetails?.state || ""} - ` +
        `${order.deliveryDetails?.pincode || ""}`;

    container.append(
        heading,
        name,
        phone,
        address,
        location
    );

    return container;
}

function createPaymentInfo(order) {
    const payment = createElementWithClass(
        "div",
        "payment-info"
    );

    const strong = document.createElement("strong");
    strong.textContent = "Payment: ";

    const method = document.createTextNode(
        order.paymentMethod || ""
    );

    payment.append(strong, method);

    return payment;
}

function createOrderActions(order) {
    const actions = createElementWithClass(
        "div",
        "order-actions"
    );

    const button = document.createElement("button");
    button.type = "button";

    if (order.cancelled) {
        button.classList.add("cancelled-order-btn");
        button.disabled = true;
        button.textContent = "Cancelled";
    } else {
        button.classList.add("cancel-order-btn");
        button.dataset.orderId = order.id;
        button.textContent = "Cancel Order";
    }

    actions.append(button);

    if (!order.cancelled) {
        button.addEventListener("click", () => {
            showCancelDialog(order.id);
        });
    }

    return actions;
}

function getProductURL(product) {
    const params = new URLSearchParams({
        category: product.category,
        brand: product.brand,
        id: product.productId || product.id
    });

    return `product.html?${params.toString()}`;
}

function showCancelDialog(orderId) {
    const existingDialog =
        document.getElementById("cancelOrderDialog");

    if (existingDialog) {
        existingDialog.remove();
    }

    const dialog = document.createElement("div");
    dialog.id = "cancelOrderDialog";
    dialog.classList.add("cancel-dialog-overlay");

    const cancelDialog = createElementWithClass(
        "div",
        "cancel-dialog"
    );

    const heading = document.createElement("h2");
    heading.textContent = "Cancel Order";

    const message = document.createElement("p");
    message.textContent =
        "Why do you want to cancel this order?";

    const reasons = createElementWithClass(
        "div",
        "cancel-reasons"
    );

    const reasonOptions = [
        "Ordered by mistake",
        "Found a better price",
        "Delivery takes too long",
        "No longer needed",
        "Other"
    ];

    reasonOptions.forEach(reason => {
        reasons.append(
            createReasonOption(reason)
        );
    });

    const otherContainer = createElementWithClass(
        "div",
        "other-reason-container"
    );

    const otherLabel = document.createElement("label");
    otherLabel.htmlFor = "otherReason";
    otherLabel.textContent =
        "Please tell us the reason";

    const otherReason = document.createElement("textarea");
    otherReason.id = "otherReason";
    otherReason.rows = 3;
    otherReason.maxLength = 60;
    otherReason.placeholder = "Enter your reason...";

    const characterLimit = createElementWithClass(
        "small",
        "character-limit"
    );

    characterLimit.textContent =
        "Maximum 60 characters";

    otherContainer.append(
        otherLabel,
        otherReason,
        characterLimit
    );

    const error = createElementWithClass(
        "p",
        "cancel-reason-error"
    );

    error.id = "cancelReasonError";

    const actions = createElementWithClass(
        "div",
        "cancel-dialog-actions"
    );

    const keepButton = document.createElement("button");
    keepButton.type = "button";
    keepButton.classList.add("cancel-dialog-back");
    keepButton.textContent = "Keep Order";

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.classList.add("confirm-cancel-btn");
    confirmButton.textContent = "Cancel Order";

    actions.append(keepButton, confirmButton);

    cancelDialog.append(
        heading,
        message,
        reasons,
        otherContainer,
        error,
        actions
    );

    dialog.append(cancelDialog);
    document.body.append(dialog);

    setupCancelDialog(
        dialog,
        orderId,
        otherContainer,
        otherReason,
        error
    );

    keepButton.addEventListener("click", () => {
        dialog.remove();
    });

    confirmButton.addEventListener("click", () => {
        confirmCancellation(
            dialog,
            orderId,
            otherReason,
            error
        );
    });

    dialog.addEventListener("click", event => {
        if (event.target === dialog) {
            dialog.remove();
        }
    });
}

function createReasonOption(reason) {
    const label = document.createElement("label");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "cancelReason";
    input.value = reason;

    if (reason === "Other") {
        input.id = "otherCancelReason";
    }

    const span = document.createElement("span");
    span.textContent = reason;

    label.append(input, span);

    return label;
}

function setupCancelDialog(
    dialog,
    orderId,
    otherContainer,
    otherReason,
    error
) {
    const reasonInputs = dialog.querySelectorAll(
        'input[name="cancelReason"]'
    );

    reasonInputs.forEach(input => {
        input.addEventListener("change", () => {
            error.textContent = "";

            if (input.value === "Other" && input.checked) {
                otherContainer.style.display = "block";
                otherReason.focus();
            } else {
                otherContainer.style.display = "none";
                otherReason.value = "";
            }
        });
    });
}

function confirmCancellation(
    dialog,
    orderId,
    otherReason,
    error
) {
    const selectedReason = dialog.querySelector(
        'input[name="cancelReason"]:checked'
    );

    if (!selectedReason) {
        error.textContent =
            "Please select a reason for cancellation.";
        return;
    }

    let reason = selectedReason.value;

    if (selectedReason.value === "Other") {
        const customReason = otherReason.value.trim();

        if (!customReason) {
            error.textContent =
                "Please enter your reason.";
            otherReason.focus();
            return;
        }

        if (customReason.length < 3) {
            error.textContent =
                "Please enter a valid reason.";
            otherReason.focus();
            return;
        }

        reason = customReason;
    }

    const cancelled = cancelOrder(
        orderId,
        reason
    );

    if (!cancelled) {
        error.textContent =
            "Unable to cancel this order.";
        return;
    }

    dialog.remove();

    const ordersContainer =
        document.getElementById("ordersContainer");

    renderOrders(ordersContainer);
}

function formatDate(dateValue) {
    const date = new Date(dateValue);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function createOrderPage() {
    const {
        navbarContainer,
        ordersContainer
    } = createPage();

    loadNavbar(navbarContainer);
    renderOrders(ordersContainer);
}

document.addEventListener(
    "DOMContentLoaded",
    createOrderPage
);