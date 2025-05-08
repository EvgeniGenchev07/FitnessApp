import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export const getUserId = async (): Promise<string> => {
    const userId = await SecureStore.getItemAsync('user');
    if (!userId) {
        router.push('/login');
        return '';
    }
    return userId;
};