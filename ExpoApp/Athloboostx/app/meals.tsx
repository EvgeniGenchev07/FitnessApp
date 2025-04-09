import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function SavedTab() {
    return (
        <View style={styles.container}>
            <Text>Saved Content</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default SavedTab;
