import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ReelsTab() {
    return (
        <View style={styles.container}>
            <Text>Reels Content</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ReelsTab;
