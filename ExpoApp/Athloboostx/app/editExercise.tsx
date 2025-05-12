import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    Animated
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Exercise } from '@/types/workout';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 100 : 80;

const defaultExercise: Exercise = {
    name: '',
    muscleGroups: [],
    sets: [{ reps: 0, weight: 0, restTime: 60 }],
    estimatedTime: 5
};

const EditExerciseScreen = () => {
    const params = useLocalSearchParams();
    const [exercise, setExercise] = useState<Exercise>(() => {
        if (params.exercise) {
            const exerciseData = JSON.parse(decodeURIComponent(params.exercise as string));
            return {
                ...exerciseData,
                sets: exerciseData.sets || [{ reps: 0, weight: 0, restTime: 60 }]
            };
        }
        return defaultExercise;
    });
    const [isLoading, setIsLoading] = useState(true);
    const [scrollY] = useState(new Animated.Value(0));
    const router = useRouter();

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleNameChange = (text: string) => {
        setExercise(prev => ({ ...prev, name: text }));
    };

    const handleTimeChange = (text: string) => {
        const time = parseInt(text) || 5;
        setExercise(prev => ({ ...prev, estimatedTime: time }));
    };

    const handleSetChange = (index: number, field: 'reps' | 'weight' | 'restTime', value: string) => {
        const updatedSets = [...exercise.sets];
        updatedSets[index] = {
            ...updatedSets[index],
            [field]: parseInt(value) || 0
        };
        setExercise(prev => ({ ...prev, sets: updatedSets }));
    };

    const addSet = () => {
        setExercise(prev => ({
            ...prev,
            sets: [...prev.sets, { reps: 0, weight: 0, restTime: 60 }]
        }));
    };

    const removeSet = (index: number) => {
        if (exercise.sets.length <= 1) return;
        setExercise(prev => ({
            ...prev,
            sets: prev.sets.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        try {
            const updatedExercise = {
                ...exercise,
                sets: exercise.sets.map(set => ({
                    reps: parseInt(set.reps.toString()) || 0,
                    weight: parseInt(set.weight.toString()) || 0,
                    restTime: parseInt(set.restTime.toString()) || 60
                }))
            };
            
            const currentWorkout = JSON.parse(decodeURIComponent(params.workout as string));
            
            const updatedWorkout = {
                ...currentWorkout,
                exercises: currentWorkout.exercises.map((ex: Exercise) => 
                    ex.id === updatedExercise.id ? updatedExercise : ex
                )
            };
            
            router.push({
                pathname: '/manageWorkout',
                params: {
                    workout: encodeURIComponent(JSON.stringify(updatedWorkout)),
                    edit: 'true'
                }
            });
        } catch (error) {
            console.error('Error saving exercise:', error);
        }
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.header]}>
                <BlurView intensity={80} style={StyleSheet.absoluteFill} />
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Exercise</Text>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <Animated.ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                >
                    <View style={styles.content}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Exercise Name</Text>
                            <TextInput
                                style={styles.input}
                                value={exercise.name}
                                onChangeText={handleNameChange}
                                placeholder="Enter exercise name"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Estimated Time (minutes)</Text>
                            <TextInput
                                style={styles.input}
                                value={exercise.estimatedTime?.toString()}
                                onChangeText={handleTimeChange}
                                keyboardType="numeric"
                                placeholder="5"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                            />
                        </View>

                        <View style={styles.setsContainer}>
                            <View style={styles.setsHeader}>
                                <Text style={styles.setsTitle}>Sets</Text>
                                <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
                                    <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                                </TouchableOpacity>
                            </View>

                            {exercise.sets.map((set, index) => (
                                <View key={index} style={styles.setCard}>
                                    <LinearGradient
                                        colors={['#2A2A2A', '#1A1A1A']}
                                        style={styles.setGradient}
                                    >
                                        <View style={styles.setHeader}>
                                            <Text style={styles.setNumber}>Set {index + 1}</Text>
                                            {exercise.sets.length > 1 && (
                                                <TouchableOpacity
                                                    style={styles.removeSetButton}
                                                    onPress={() => removeSet(index)}
                                                >
                                                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        <View style={styles.setInputs}>
                                            <View style={styles.inputWrapper}>
                                                <Text style={styles.inputLabel}>Reps</Text>
                                                <TextInput
                                                    style={styles.setInput}
                                                    value={set.reps.toString()}
                                                    onChangeText={(value) => handleSetChange(index, 'reps', value)}
                                                    keyboardType="numeric"
                                                    placeholder="0"
                                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                                />
                                            </View>

                                            <View style={styles.inputWrapper}>
                                                <Text style={styles.inputLabel}>Weight (kg)</Text>
                                                <TextInput
                                                    style={styles.setInput}
                                                    value={set.weight.toString()}
                                                    onChangeText={(value) => handleSetChange(index, 'weight', value)}
                                                    keyboardType="numeric"
                                                    placeholder="0"
                                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                                />
                                            </View>

                                            <View style={styles.inputWrapper}>
                                                <Text style={styles.inputLabel}>Rest (sec)</Text>
                                                <TextInput
                                                    style={styles.setInput}
                                                    value={set.restTime?.toString()}
                                                    onChangeText={(value) => handleSetChange(index, 'restTime', value)}
                                                    keyboardType="numeric"
                                                    placeholder="60"
                                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                                />
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </View>
                            ))}
                        </View>
                    </View>
                </Animated.ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        zIndex: 1000,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 50,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#007AFF',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: HEADER_HEIGHT,
        paddingBottom: 40,
    },
    content: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
    },
    setsContainer: {
        marginTop: 8,
    },
    setsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    setsTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    addSetButton: {
        padding: 8,
    },
    setCard: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    setGradient: {
        padding: 16,
    },
    setHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    setNumber: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    removeSetButton: {
        padding: 8,
    },
    setInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputWrapper: {
        flex: 1,
        marginHorizontal: 4,
    },
    inputLabel: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 8,
        opacity: 0.7,
    },
    setInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default EditExerciseScreen;
