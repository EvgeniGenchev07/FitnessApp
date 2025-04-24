const apiUrl = 'http://192.168.56.1:5000'; 
    // JavaScript functions to show/hide the forms with zoom-in and fade animation
    function showLogin() {
        hideAllForms();
        document.getElementById('login-form').style.display = 'block';
        setTimeout(() => {
            document.getElementById('login-form').classList.add('active');
        }, 10);
    }

    function showSignUp() {
        hideAllForms();
        document.getElementById('signup-form').style.display = 'block';
        setTimeout(() => {
            document.getElementById('signup-form').classList.add('active');
        }, 10);
    }

    function showForgotPassword() {
        hideAllForms();
        document.getElementById('forgot-password-form').style.display = 'block';
        setTimeout(() => {
            document.getElementById('forgot-password-form').classList.add('active');
        }, 10);
    }

    function hideAllForms() {
        const forms = document.querySelectorAll('.form-container');
        forms.forEach(form => {
            form.classList.remove('active');
            form.style.display = 'none';
        });
    }

    // Default to show Sign Up form initially
    document.getElementById('signup-form').style.display = 'block';
    setTimeout(() => {
        document.getElementById('signup-form').classList.add('active');
    }, 10);

    async function handleSignUp(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const userData = {
            UserName: name,
            Email: email,
            Password: password
        };

        try {
            const response = await fetch(`${apiUrl}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('Регистрацията е успешна!');
            } else {
                const errorData = await response.json();
                alert(`Грешка: ${errorData.message}`);
            }
        } catch (error) {
            alert('Възникна грешка при регистрацията.');
            console.error(error);
        }
    }
    //Password pattern
    function checkPasswordStrength(password) {
        // Check each requirement
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@$!%*?&#]/.test(password);
        
        // Update requirement indicators
        document.getElementById('req-length').classList.toggle('valid', hasMinLength);
        document.getElementById('req-uppercase').classList.toggle('valid', hasUpperCase);
        document.getElementById('req-lowercase').classList.toggle('valid', hasLowerCase);
        document.getElementById('req-number').classList.toggle('valid', hasNumber);
        document.getElementById('req-special').classList.toggle('valid', hasSpecialChar);
        
        // Calculate password strength (0-100)
        let strength = 0;
        if (hasMinLength) strength += 20;
        if (hasUpperCase) strength += 20;
        if (hasLowerCase) strength += 20;
        if (hasNumber) strength += 20;
        if (hasSpecialChar) strength += 20;
        
        // Update strength bar
        const strengthBar = document.getElementById('password-strength-bar');
        strengthBar.style.width = strength + '%';
        
        // Change color based on strength
        if (strength < 40) {
            strengthBar.style.backgroundColor = '#dc3545'; // Red
        } else if (strength < 80) {
            strengthBar.style.backgroundColor = '#ffc107'; // Yellow
        } else {
            strengthBar.style.backgroundColor = '#28a745'; // Green
        }
    }
    
    function handleSignUp(event) {
        event.preventDefault();
        // Your signup logic here
        alert('Sign up form submitted!');
    }
    
    function handleLogin(event) {
        event.preventDefault();
        // Your login logic here
        alert('Login form submitted!');
    }
    
    function showLogin() {
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('forgot-password-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    }
    
    function showSignUp() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('forgot-password-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
    }
    
    function showForgotPassword() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('forgot-password-form').style.display = 'block';
    }