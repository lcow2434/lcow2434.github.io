document.addEventListener('DOMContentLoaded', () => {
    // Fetch product data from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => displayProducts(data))
        .catch(error => console.error('Error fetching product data:', error));

    // Load cart from local storage if it exists
    if (localStorage.getItem('cart')) {
        updateCartDisplay(JSON.parse(localStorage.getItem('cart')));
    }

    // Contact form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                alert(`Thank you for contacting us, ${name}! We will get back to you soon.`);
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
});

// Function to display products on the page
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Function to add a product to the cart
function addToCart(productId, productName, productPrice, productImage) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity++;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1, image: productImage });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(cart);
}

// Function to update the cart display
function updateCartDisplay(cart) {
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    cartList.innerHTML = ''; // Clear previous cart items

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <input type="number" value="${item.quantity}" min="1" readonly>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartList.appendChild(cartItem);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to change the quantity of a product in the cart
function changeQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay(cart);
    }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(cart);
}
