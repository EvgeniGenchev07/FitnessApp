import React from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';

function PostsTab() {
    let posts = [{id:1,image:require('../assets/images/man-avatar-icon-free-vector-3688420316.jpg')}];
    return (
    <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.image }} style={styles.post} />
                )}
                numColumns={3}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'black' },
    post: { width: '33%', aspectRatio: 1 }

});

export default PostsTab;
