import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WorkoutEditScreen = ()=> {
    const [name, setName] = useState('Strength');
    const [type, setType] = useState('Strength');
    const [duration, setDuration] = useState('30 min');
    const [notes, setNotes] = useState('Lower body workout');

    const handleDelete = () => {
        // Handle delete logic here
        console.log('Workout deleted');
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="barbell" size={48} color="white" />
            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Type</Text>
            <TouchableOpacity style={styles.selectBox}>
                <Text style={styles.selectText}>{type}</Text>
                <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </TouchableOpacity>

            <Text style={styles.label}>Duration</Text>
            <TouchableOpacity style={styles.selectBox}>
                <Text style={styles.selectText}>{duration}</Text>
                <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </TouchableOpacity>

            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={[styles.input, { height: 60 }]}
                value={notes}
                onChangeText={setNotes}
                multiline
            />

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete Workout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    label: {
        color: '#aaa',
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        backgroundColor: '#1c1c1e',
        color: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    selectBox: {
        flexDirection: 'row',
        backgroundColor: '#1c1c1e',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectText: {
        color: '#fff',
        fontSize: 16,
    },
    deleteButton: {
        marginTop: 30,
        backgroundColor: '#007aff',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    deleteText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
export default WorkoutEditScreen;
