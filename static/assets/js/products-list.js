// Products JavaScript - Pure vanilla JS with Django integration
class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 8;
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartCount();
        this.showFloatingElements();
        this.initializeLucideIcons();
    }

    initializeLucideIcons() {
        // Initialize Lucide icons after DOM changes
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    bindEvents() {
        // Filter and sort events
        document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
            this.filterProducts();
        });

        document.getElementById('priceFilter')?.addEventListener('change', (e) => {
            this.filterProducts();
        });

        document.getElementById('sortFilter')?.addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchProducts(e.target.value);
                }, 300);
            });
        }

        // Quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = btn.getAttribute('data-product-id');
                this.openQuickView(productId);
            });
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = btn.getAttribute('data-product-id');
                this.addToCart(productId);
                btn.classList.add('bounce');
                setTimeout(() => btn.classList.remove('bounce'), 1000);
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = btn.getAttribute('data-product-id');
                this.toggleWishlist(productId);
                btn.classList.add('pulse');
                setTimeout(() => btn.classList.remove('pulse'), 2000);
            });
        });

        // Modal quantity controls
        document.getElementById('decreaseQty')?.addEventListener('click', () => {
            const input = document.getElementById('quantityInput');
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });

        document.getElementById('increaseQty')?.addEventListener('click', () => {
            const input = document.getElementById('quantityInput');
            input.value = parseInt(input.value) + 1;
        });

        // Modal add to cart
        document.getElementById('modalAddToCart')?.addEventListener('click', () => {
            const productId = document.getElementById('quickViewModal').getAttribute('data-product-id');
            const quantity = parseInt(document.getElementById('quantityInput').value);
            this.addToCart(productId, quantity);
            
            // Close modal and show success
            const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
            modal.hide();
            this.showToast('Product added to cart!', 'success');
        });

        // Load more button
        document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
            this.loadMoreProducts();
        });

        // Back to top
        document.getElementById('backToTop')?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Floating cart
        document.getElementById('floatingCart')?.addEventListener('click', () => {
            window.location.href = '/cart/'; // Django cart URL
        });

        // Scroll events for floating elements
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    filterProducts() {
        const category = document.getElementById('categoryFilter').value;
        const priceRange = document.getElementById('priceFilter').value;
        
        let products = document.querySelectorAll('.product-item');
        
        products.forEach(product => {
            let show = true;
            
            // Category filter
            if (category !== 'all') {
                const productCategory = product.getAttribute('data-category');
                if (productCategory !== category) {
                    show = false;
                }
            }
            
            // Price filter
            if (priceRange !== 'all' && show) {
                const productPrice = parseFloat(product.getAttribute('data-price'));
                const [min, max] = priceRange.split('-').map(p => 
                    p.includes('+') ? Infinity : parseFloat(p)
                );
                
                if (productPrice < min || (max !== Infinity && productPrice > max)) {
                    show = false;
                }
            }
            
            // Show/hide product with animation
            if (show) {
                product.style.display = 'block';
                product.classList.add('fade-in');
            } else {
                product.style.display = 'none';
                product.classList.remove('fade-in');
            }
        });
        
        this.updateProductCount();
    }

    sortProducts(sortBy) {
        const container = document.getElementById('productsGrid');
        const products = Array.from(container.querySelectorAll('.product-item'));
        
        products.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            
            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'rating':
                    // Assuming rating data attribute exists
                    const ratingA = parseFloat(a.getAttribute('data-rating') || 0);
                    const ratingB = parseFloat(b.getAttribute('data-rating') || 0);
                    return ratingB - ratingA;
                case 'popular':
                    // Assuming reviews data attribute exists
                    const reviewsA = parseInt(a.getAttribute('data-reviews') || 0);
                    const reviewsB = parseInt(b.getAttribute('data-reviews') || 0);
                    return reviewsB - reviewsA;
                case 'newest':
                default:
                    // Assuming date or new status
                    const isNewA = a.querySelector('.badge-new') ? 1 : 0;
                    const isNewB = b.querySelector('.badge-new') ? 1 : 0;
                    return isNewB - isNewA;
            }
        });
        
        // Re-append sorted products
        products.forEach(product => container.appendChild(product));
        
        // Re-initialize AOS for sorted products
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    searchProducts(query) {
        const products = document.querySelectorAll('.product-item');
        const searchTerm = query.toLowerCase();
        
        products.forEach(product => {
            const productName = product.querySelector('.product-name').textContent.toLowerCase();
            const category = product.getAttribute('data-category').toLowerCase();
            
            if (productName.includes(searchTerm) || category.includes(searchTerm) || searchTerm === '') {
                product.style.display = 'block';
                product.classList.add('fade-in');
            } else {
                product.style.display = 'none';
                product.classList.remove('fade-in');
            }
        });
        
        this.updateProductCount();
    }

    async openQuickView(productId) {
        try {
            // Fetch product details via AJAX
            const response = await fetch(`/api/products/${productId}/`);
            const product = await response.json();
            
            // Populate modal
            document.getElementById('modalImage').src = product.image;
            document.getElementById('modalImage').alt = product.name;
            document.getElementById('modalTitle').textContent = product.name;
            document.getElementById('modalDescription').textContent = product.description;
            document.getElementById('modalPrice').innerHTML = `
                ${product.original_price ? `<span class="original-price">$${product.original_price}</span>` : ''}
                <span class="current-price">$${product.price}</span>
            `;
            
            // Set rating
            const ratingContainer = document.getElementById('modalRating');
            ratingContainer.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                star.setAttribute('data-lucide', 'star');
                star.classList.add('star');
                if (i <= product.rating) {
                    star.classList.add('filled');
                }
                ratingContainer.appendChild(star);
            }
            
            // Reset quantity
            document.getElementById('quantityInput').value = 1;
            
            // Store product ID for modal actions
            document.getElementById('quickViewModal').setAttribute('data-product-id', productId);
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
            modal.show();
            
            // Re-initialize Lucide icons
            this.initializeLucideIcons();
            
        } catch (error) {
            console.error('Error fetching product details:', error);
            this.showToast('Error loading product details', 'error');
        }
    }

    async addToCart(productId, quantity = 1) {
        try {
            // Send AJAX request to Django backend
            const response = await fetch('/cart/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken(),
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.updateCartCount(data.cart_count);
                this.showToast('Product added to cart!', 'success');
                
                // Animate floating cart
                const floatingCart = document.getElementById('floatingCart');
                floatingCart.classList.add('bounce');
                setTimeout(() => floatingCart.classList.remove('bounce'), 1000);
            } else {
                this.showToast('Error adding product to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showToast('Error adding product to cart', 'error');
        }
    }

    async toggleWishlist(productId) {
        try {
            const response = await fetch('/wishlist/toggle/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken(),
                },
                body: JSON.stringify({
                    product_id: productId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                const message = data.added ? 'Added to wishlist!' : 'Removed from wishlist!';
                this.showToast(message, 'success');
                
                // Update wishlist button state
                const wishlistBtns = document.querySelectorAll(`[data-product-id="${productId}"].wishlist-btn`);
                wishlistBtns.forEach(btn => {
                    const icon = btn.querySelector('i');
                    if (data.added) {
                        icon.style.fill = 'currentColor';
                        icon.style.color = '#ef4444';
                    } else {
                        icon.style.fill = 'none';
                        icon.style.color = '';
                    }
                });
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            this.showToast('Error updating wishlist', 'error');
        }
    }

    loadMoreProducts() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const btnText = loadMoreBtn.querySelector('.btn-text');
        const spinner = loadMoreBtn.querySelector('.spinner-border');
        
        // Show loading state
        btnText.textContent = 'Loading...';
        spinner.style.display = 'inline-block';
        loadMoreBtn.disabled = true;
        
        // Simulate AJAX call (replace with actual Django endpoint)
        setTimeout(() => {
            // Reset button state
            btnText.textContent = 'Load More Products';
            spinner.style.display = 'none';
            loadMoreBtn.disabled = false;
            
            // Hide button if no more products (this should come from server response)
            // loadMoreBtn.parentElement.style.display = 'none';
        }, 1000);
    }

    updateCartCount(count = null) {
        if (count !== null) {
            // Update all cart badges
            document.querySelectorAll('.cart-badge, .cart-count').forEach(badge => {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            });
        }
    }

    updateProductCount() {
        const visibleProducts = document.querySelectorAll('.product-item[style*="block"], .product-item:not([style*="none"])').length;
        const badge = document.querySelector('.hero-content .badge');
        if (badge) {
            badge.textContent = `${visibleProducts} Products Available`;
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide floating elements
        const floatingCart = document.getElementById('floatingCart');
        const backToTop = document.getElementById('backToTop');
        
        if (scrollTop > 300) {
            floatingCart?.classList.add('show');
            backToTop?.classList.add('show');
        } else {
            floatingCart?.classList.remove('show');
            backToTop?.classList.remove('show');
        }
    }

    showFloatingElements() {
        // Show floating elements after page load
        setTimeout(() => {
            const floatingCart = document.getElementById('floatingCart');
            const backToTop = document.getElementById('backToTop');
            
            if (window.pageYOffset > 300) {
                floatingCart?.classList.add('show');
                backToTop?.classList.add('show');
            }
        }, 1000);
    }

    showToast(message, type = 'info') {
        // Create toast element (you can also use Django messages framework)
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || 
               document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductsManager();
});

// Export for global access if needed
window.ProductsManager = ProductsManager;