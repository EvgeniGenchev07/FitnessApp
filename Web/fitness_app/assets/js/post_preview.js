const apiUrl = 'http://192.168.100.6:5000';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    
    if (!postId) {
        document.querySelector('.article-content').innerHTML = '<p style="color:red;">Липсва ID на публикация.</p>';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/posts/${postId}?includeComments=true`);
        
        if (!response.ok) {
            throw new Error('Неуспешно извличане на публикацията.');
        }

        const post = await response.json();

        const safePost = {
            id: post.id,
            title: post.title || 'Без заглавие',
            description: post.description || 'Няма описание',
            created: new Date(post.created).toLocaleString('bg-BG'),
            likes: post.likes || 0,
            comments: post.comments || [],
            user:post.user ,
            photo:post.photo ,
            photoMimeType:post.photoMimeType
        };
        
        document.querySelector('.article-title').textContent = safePost.title;
        const base64String = safePost.photo.trim().replace(/^data:image\/[a-z]+;base64,/, '');
        const mimeType = safePost.photoMimeType || 'image/jpeg';
        document.getElementById('postImage').src = `data:${mimeType};base64,${base64String}`;

        document.querySelector('.article-meta div').innerHTML = 
            `Публикувано на: <span style="color: var(--accent-red)">${safePost.created.slice(0,12)}</span> 
            | Автор: <span style="color: var(--accent-red)">${safePost.user.userName}</span>`;
        
        document.getElementById('likeCount').textContent = safePost.likes;
        
        const articleContent = document.querySelector('.article-content');
        articleContent.innerHTML = `
            <p>${safePost.description}</p>
        `;

        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = safePost.comments.map(c => `
            <div class="comment">
                <div class="comment-author">АНОНИМЕН</div>
                <div class="comment-date">${new Date(c.createdAt).toLocaleString('bg-BG')}</div>
                <div class="comment-text">${c.description}</div>
            </div>
        `).join('');

    } catch (err) {
        document.querySelector('.article-content').innerHTML = `<p style="color:red;">Грешка: ${err.message}</p>`;
    }
});