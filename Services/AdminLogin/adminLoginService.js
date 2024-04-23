document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission to server

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Hardcoded credentials for demonstration
    if (username === 'TpARI' && password === 'TpARI124$') {
        alert('Login successful!');
        sessionStorage.setItem('isAdmin', true);
        window.location.href = '../../index.html'; // Redirect back home
    } else {
        document.getElementById('loginError').textContent = 'Invalid username or password!';
    }
});
