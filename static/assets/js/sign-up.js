document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.querySelector('.modal-close-btn');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the data to a server
        // For demonstration, we'll just show the success modal
        showSuccessModal();
    });

    // Show the success modal
    function showSuccessModal() {
        successModal.style.display = 'block';
    }

    // Hide the success modal
    function hideSuccessModal() {
        successModal.style.display = 'none';
    }

    // Event listeners for closing the modal
    closeModalBtn.addEventListener('click', hideSuccessModal);
    window.addEventListener('click', (e) => {
        if (e.target == successModal) {
            hideSuccessModal();
        }
    });
});