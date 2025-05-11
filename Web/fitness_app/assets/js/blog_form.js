const apiUrl = 'http://192.168.100.6:5000';
let selectedPhotoFile = null;


$(document).ready(function () {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const blogFormSection = $('.blog-form-container');
    const isBulgarian = window.location.pathname.includes('blog_form_bg.html');

    if (!userData) return showAuthRequired();

    $('#image').on('change', handleImageSelect);
    $('.close-preview').on('click', resetImagePreview);
    $('#blogForm').on('submit', handleFormSubmit);

    function showAuthRequired() {
        blogFormSection.hide();
        const msg = {
            title: isBulgarian ? 'Изисква се регистрация' : 'Authentication Required',
            text: isBulgarian ? 'Трябва да влезете в профила си, за да публикувате статии' : 'You need to be signed in to create blog posts',
            signUp: isBulgarian ? 'Регистрация/Вход' : 'Sign Up/In',
        };
        const html = `
            <div class="container">
                <div class="auth-required-message">
                    <div class="auth-icon"><i class="fas fa-lock"></i></div>
                    <h2>${msg.title}</h2>
                    <p>${msg.text}</p>
                    <div class="auth-buttons">
                        <a href="${isBulgarian ? 'signUp_bg.html' : 'signUp.html'}" class="btn">${msg.signUp}</a>
                    </div>
                </div>
            </div>`;
        blogFormSection.after(html);
    }

    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        selectedPhotoFile = file;

        const reader = new FileReader();
        reader.onload = function (event) {
            $('#imagePreview').attr('src', event.target.result).show();
            $('.close-preview').show();
        };
        reader.readAsDataURL(file);
    }

    function resetImagePreview() {
        $('#imagePreview').hide().attr('src', '');
        $('.close-preview').hide();
        $('#image').val('');
        selectedPhotoFile = null;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const submitBtn = $('.blog-form-btn');
        submitBtn.prop('disabled', true).text(isBulgarian ? 'Изпращане...' : 'Submitting...');

        try {
            const formData = new FormData();
            formData.append('title', $('#title').val());
            formData.append('description', $('#content').val());
            formData.append('userId', userData.id);
            if (selectedPhotoFile) formData.append('photo', selectedPhotoFile);

            const response = await fetch(`${apiUrl}/posts`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || (isBulgarian ? 'Грешка при изпращане' : 'Submission failed'));
            }

            const createdPost = await response.json(); // Get back the post data
            await updateSessionWithNewPost(createdPost);

            showMessage(isBulgarian ? 'Успешно публикувано!' : 'Successfully published!', 'success');

            setTimeout(() => {
                window.location.href = isBulgarian ? 'blog_bg.html' : 'blog.html';
            }, 2000);
        } catch (err) {
            showMessage(err.message, 'error');
        } finally {
            submitBtn.prop('disabled', false).text(isBulgarian ? 'Публикувай' : 'Publish');
        }
    }

    function showMessage(message, type = 'error') {
        $('.form-message').remove();
        const el = $(`
            <div class="form-message alert alert-${type}">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                ${message}
            </div>`);
        $('.blog-form-title').after(el);

        if (type === 'error') {
            setTimeout(() => el.fadeOut(500, () => el.remove()), 5000);
        }
    }

    async function updateSessionWithNewPost(post) {
        if (!userData.posts) userData.posts = [];

        let imageBase64 = null;
        if (selectedPhotoFile) {
            imageBase64 = await toBase64(selectedPhotoFile);
        }

        userData.posts.push({
            id: post.id,
            title: post.title,
            description: post.description,
            image: imageBase64,
            likes: [],
            comments: []
        });

        sessionStorage.setItem('user', JSON.stringify(userData));
    }

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
        });
    }
});
