let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load cart on page load
window.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    checkUserLogin();
});

// Check if user is logged in
function checkUserLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.querySelector('.signup-btn');
    
    if (currentUser && loginBtn) {
        loginBtn.textContent = `Hi, ${currentUser.name.split(' ')[0]} →`;
        loginBtn.href = '#';
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm('Do you want to logout?')) {
                localStorage.removeItem('currentUser');
                window.location.reload();
            }
        };
    }
}

function addToCart(button) {
    const productCard = button.parentElement;
    const product = {
        id: productCard.dataset.id,
        name: productCard.querySelector('h3').textContent,
        price: parseFloat(productCard.querySelector('p').textContent.replace('$', '')),
        image: productCard.querySelector('img').src
    };
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // If product exists, increase quantity
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
        // If new product, add with quantity 1
        product.quantity = 1;
        cart.push(product);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    updateCartDisplay();
    
    // Show success animation
    button.textContent = '✓ Added!';
    button.style.background = '#43e97b';
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.background = '';
    }, 1500);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Your cart is empty</p>';
        updateTotal();
        return;
    }
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${index})" class="qty-btn">-</button>
                    <span class="quantity">${item.quantity || 1}</span>
                    <button onclick="increaseQuantity(${index})" class="qty-btn">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${index})" class="remove-btn">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    updateTotal();
}

function increaseQuantity(index) {
    cart[index].quantity = (cart[index].quantity || 1) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    } else {
        removeFromCart(index);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    document.getElementById('total').textContent = total.toFixed(2);
}

document.querySelector('.cart').addEventListener('click', () => {
    document.querySelector('.cart-sidebar').classList.toggle('active');
});

document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        if (confirm('Please login to checkout. Go to login page?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    alert(`Thank you for your purchase, ${currentUser.name}! Total: $${document.getElementById('total').textContent}`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    document.querySelector('.cart-sidebar').classList.remove('active');
});

function toggleAbout() {
    const modal = document.getElementById('aboutModal');
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('aboutModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function filterItems() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput.value.length > 0) {
        searchResults.style.display = 'block';
    } else {
        searchResults.style.display = 'none';
    }
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    const searchContainer = document.querySelector('.search-container');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchContainer.contains(event.target)) {
        searchResults.style.display = 'none';
    }
});
