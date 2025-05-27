document.addEventListener('DOMContentLoaded', function() {
    const config = {
        API_URL: 'http://192.168.56.1:5000/posts/all',
        DEFAULT_IMAGE: 'img/default-post-image.jpg',
        DEFAULT_USER: 'Анонимен',
        MONTH_NAMES: ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'],
        POSTS_PER_PAGE: 3,
         TARGET_LANGUAGE: 'bg'
    };

    const state = {
        currentPage: 1,
        allPosts: [],
        totalPages: 1,
        translationCache: {}
    };

    init();

    async function init() {
        await loadPosts();
        setupPagination();
        await renderPage();
        setupResponsiveImages();
         refreshInterval = setInterval(async () => {
            await loadPosts();
            renderPage();
        }, 3000);
        window.addEventListener('unload', () => {
            clearInterval(refreshInterval);
        });
    }

    async function loadPosts() {
        try {
            showLoading(true);
            const response = await fetch(config.API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            state.allPosts = await response.json();
            if (!Array.isArray(state.allPosts)) throw new Error('Invalid data format');
            
            state.totalPages = Math.ceil(state.allPosts.length / config.POSTS_PER_PAGE);
        } catch (error) {
            console.error('Error loading posts:', error);
            showError('Грешка при зареждане на постовете');
        } finally {
            showLoading(false);
        }
    }

    function renderPage() {
        const start = (state.currentPage - 1) * config.POSTS_PER_PAGE;
        const end = start + config.POSTS_PER_PAGE;
        renderPosts(state.allPosts.slice(start, end));
        updatePagination();
    }

    function renderPosts(posts) {
        const container = document.querySelector('.blog_left_sidebar');
        if (!container) return;
        
        container.querySelectorAll('article.blog_item').forEach(el => el.remove());
        
        if (posts.length === 0) {
            container.innerHTML = '<p>Няма налични постове</p>';
            return;
        }

        posts.forEach(post => {
        const postHtml = createPostHtml(post);
        if (postHtml) { 
            container.insertAdjacentHTML('beforeend', postHtml);
        }
       });
    }

    function createPostHtml(post) {
        const safePost = {
            id: post.id,
            title: post.title || 'Без заглавие',
            description: post.description || '',
            created: post.created ? new Date(post.created) : new Date(),
            likes: post.likes || 0,
            photo: post.photo,
            mimeType: post.photoMimeType || 'image/jpeg',
            username: post.user?.userName || config.DEFAULT_USER,
            userId: post.user?.id || 0,
            language:post.language
        };
        function getUserHtml(username, userId) {
        return `<a href="profile_page_user_bg.html?userId=${userId}" class="user-link"><i class="fa fa-user"></i> ${username}</a>`;
    }
        if(safePost.language=="bg")
        {
            return `
                <article class="blog_item">
                    <div class="blog_item_img">
                        ${getImageHtml(safePost.photo, safePost.mimeType, safePost.title)}
                        <a href="#" class="blog_item_date">
                            <h3>${safePost.created.getDate()} ${config.MONTH_NAMES[safePost.created.getMonth()]}/${safePost.created.getFullYear()}</h3>
                        </a>
                    </div>
                    <div class="blog_details">
                        <a class="d-inline-block" href="post_preview.html?postId=${safePost.id}">
                            <h2 class="blog-head">${safePost.title}</h2>
                        </a>
                        <p><a href="post_preview.html?postId=${safePost.id}">Прочетете повече...</a></p>
                        <ul class="blog-info-link">
                            <li> ${getUserHtml(safePost.username, safePost.userId)}</li>
                            <li><i class="fa fa-heart"></i> ${safePost.likes} Харесвания</li>
                        </ul>
                    </div>
                </article>
                `;
        }
    }

   function setupPagination() {
    const container = document.querySelector('.blog_left_sidebar');
    if (!container) return;
    
    const paginationHTML = `
        <div class="pagination-container">
            <button class="pagination-button prev" aria-label="Предишна страница">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="page-circle">${state.currentPage}</div>
            <button class="pagination-button next" aria-label="Следваща страница">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    container.insertAdjacentHTML('afterend', paginationHTML);
    
   const style = document.createElement('style');
style.textContent = `
    .pagination-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        margin: 30px 0;
    }
    
    .page-circle {
        width: 40px;
        height: 40px;
        background-color: #ff0000;
        color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    
    .pagination-button {
        background: none;
        border: none;
        color: #333;
        font-size: 18px;
        cursor: pointer;
        padding: 5px 10px;
        transition: all 0.3s;
    }
    
    .pagination-button:hover {
        color: #ff0000;
    }
    
    .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        color: #ccc;
    }

    /* Респонсивни стилове */
    @media (max-width: 768px) {
        .page-circle {
            width: 35px;
            height: 35px;
            font-size: 14px;
        }
        
        .pagination-button {
            font-size: 16px;
        }
    }
    
    @media (max-width: 480px) {
        .pagination-container {
            gap: 10px;
        }
        
        .page-circle {
            width: 30px;
            height: 30px;
            font-size: 12px;
        }
        
        .pagination-button {
            font-size: 14px;
            padding: 3px 6px;
        }
    }
`;
document.head.appendChild(style);
    document.querySelector('.pagination-button.prev').addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderPage();
        }
    });
    
    document.querySelector('.pagination-button.next').addEventListener('click', () => {
        if (state.currentPage < state.totalPages) {
            state.currentPage++;
            renderPage();
        }
    });
}

    function updatePagination() {
    const pageCircle = document.querySelector('.page-circle');
    const prevBtn = document.querySelector('.pagination-button.prev');
    const nextBtn = document.querySelector('.pagination-button.next');
    
    if (pageCircle) pageCircle.textContent = state.currentPage;
    if (prevBtn) prevBtn.disabled = state.currentPage === 1;
    if (nextBtn) nextBtn.disabled = state.currentPage === state.totalPages;
}
    function setupResponsiveImages() {
        const style = document.createElement('style');
        style.textContent = `
            .blog_item_img img {
                width: 100%;
                height: auto;
                max-height: 200px;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            @media (max-width: 768px) {
                .blog_item_img img {
                    max-height: 150px;
                }
            }
            
            @media (max-width: 480px) {
                .blog_item_img img {
                    max-height: 120px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function getImageHtml(photoData, mimeType, altText) {
        if (!photoData) {
            return `<img src="${config.DEFAULT_IMAGE}" alt="${altText}" loading="lazy">`;
        }

        try {
            const base64 = typeof photoData === 'string' ? photoData : btoa(String.fromCharCode(...new Uint8Array(photoData)));
            return `<img src="data:${mimeType};base64,${base64}" alt="${altText}" loading="lazy">`;
        } catch (e) {
            console.error('Грешка при изображението:', e);
            return `<img src="${config.DEFAULT_IMAGE}" alt="${altText}" loading="lazy">`;
        }
    }

    function showLoading(show) {
        let loader = document.getElementById('loading-spinner');
        if (!loader && show) {
            loader = document.createElement('div');
            loader.id = 'loading-spinner';
            loader.innerHTML = `
                <div class="spinner"></div>
                <p>Зареждане...</p>
            `;
            document.body.appendChild(loader);
        }
        if (loader) loader.style.display = show ? 'flex' : 'none';
    }

    function showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        document.body.appendChild(errorEl);
        setTimeout(() => errorEl.remove(), 5000);
    }
});