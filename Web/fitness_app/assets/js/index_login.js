document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
        const logoDiv = document.querySelector('.logo');
        if (logoDiv) {
            const newLink = document.createElement('a');
            newLink.href = "profile_page_editing.html"; 

            const avatarImg = document.createElement('img');
            avatarImg.src = userData.avatarUrl || 'assets/img/index/avatar.jpg';
            avatarImg.alt = 'User Avatar';
            avatarImg.style.width = '50px';
            avatarImg.style.height = '50px';
            avatarImg.style.borderRadius = '50%';
            newLink.appendChild(avatarImg);

            logoDiv.innerHTML = '';
            logoDiv.appendChild(newLink);
        }
    }
});
