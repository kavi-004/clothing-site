document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Select elements
    const sizeButtons = document.querySelectorAll(".size-btn");
    const colorBoxes = document.querySelectorAll(".color-box");
    const quantityButtons = document.querySelectorAll(".qty-btn");
    const addToCartBtn = document.querySelector(".add-to-cart");
    const buyNowBtn = document.querySelector(".buy-now");

    let selectedSize = "S";
    let selectedColor = "White";
    let quantity = 1; 

    // Size selection
    sizeButtons.forEach(button => {
        button.addEventListener("click", function () {
            document.querySelector(".size-btn.active")?.classList.remove("active");
            this.classList.add("active");
            selectedSize = this.textContent;
        });
    });

    // Color selection
    colorBoxes.forEach(box => {
        box.addEventListener("click", function () {
            document.querySelector(".color-box.selected")?.classList.remove("selected");
            this.classList.add("selected");
            selectedColor = this.dataset.color || "Default Color";
        });
    });

    // Quantity selection
    quantityButtons.forEach(button => {
        button.addEventListener("click", function () {
            let qtyElement = document.querySelector(".qty");
            if (this.textContent === "+") {
                quantity++;
            } else if (this.textContent === "-" && quantity > 1) {
                quantity--;
            }
            qtyElement.textContent = quantity;
        });
    });

    // Get product details
    function getProductDetails() {
        return {
            id: document.querySelector(".sku")?.textContent.split(":")[1].trim() || "000000",
            name: document.querySelector(".product-heading")?.textContent || "Unknown Product",
            price: parseFloat(document.querySelector(".price")?.textContent.replace("Rs ", "").replace(",", "")) || 0,
            image: document.querySelector(".product-image img")?.getAttribute("src") || "placeholder.jpg",
            size: selectedSize,
            color: selectedColor,
            quantity: quantity
        };
    }

    // Add to cart
    addToCartBtn?.addEventListener("click", function () {
        let product = getProductDetails();
        let existingProduct = cart.find(item => item.id === product.id && item.size === product.size && item.color === product.color);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
    });

    // Buy now
    buyNowBtn?.addEventListener("click", function () {
        let product = getProductDetails();

        let checkoutCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
        let existingCheckoutProduct = checkoutCart.find(item => item.id === product.id && item.size === product.size && item.color === product.color);
        if (!existingCheckoutProduct) {
            checkoutCart.push(product);
        } else {
            existingCheckoutProduct.quantity += product.quantity;
        }

        localStorage.setItem("checkoutCart", JSON.stringify(checkoutCart));
        window.location.href = "checkout.html";
    });

    // Reviews
    const productId = document.body.getAttribute("data-product-id");
    const reviewContainer = document.getElementById("reviews");

    fetch("reviews.xml")
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const reviews = data.querySelector(`product[id="${productId}"]`);
            if (reviews) {
                reviews.querySelectorAll("review").forEach(review => {
                    const name = review.querySelector("name").textContent;
                    const rating = review.querySelector("rating").textContent;
                    const comment = review.querySelector("comment").textContent;

                    const reviewElement = document.createElement("div");
                    reviewElement.classList.add("review");
                    reviewElement.innerHTML = `<strong>${name}:</strong> ⭐${rating}<br> ${comment}`;
                    reviewContainer.appendChild(reviewElement);
                });
            } else {
                reviewContainer.innerHTML = "<p>No reviews yet.</p>";
            }
        });

    // Submit review
    document.getElementById("reviewForm")?.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const rating = document.getElementById("rating").value;
        const comment = document.getElementById("comment").value;

        if (name && rating && comment) {
            const newReview = document.createElement("div");
            newReview.classList.add("review");
            newReview.innerHTML = `<strong>${name}:</strong> ⭐${rating}<br> ${comment}`;
            reviewContainer.appendChild(newReview);

            alert("Review submitted! (Note: This will not be saved to XML without a backend)");
            document.getElementById("reviewForm").reset();
        }
    });

    // 🟡 Filtering products logic 
    const searchInput = document.getElementById("searchInput");
    const priceFilter = document.getElementById("priceFilter");
    const colorFilter = document.getElementById("colorFilter");

    if (!searchInput || !priceFilter || !colorFilter) {
        console.warn("Search or filters not found — skipping filtering logic.");
    } else {
        searchInput.addEventListener("input", filterProducts);
        priceFilter.addEventListener("change", filterProducts);
        colorFilter.addEventListener("change", filterProducts);
    }

    function filterProducts() {
        const searchText = searchInput.value.toLowerCase();
        const priceRange = priceFilter.value;
        const colorValue = colorFilter.value.toLowerCase();

        const cards = document.querySelectorAll(".product-card");

        cards.forEach((card) => {
            const name = card.querySelector("p").textContent.toLowerCase();
            const price = parseInt(card.querySelector("h4").textContent.replace("Rs.", "").trim());
            const color = card.querySelector("img").alt.toLowerCase();

            const matchesSearch = name.includes(searchText);

            let matchesPrice = true;
            if (priceRange) {
                const [min, max] = priceRange.split("-").map(Number);
                matchesPrice = price >= min && (isNaN(max) || price <= max);
            }

            const matchesColor = colorValue ? color.includes(colorValue) : true;

            card.style.display = (matchesSearch && matchesPrice && matchesColor) ? "block" : "none";
        });
    }
});
