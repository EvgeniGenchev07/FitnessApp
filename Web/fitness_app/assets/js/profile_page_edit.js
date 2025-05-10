const apiUrl = 'http://192.168.100.6:5000';
let selectedPhotoFile = null;
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
        //loading data
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
        
            // Set profile image (handle byte array or default)
            if (user.photo && Array.isArray(user.photo)) {
                try {
                    const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(user.photo)));
                    avatarPreview.src = `data:image/jpeg;base64,${base64String}`;
                } catch (e) {
                    console.error('Error processing profile photo:', e);
                    avatarPreview.src = 'assets/img/index/avatar.jpg';
                }
            } else {
                avatarPreview.src = 'assets/img/index/avatar.jpg';
            }
            avatarPreview.alt = user.userName;
        
            // Set username with validation
            const userName = user.userName;
            userNameInput.value = userName;
            userNameDisplay.textContent = userName;
        
            // Set email (required field)
            emailInput.value = user.email || '';
        
            // Set height (50-255 range)
            heightInput.value = user.height || '';
        
            // Set weight (with precision handling)
            weightInput.value = user.weight?.toFixed(1) || '';
        
            // Set bio
            bioInput.value = user.bio || '';
        
            // Set social media links (validate URLs)
            facebookInput.value = user.facebook || '';
            twitterInput.value = user.x || ''; // Note: Model uses 'x' for Twitter
            instagramInput.value = user.instagram || '';
        
            // Calculate and display "Member since" 
            if (user.creationDate) {
                const creationDate = new Date(user.creationDate);
                const options = { year: 'numeric', month: 'long' };
                memberSinceDisplay.textContent = `Member since:${creationDate.toLocaleDateString('en-US', options)}`;
            } else {
                memberSinceDisplay.textContent = 'New member';
            }
        }
        // Call the function when the page loads
         document.addEventListener('DOMContentLoaded', loadProfileData); 


         document.getElementById('photo-upload')?.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            selectedPhotoFile = file;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('avatar-preview').src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
        document.querySelector('.edit-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const saveBtn = document.querySelector('.save-btn');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Запазване...';
            
            try {
                const user = JSON.parse(sessionStorage.getItem('user')) || {};
                
                const patchData = {
                    email: user.email,
                    username: document.getElementById('username').value,
                    bio: document.getElementById('bio').value || null,
                    height: document.getElementById('height').value ? 
                           parseInt(document.getElementById('height').value) : null,
                    weight: document.getElementById('weight').value ? 
                           parseFloat(document.getElementById('weight').value) : null,
                    facebook: document.getElementById('facebook').value || null,
                    twitter: document.getElementById('twitter').value || null,
                    instagram: document.getElementById('instagram').value || null
                };
        
                if (selectedPhotoFile) {
                    const base64String = await convertFileToBase64(selectedPhotoFile);
                    patchData.photo = base64String;
                }
        
                const response = await fetch(`${apiUrl}/user`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token || ''}`
                    },
                    body: JSON.stringify(patchData)
                });
                
                if (response.ok) {
                    const updatedUser = {
                        ...user,
                        userName: patchData.username,
                        bio: patchData.bio,
                        height: patchData.height,
                        weight: patchData.weight,
                        facebook: patchData.facebook,
                        x: patchData.twitter,
                        instagram: patchData.instagram
                    };
                    
                    if (selectedPhotoFile) {
                        updatedUser.photo = Array.from(new Uint8Array(await selectedPhotoFile.arrayBuffer()));
                        selectedPhotoFile = null; 
                        document.getElementById('photo-upload').value = ''; 
                    }
                    sessionStorage.setItem('user', JSON.stringify(updatedUser));
                    alert('Профилът е обновен успешно!');
                    window.location.href = 'profile_page.html';
                } else {
                    const error = await response.text();
                    throw new Error(error || 'Грешка при обновяване на профила');
                }
            } catch (error) {
                console.error('Грешка при обновяване на профила:', error);
                alert('Грешка при обновяване на профила: ' + error.message);
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Запази промените';
            }
        });
        
        function convertFileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        }