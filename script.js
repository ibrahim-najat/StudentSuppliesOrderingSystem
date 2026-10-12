
"use strict";

/* ========================================
   1. PRODUCT DATA
======================================== */

// The six products available in the campus supplies shop.

const products = [
    {
        id: "ballpen",
        name: "Ballpen",
        price: 12
    },
    {
        id: "pencil",
        name: "Pencil",
        price: 10
    },
    {
        id: "notebook",
        name: "Notebook",
        price: 35
    },
    {
        id: "yellow-pad",
        name: "Yellow Pad",
        price: 45
    },
    {
        id: "eraser",
        name: "Eraser",
        price: 8
    },
    {
        id: "ruler",
        name: "Ruler",
        price: 15
    }
];

/* ========================================
   2. APPLICATION DATA
======================================== */

// The shopping cart stores selected products and quantities.

let cart = [];
let paymentCompleted = false;

/* ========================================
   3. HTML ELEMENTS
======================================== */

// Get the existing HTML elements using their IDs.

const cartItems = document.getElementById("cart-items");
const cartEmptyMessage = document.getElementById("cart-empty-message");
const totalItemsElement = document.getElementById("total-items");
const orderTotalElement = document.getElementById("order-total");

const paymentForm = document.getElementById("payment-form");
const cashPaymentInput = document.getElementById("cash-payment");
const paymentValidationMessage = document.getElementById(
    "payment-validation-message"
);

const receiptContent = document.getElementById("receipt-content");
const newTransactionButton = document.getElementById(
    "new-transaction-btn"
);

/* ========================================
   4. HELPER FUNCTIONS
======================================== */

// Format a number as Philippine pesos.

function formatPeso(amount) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Find a product using its ID.

function findProduct(productId) {
    return products.find(function (product) {
        return product.id === productId;
    });
}

// Calculate the total number of individual items in the cart.

function calculateTotalItems() {
    return cart.reduce(function (total, item) {
        return total + item.quantity;
    }, 0);
}

// Calculate the total price of all cart items.

function calculateOrderTotal() {
    return cart.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);
}

// Display a payment validation message.

function showPaymentMessage(message, type) {
    paymentValidationMessage.textContent = message;

    // Remove any previous message styles.
    paymentValidationMessage.classList.remove(
        "success-message",
        "error-message",
        "warning-message",
        "payment-success",
        "payment-error",
        "payment-warning",
        "validation-success",
        "validation-error",
        "validation-warning"
    );

    // Apply the appropriate CSS class.
    if (type === "success") {
        paymentValidationMessage.classList.add("success-message");
    } else if (type === "warning") {
        paymentValidationMessage.classList.add("warning-message");
    } else {
        paymentValidationMessage.classList.add("error-message");
    }
}

// Clear the payment validation message.

function clearPaymentMessage() {
    paymentValidationMessage.textContent = "";

    paymentValidationMessage.classList.remove(
        "success-message",
        "error-message",
        "warning-message",
        "payment-success",
        "payment-error",
        "payment-warning",
        "validation-success",
        "validation-error",
        "validation-warning"
    );
}

/* ========================================
   5. ADD PRODUCTS TO CART
======================================== */

// Add a product when its Add to Cart button is clicked.

function addToCart(productId) {
    // Prevent changes after payment has been completed.
    if (paymentCompleted) {
        showPaymentMessage(
            "Payment is complete. Click New Transaction to make another purchase.",
            "warning"
        );
        return;
    }

    const product = findProduct(productId);

    // Stop if the product ID is invalid.
    if (!product) {
        showPaymentMessage("Product not found.", "error");
        return;
    }

    // Check whether the product is already in the cart.
    const existingItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    clearPaymentMessage();
    renderCart();
}

// Attach click listeners to all Add to Cart buttons.

const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const productId = button.dataset.productId;
        addToCart(productId);
    });
});

/* ========================================
   6. CHANGE ITEM QUANTITY
======================================== */

// Increase or decrease the quantity of a cart item.

function changeQuantity(productId, amount) {
    if (paymentCompleted) {
        return;
    }

    const item = cart.find(function (cartItem) {
        return cartItem.id === productId;
    });

    if (!item) {
        return;
    }

    const newQuantity = item.quantity + amount;

    // Quantity must always be at least one.
    if (newQuantity < 1) {
        return;
    }

    item.quantity = newQuantity;

    clearPaymentMessage();
    renderCart();
}

/* ========================================
   7. REMOVE ITEMS FROM CART
======================================== */

// Remove only the selected product from the cart.

function removeFromCart(productId) {
    if (paymentCompleted) {
        return;
    }

    cart = cart.filter(function (item) {
        return item.id !== productId;
    });

    clearPaymentMessage();
    renderCart();
}

/* ========================================
   8. DISPLAY THE SHOPPING CART
======================================== */

// Build and update the shopping cart table.

