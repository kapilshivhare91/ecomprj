// Cart Application JavaScript
class CartApp {
    constructor() {
        this.cartItems = [
            {% for p in front_product %}
            {
                id: "{{ p.pid }}",
                name: "{{ p.title }}",
                price: {{ p.price }},
                originalPrice: {{ p.original_price|default:"null" }},
                image: "{% if p.image %}{{ p.image.url }}{% else %}{% static 'assets/imgs/cart-images/pet-bed.jpg' %}{% endif %}",
                quantity: 2,
                favorited: false
            },
            {% endfor %}
            {
                id: "2",
                name: "Interactive Cat Feather Toy",
                price: 24.99,
                originalPrice: null,
                image: "static/assets/imgs/cart-images/cat-toy.jpg",
                quantity: 1,
                favorited: false
            },
            {
                id: "3",
                name: "Premium Leather Dog Collar",
                price: 34.99,
                originalPrice: 39.99,
                image: "static/assets/imgs/cart-images/dog-collar.jpg",
                quantity: 1,
                favorited: true
            },
            {
                id: "4",
                name: "Cozy Pet Bed - Gray Cushion",
                price: 89.99,
                originalPrice: null,
                image: "static/assets/imgs/cart-images/pet-bed.jpg",
                quantity: 1,
                favorited: false
            }
        ];
        
        this.init();
    }

    init() {
        this.renderCart();
        this.updateSummary();
        this.initializeAOS();
    }

