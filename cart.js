document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.querySelector(".cart-container");
    const totalsContainer = document.querySelector(".cart-totals");
    const emptyCartMessage = document.querySelector(".empty-cart-message");
    const grossTotalElement = document.querySelector(".gross-total");
    const discountElement = document.querySelector(".discount");
    const netTotalElement = document.querySelector(".net-total");
 
    function renderCart() {
        cartContainer.innerHTML = ""; // Clear cart
        let total = 0;
        let discount = 0; // Future logic for discount

        if (cart.length === 0) {
            emptyCartMessage.style.display = "block"; // Show empty cart message
            totalsContainer.style.display = "none"; // Hide totals
            return;
        }

        emptyCartMessage.style.display = "none"; // Hide empty cart message
        totalsContainer.style.display = "block"; // Show totals

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            cartContainer.innerHTML += `
                <div class="cart-item">
                    <span class="item-number">${index + 1}</span>
                    <img src="${item.image}" alt="${item.name}" class="cart-img">
                    <div class="cart-details">
                        <h3>${item.name}</h3>
                        <p>${item.color} / ${item.size}</p>
                        <p><strong>LKR ${item.price.toLocaleString()}</strong></p>
                    </div>
                    <button class="remove-item" data-index="${index}">🗑️Delete</button>
                </div>
            `;
        });

        // Update totals
        grossTotalElement.textContent = `LKR ${total.toLocaleString()}`;
        discountElement.textContent = `LKR ${discount.toLocaleString()}`;
        netTotalElement.textContent = `LKR ${(total - discount).toLocaleString()}`;
    }

    // Remove item function
    cartContainer.addEventListener("click", function (e) {
        if (e.target.closest(".remove-item")) {
            let index = e.target.closest(".remove-item").dataset.index;
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        }
    });

    renderCart();
});
