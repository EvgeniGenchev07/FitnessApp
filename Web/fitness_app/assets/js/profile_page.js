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

// Modal Functions (Placeholder)
function showEditProfileModal() {
    alert('Edit Profile clicked');
}

function showDeletePostModal() {
    alert('Delete Post clicked');
}

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
        
        // Set profile image (convert byte array to URL if available)
        if (userData.photo) {
            // Convert byte array to base64 image
            const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(userData.photo)));
            profileAvatar.src = `data:image/jpeg;base64,${base64String}`;
        } else {
            profileAvatar.src = 'assets/img/index/avatar.jpg';
        }
        profileAvatar.alt = userData.userName || 'Profile';
        
        // Set username
        profileName.textContent = userData.userName || 'DARK_USER';
        
        // Set stats
        profileStats[0].textContent = userData.workouts?.length || '0'; // Using workouts count as posts
        profileStats[1].textContent = userData.followers?.toLocaleString() || '0';
        profileStats[2].textContent = userData.following?.toLocaleString() || '0';
        
        // Set bio if available
        if (userData.bio) {
            profileBio.innerHTML = userData.bio.replace(/\n/g, '<br>');
        }
        else{
            profileBio.innerHTML = 'AthloBoostX Warrior';
        }

        // Social media links could be added here if needed
    } else {
        // If no data in session storage, use defaults or show message
        console.log('No user data found in session storage');
        // You might want to redirect to login page here
        // window.location.href = '/login';
    }
}
function showDeletePostModal() {
    alert('Delete Post modal would appear here');
    // In a real implementation, you would show a modal here
}
//Logout
function logout() {
    sessionStorage.removeItem('user');
    const language=navigator.language;
    if(language.startsWith("bg"))
    {
        window.location.href="index.html"
    }
    else{
        window.location.href="index_en.html"
    }
}
//Redirect to dashboard
function navigateToDashboard()
{
    const language=navigator.language;
    if(language.startsWith("bg"))
    {
        window.location.href="dashboard_bg.html"
    }
    else{
        window.location.href="dashboard.html"
    }
}
//Redirext to edit page
function navigateToEditPage()
{
    const language=navigator.language;
    if(language.startsWith("bg"))
        {
            window.location.href="profile_page_edit_bg.html"
        }
        else{
            window.location.href="profile_page_edit.html"
        }
}
function navigateToMainPage()
{
    const language=navigator.language;
    if(language.startsWith("bg"))
        {
            window.location.href="index.html"
        }
        else{
            window.location.href="index_en.html"
        }
}
// Load profile data when page loads
document.addEventListener('DOMContentLoaded', loadProfileData);