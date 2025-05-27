const apiUrl = 'http://192.168.56.1:5000';
let latestPostId=-1;
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUrl=window.location.pathname;
    const userId = urlParams.get('userId');
    const user=JSON.parse(sessionStorage.getItem('user'));
    let language;
    if(currentUrl.includes("_bg.html"))
    {
        language="bg";
    }
    else{
        language="en";
    }
    if (userId) {
        if(userId==user.id)
        {
            showProfile(language);
        }
        document.body.classList.add('visible')
        fetchUserProfile(userId,language);
    } else {
        document.querySelector('.profile-card').innerHTML = 
            '<div class="error-message"><p>No user specified</p></div>';
    }
});

function showProfile(language)
{
    if(language==="bg")
    {
        window.location.href="profile_page_bg.html";
    }
    else{
        window.location.href="profile_page.html"
    }
}

async function fetchUserProfile(userId,language) {
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
        loadData(userData,language);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        document.querySelector('.profile-card').innerHTML = 
            '<div class="error-message"><p>Error loading user profile</p></div>';
    }
}

function loadData(userData,language) {
    // Update basic profile information
    if (userData.userName) {
        document.querySelector('.username').textContent = userData.userName;
    }
    
    // Update bio if available
    if (userData.bio) {
        document.querySelector('.bio-text').textContent = userData.bio;
    } else {
        if(language=="bg")
        {
            document.querySelector('.bio-text').textContent = "Няма био";
        }
        else{
            document.querySelector('.bio-text').textContent = "No bio";
        }
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
        if(language=="bg")
        {
            document.querySelector('.last-post .post-CTA').textContent="Виж";
        }
        else{
            document.querySelector('.last-post .post-CTA').textContent="View";
        }
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