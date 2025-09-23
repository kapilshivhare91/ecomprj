// Animation Utilities for Cart Application

class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupHoverEffects();
        this.setupScrollAnimations();
    }

    // Intersection Observer for scroll-based animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all cart items and summary elements
        document.addEventListener('DOMContentLoaded', () => {
            const elementsToObserve = document.querySelectorAll(
                '.cart-item, .cart-summary, .empty-cart-icon'
            );
            elementsToObserve.forEach(el => observer.observe(el));
        });
    }

    // Animate individual elements
    animateElement(element) {
        if (element.classList.contains('cart-item')) {
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        } else if (element.classList.contains('cart-summary')) {
            element.style.animation = 'slideInRight 0.5s ease-out forwards';
        } else if (element.classList.contains('empty-cart-icon')) {
            element.style.animation = 'scaleIn 0.4s ease-out forwards';
        }
    }

    // Enhanced hover effects
    setupHoverEffects() {
        document.addEventListener('DOMContentLoaded', () => {
            // Checkout button ripple effect
            this.setupRippleEffect();
            
            // Cart item hover animations
            this.setupCartItemHovers();
            
            // Button hover animations
            this.setupButtonHovers();
        });
    }

    // Ripple effect for checkout button
    setupRippleEffect() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.checkout-btn')) {
                const button = e.target.closest('.checkout-btn');
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });

        // Add ripple keyframes if not exists
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Cart item hover animations
    setupCartItemHovers() {
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.cart-item')) {
                const item = e.target.closest('.cart-item');
                this.animateCartItemHover(item, true);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.cart-item')) {
                const item = e.target.closest('.cart-item');
                this.animateCartItemHover(item, false);
            }
        }, true);
    }

    animateCartItemHover(item, isEntering) {
        const image = item.querySelector('.item-image');
        const actionButtons = item.querySelector('.action-buttons');
        
        if (isEntering) {
            if (image) {
                image.style.transform = 'scale(1.05) rotate(2deg)';
                image.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            if (actionButtons) {
                actionButtons.style.transform = 'translateX(-5px)';
                actionButtons.style.transition = 'transform 0.3s ease-out';
            }
        } else {
            if (image) {
                image.style.transform = 'scale(1) rotate(0deg)';
            }
            if (actionButtons) {
                actionButtons.style.transform = 'translateX(0)';
            }
        }
    }

    // Button hover animations
    setupButtonHovers() {
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('.quantity-btn, .action-btn, .btn-back')) {
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.transition = 'transform 0.2s ease-out';
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('.quantity-btn, .action-btn, .btn-back')) {
                e.target.style.transform = 'translateY(0) scale(1)';
            }
        }, true);
    }

    // Scroll-based animations
    setupScrollAnimations() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
    }

    updateScrollAnimations() {
        const scrollY = window.scrollY;
        const header = document.querySelector('.cart-header');
        
        if (header) {
            const opacity = Math.min(1, scrollY / 50);
            header.style.backgroundColor = `rgba(255, 255, 255, ${0.95 + (opacity * 0.05)})`;
            header.style.backdropFilter = `blur(${10 + (scrollY * 0.1)}px)`;
        }
    }

    // Counter animation utility
    static animateCounter(element, start, end, duration = 1000) {
        const range = end - start;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (range * easeOut);
            
            element.textContent = current.toFixed(2);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Stagger animation utility
    static staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    // Shake animation for validation errors
    static shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
        
        // Add shake keyframes if not exists
        if (!document.querySelector('#shake-keyframes')) {
            const style = document.createElement('style');
            style.id = 'shake-keyframes';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Pulse animation for notifications
    static pulseElement(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    // Bounce animation for success states
    static bounceElement(element) {
        element.style.animation = 'bounce 0.6s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
        
        // Add bounce keyframes if not exists
        if (!document.querySelector('#bounce-keyframes')) {
            const style = document.createElement('style');
            style.id = 'bounce-keyframes';
            style.textContent = `
                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40%, 43% {
                        transform: translateY(-10px);
                    }
                    70% {
                        transform: translateY(-5px);
                    }
                    90% {
                        transform: translateY(-2px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize animation manager
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});

// Export for use in other scripts
window.AnimationManager = AnimationManager;