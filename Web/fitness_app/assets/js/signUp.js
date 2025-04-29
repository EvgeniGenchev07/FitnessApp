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
            Password: password,
            CreationDate: new Date().toISOString()
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

    //login
    async function handleLogin(event) {
        event.preventDefault();
    
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
    
        // Format data as URL-encoded form (not JSON)
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);
    
        try {
            const response = await fetch(`${apiUrl}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Required for C#
                },
                body: formData
            });
    
            if (response.ok) {
                const userData = await response.json();
                alert('Успешен вход!');
                sessionStorage.setItem('user', JSON.stringify(userData));
                const userLanguage = navigator.language || navigator.userLanguage;
                const isBulgarian = userLanguage.startsWith('bg');
                const page = isBulgarian ? 'index.html' : 'index_en.html';
                window.location.href = `../fitness_app/${page}`; 
            } else {
                const error = await response.text();
                alert(`Грешка при вход: ${error}`)
            }
        } catch (error) {
            alert('Грешка при връзка със сървъра.');
            console.error(error);
        }
    }
    
    
    // Initialize event listeners when DOM loads
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('signup-form').querySelector('form').addEventListener('submit', handleSignUp);
    });
    