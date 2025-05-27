import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    useColorScheme,
    StatusBar,
    Platform,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {router, useFocusEffect} from "expo-router";
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { GetAllPosts } from '@/serviceLayer/managerHandler';
import Status from '@/serviceLayer/status';

interface Post {
    id: string;
    user: {
        id: string;
        userName: string;
    };
    created: string;
    description: string;
    photo?: string;
    avatar?: string;
    likes: number;
}

interface UserData {
    userName: string;
    bio: string;
    photo: string | null;
    followers: any[];
    following: any[];
    email: string;
}

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight as number) ?? 0 : 0;

export default function ProfileScreen() {
    const { colors } = useTheme();
    const { t } = useLanguage();
    const colorScheme = useColorScheme();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [image, setImage] = useState(require('@/assets/images/man-avatar-icon-free-vector-3688420316.jpg'));
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [likes, setLikes] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [userEmail, setUserEmail] = useState<string>('');

    const loadUser = async () => {
        try {
            // Get user email from secure storage
            const email = await SecureStore.getItemAsync('user');
            if (!email) {
                console.error('No user email found');
                return;
            }
            setUserEmail(email);

            // Load user profile data
            const user_data = await AsyncStorage.getItem('profile');
            if (!user_data) {
                console.error('No profile data found');
                return;
            }
            const user = JSON.parse(user_data);
            setUserData(user);
            
            if(user?.photo){
                const imageUri = convertToImage(user.photo);
                if (imageUri) {
                    setImage({uri: imageUri});
                }
            }
            setUsername(user.userName);
            setDescription(user.bio);
            setFollowers(user.followers?.length || 0);
            setFollowing(user.following?.length || 0);

            // Load all posts and filter for user's posts
                setPosts(user.posts||[]);
                
                // Calculate total likes from user's posts
                const totalLikes = user.posts?.reduce((sum: number, post: Post) => sum + post.likes, 0) || 0;
                setLikes(totalLikes);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadUser();
        }, [])
    );

    const renderPost = ({ item }: { item: Post }) => (
        <View style={[styles.postItem, { borderColor: colors.border }]}>
            {item.photo && (
                <Image 
                    source={{ uri: convertToImage(item.photo) || undefined }} 
                    style={styles.postImage}
                />
            )}
            <ThemedText style={styles.postText}>{item.description}</ThemedText>
            <View style={styles.postStats}>
                <ThemedText style={styles.postLikes}>
                    {t('explore.like').replace('{{likes}}', item.likes.toString())}
                </ThemedText>
                <ThemedText style={styles.postDate}>
                    {t('explore.timeAgo').replace('{{time}}', timeSince(item.created))}
                </ThemedText>
            </View>
        </View>
    );

    const timeSince = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + 'y';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + 'mo';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + 'd';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + 'h';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + 'm';
        
        return Math.floor(seconds) + 's';
    };

    const convertToImage = (photo: any) => {
        if (!photo) {
            return null;
        }
        try {
            if (typeof photo === 'string') {
                if (photo.startsWith('data:image')) {
                    return photo;
                }
                return `data:image/jpeg;base64,${photo}`;
            }
            if (Array.isArray(photo)) {
                const binaryString = photo.map(byte => String.fromCharCode(byte)).join('');
                const base64String = btoa(binaryString);
                return `data:image/jpeg;base64,${base64String}`;
            }
            return null;
        } catch (error) {
            console.error('Error converting photo:', error);
            return null;
        }
    };

    return (
        <ThemedView type={'default'} style={[styles.container, { paddingTop: STATUSBAR_HEIGHT + 50 }]}>
            {/* Profile Section */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.headerRightIcon}
                    onPress={() => router.navigate('/settings')}
                >
                    <Ionicons name="settings-outline" size={25} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.profileContainer}>
                <Image
                    source={image}
                    style={styles.profileImage}
                />
                <ThemedText type={'subtitle'}>{username}</ThemedText>
                <ThemedText style={styles.description} type={'description'}>
                    {description}
                </ThemedText>

                <View style={styles.stats}>
                    <View style={styles.stats_el}>
                        <ThemedText type={'defaultBold'}>{followers}</ThemedText>
                        <ThemedText type={'description'}>{t('profile.followers')}</ThemedText>
                    </View>
                    <View style={styles.stats_el}>
                        <ThemedText type={'defaultBold'}>{following}</ThemedText>
                        <ThemedText type={'description'}>{t('profile.following')}</ThemedText>
                    </View>
                    <View style={styles.stats_el}>
                        <ThemedText type={'defaultBold'}>{likes}</ThemedText>
                        <ThemedText type={'description'}>{t('profile.likes')}</ThemedText>
                    </View>
                </View>

                <View style={styles.container_buttons}>
                    <ThemedButton type={'default'} style={styles.follow_button} onPress={()=>router.push("/editProfile")}>
                        <ThemedText type={'button'}>{t('profile.editProfile')}</ThemedText>
                    </ThemedButton>
                </View>
            </View>

            {/* Posts Section */}
            {posts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="image-outline" size={64} color={colors.text + '80'} />
                    <ThemedText style={styles.emptyText}>{t('profile.noPosts')}</ThemedText>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPost}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    headerContainer: {
        position: 'relative',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        zIndex: 10,
    },
    headerRightIcon: {
        padding: 6,
        borderRadius: 8,
        justifyContent: 'flex-end',
        marginRight: 20
    },
    settingsButton: {
        marginRight: 16,
        padding: 6,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        zIndex: 90,
    },
    editIcon: {
        position: 'relative',
        bottom: 10,
        marginLeft: '15%',
        width: '20%',
        borderRadius: 20,
        padding: 5,
        zIndex: 99,
    },
    editText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        marginTop: 20,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: 200,
        marginTop: 10,
    },
    stats_el: {
        flexDirection: 'column',
        marginHorizontal: 20,
        alignItems: 'center',
    },
    container_buttons: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: -10,
    },
    follow_button: {
        width: '50%',
    },
    icon_social: {
        paddingRight: 10,
        paddingLeft: 10,
    },
    postItem: {
        padding: 16,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    postText: {
        fontSize: 16,
        marginBottom: 8,
    },
    postStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postLikes: {
        fontSize: 14,
        opacity: 0.7,
    },
    postDate: {
        fontSize: 12,
        opacity: 0.5,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
    },
});
