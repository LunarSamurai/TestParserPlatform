document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Force focus on the username input when the form loads
    usernameInput.focus();

    // Event listener for form submission
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission to server

        console.log("Form submission intercepted");

        const username = usernameInput.value;
        const password = passwordInput.value;
        console.log("Username: ", username, "Password: ", password);
        
        // Hardcoded credentials for demonstration
        if (username === 'TpARI' && password === 'TpARI124$') {
            alert('Login successful!');
            sessionStorage.setItem('isAdmin', true);
            window.location.href = '../../index.html'; // Redirect back home
        } else {
            document.getElementById('loginError').textContent = 'Invalid username or password!';
        }
    });
});

// Attempt to refocus the input if the window is refocused.
window.addEventListener('focus', () => {
    document.getElementById('username').focus();
});
