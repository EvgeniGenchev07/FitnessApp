import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const posts = [
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

export default function TabTwoScreen() {
    //@ts-ignore
    const renderPost = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.userRow}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View>
                    <Text style={styles.username}>{item.user}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
            </View>
            <Text style={styles.content}>{item.content}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
            <View style={styles.actionRow}>
                <TouchableOpacity>
                    <Ionicons name="heart-outline" size={22} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="chatbubble-outline" size={22} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="share" size={20} color="#555" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={renderPost}
            contentContainerStyle={styles.container}
        />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 100,
        backgroundColor: '#fff',
    },
    card: {
        backgroundColor: '#f9f9f9',
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
        color: '#999',
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
        borderTopColor: '#eee',
    },
});