    initializeAOS() {
        AOS.init({
            duration: 600,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartContent = document.getElementById('cart-content');
        const emptyCart = document.getElementById('empty-cart');

        if (this.cartItems.length === 0) {
            cartContent.style.display = 'none';
            emptyCart.style.display = 'block';
            return;
        }

        cartContent.style.display = 'block';
        emptyCart.style.display = 'none';

        cartItemsContainer.innerHTML = this.cartItems.map((item, index) => 
            this.createCartItemHTML(item, index)
        ).join('');

        // Add event listeners after rendering
        this.attachEventListeners();
    }

    createCartItemHTML(item, index) {
        const hasDiscount = item.originalPrice && item.originalPrice > item.price;
        const discount = hasDiscount ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

        return `
            <div class="cart-item" data-aos="fade-up" data-aos-delay="${index * 100}" data-item-id="${item.id}">
                <div class="row align-items-center">
                    <!-- Product Image -->
                    <div class="col-md-2 col-3 mb-3 mb-md-0">
                        <img src="${item.image}" alt="${item.name}" class="item-image img-fluid">
                    </div>
                    
                    <!-- Product Details -->
                    <div class="col-md-4 col-9 mb-3 mb-md-0">
                        <div class="item-details">
                            <h5 class="item-name">${item.name}</h5>
                            <div class="item-pricing">
                                ${hasDiscount ? `<span class="original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
                                <span class="item-price">$${item.price.toFixed(2)}</span>
                                ${hasDiscount ? `<span class="discount-badge">${discount}% OFF</span>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quantity Selector -->
                    <div class="col-md-3 col-6 mb-3 mb-md-0">
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="cartApp.changeQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-value" id="qty-${item.id}">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartApp.changeQuantity('${item.id}', ${item.quantity + 1})" ${item.quantity >= 99 ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="col-md-3 col-6">
                        <div class="action-buttons justify-content-end">
                            <button class="action-btn ${item.favorited ? 'favorited' : ''}" onclick="cartApp.toggleFavorite('${item.id}')" title="Add to favorites">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="action-btn remove" onclick="cartApp.removeItem('${item.id}')" title="Remove item">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Event listeners are handled by onclick attributes in HTML
        // This method can be used for additional event handling if needed
    }

    changeQuantity(itemId, newQuantity) {
        if (newQuantity < 1 || newQuantity > 99) return;

        const item = this.cartItems.find(item => item.id === itemId);
        if (!item) return;

        const oldQuantity = item.quantity;
        item.quantity = newQuantity;

        // Animate quantity change
        const quantityElement = document.getElementById(`qty-${itemId}`);
        quantityElement.classList.add('counter-animation');
        
        setTimeout(() => {
            quantityElement.textContent = newQuantity;
            quantityElement.classList.remove('counter-animation');
        }, 150);

        // Update quantity buttons state
        this.updateQuantityButtons(itemId, newQuantity);
        
        // Update summary with animation
        this.updateSummary();

        // Show toast notification
        this.showToast('Quantity Updated', `Changed from ${oldQuantity} to ${newQuantity}`);
    }

    updateQuantityButtons(itemId, quantity) {
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        const decreaseBtn = itemElement.querySelector('.quantity-btn:first-child');
        const increaseBtn = itemElement.querySelector('.quantity-btn:last-child');

        decreaseBtn.disabled = quantity <= 1;
        increaseBtn.disabled = quantity >= 99;
    }

    toggleFavorite(itemId) {
        const item = this.cartItems.find(item => item.id === itemId);
        if (!item) return;

        item.favorited = !item.favorited;

        const button = document.querySelector(`[data-item-id="${itemId}"] .action-btn:not(.remove)`);
        button.classList.toggle('favorited', item.favorited);

        this.showToast(
            item.favorited ? 'Added to Favorites' : 'Removed from Favorites',
            `${item.name} ${item.favorited ? 'added to' : 'removed from'} your favorites`
        );
    }

    removeItem(itemId) {
        const item = this.cartItems.find(item => item.id === itemId);
        if (!item) return;

        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        
        // Add removal animation
        itemElement.classList.add('removing');
        
        setTimeout(() => {
            // Remove from cart array
            this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== itemId);
            
            // Re-render cart
            this.renderCart();
            this.updateSummary();
            
            // Show toast notification
            this.showToast('Item Removed', `${item.name} has been removed from your cart`);
        }, 500);
    }

    updateSummary() {
        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 75 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const savings = this.cartItems.reduce((sum, item) => {
            if (item.originalPrice && item.originalPrice > item.price) {
                return sum + ((item.originalPrice - item.price) * item.quantity);
            }
            return sum;
        }, 0);
        const total = subtotal + shipping + tax - savings;
        const itemCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);

        // Update all summary elements with animation
        this.animateValueUpdate('subtotal', subtotal.toFixed(2));
        this.animateValueUpdate('tax', tax.toFixed(2));
        this.animateValueUpdate('total', total.toFixed(2));
        
        // Update shipping display
        const shippingDisplay = document.getElementById('shipping-display');
        if (shipping === 0) {
            shippingDisplay.innerHTML = '<span class="text-primary fw-bold">Free</span>';
        } else {
            shippingDisplay.textContent = `$${shipping.toFixed(2)}`;
        }

        // Update item counts
        this.updateItemCounts(itemCount);

        // Show/hide savings row
        const savingsRow = document.getElementById('savings-row');
        if (savings > 0) {
            savingsRow.style.display = 'flex !important';
            document.getElementById('savings').textContent = savings.toFixed(2);
        } else {
            savingsRow.style.display = 'none !important';
        }
    }

    animateValueUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        const parentElement = element.closest('.animated-total') || element.parentElement;
        
        // Add animation class
        parentElement.classList.add('updating');
        
        setTimeout(() => {
            element.textContent = newValue;
            parentElement.classList.remove('updating');
        }, 150);
    }

    updateItemCounts(count) {
        // Update header item count
        document.getElementById('item-count').textContent = count;
        document.getElementById('item-plural').textContent = count !== 1 ? 's' : '';
        
        // Update summary item count
        document.getElementById('summary-count').textContent = count;
        document.getElementById('summary-plural').textContent = count !== 1 ? 's' : '';
    }

    showToast(title, message, type = 'success') {
        const toast = document.getElementById('cart-toast');
        const toastTitle = document.getElementById('toast-title');
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = toast.querySelector('.toast-icon i');

        // Update content
        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Update icon based on type
        toastIcon.className = type === 'success' ? 'fas fa-check-circle text-success' : 'fas fa-exclamation-circle text-warning';

        // Show toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    proceedToCheckout() {
        if (this.cartItems.length === 0) {
            this.showToast('Cart Empty', 'Please add items to your cart before checkout', 'warning');
            return;
        }

        // Add loading state to checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        const originalText = checkoutBtn.innerHTML;
        
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        checkoutBtn.disabled = true;

        // Simulate checkout process
        setTimeout(() => {
            checkoutBtn.innerHTML = originalText;
            checkoutBtn.disabled = false;
            this.showToast('Checkout Initiated', 'Redirecting to secure checkout...');
        }, 2000);
    }

    continueShopping() {
        this.showToast('Continue Shopping', 'Redirecting to product catalog...');
        
        // Simulate navigation
        setTimeout(() => {
            // In a real app, this would navigate to the product page
            console.log('Navigating to product catalog...');
        }, 1000);
    }
}

// Global functions for HTML onclick handlers
function changeQuantity(itemId, newQuantity) {
    cartApp.changeQuantity(itemId, newQuantity);
}

function toggleFavorite(itemId) {
    cartApp.toggleFavorite(itemId);
}

function removeItem(itemId) {
    cartApp.removeItem(itemId);
}

function proceedToCheckout() {
    cartApp.proceedToCheckout();
}

function continueShopping() {
    cartApp.continueShopping();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cartApp = new CartApp();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Reinitialize AOS on resize if needed
    AOS.refresh();
});