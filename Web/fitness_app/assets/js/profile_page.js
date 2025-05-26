const apiUrl = 'http://192.168.100.7:5000';
// Navigation functions with URL-based language detection
function getLanguageFromUrl() {
    const currentUrl = window.location.pathname;
    if (currentUrl.includes('_bg.html')) {
        return 'bg';
    }
    return 'en'; // Default to English
}
//Delete post
async function deletePost(postId, event) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
        const language = getLanguageFromUrl();
        const confirmMessage = language === 'bg' 
            ? 'Сигурни ли сте, че искате да изтриете този пост? Това действие е необратимо!' 
            : 'Are you sure you want to delete this post? This action cannot be undone!';
        
        if (!confirm(confirmMessage)) {
            return;
        }

        const response = await fetch(`${apiUrl}/posts/${postId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const userData = JSON.parse(sessionStorage.getItem('user'));
            if (userData && userData.posts) {
                userData.posts = userData.posts.filter(post => post.id !== postId);
                sessionStorage.setItem('user', JSON.stringify(userData));
                
                loadProfileData();
                
                const successMessage = language === 'bg' 
                    ? 'Постът беше изтрит успешно!' 
                    : 'Post deleted successfully!';
                alert(successMessage);
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        const language = getLanguageFromUrl();
        alert(language === 'bg' 
            ? 'Грешка при изтриване на поста: ' + error.message 
            : 'Error deleting post: ' + error.message);
    }
}
//Delete account
async function deleteAccount() {
    try {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        if (!userData || !userData.email) {
            alert('No user data found');
            return;
        }

        // Show confirmation dialog
        const language = getLanguageFromUrl();
        const confirmMessage = language === 'bg' 
            ? 'Сигурни ли сте, че искате да изтриете акаунта си? Това действие е необратимо!' 
            : 'Are you sure you want to delete your account? This action cannot be undone!';
        
        if (!confirm(confirmMessage)) {
            return;
        }

        const response = await fetch(`${apiUrl}/user/${encodeURIComponent(userData.email)}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Clear session storage and redirect
            sessionStorage.removeItem('user');
            window.location.href = language === 'bg' ? 'index.html' : 'index_en.html';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete account');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        const language = getLanguageFromUrl();
        alert(language === 'bg' 
            ? 'Грешка при изтриване на акаунта: ' + error.message 
            : 'Error deleting account: ' + error.message);
    }
}

function navigateToDashboard() {
    const language = getLanguageFromUrl();
    window.location.href = language === 'bg' ? 'dashboard_bg.html' : 'dashboard.html';
}

function navigateToEditPage() {
    const language = getLanguageFromUrl();
    window.location.href = language === 'bg' ? 'profile_page_edit_bg.html' : 'profile_page_edit.html';
}

function navigateToMainPage() {
    const language = getLanguageFromUrl();
    window.location.href = language === 'bg' ? 'index.html' : 'index_en.html';
}
function appendDeleteButton()
{
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.style.display = 'flex';
    });;
}
function logout() {
    sessionStorage.removeItem('user');
    const language = getLanguageFromUrl();
    window.location.href = language === 'bg' ? 'index.html' : 'index_en.html';
}

// Settings Dropdown Functionality
function toggleSettings(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('settingsDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('settingsDropdown');
    const settingsIcon = document.querySelector('.settings-icon');
    
    if (!settingsIcon.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// Prevent dropdown from closing when clicking inside
document.getElementById('settingsDropdown').addEventListener('click', function(event) {
    event.stopPropagation();
});

// Function to load profile data from session storage
function loadProfileData() {
    const userData = JSON.parse(sessionStorage.getItem('user'));

    if (userData) {
        const profileAvatar = document.querySelector('.profile-avatar');
        const profileName = document.querySelector('.profile-name');
        const profileStats = document.querySelectorAll('.profile-stats span');
        const profileBio = document.querySelector('.profile-bio');
        const profilePostsContainer = document.querySelector('.profile-posts');

        if (userData.photo) {
            profileAvatar.src = `data:image/jpeg;base64,${userData.photo}`;
        } else {
            profileAvatar.src = 'assets/img/index/avatar.jpg';
        }
        profileAvatar.alt = userData.userName;

        profileName.textContent = userData.userName;
        profileStats[0].textContent = userData.posts?.length || '0';
        profileStats[1].textContent = userData.followers?.length || '0';
        profileStats[2].textContent = userData.following?.length || '0';

        profileBio.innerHTML = userData.bio ? userData.bio.replace(/\n/g, '<br>') : 'AthloBoostX Warrior';
        if (userData.posts && userData.posts.length > 0) {
        profilePostsContainer.innerHTML = '';
        userData.posts.forEach(post => {
        const postLink = document.createElement('a');
        postLink.href = `post_preview.html?postId=${post.id}`; 
        postLink.className = 'post-link'; 

        const postItem = document.createElement('div');
        postItem.className = 'post-item';

        const img = document.createElement('img');
        img.src = post.image
            ? `data:image/jpeg;base64,${post.image}`
            : 'post-placeholder.jpg';
        img.alt = 'Post';
        postItem.appendChild(img);

        const postHover = document.createElement('div');
        postHover.className = 'post-hover';

        const likesSpan = document.createElement('span');
        likesSpan.textContent = `❤️ ${post.likes?.length || '0'}`;

        const commentsSpan = document.createElement('span');
        commentsSpan.textContent = `💬 ${post.comments?.length || '0'}`;
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.className = 'close-button';
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            deletePost(post.id,e);
        });

postItem.appendChild(closeButton);

        postHover.appendChild(likesSpan);
        postHover.appendChild(commentsSpan);
        postItem.appendChild(postHover);

        postLink.appendChild(postItem); 
        profilePostsContainer.appendChild(postLink); 
    });
}
        else {
            const language=getLanguageFromUrl();
            if(language=="en")
            {
                profilePostsContainer.innerHTML =
                    '<p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.2em;">No posts yet</p>';
            }
            else{
            profilePostsContainer.innerHTML =
                    '<p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.2em;">Все още няма постове</p>';
            }
        }
    } else {
        console.log('No user data found in session storage');
    }
}

// Load profile data when page loads
document.addEventListener('DOMContentLoaded', loadProfileData);