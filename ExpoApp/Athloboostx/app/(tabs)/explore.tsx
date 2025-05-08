import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    TextInput, // Import TextInput
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react'; // Import useState

interface Post {
    id: string;
    user: string;
    avatar: string;
    time: string;
    content: string;
    image?: string;
}

const posts: Post[] = [
    {
        id: '1',
        user: 'Tracy Adams',
        avatar: 'https://i.pravatar.cc/100?img=1',
        time: '2h ago',
        content: 'Just crushed my morning HIIT workout 💪🔥',
        image: 'https://source.unsplash.com/400x300/?fitness',
    },
    {
        id: '2',
        user: 'Jordan Fit',
        avatar: 'https://i.pravatar.cc/100?img=2',
        time: '4h ago',
        content: 'Leg day never skips me 🏋️‍♂️',
        image: 'https://source.unsplash.com/400x300/?gym',
    },
];

export default function ExploreScreen() {
    const { colors } = useTheme();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState(''); // Add state for search query

    const SearchBar = () => (
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
            <Ionicons name="search" size={20} color={colors.text} style={styles.searchIcon} />
            <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder={t('explore.search')}
                placeholderTextColor={colors.text + '80'}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
    );


    const renderPost = ({ item }: { item: Post }) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.userRow}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View>
                    <ThemedText style={styles.username}>{item.user}</ThemedText>
                    <ThemedText style={styles.time}>{t('explore.timeAgo').replace('{{time}}', item.time)}</ThemedText>
                </View>
            </View>
            <ThemedText style={styles.content}>{item.content}</ThemedText>
            {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
            <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart-outline" size={22} color={colors.text} />
                    <ThemedText style={styles.actionText}>{t('explore.like')}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={22} color={colors.text} />
                    <ThemedText style={styles.actionText}>{t('explore.comment')}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Feather name="share" size={20} color={colors.text} />
                    <ThemedText style={styles.actionText}>{t('explore.share')}</ThemedText>
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
        padding: 16,
        paddingBottom: 100, // Adjusted padding to avoid overlap with tab bar if needed
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
        borderTopWidth: 1,
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