function renderCart() {
    // Remove the previous cart rows.
    cartItems.replaceChildren();

    // Show or hide the empty cart message.
    cartEmptyMessage.hidden = cart.length > 0;

    // Create a row for each selected product.
    cart.forEach(function (item) {
        const row = document.createElement("tr");

        // Product name.
        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;

        // Unit price.
        const priceCell = document.createElement("td");
        priceCell.textContent = formatPeso(item.price);

        // Quantity controls.
        const quantityCell = document.createElement("td");
        const quantityControls = document.createElement("div");

        quantityControls.className = "quantity-controls";

        // Decrease quantity button.
        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "-";
        decreaseButton.className = "quantity-btn";
        decreaseButton.setAttribute(
            "aria-label",
            "Decrease quantity of " + item.name
        );
        decreaseButton.disabled = paymentCompleted;

        decreaseButton.addEventListener("click", function () {
            changeQuantity(item.id, -1);
        });

        // Display current quantity.
        const quantityDisplay = document.createElement("span");
        quantityDisplay.className = "quantity-value";
        quantityDisplay.textContent = item.quantity;
        quantityDisplay.setAttribute("aria-label", "Quantity");

        // Increase quantity button.
        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.className = "quantity-btn";
        increaseButton.setAttribute(
            "aria-label",
            "Increase quantity of " + item.name
        );
        increaseButton.disabled = paymentCompleted;

        increaseButton.addEventListener("click", function () {
            changeQuantity(item.id, 1);
        });

        quantityControls.append(
            decreaseButton,
            quantityDisplay,
            increaseButton
        );

        quantityCell.appendChild(quantityControls);

        // Item subtotal.
        const subtotalCell = document.createElement("td");
        subtotalCell.textContent = formatPeso(item.price * item.quantity);

        // Remove button.
        const actionCell = document.createElement("td");
        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.className = "remove-btn";
        removeButton.setAttribute(
            "aria-label",
            "Remove " + item.name + " from cart"
        );
        removeButton.disabled = paymentCompleted;

        removeButton.addEventListener("click", function () {
            removeFromCart(item.id);
        });

        actionCell.appendChild(removeButton);

        // Add all cells to the row.
        row.append(
            nameCell,
            priceCell,
            quantityCell,
            subtotalCell,
            actionCell
        );

        // Add the row to the cart table.
        cartItems.appendChild(row);
    });

    // Update the total number of items.
    totalItemsElement.textContent = calculateTotalItems();

    // Update the order total.
    orderTotalElement.textContent = formatPeso(calculateOrderTotal());

    // Disable Add to Cart buttons after successful payment.
    addToCartButtons.forEach(function (button) {
        button.disabled = paymentCompleted;
    });

    // Disable payment input and button after successful payment.
    cashPaymentInput.disabled = paymentCompleted;

    const confirmPaymentButton = document.getElementById(
        "confirm-payment-btn"
    );

    if (confirmPaymentButton) {
        confirmPaymentButton.disabled = paymentCompleted;
    }
}

/* ========================================
   9. GENERATE TRANSACTION REFERENCE
======================================== */

// Generate a unique reference for each successful transaction.

function generateTransactionReference() {
    const timestamp = Date.now().toString(36).toUpperCase();

    const randomPart = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return "SST-" + timestamp + "-" + randomPart;
}

/* ========================================
   10. DISPLAY THE RECEIPT
======================================== */

// Display the purchased products and payment details.

function displayReceipt(transaction, cashPaid, change) {
    // Clear any previous receipt.
    receiptContent.replaceChildren();

    // Receipt title.
    const title = document.createElement("h3");
    title.textContent = "Student Supplies Shop Receipt";

    receiptContent.appendChild(title);

    // Transaction reference.
    const referenceParagraph = document.createElement("p");
    const referenceLabel = document.createElement("strong");

    referenceLabel.textContent = "Transaction Reference: ";
    referenceParagraph.append(
        referenceLabel,
        document.createTextNode(transaction.reference)
    );

    receiptContent.appendChild(referenceParagraph);

    // Transaction date and time.
    const dateParagraph = document.createElement("p");
    const dateLabel = document.createElement("strong");

    dateLabel.textContent = "Date and Time: ";

    dateParagraph.append(
        dateLabel,
        document.createTextNode(transaction.date)
    );

    receiptContent.appendChild(dateParagraph);

    // Purchased products heading.
    const productsHeading = document.createElement("h3");
    productsHeading.textContent = "Purchased Products";

    receiptContent.appendChild(productsHeading);

    // Receipt table.
    const table = document.createElement("table");
    const tableHead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headings = [
        "Product",
        "Unit Price",
        "Quantity",
        "Subtotal"
    ];

    headings.forEach(function (headingText) {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = headingText;
        headerRow.appendChild(th);
    });

    tableHead.appendChild(headerRow);

    const tableBody = document.createElement("tbody");

    transaction.items.forEach(function (item) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;

        const priceCell = document.createElement("td");
        priceCell.textContent = formatPeso(item.price);

        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.quantity;

        const subtotalCell = document.createElement("td");
        subtotalCell.textContent = formatPeso(
            item.price * item.quantity
        );

        row.append(
            nameCell,
            priceCell,
            quantityCell,
            subtotalCell
        );

        tableBody.appendChild(row);
    });

    table.append(tableHead, tableBody);
    receiptContent.appendChild(table);

    // Payment summary.
    const totalParagraph = document.createElement("p");
    const totalLabel = document.createElement("strong");

    totalLabel.textContent = "Order Total: ";

    totalParagraph.append(
        totalLabel,
        document.createTextNode(formatPeso(transaction.total))
    );

    receiptContent.appendChild(totalParagraph);

    const paidParagraph = document.createElement("p");
    const paidLabel = document.createElement("strong");

    paidLabel.textContent = "Amount Paid: ";

    paidParagraph.append(
        paidLabel,
        document.createTextNode(formatPeso(cashPaid))
    );

    receiptContent.appendChild(paidParagraph);

    const changeParagraph = document.createElement("p");
    const changeLabel = document.createElement("strong");

    changeLabel.textContent = "Change: ";

    changeParagraph.append(
        changeLabel,
        document.createTextNode(formatPeso(change))
    );

    receiptContent.appendChild(changeParagraph);

    // Payment confirmation.
    const confirmationParagraph = document.createElement("p");
    confirmationParagraph.className = "success-message";

    const confirmationText = document.createElement("strong");
    confirmationText.textContent = "Payment Confirmed";

    confirmationParagraph.appendChild(confirmationText);

    receiptContent.appendChild(confirmationParagraph);
}

