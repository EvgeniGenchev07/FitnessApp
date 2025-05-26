const apiUrl = 'http://192.168.100.7:5000';
let latestPostId=-1;
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
        loadData(userData);
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
    
    // Update bio if available
    if (userData.bio) {
        document.querySelector('.bio-text').textContent = userData.bio;
    } else {
        document.querySelector('.bio-text').textContent = "No bio";
    }
    
    // Update profile statistics
    if (userData.posts) {
        document.querySelector('.account-info .data .data-item:nth-child(1) .value').textContent = userData.posts.length;
    }
    else{
        document.querySelector('.account-info .data .data-item:nth-child(1) .value').textContent = 0;
    }
    
    if (userData.followers) {
        document.querySelector('.account-info .data-item:nth-child(2) .value').textContent = userData.followers.length;
    }
    else{
        document.querySelector('.account-info .data-item:nth-child(2) .value').textContent = 0;
    }
    
    if (userData.following) {
        document.querySelector('.account-info .data-item:nth-child(3) .value').textContent = userData.following.length;
    }
    else{
        document.querySelector('.account-info .data-item:nth-child(3) .value').textContent = 0;
    }
    // Update social media links
    if (userData.facebook) {
        document.querySelector('.media-link:nth-child(1)').href = userData.facebook;
    }
    
    if (userData.twitter) {
        document.querySelector('.media-link:nth-child(2)').href = userData.twitter;
    }
    
    if (userData.instagram) {
        document.querySelector('.media-link:nth-child(3)').href = userData.instagram;
    }
 
    if (userData.photo) {
    const base64String = userData.photo.trim().replace(/^data:image\/[a-z]+;base64,/, '');
    const mimeType = userData.photoMimeType || 'image/jpeg';
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.style.backgroundImage = `url('data:${mimeType};base64,${base64String}')`;
    }} 
    else {
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.style.backgroundImage = "url('assets/img/index/avatar.jpg')";
    }}
    
    if(userData.posts)
    {
        let latestPost = userData.posts[userData.posts.length-1];
        const base64String = latestPost.image.replace(/^data:image\/[a-z]+;base64,/, '');
        const mimeType = latestPost.photoMimeType;
        
        document.querySelector('.last-post .post-title').textContent = latestPost.title;
        const postCover = document.querySelector('.last-post .post-cover');
        postCover.style.backgroundImage = `url('data:${mimeType};base64,${base64String}')`;
        postCover.style.backgroundPosition = 'center'; 
        postCover.style.backgroundSize = 'cover'; 
        postCover.style.backgroundRepeat = 'no-repeat';
        document.querySelector('.last-post .post-CTA').textContent="Виж";
        latestPostId=latestPost.id;
        document.querySelector('.last-post .post-CTA').addEventListener('click', () => openPost(latestPostId));
    }
}

function openPost(pathId)
{
    if(pathId!=-1)
    {
        window.location.href=`post_preview.html?postId=${pathId}`;
    }
}