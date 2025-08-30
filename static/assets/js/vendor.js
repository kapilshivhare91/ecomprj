// Vendor Details Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Initialize star rating animation
    initializeStarRating();
    
    // Initialize button interactions
    initializeButtons();
    
    // Initialize product interactions
    initializeProducts();
    
    // Initialize contact card clicks
    initializeContactCards();
});

// Animation initialization
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('[data-delay]');
    
    animatedElements.forEach(element => {
        const delay = element.getAttribute('data-delay');
        element.style.animationDelay = delay + 'ms';
    });
    
    // Trigger animations on scroll for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Star rating animation
function initializeStarRating() {
    const starRating = document.querySelector('.star-rating');
    if (!starRating) return;
    
    const rating = parseFloat(starRating.getAttribute('data-rating'));
    const stars = starRating.querySelectorAll('.star');
    
    // Animate stars filling up
    setTimeout(() => {
        stars.forEach((star, index) => {
            setTimeout(() => {
                if (index < Math.floor(rating)) {
                    star.classList.add('active', 'animate');
                } else if (index === Math.floor(rating) && rating % 1 !== 0) {
                    // Handle half stars
                    star.classList.add('active', 'animate');
                    star.style.background = `linear-gradient(90deg, #ffc107 ${(rating % 1) * 100}%, #ddd ${(rating % 1) * 100}%)`;
                    star.style.webkitBackgroundClip = 'text';
                    star.style.webkitTextFillColor = 'transparent';
                }
            }, index * 200);
        });
    }, 500);
}

// Button interactions
function initializeButtons() {
    // Follow button functionality
    const followBtn = document.getElementById('followBtn');
    if (followBtn) {
        followBtn.addEventListener('click', handleFollowToggle);
        
        // Add pulse animation
        followBtn.classList.add('pulse');
        setTimeout(() => {
            followBtn.classList.remove('pulse');
        }, 3000);
    }
    
    // Ripple effect for gradient buttons
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    rippleButtons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
    
    // View all products button
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            // Django URL redirect
            window.location.href = '/vendor/' + getVendorId() + '/products/';
        });
    }
}

// Follow toggle functionality
function handleFollowToggle() {
    const followBtn = document.getElementById('followBtn');
    const followText = followBtn.querySelector('.follow-text');
    const heartIcon = followBtn.querySelector('i');
    const vendorId = followBtn.getAttribute('data-vendor-id');
    
    // Toggle button state
    const isFollowing = followBtn.classList.contains('following');
    
    if (isFollowing) {
        followBtn.classList.remove('following');
        followText.textContent = 'Follow Vendor';
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
    } else {
        followBtn.classList.add('following');
        followText.textContent = 'Following';
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
    }
    
    // Django AJAX request
    fetch('/vendor/follow/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
            vendor_id: vendorId,
            action: isFollowing ? 'unfollow' : 'follow'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            // Revert changes if request failed
            handleFollowToggle();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Revert changes if request failed
        handleFollowToggle();
    });
}

// Ripple effect
function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Product interactions
function initializeProducts() {
    // Product card clicks
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.add-to-cart-btn') || e.target.closest('.quick-view-btn')) {
                return; // Don't navigate if clicking action buttons
            }
            
            const productId = this.getAttribute('data-product-id');
            window.location.href = '/product/' + productId + '/';
        });
    });
    
    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            
            // Open quick view modal (implement as needed)
            openQuickViewModal(productId);
        });
    });
    
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

// Contact card interactions
function initializeContactCards() {
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.addEventListener('click', function() {
            const contactIcon = this.querySelector('i');
            const contactValue = this.querySelector('.contact-value').textContent;
            
            if (contactIcon.classList.contains('fa-phone')) {
                window.open('tel:' + contactValue, '_self');
            } else if (contactIcon.classList.contains('fa-envelope')) {
                window.open('mailto:' + contactValue, '_self');
            } else if (contactIcon.classList.contains('fa-globe')) {
                window.open('https://' + contactValue, '_blank');
            } else if (contactIcon.classList.contains('fa-map-marker-alt')) {
                window.open('https://maps.google.com?q=' + encodeURIComponent(contactValue), '_blank');
            }
        });
    });
}

// Add to cart functionality
function addToCart(productId) {
    const button = document.querySelector(`[data-product-id="${productId}"].add-to-cart-btn`);
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    // Django AJAX request
    fetch('/cart/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success state
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.classList.add('btn-success');
            
            // Show toast notification
            showToast('Product added to cart!', 'success');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('btn-success');
                button.disabled = false;
            }, 2000);
        } else {
            throw new Error(data.message || 'Failed to add to cart');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        button.innerHTML = originalText;
        button.disabled = false;
        showToast('Failed to add to cart. Please try again.', 'error');
    });
}

// Quick view modal
function openQuickViewModal(productId) {
    // Implement quick view modal functionality
    console.log('Opening quick view for product:', productId);
    
    // You can implement a Bootstrap modal here
    // For now, redirect to product page
    window.location.href = '/product/' + productId + '/';
}

// Utility functions
function getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function getVendorId() {
    const followBtn = document.getElementById('followBtn');
    return followBtn ? followBtn.getAttribute('data-vendor-id') : null;
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles if not already added
    if (!document.querySelector('#toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 0.5rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                padding: 1rem 1.5rem;
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .toast-notification.show {
                transform: translateX(0);
            }
            .toast-success { border-left: 4px solid #28a745; }
            .toast-error { border-left: 4px solid #dc3545; }
            .toast-info { border-left: 4px solid #007bff; }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #333;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Image error handling
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = '/static/images/placeholder.jpg';
    });
});