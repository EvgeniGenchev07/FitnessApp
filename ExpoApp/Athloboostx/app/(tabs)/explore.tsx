import React, {useEffect} from 'react';
import {
    View,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    TextInput, Alert, // Import TextInput
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import {useFocusEffect} from "expo-router";
import {GetAllPosts, SearchPostResults} from "@/serviceLayer/managerHandler";
import Status from "@/serviceLayer/status";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Post {
    id: string;
    user: User;
    created: string;
    description: string;
    photo?: [];
    avatar:[];
    likes:number;
}

interface User{
    id: number;
    userName: string;
}

type ApiResponse = {
    status: Status;
    data?: Post[];
} | string;

const convertToImage = (photo: any) => {
    if (!photo) {
        return require('@/assets/images/man-avatar-icon-free-vector-3688420316.jpg');
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

function timeSince(postDate: string): string {
    const now = new Date();
    const date = new Date(postDate);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: Record<string, number> = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    if (seconds < 5) return "just now";

    for (const [unit, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }

    return `${seconds} seconds ago`;
}

export default function ExploreScreen() {
    const { colors } = useTheme();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadPosts();
        loadLikedPosts();
    }, []);

    const loadLikedPosts = async () => {
        try {
            const storedLikes = await GetAllPosts();
            if (storedLikes) {
                setLikedPosts(new Set(storedLikes.data));
            }
        } catch (error) {
            console.error('Error loading liked posts:', error);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            const newLikedPosts = new Set(likedPosts);
            const updatedPosts = posts.map(post => {
                if (post.id === postId) {
                    const newLikes = post.likes + (newLikedPosts.has(postId) ? -1 : 1);
                    if (newLikedPosts.has(postId)) {
                        newLikedPosts.delete(postId);
                    } else {
                        newLikedPosts.add(postId);
                    }
                    return { ...post, likes: newLikes };
                }
                return post;
            });

            setPosts(updatedPosts);
            setLikedPosts(newLikedPosts);
            await AsyncStorage.setItem('likedPosts', JSON.stringify([...newLikedPosts]));
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    const loadPosts = async () => {
        const res = await GetAllPosts();
        if (typeof res === 'object' && res.status === Status.OK && Array.isArray(res.data)) {
            setPosts(res.data);
        } else {
            Alert.alert("Something went wrong!");
        }
    };

    const SearchBar = () => (
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
            <Ionicons name="search" size={20} color={colors.text} style={styles.searchIcon} />
            <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder={t('explore.search')}
                placeholderTextColor={colors.text + '80'}
                value={searchQuery}
                onChangeText={async (query)=>{
                    setSearchQuery(query);
                    const res = await SearchPostResults(query);
                    if (typeof res === 'object' && res.status === Status.OK && Array.isArray(res.data)) {
                        setPosts(res.data);
                    }
                }}
            />
        </View>
    );

    const renderPost = ({ item }: { item: Post }) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.userRow}>
                <Image source={{ uri: convertToImage(item.avatar) }} style={styles.avatar} />
                <View>
                    <ThemedText style={styles.username}>{item.user.userName}</ThemedText>
                    <ThemedText style={styles.time}>{t('explore.timeAgo').replace('{{time}}', timeSince(item.created))}</ThemedText>
                </View>
            </View>
            <ThemedText style={styles.content}>{item.description}</ThemedText>
            {item.photo && <Image source={{ uri: convertToImage(item.photo) }} style={styles.postImage} />}
            <View style={[styles.actionRow,{justifyContent:'flex-start'}]}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleLike(item.id)}
                >
                    <Ionicons 
                        name={likedPosts.has(item.id) ? "heart" : "heart-outline"} 
                        size={22} 
                        color={likedPosts.has(item.id) ? colors.tint : colors.text} 
                    />
                    <ThemedText style={[
                        styles.actionText,
                        likedPosts.has(item.id) && { color: colors.tint }
                    ]}>
                        {t('explore.like').replace('{{likes}}', item.likes.toString())}
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                ListHeaderComponent={SearchBar} // Add SearchBar as ListHeaderComponent
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                contentContainerStyle={styles.container}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>{t('explore.noPosts')}</ThemedText>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 100,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16, // Add margin below the search bar
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    username: {
        fontWeight: '600',
        fontSize: 16,
    },
    time: {
        fontSize: 12,
        opacity: 0.7,
    },
    content: {
        fontSize: 14,
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 10,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 4,
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    emptyText: {
        fontSize: 16,
        opacity: 0.7,
    },
});
