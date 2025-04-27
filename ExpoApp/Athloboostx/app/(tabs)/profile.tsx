import React, { useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    useColorScheme,
    StatusBar,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {router} from "expo-router"; // dummy or real post data

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const navigation = useNavigation();

    const renderPost = ({ item }) => (
        <View style={styles.postItem}>
            <Text style={styles.postText}>{item.title}</Text>
        </View>
    );
    const posts = [];
    return (
        <ThemedView type={'default'} style={styles.container}>
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
                <TouchableOpacity onPress={() => router.navigate('/editProfile')}>
                    <Image
                        source={require('@/assets/images/man-avatar-icon-free-vector-3688420316.jpg')}
                        style={styles.profileImage}
                    />
                    <View style={styles.editIcon}>
                        <Text style={styles.editText}>✎</Text>
                    </View>
                </TouchableOpacity>
                <ThemedText type={'subtitle'}>John Doe</ThemedText>
                <ThemedText style={styles.description} type={'description'}>
                    123 Maple Street, Anytown, PA 17101
                </ThemedText>

                <View style={styles.stats}>
                    <View style={styles.stats_el}>
                        <ThemedText type={'defaultBold'}>100</ThemedText>
                        <ThemedText type={'description'}>Followers</ThemedText>
                    </View>
                    <View style={styles.stats_el}>
                        <ThemedText type={'defaultBold'}>1000</ThemedText>
                        <ThemedText type={'description'}>Following</ThemedText>
                    </View>
                    <View style={styles.stats_el}>
                        <ThemedText type={'defaultBold'}>100000</ThemedText>
                        <ThemedText type={'description'}>Likes</ThemedText>
                    </View>
                </View>

                <View style={styles.container_buttons}>
                    <ThemedButton type={'default'} style={styles.follow_button}>
                        <ThemedText type={'button'}>Follow</ThemedText>
                    </ThemedButton>
                    <ThemedButton type={'icon'} style={{ marginLeft: 10 }}>
                        <Ionicons
                            style={[styles.icon_social, { color: colors.borderColor }]}
                            name="share-social"
                            size={24}
                        />
                    </ThemedButton>
                </View>
            </View>

            {/* Posts Section */}
            {posts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="image-outline" size={64} color="gray" />
                    <Text style={styles.emptyText}>No posts available</Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item, index) => index.toString()}
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
        paddingTop: StatusBar.currentHeight + 50,
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
        marginBottom: -20,
        zIndex: 90,
    },
    editIcon: {
        position: 'relative',
        bottom: 10,
        marginLeft: '15%',
        width: '20%',
        backgroundColor: '#007bff',
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
        borderColor: '#ddd',
    },
    postText: {
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: 'gray',
    },
});
