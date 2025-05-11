const apiUrl = 'http://192.168.100.6:5000'; // Your API base URL
let selectedPhotoFile = null;

$(document).ready(function() {
    // Check if user is logged in
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const blogFormSection = $('.blog-form-container');
    
    // Check if current page is Bulgarian version
    const isBulgarian = window.location.pathname.includes('blog_form_bg.html');
    
    if (!userData) {
        // Hide the form and show authentication message
        blogFormSection.hide();
        
        const messages = {
            title: isBulgarian ? 'Изисква се регистрация' : 'Authentication Required',
            text: isBulgarian ? 'Трябва да влезете в профила си, за да публикувате статии' : 'You need to be signed in to create blog posts',
            signUp: isBulgarian ? 'Регистрация/Вход' : 'Sign Up/In',
        };
        
        const warningMessage = `
            <div class="container">
                <div class="auth-required-message">
                    <div class="auth-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h2>${messages.title}</h2>
                    <p>${messages.text}</p>
                    <div class="auth-buttons">
                        <a href="${isBulgarian ? 'signUp_bg.html' : 'signUp.html'}" class="btn">${messages.signUp}</a>
                    </div>
                </div>
            </div>
        `;
        
        blogFormSection.after(warningMessage);
        return;
    }

    // Image preview functionality
    $('#image').on('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        selectedPhotoFile = file;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            $('#imagePreview').attr('src', event.target.result).show();
            $('.close-preview').show();
        };
        reader.readAsDataURL(file);
    });

    // Remove image preview
    $('.close-preview').on('click', function() {
        $('#imagePreview').hide().attr('src', '');
        $('.close-preview').hide();
        $('#image').val('');
        selectedPhotoFile = null;
    });

    // Form submission handler
   $('#blogForm').on('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = $('.blog-form-btn');
    submitBtn.prop('disabled', true);
    submitBtn.text(isBulgarian ? 'Изпращане...' : 'Submitting...');

    try {
        const formData = new FormData();
        formData.append('title', $('#title').val());
        formData.append('description', $('#content').val());
        formData.append('userId', userData.id); 

        if (selectedPhotoFile) {
            formData.append('photo', selectedPhotoFile); 
        }

        const response = await fetch(`${apiUrl}/posts`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 
                (isBulgarian ? 'Грешка при изпращане' : 'Submission failed'));
        }

        showMessage(
            isBulgarian ? 'Успешно публикувано!' : 'Successfully published!',
            'success'
        );

        setTimeout(() => {
            window.location.href = isBulgarian ? 'blog_bg.html' : 'blog.html';
        }, 2000);

    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        submitBtn.prop('disabled', false);
        submitBtn.text(isBulgarian ? 'Публикувай' : 'Publish');
    }
});
    
    // Display messages to user
    function showMessage(message, type = 'error') {
        // Remove any existing messages
        $('.form-message').remove();
        
        const messageElement = $(`
            <div class="form-message alert alert-${type}">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                ${message}
            </div>
        `);
        
        // Insert after the form title
        $('.blog-form-title').after(messageElement);
        
        // Auto-hide after 5 seconds (only for errors)
        if (type === 'error') {
            setTimeout(() => {
                messageElement.fadeOut(500, function() {
                    $(this).remove();
                });
            }, 5000);
        }
    }
});