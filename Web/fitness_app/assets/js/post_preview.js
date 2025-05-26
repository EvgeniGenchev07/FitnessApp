const apiUrl = 'http://192.168.100.7:5000';
const userData = JSON.parse(sessionStorage.getItem('user'));
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

const likeIcon = document.getElementById("likeIcon");
const likeCount = document.getElementById("likeCount");
let liked = false; 
let count = parseInt(likeCount.textContent);
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');
const userId = userData.id;

async function checkIfLiked() {
    try {
        const response = await fetch(`${apiUrl}/posts/${postId}/check-like?userId=${userId}`);
        if (response.ok) {
            const data = await response.json();
            liked = data.liked;
            if (liked) {
                likeIcon.classList.add("liked");
            } else {
                likeIcon.classList.remove("liked");
            }
        }
    } catch (error) {
        console.error("Грешка при проверка на лайк:", error);
    }
}

checkIfLiked();

likeIcon.addEventListener("click", async () => {
    try {
        const response = await fetch(`${apiUrl}/posts/${postId}/like?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            liked = data.liked;
            count = data.likes;
            likeCount.textContent = count;
            
            if (liked) {
                likeIcon.classList.add("liked");
            } else {
                likeIcon.classList.remove("liked");
            }
        } else {
            throw new Error('Неуспешно изпълнение на заявката');
        }
    } catch (error) {
        console.error('Грешка при изпращането:', error);
        likeIcon.classList.toggle("liked");
    }
});