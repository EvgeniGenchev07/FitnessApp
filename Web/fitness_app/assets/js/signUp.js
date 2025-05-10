const apiUrl = 'http://192.168.100.6:5000'; 
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
            const response = await fetch(`${apiUrl}/user/register`, {
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
    
        try {
            const response = await fetch(`${apiUrl}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ 
                    email: email,
                    password: password
                })
            });
    
            if (response.ok) {
                const userData = await response.json();
                alert('Успешен вход!');
                sessionStorage.setItem('user', JSON.stringify(userData));
                    const currentPath = window.location.pathname;
                    const isBulgarian = currentPath.includes('_bg.html');
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
    //Forgot password
    document.addEventListener('DOMContentLoaded', function () {
        emailjs.init("zd7S-Qg4R-j6V3sQ0");
      
        const form = document.getElementById('reset-password-form');
      
        form.addEventListener('submit', async function (event) {
          event.preventDefault();
      
          const email = document.getElementById('forgot-email').value;
      
          try {
            const response = await fetch(`${apiUrl}/user/check-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: email })
            });
      
            if (response.ok) {
              emailjs.sendForm('service_237qqkq', 'template_pkounmf', form)
                .then(() => {
                  alert('Изпратихме имейл с инструкции за възстановяване на паролата.');
                }, (error) => {
                  alert('Възникна грешка при изпращане на имейл: ' + JSON.stringify(error));
                });
            } else {
              alert('Такъв имейл не съществува в системата.');
            }
          } catch (err) {
            console.error('Грешка при свързване с API:', err);
            alert('Грешка при връзка със сървъра.');
          }
        });
      });
      
    // Initialize event listeners when DOM loads
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('signup-form').querySelector('form').addEventListener('submit', handleSignUp);
    });
    