/* ========================================
   11. PROCESS PAYMENT
======================================== */

// Validate payment and complete the transaction if it is valid.

paymentForm.addEventListener("submit", function (event) {
    // Prevent the form from refreshing the page.
    event.preventDefault();

    // Prevent a second payment for the same transaction.
    if (paymentCompleted) {
        showPaymentMessage(
            "This transaction has already been paid. Click New Transaction to continue.",
            "warning"
        );
        return;
    }

    // Payment is not allowed when the cart is empty.
    if (cart.length === 0) {
        showPaymentMessage(
            "Your shopping cart is empty. Please add products before paying.",
            "error"
        );
        return;
    }

    // Reject blank payment.
    const paymentValue = cashPaymentInput.value.trim();

    if (paymentValue === "") {
        showPaymentMessage(
            "Please enter your cash payment.",
            "error"
        );
        cashPaymentInput.focus();
        return;
    }

    // Convert the input to a number.
    const cashPaid = Number(paymentValue);

    // Reject non-numeric or invalid payment.
    if (!Number.isFinite(cashPaid)) {
        showPaymentMessage(
            "Please enter a valid numeric payment amount.",
            "error"
        );
        cashPaymentInput.focus();
        return;
    }

    // Reject negative payment.
    if (cashPaid < 0) {
        showPaymentMessage(
            "Payment cannot be negative.",
            "error"
        );
        cashPaymentInput.focus();
        return;
    }

    // Reject payment with more than two decimal places.
    if (!/^\d+(\.\d{1,2})?$/.test(paymentValue)) {
        showPaymentMessage(
            "Please enter a valid amount with no more than two decimal places.",
            "error"
        );
        cashPaymentInput.focus();
        return;
    }

    // Calculate the total in centavos to avoid floating-point issues.
    const totalInCentavos = Math.round(calculateOrderTotal() * 100);
    const paymentInCentavos = Math.round(cashPaid * 100);

    // Reject payment that is lower than the order total.
    if (paymentInCentavos < totalInCentavos) {
        const shortage = (totalInCentavos - paymentInCentavos) / 100;

        showPaymentMessage(
            "Insufficient payment. You still need " +
                formatPeso(shortage) +
                ".",
            "error"
        );

        cashPaymentInput.focus();
        return;
    }

    // Calculate the correct change.
    const change = (paymentInCentavos - totalInCentavos) / 100;

    // Save a snapshot of the completed transaction.
    const transaction = {
        reference: generateTransactionReference(),
        date: new Date().toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "medium"
        }),
        items: cart.map(function (item) {
            return {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            };
        }),
        total: totalInCentavos / 100
    };

    // Mark the transaction as paid.
    paymentCompleted = true;

    // Display the receipt.
    displayReceipt(transaction, cashPaid, change);

    // Display payment success and change.
    showPaymentMessage(
        "Payment successful! Your change is " +
            formatPeso(change) +
            ".",
        "success"
    );

    // Update the interface and lock the cart after payment.
    renderCart();
});

/* ========================================
   12. START A NEW TRANSACTION
======================================== */

// Reset the application for another purchase.

newTransactionButton.addEventListener("click", function () {
    // Empty the shopping cart.
    cart = [];

    // Allow a new payment.
    paymentCompleted = false;

    // Clear the payment input.
    paymentForm.reset();

    // Clear payment validation messages.
    clearPaymentMessage();

    // Clear the previous receipt.
    receiptContent.replaceChildren();

    // Refresh the cart, item count, and total.
    renderCart();

    // Return focus to the product list.
    const firstAddButton = document.querySelector(".add-to-cart-btn");

    if (firstAddButton) {
        firstAddButton.focus();
    }
});

/* ========================================
   13. INITIALIZE THE APPLICATION
======================================== */

// Display the initial empty cart and zero total.

renderCart();
