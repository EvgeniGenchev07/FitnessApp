document.addEventListener('DOMContentLoaded', () => {
    const lang = navigator.language || navigator.userLanguage;
    const isBulgarian = lang.startsWith('bg');
    const title = document.querySelector('h3');
    const emailLabel = document.querySelector('label[for="email"]');
    const passwordLabel = document.querySelector('label[for="password"]');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const button = document.querySelector('.btn-primary');
    if (isBulgarian) {
      title.textContent = 'Смяна на парола';
      emailLabel.textContent = 'Имейл';
      passwordLabel.textContent = 'Нова парола';
      emailInput.placeholder = 'Въведете вашия имейл';
      passwordInput.placeholder = 'Въведете нова парола';
      button.textContent = 'Сменете паролата';
    }
  });