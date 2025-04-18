import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ExerciseEditScreen from './editExercise'; // adjust path as needed

const WorkoutPage = () => {
    const [exercises, setExercises] = useState([{}]);

    const addExercise = () => {
        setExercises([...exercises, {}]);
    };

    const handleSaveAll = () => {
        console.log('All exercises saved');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Workout Plan</Text>
            {exercises.map((_, index) => (
                <View key={index} style={styles.exerciseContainer}>
                    <ExerciseEditScreen />
                </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addExercise}>
                <Text style={styles.addButtonText}>+ Add Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveAllButton} onPress={handleSaveAll}>
                <Text style={styles.saveAllText}>Save All</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#000',
    },
    header: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    exerciseContainer: {
        marginBottom: 30,
        backgroundColor: '#121212',
        borderRadius: 12,
        padding: 10,
    },
    addButton: {
        backgroundColor: '#1c1c1e',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    saveAllButton: {
        backgroundColor: '#007aff',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveAllText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default WorkoutPage;
