import { API_URL } from '@/config';
import { getUserId } from '@/utils/auth';

// Post API calls
export const GetPosts = async (page: number = 1, pageSize: number = 10) => {
    try {
        const response = await fetch(`${API_URL}/Post?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const CreatePost = async (post: {
    content: string;
    imageUrl?: string;
}) => {
    try {
        const response = await fetch(`${API_URL}/Post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...post,
                userId: await getUserId(),
            }),
        });
        if (!response.ok) throw new Error('Failed to create post');
        return await response.json();
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const LikePost = async (postId: number) => {
    try {
        const response = await fetch(`${API_URL}/Post/${postId}/like`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to like post');
        return await response.json();
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

export const AddComment = async (postId: number, content: string) => {
    try {
        const response = await fetch(`${API_URL}/Post/${postId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                userId: await getUserId(),
            }),
        });
        if (!response.ok) throw new Error('Failed to add comment');
        return await response.json();
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const DeletePost = async (postId: number) => {
    try {
        const response = await fetch(`${API_URL}/Post/${postId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete post');
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}; 