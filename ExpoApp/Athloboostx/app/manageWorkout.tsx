import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
    Platform,
    StatusBar,
    Dimensions, Alert
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {SaveWorkout,DeleteWorkout} from "@/serviceLayer/managerHandler";
import Status from "@/serviceLayer/status";

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === 'ios' ? 100 : 80;

interface Exercise {
    id: number;
    name: string;
    sets: {
        reps: number;
        weight: number;
        restTime: number;
    }[];
    estimatedTime: number;
}

interface Workout {
    id: number;
    title: string;
    exercises: Exercise[];
    exercise?: Exercise; // Optional property for editing
}

export default function ManageWorkoutScreen() {
    const params = useLocalSearchParams();
    const edit = params.edit || 'false';
    const isNew = edit === 'true';
    const workoutData = params.workout ? JSON.parse(decodeURIComponent(params.workout as string)) as Workout : null;
    
    const generateId = () => Math.floor(Math.random() * 2147483647); // Max int32 value
    
    const [workout, setWorkout] = useState<Workout>(() => {
        if (workoutData) {
            return {
                id: workoutData.id || 0,
                title: workoutData.title || '',
                exercises: workoutData.exercises?.map(ex => ({
                    ...ex,
                    id: ex.id || generateId(),
                    sets: ex.sets || [{ reps: 0, weight: 0, restTime: 60 }]
                })) || [],
            };
        }
        
        return {
            id: 0,
            title: '',
            exercises: [],
        };
    });
    
    const [isEditing, setIsEditing] = useState(isNew);
    const scrollY = new Animated.Value(0);

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const handleDragEnd = ({ data }: { data: Exercise[] }) => {
        setWorkout(prev => ({ ...prev, exercises: data }));
    };

    const handleAddExercise = () => {
        const newExercise: Exercise = {
            id: generateId(), // Use the new ID generator
            name: '',
            sets: [{ reps: 0, weight: 0, restTime: 60 }],
            estimatedTime: 5
        };
        setWorkout(prev => ({
            ...prev,
            exercises: [...prev.exercises, newExercise]
        }));
    };
    const handleDeleteWorkout= async () => {
        try {
            const res = await DeleteWorkout(workout.id);
            if(!res || res !== Status.OK){
                Alert.alert("Something went wrong!");
            }else{
                router.push('/(tabs)');
            }
        }
        catch (err){
            Alert.alert('Something went wrong.');
        }
    };
    const handleEditExercise = (exerciseId: number) => {
        const exercise = workout.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        router.push({
            pathname: '/editExercise',
            params: { 
                workoutId: workout.id,
                exerciseId: exerciseId,
                exercise: encodeURIComponent(JSON.stringify(exercise)),
                workout: encodeURIComponent(JSON.stringify(workout)) // Pass the entire workout
            }
        });
    };

    const handleSave = async () => {
        try {
            const res = await SaveWorkout(workout);
            if(!res || res !== Status.OK){
                Alert.alert("Something went wrong!");
            }
        }
        catch (err){
            Alert.alert('Something went wrong.');
        }
        setIsEditing(false);
    };

    const calculateTotalTime = () => {
        return workout.exercises.reduce((total, exercise) => {
            const exerciseTime = exercise.estimatedTime || 5;
            const restTime = exercise.sets.reduce((setTotal, set) => setTotal + (set.restTime || 60), 0);
            return total + exerciseTime + (restTime / 60);
        }, 0);
    };

    const renderHeader = () => (
        <View style={styles.workoutInfo}>
            <TextInput
                style={styles.workoutNameInput}
                value={workout.title}
                onChangeText={(text) => setWorkout(prev => ({ ...prev, title: text }))}
                placeholder="Enter workout name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                editable={isEditing}
            />
            <View style={styles.timeEstimate}>
                <Ionicons name="time-outline" size={20} color="#fff" />
                <Text style={styles.timeEstimateText}>
                    Estimated time: {calculateTotalTime().toFixed(0)} minutes
                </Text>
            </View>
        </View>
    );

    const renderFooter = () => (
        isEditing ? (<View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
                <LinearGradient
                    colors={['#007AFF', '#0055FF']}
                    style={styles.addButtonGradient}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Add Exercise</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeButton} onPress={handleDeleteWorkout}>
                <LinearGradient
                    colors={['#ff0055', '#fd2055']}
                    style={styles.removeButtonGradient}
                >
                    <Ionicons name="trash-outline" size={24} color="#fff" />
                    <Text style={styles.removeButtonText}>Delete Workout</Text>
                </LinearGradient>
            </TouchableOpacity>
            </View>
        ) : null
    );

    const renderItem = ({ item, drag, isActive }: { item: Exercise; drag: () => void; isActive: boolean }) => (
        <ScaleDecorator>
            <TouchableOpacity
                onLongPress={isEditing ? drag : undefined}
                delayLongPress={200}
                style={[
                    styles.exerciseCard,
                    isActive && styles.exerciseCardActive
                ]}
                onPress={() => isEditing ? handleEditExercise(item.id) : null}
            >
                <LinearGradient
                    colors={['#2A2A2A', '#1A1A1A']}
                    style={styles.exerciseGradient}
                >
                    <View style={styles.exerciseHeader}>
                        <Text style={styles.exerciseName}>{item.name || 'New Exercise'}</Text>
                        {isEditing && (
                            <TouchableOpacity 
                                style={styles.deleteButton}
                                onPress={() => {
                                    setWorkout(prev => ({
                                        ...prev,
                                        exercises: prev.exercises.filter(ex => ex.id !== item.id)
                                    }));
                                }}
                            >
                                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.exerciseInfo}>
                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={16} color="#fff" />
                            <Text style={styles.infoText}>{item.estimatedTime || 5} min</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="fitness-outline" size={16} color="#fff" />
                            <Text style={styles.infoText}>{item.sets.length} sets</Text>
                        </View>
                    </View>
                    <View style={styles.setsContainer}>
                        {item.sets.map((set, setIndex) => (
                            <View key={`${item.id}-set-${setIndex}`} style={styles.setItem}>
                                <Text style={styles.setNumber}>Set {setIndex + 1}</Text>
                                <Text style={styles.setDetails}>
                                    {set.reps} reps × {set.weight} kg
                                </Text>
                                <Text style={styles.restTime}>
                                    Rest: {set.restTime || 60}s
                                </Text>
                            </View>
                        ))}
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </ScaleDecorator>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Animated.View style={[styles.header]}>
                    <BlurView intensity={80} style={StyleSheet.absoluteFill} />
                    <View style={styles.headerContent}>
                        <TouchableOpacity 
                            onPress={() => router.push('/(tabs)')}
                            style={styles.backButton}
                        >
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Workout Plan</Text>
                        <TouchableOpacity 
                            style={styles.editButton} 
                            onPress={() => {
                                if (isEditing) {
                                    handleSave();
                                } else {
                                    setIsEditing(true);
                                }
                            }}
                        >
                            <Text style={styles.editButtonText}>
                                {isEditing ? 'Done' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <DraggableFlatList
                    data={workout.exercises}
                    onDragEnd={handleDragEnd}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={styles.scrollContent}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        zIndex: 1000,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
        backgroundColor: 'rgba(0,0,0,0.5)',
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
    editButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    scrollContent: {
        paddingTop: HEADER_HEIGHT,
        paddingBottom: 40,
    },
    workoutInfo: {
        padding: 20,
        paddingBottom: 0,
    },
    workoutNameInput: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    timeEstimate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    timeEstimateText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    exerciseCard: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    exerciseCardActive: {
        transform: [{ scale: 1.02 }],
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    exerciseGradient: {
        padding: 16,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    exerciseName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    exerciseInfo: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    infoText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 4,
        opacity: 0.7,
    },
    deleteButton: {
        padding: 8,
    },
    setsContainer: {
        marginTop: 8,
    },
    setItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    setNumber: {
        color: '#fff',
        fontSize: 16,
    },
    setDetails: {
        color: '#fff',
        fontSize: 16,
        opacity: 0.7,
    },
    restTime: {
        color: '#007AFF',
        fontSize: 14,
    },
    addButton: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    addButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    removeButton: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    removeButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
});
