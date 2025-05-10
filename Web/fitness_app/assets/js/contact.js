document.addEventListener('DOMContentLoaded', function () {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    // Detect language from URL path - only check for _en.html
    const currentPath = window.location.pathname;
    const isEnglish = currentPath.includes('_en.html');
    // If URL contains _en.html -> English, otherwise Bulgarian

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

                // Create arrow span
                const arrowSpan = document.createElement('span');
                arrowSpan.innerHTML = '&#x25B6;';
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

                // Profile link
                const profileLink = document.createElement('a');
                profileLink.href = isEnglish ? 'profile_page.html' : 'profile_page_bg.html';
                profileLink.style.display = 'block';
                profileLink.style.padding = '5px 0';
                profileLink.style.color = '#333';
                profileLink.style.textDecoration = 'none';
                profileLink.textContent = isEnglish ? 'Profile' : 'Профил';

                // Logout link
                const logoutLink = document.createElement('a');
                logoutLink.href = "#";
                logoutLink.style.display = 'block';
                logoutLink.style.padding = '5px 0';
                logoutLink.style.color = '#333';
                logoutLink.style.textDecoration = 'none';
                logoutLink.textContent = isEnglish ? 'Logout' : 'Изход';

                logoutLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    sessionStorage.removeItem('user');
                    window.location.href = isEnglish ? 'index_en.html' : 'index.html';
                });

                dropdownMenu.appendChild(profileLink);
                dropdownMenu.appendChild(logoutLink);

                welcomeDiv.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const isOpen = dropdownMenu.style.display === 'block';
                    dropdownMenu.style.display = isOpen ? 'none' : 'block';
                    arrowSpan.innerHTML = isOpen ? '&#x25B6;' : '&#x25BC;';
                });

                document.addEventListener('click', function () {
                    dropdownMenu.style.display = 'none';
                    arrowSpan.innerHTML = '&#x25B6;';
                });

                welcomeDiv.appendChild(dropdownMenu);
                logoDiv.appendChild(welcomeDiv);
            } else { // Desktop
                const newLink = document.createElement('a');
                newLink.href = isEnglish ? 'profile_page.html' : 'profile_page_bg.html';

                let avatarSrc = 'assets/img/index/avatar.jpg';
                if (userData.photo && Array.isArray(userData.photo)) {
                    try {
                        const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(userData.photo)));
                        avatarSrc = `data:image/jpeg;base64,${base64String}`;
                    } catch (e) {
                        console.error('Error processing avatar image:', e);
                    }
                } else if (userData.avatarUrl) {
                    avatarSrc = userData.avatarUrl;
                }

                const avatarImg = document.createElement('img');
                avatarImg.src = avatarSrc;
                avatarImg.alt = 'User Avatar';
                avatarImg.style.width = '50px';
                avatarImg.style.height = '50px';
                avatarImg.style.borderRadius = '50%';
                avatarImg.style.objectFit = 'cover';

                newLink.appendChild(avatarImg);
                logoDiv.appendChild(newLink);
            }
        }
    }
});