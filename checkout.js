document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalElement = document.querySelector(".subtotal-value");
    const deliveryElement = document.querySelector(".delivery-value");
    const totalElement = document.querySelector(".total-value");
    const summaryBox = document.querySelector(".summary-box");
    const emptyCartMessage = document.querySelector(".empty-cart-msg"); 
    const checkoutForm = document.querySelector(".checkout-form");

    // Simulating cart retrieval from localStorage (assuming it's stored as an array of objects)
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateOrderSummary() {
        cartItemsContainer.innerHTML = ""; // Clear previous items
        let subtotal = 0;
        let deliveryFee = 200; // Assume Rs.200 as a fixed delivery fee
        let total = 0;

        if (cart.length === 0) {
            // Show empty cart message and hide summary
            emptyCartMessage.style.display = "block";
            summaryBox.style.display = "none";
            checkoutForm.style.display = "none";
            return;
        }

        // Hide empty cart message and show summary
        emptyCartMessage.style.display = "none";
        summaryBox.style.display = "block";
        checkoutForm.style.display = "block";

        // Loop through cart and display items
        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <p><strong>${item.name}</strong></p>
                    <p>Qty: ${item.quantity}</p>
                    <p>Price: Rs.${item.price}</p>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        });

        // Calculate total
        total = subtotal + deliveryFee;

        // Update totals in the UI
        subtotalElement.textContent = `Rs.${subtotal.toFixed(2)}`;
        deliveryElement.textContent = `Rs.${deliveryFee.toFixed(2)}`;
        totalElement.textContent = `Rs.${total.toFixed(2)}`;
    }

    // Call function to update order summary on page load
    updateOrderSummary();

    // --- Cart Handling Logic (Assuming you already had this) ---
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cartItems");
    const totalPriceEl = document.getElementById("totalPrice");
    let total = 0;
  
    cartContainer.innerHTML = "";
  
    if (cartItems.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalPriceEl.textContent = "0.00";
      return;
    }
  
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
  
      const itemEl = document.createElement("div");
      itemEl.classList.add("cart-item");
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <p>${item.name}</p>
        <p>Size: ${item.size}, Color: ${item.color}</p>
        <p>Qty: ${item.quantity}</p>
        <p>Price: $${item.price}</p>
      `;
      cartContainer.appendChild(itemEl);
    });
  
    totalPriceEl.textContent = total.toFixed(2);
  }
  
  document.addEventListener("DOMContentLoaded", loadCartItems);
  
  
  // --- Checkout Form Validation ---
  document.getElementById("checkoutForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
  
    const name = document.getElementById("fullName").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();
    const payment = document.getElementById("payment").value;
  
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  
    if (!name || !address || !email || !payment) {
      alert("Please fill in all fields.");
      return;
    }
  
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    alert("Order placed successfully!");
  });
  
  
  // --- Login Form Validation ---
  document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
  
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
  
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
  
    if (!emailRegex.test(email)) {
      alert("Invalid email format.");
      return;
    }
  
    alert("Login successful!");
  });
  
});
