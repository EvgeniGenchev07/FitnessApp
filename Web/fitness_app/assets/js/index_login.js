document.addEventListener('DOMContentLoaded', function () {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const language = navigator.language || navigator.userLanguage; // Detect device language

    if (userData) {
        const logoDiv = document.querySelector('.logo');
        if (logoDiv) {
            logoDiv.innerHTML = '';

            if (window.innerWidth <= 768) { // Mobile
                const welcomeDiv = document.createElement('div');
                welcomeDiv.style.fontFamily = "Cursive";
                welcomeDiv.style.color = "orange";
                welcomeDiv.style.fontSize = '15px';
                welcomeDiv.style.position = 'relative';
                welcomeDiv.style.cursor = 'pointer';
                welcomeDiv.style.display = 'flex';
                welcomeDiv.style.alignItems = 'center';
                welcomeDiv.style.gap = '5px';

                // Set welcome text
                const welcomeText = document.createElement('span');
                welcomeText.textContent = userData.userName;
                welcomeDiv.appendChild(welcomeText);

                // Create arrow span (pointing right when closed)
                const arrowSpan = document.createElement('span');
                arrowSpan.innerHTML = '&#x25B6;'; // Right-pointing triangle ▶
                arrowSpan.style.display = 'inline-block';
                arrowSpan.style.transition = 'transform 0.3s ease';
                welcomeDiv.appendChild(arrowSpan);

                const dropdownMenu = document.createElement('div');
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.position = 'absolute';
                dropdownMenu.style.top = '100%';
                dropdownMenu.style.left = '0';
                dropdownMenu.style.backgroundColor = '#fff';
                dropdownMenu.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.1)';
                dropdownMenu.style.borderRadius = '8px';
                dropdownMenu.style.padding = '10px';
                dropdownMenu.style.zIndex = '1000';

                // Create Profile link
                const profileLink = document.createElement('a');
                profileLink.href = (language.startsWith('bg')) ? 'profile_page_bg.html' : 'profile_page.html';
                profileLink.style.display = 'block';
                profileLink.style.padding = '5px 0';
                profileLink.style.color = '#333';
                profileLink.style.textDecoration = 'none';
                profileLink.textContent = (language.startsWith('bg')) ? 'Профил' : 'Profile';

                // Create Logout link
                const logoutLink = document.createElement('a');
                logoutLink.href = "logout.html";
                logoutLink.style.display = 'block';
                logoutLink.style.padding = '5px 0';
                logoutLink.style.color = '#333';
                logoutLink.style.textDecoration = 'none';
                logoutLink.textContent = (language.startsWith('bg')) ? 'Изход' : 'Logout';

                logoutLink.addEventListener('click', function () {
                    sessionStorage.removeItem('user');
                });

                dropdownMenu.appendChild(profileLink);
                dropdownMenu.appendChild(logoutLink);

                welcomeDiv.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const isOpen = dropdownMenu.style.display === 'block';
                    dropdownMenu.style.display = isOpen ? 'none' : 'block';
                    arrowSpan.innerHTML = isOpen ? '&#x25B6;' : '&#x25BC;'; // Switch between ▶ and ▼
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', function () {
                    dropdownMenu.style.display = 'none';
                    arrowSpan.innerHTML = '&#x25B6;'; // Reset to ▶
                });

                welcomeDiv.appendChild(dropdownMenu);
                logoDiv.appendChild(welcomeDiv);
            } else { // Desktop
                const newLink = document.createElement('a');
                newLink.href = (language.startsWith('bg')) ? 'profile_page_bg.html' : 'profile_page.html';

                const avatarImg = document.createElement('img');
                avatarImg.src = userData.avatarUrl || 'assets/img/index/avatar.jpg';
                avatarImg.alt = 'User Avatar';
                avatarImg.style.width = '50px';
                avatarImg.style.height = '50px';
                avatarImg.style.borderRadius = '50%';

                newLink.appendChild(avatarImg);
                logoDiv.appendChild(newLink);
            }
        }
    }
});