// Navigation functions with URL-based language detection
function getLanguageFromUrl() {
    const currentUrl = window.location.pathname;
    if (currentUrl.includes('_bg.html')) {
        return 'bg';
    }
    return 'en'; // Default to English
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
    // Get user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    if (userData) {
        // Update profile header
        const profileAvatar = document.querySelector('.profile-avatar');
        const profileName = document.querySelector('.profile-name');
        const profileStats = document.querySelectorAll('.profile-stats span');
        const profileBio = document.querySelector('.profile-bio');
        const profilePostsContainer = document.querySelector('.profile-posts');
        
        // Set profile image (convert byte array to URL if available)
        if (userData.photo) {
            // Convert byte array to base64 image
            const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(userData.photo)));
            profileAvatar.src = `data:image/jpeg;base64,${base64String}`;
        } else {
            profileAvatar.src = 'assets/img/index/avatar.jpg';
        }
        profileAvatar.alt = userData.userName;
        
        // Set username
        profileName.textContent = userData.userName;
        
        // Set stats - using actual counts from session data
        profileStats[0].textContent = userData.posts?.length || '0'; // Posts count
        profileStats[1].textContent = userData.followers?.length || '0'; // Followers count
        profileStats[2].textContent = userData.following?.length || '0'; // Following count
        
        // Set bio if available
        if (userData.bio) {
            profileBio.innerHTML = userData.bio.replace(/\n/g, '<br>');
        } else {
            profileBio.innerHTML = 'AthloBoostX Warrior';
        }

        // Load posts if available
        if (userData.posts && userData.posts.length > 0) {
            profilePostsContainer.innerHTML = ''; // Clear any placeholder content
            
            userData.posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.className = 'post-item';
                
                // Assuming post has an image property
                if (post.image) {
                    const img = document.createElement('img');
                    // Convert byte array to base64 if needed
                    const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(post.image)));
                    img.src = `data:image/jpeg;base64,${base64String}`;
                    img.alt = 'Post';
                    postItem.appendChild(img);
                } else {
                    // Default placeholder if no image
                    const img = document.createElement('img');
                    img.src = 'post-placeholder.jpg';
                    img.alt = 'Post';
                    postItem.appendChild(img);
                }
                
                // Add hover overlay with likes and comments if available
                const postHover = document.createElement('div');
                postHover.className = 'post-hover';
                
                const likesSpan = document.createElement('span');
                    likesSpan.textContent = `❤️ ${post.likes?.length || '0'}`;
                    
                const commentsSpan = document.createElement('span');
                    commentsSpan.textContent = `💬 ${post.comments?.length || '0'}`;
                    
                postHover.appendChild(likesSpan);
                postHover.appendChild(commentsSpan);
                postItem.appendChild(postHover);
                
                profilePostsContainer.appendChild(postItem);
            });
        } else {
            // No posts - you could show a message or leave empty
            profilePostsContainer.innerHTML = 
                '<p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.2em;">No posts yet</p>';
        }
    } else {
        // If no data in session storage, use defaults or show message
        console.log('No user data found in session storage');
    }
}

// Load profile data when page loads
document.addEventListener('DOMContentLoaded', loadProfileData);