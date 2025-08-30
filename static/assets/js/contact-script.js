// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
});

// Initialize Bootstrap tooltips
document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Smooth scroll to form section
function scrollToForm() {
    const formSection = document.getElementById('contact-form-section');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form validation and submission
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Validate form
    let isValid = true;
    const fields = ['name', 'email', 'subject', 'message'];
    
    fields.forEach(field => {
        const input = document.getElementById(field);
        const value = formData[field];
        
        // Remove previous validation classes
        input.classList.remove('is-invalid', 'is-valid');
        
        // Validate field
        if (!value) {
            input.classList.add('is-invalid');
            isValid = false;
        } else if (field === 'email' && !isValidEmail(value)) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.add('is-valid');
        }
    });
    
    // If validation fails, shake the form
    if (!isValid) {
        form.classList.add('animate__animated', 'animate__headShake');
        setTimeout(() => {
            form.classList.remove('animate__animated', 'animate__headShake');
        }, 1000);
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');
    
    try {
        // Simulate API call (replace with actual endpoint)
        await simulateFormSubmission(formData);
        
        // Show success toast
        showToast('successToast');
        
        // Reset form
        form.reset();
        fields.forEach(field => {
            document.getElementById(field).classList.remove('is-valid');
        });
        
        // Add success animation to button
        submitBtn.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            submitBtn.classList.remove('animate__animated', 'animate__pulse');
        }, 1000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showToast('errorToast');
        
        // Add error shake to button
        submitBtn.classList.add('animate__animated', 'animate__shakeX');
        setTimeout(() => {
            submitBtn.classList.remove('animate__animated', 'animate__shakeX');
        }, 1000);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
    }
});

// Newsletter form submission
document.getElementById('newsletterForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('input[type="email"]');
    const submitBtn = this.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    
    if (!email || !isValidEmail(email)) {
        emailInput.classList.add('is-invalid');
        emailInput.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        }, { once: true });
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subscribing...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success
        submitBtn.innerHTML = '<i class="bi bi-check-lg"></i> Subscribed!';
        submitBtn.classList.replace('btn-gradient', 'btn-success');
        emailInput.value = '';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.replace('btn-success', 'btn-gradient');
            submitBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showToast('errorToast');
    }
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showToast(toastId) {
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    toast.show();
}

async function simulateFormSubmission(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random success/failure (90% success rate)
    if (Math.random() > 0.1) {
        console.log('Form submitted successfully:', formData);
        return { success: true };
    } else {
        throw new Error('Simulated server error');
    }
}

// Enhanced form interactions
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            this.classList.remove('is-invalid');
        }
    });
});

// Contact card interactions
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.contact-icon');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.contact-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Social link interactions with ripple effect
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Create ripple effect
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .focused {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);

// Parallax effect for floating shapes
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// Enhanced map interaction
const mapContainer = document.querySelector('.map-container');
if (mapContainer) {
    mapContainer.addEventListener('mouseenter', function() {
        const iframe = this.querySelector('iframe');
        iframe.style.filter = 'saturate(1.1) contrast(1.1)';
        iframe.style.transform = 'scale(1.02)';
        iframe.style.transition = 'all 0.3s ease';
    });
    
    mapContainer.addEventListener('mouseleave', function() {
        const iframe = this.querySelector('iframe');
        iframe.style.filter = 'none';
        iframe.style.transform = 'scale(1)';
    });
}

// Add intersection observer for enhanced animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for enhanced animations
document.querySelectorAll('.contact-card, .accordion-item').forEach(el => {
    observer.observe(el);
});

// Console log for development
console.log('🚀 Contact page loaded successfully!');
console.log('✨ All animations and interactions initialized');