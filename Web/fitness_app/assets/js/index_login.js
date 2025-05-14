document.addEventListener('DOMContentLoaded', function () {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const defaultAvatar= 'assets/img/index/avatar.jpg';
    const currentPath = window.location.pathname;
    const isEnglish = currentPath.includes('_en.html');

    if (userData) {
        const logoDiv = document.querySelector('.logo');
        if (!logoDiv) return;

        logoDiv.innerHTML = '';
        let avatarSrc = defaultAvatar; 
        if (userData.photo) {
            const base64String = userData.photo.trim().replace(/^data:image\/[a-z]+;base64,/, '');
            const mimeType = userData.photoMimeType || 'image/jpeg';
            avatarSrc = `data:${mimeType};base64,${base64String}`;
        }
        if (window.innerWidth <= 768) {
            // 📱 Mobile view
            const welcomeDiv = document.createElement('div');
            welcomeDiv.style.fontFamily = "Cursive";
            welcomeDiv.style.color = "orange";
            welcomeDiv.style.fontSize = '15px';
            welcomeDiv.style.position = 'relative';
            welcomeDiv.style.cursor = 'pointer';
            welcomeDiv.style.display = 'flex';
            welcomeDiv.style.alignItems = 'center';
            welcomeDiv.style.gap = '5px';

            const welcomeText = document.createElement('span');
            welcomeText.textContent = userData.userName;
            welcomeDiv.appendChild(welcomeText);

            const arrowSpan = document.createElement('span');
            arrowSpan.innerHTML = '&#x25B6;';
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

            const profileLink = document.createElement('a');
            profileLink.href = isEnglish ? 'profile_page.html' : 'profile_page_bg.html';
            profileLink.textContent = isEnglish ? 'Profile' : 'Профил';
            profileLink.style.cssText = 'display: block; padding: 5px 0; color: #333; text-decoration: none;';

            const logoutLink = document.createElement('a');
            logoutLink.href = "#";
            logoutLink.textContent = isEnglish ? 'Logout' : 'Изход';
            logoutLink.style.cssText = 'display: block; padding: 5px 0; color: #333; text-decoration: none;';
            logoutLink.addEventListener('click', function (e) {
                e.preventDefault();
                sessionStorage.removeItem('user');
                window.location.href = isEnglish ? 'index_en.html' : 'index.html';
            });

            dropdownMenu.appendChild(profileLink);
            dropdownMenu.appendChild(logoutLink);

            welcomeDiv.appendChild(dropdownMenu);
            logoDiv.appendChild(welcomeDiv);

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

        } else {
            // 💻 Desktop view
            const newLink = document.createElement('a');
            newLink.href = isEnglish ? 'profile_page.html' : 'profile_page_bg.html';

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
});
