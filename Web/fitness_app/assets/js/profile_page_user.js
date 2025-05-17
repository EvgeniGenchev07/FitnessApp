const apiUrl = 'http://192.168.100.6:5000';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    if (userId) {
        fetchUserProfile(userId);
    } else {
        document.querySelector('.profile-card').innerHTML = 
            '<div class="error-message"><p>No user specified</p></div>';
    }
});

async function fetchUserProfile(userId) {
    try {
        const response = await fetch(`${apiUrl}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        loadData(userData); // Call loadData with the fetched user data
    } catch (error) {
        console.error('Error fetching user profile:', error);
        document.querySelector('.profile-card').innerHTML = 
            '<div class="error-message"><p>Error loading user profile</p></div>';
    }
}

function loadData(userData) {
    // Update basic profile information
    if (userData.userName) {
        document.querySelector('.username').textContent = userData.userName;
    }
    
    if (userData.pageTitle) {
        document.querySelector('.page-title').textContent = userData.pageTitle;
    }
    
    // Update bio if available
    if (userData.bio) {
        document.querySelector('.bio-text').textContent = userData.bio;
    }
    else{
        document.querySelector('.bio-text').textContent = "No bio";
    }
    
    // Update profile statistics
    if (userData.posts) {
        document.querySelector('.account-info .data-item:nth-child(1) .value').textContent = userData.posts.length;
    }
    
    if (userData.followers) {
        document.querySelector('.important-data .data-item:nth-child(2) .value').textContent = userData.followers.length;
    }
    
    if (userData.following) {
        document.querySelector('.important-data .data-item:nth-child(3) .value').textContent = userData.following.length;
    }
    
    // Update social media links
    if (userData.facebook) {
        const facebookLink = document.querySelector('.media-link:nth-child(1)');
        facebookLink.href = userData.facebook;
    }
    
    if (userData.twitter) {
        const twitterLink = document.querySelector('.media-link:nth-child(2)');
        twitterLink.href = userData.x;
    }
    
    if (userData.instagram) {
        const instagramLink = document.querySelector('.media-link:nth-child(3)');
        instagramLink.href = userData.instagram;
    }
    
    // Update last post if available
    if (userData.lastPost) {
        document.querySelector('.post-title').textContent = userData.lastPost.title;
    }
    
    // Update profile image if available
    if (userData.photo) {
            const base64String = userData.photo.replace(/^data:image\/[a-z]+;base64,/, '');
            const mimeType = userData.photoMimeType || 'image/jpeg';
            document.querySelector('.profile-image').style.backgroundImage =`data:${mimeType};base64,${base64String}`;
    }
    else{
        document.querySelector('.profile-image').style.backgroundImage ='assets/img/index/avatar.jpg';
    }
}