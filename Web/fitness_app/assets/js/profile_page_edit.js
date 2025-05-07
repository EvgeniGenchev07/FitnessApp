const apiUrl = 'http://192.168.100.3:5000'; 
// Image preview functionality
        document.getElementById('photo-upload').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('avatar-preview').src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        function loadProfileData() {
            // Get user data from session storage
            const user = JSON.parse(sessionStorage.getItem('user')) || {};
            
            // Get all the form elements
            const userNameInput = document.getElementById('username');
            const emailInput = document.getElementById('email');
            const heightInput = document.getElementById('height');
            const weightInput = document.getElementById('weight');
            const bioInput = document.getElementById('bio');
            const facebookInput = document.getElementById('facebook');
            const twitterInput = document.getElementById('twitter');
            const instagramInput = document.getElementById('instagram');
            const avatarPreview = document.getElementById('avatar-preview');
            const userNameDisplay = document.querySelector('.username-display');
            const memberSinceDisplay = document.querySelector('.member-since');
        
            // Set profile image
            if (user.photo) {
                const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(user.photo)));
                avatarPreview.src = `data:image/jpeg;base64,${base64String}`;
            } else {
                avatarPreview.src = 'assets/img/index/avatar.jpg';
            }
            avatarPreview.alt = user.userName || 'Profile';
        
            // Set userName
            const userName =user.userName || 'BEAST_USER';
            userNameInput.value = userName;
            userNameDisplay.textContent = userName;
        
            // Set other form fields
            emailInput.value = user.email || 'beast@example.com';
            heightInput.value = user.height || '185';
            weightInput.value = user.measurements.weight || '85';
            bioInput.value = user.bio || '';
            facebookInput.value = user.facebook || '';
            twitterInput.value = user.twitter || '';
            instagramInput.value = user.instagram || '';
        
            // Calculate and display "Member since" (registration date is required)
            if (!user.creationDate) {
                console.error('Registration date is required but missing');
                // Set a default registration date if absolutely necessary
                user.creationDate = new Date().toISOString();
            }
            
            const creationDate = new Date(user.creationDate);
            const now = new Date();
            
            // Calculate difference in months
            const months = (now.getFullYear() - creationDate.getFullYear()) * 12 + 
                          (now.getMonth() - creationDate.getMonth());
            
            // Format the display text
            let memberSinceText;
            if (months < 1) {
                memberSinceText = 'New member';
            } else if (months < 12) {
                memberSinceText = `Member for ${months} month${months > 1 ? 's' : ''}`;
            } else {
                const years = Math.floor(months / 12);
                const remainingMonths = months % 12;
                memberSinceText = `Member for ${years} year${years > 1 ? 's' : ''}`;
                if (remainingMonths > 0) {
                    memberSinceText += ` and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
                }
            }
            
            memberSinceDisplay.textContent = memberSinceText;
        }
        
        // Call the function when the page loads
        document.addEventListener('DOMContentLoaded', loadProfileData);

        // Save profile changes
        document.querySelector('.edit-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const saveBtn = document.querySelector('.save-btn');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
            
            try {
                // Get the current user from session storage
                const user = JSON.parse(sessionStorage.getItem('user')) || {};
                
                // Get form values
                const updatedUser = {
                    id: user.id, // Ensure we keep the same ID
                    userName: document.getElementById('username').value,
                    password:user.password,
                    email: document.getElementById('email').value,
                    height: document.getElementById('height').value ? parseInt(document.getElementById('height').value) : null,
                    birthDate: document.getElementById('birthdate').value || "0001-01-01T00:00:00",
                    bio: document.getElementById('bio').value,
                    facebook: document.getElementById('facebook').value || null,
                    twitter: document.getElementById('twitter').value || null,
                    instagram: document.getElementById('instagram').value || null,
                    measurements: user.measurements || []
                };
                
                // Update weight in measurements
                const weight = parseFloat(document.getElementById('weight').value);
                if (updatedUser.measurements.length > 0) {
                    updatedUser.measurements[0].weight = weight;
                } else {
                    updatedUser.measurements.push({ weight: weight });
                }
                
                // Send update request to backend
                const response = await fetch(`${apiUrl}/user`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedUser)
                });
                
                if (response.ok) {
                    const updatedUserData = await response.json();
                    // Update session storage with new data
                    sessionStorage.setItem('user', JSON.stringify(updatedUserData));
                    
                    // Show success message
                    alert('Profile updated successfully!');
                    // Redirect to profile page
                    window.location.href = 'profile_page.html';
                } else {
                    const error = await response.text();
                    throw new Error(error || 'Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Error updating profile: ' + error.message);
            } finally {
                // Reset button state
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Changes';
            }
        });