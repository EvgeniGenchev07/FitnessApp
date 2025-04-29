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