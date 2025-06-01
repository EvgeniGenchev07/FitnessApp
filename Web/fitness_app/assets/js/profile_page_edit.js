const apiUrl = 'http://192.168.100.8:5000';
let selectedPhotoFile = null;
const currentPath = window.location.pathname;
const isBulgarian = currentPath.includes('_bg.html');
// Image preview functionality
document.getElementById('photo-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        selectedPhotoFile = file;

        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('avatar-preview').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Load profile data
function loadProfileData() {
    const user = JSON.parse(sessionStorage.getItem('user')) || {};

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

    // Show profile image
    if (user.photo) {
        const mimeType = user.photoMimeType || 'image/jpeg';
        avatarPreview.src = `data:${mimeType};base64,${user.photo}`;
    } else {
        avatarPreview.src = 'assets/img/index/avatar.jpg';
    }
    avatarPreview.alt = user.userName;

    userNameInput.value = user.userName || '';
    userNameDisplay.textContent = user.userName || '';
    emailInput.value = user.email || '';
    heightInput.value = user.height || '';
    weightInput.value = user.weight?.toFixed(1) || '';
    bioInput.value = user.bio || '';
    facebookInput.value = user.facebook || '';
    twitterInput.value = user.x || '';
    instagramInput.value = user.instagram || '';

    if (user.creationDate) {
        const creationDate = new Date(user.creationDate);
        const options = { year: 'numeric', month: 'long' };
        if(isBulgarian){
            memberSinceDisplay.textContent = `Член от: ${creationDate.toLocaleDateString('bg-BG', options)}`;
        }
        else{
            memberSinceDisplay.textContent = `Member since: ${creationDate.toLocaleDateString('en-US', options)}`;
        }
    } else {
        if(isBulgarian){
            memberSinceDisplay.textContent = 'Нов член';
        }
        else{
            memberSinceDisplay.textContent = 'Нов член';
            memberSinceDisplay.textContent = 'New member'; 
        }
    }
}

document.addEventListener('DOMContentLoaded', loadProfileData);

// Form submit logic
document.querySelector('.edit-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const saveBtn = document.querySelector('.save-btn');
    saveBtn.disabled = true;
    if(isBulgarian)
    {
        saveBtn.textContent = 'Запазване...';
    }
    else{
            saveBtn.textContent = 'Saving...';
    }

    try {
        const user = JSON.parse(sessionStorage.getItem('user')) || {};

        const patchData = {
            email: user.email,
            username: document.getElementById('username').value,
            bio: document.getElementById('bio').value || null,
            height: document.getElementById('height').value ? parseInt(document.getElementById('height').value) : null,
            weight: document.getElementById('weight').value ? parseFloat(document.getElementById('weight').value) : null,
            facebook: document.getElementById('facebook').value || null,
            twitter: document.getElementById('twitter').value || null,
            instagram: document.getElementById('instagram').value || null
        };

        if (selectedPhotoFile) {
            const base64String = await convertFileToBase64(selectedPhotoFile);
            patchData.photo = base64String;
            patchData.photoMimeType = selectedPhotoFile.type;
        }

        const response = await fetch(`${apiUrl}/user/js`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patchData)
        });

        if (response.ok) {
            // Update sessionStorage
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

            if (patchData.photo) {
                updatedUser.photo = patchData.photo;
                updatedUser.photoMimeType = patchData.photoMimeType;
            }

            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            alert('Профилът е обновен успешно!');
            if(isBulgarian){
                window.location.href = 'profile_page_bg.html';
            }
            else{
                window.location.href = 'profile_page.html';
            }
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

// Convert file to Base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
