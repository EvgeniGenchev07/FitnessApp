import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { HttpPatchProfile } from '@/serviceLayer/httpManager';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { RenderItemParams } from 'react-native-draggable-flatlist';

interface Schedule {
    workouts: Workout[];
    startDate: number;
    restDays: number[];
}

interface Workout {
    id: string;
    title: string;
    exercises: Array<{
        name: string;
        sets: number;
        reps: number;
        weight: number;
    }>;
    bgColor: string;
    image?: string;
}

export default function ScheduleScreen() {
    const [schedule, setSchedule] = useState<Schedule>({
        workouts: [],
        startDate: Date.now(),
        restDays: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const { colors } = useTheme();
    const { t } = useLanguage();

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        try {
            setIsLoading(true);
            const storedWorkouts = await AsyncStorage.getItem('workouts');
            const storedSchedule = await AsyncStorage.getItem('schedule');
            
            let workouts: Workout[] = [];
            let restDays: number[] = [];
            
            if (storedWorkouts) {
                const parsedWorkouts = JSON.parse(storedWorkouts);
                if (Array.isArray(parsedWorkouts)) {
                    workouts = parsedWorkouts.filter((workout): workout is Workout => 
                        workout && 
                        typeof workout === 'object' &&
                        'id' in workout &&
                        'title' in workout &&
                        'exercises' in workout
                    );
                }
            }

            if (storedSchedule) {
                const parsedSchedule = JSON.parse(storedSchedule);
                if (parsedSchedule && Array.isArray(parsedSchedule.restDays)) {
                    restDays = parsedSchedule.restDays;
                } else {
                    // Initialize restDays array with zeros if not found
                    restDays = new Array(workouts.length).fill(0);
                }
            } else {
                // Initialize restDays array with zeros if no schedule exists
                restDays = new Array(workouts.length).fill(0);
            }

            setSchedule({
                workouts,
                startDate: Date.now(),
                restDays
            });
        } catch (error) {
            console.error('Error loading schedule:', error);
            setSchedule({
                workouts: [],
                startDate: Date.now(),
                restDays: []
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updateSchedule = async (updatedWorkouts: Workout[], updatedRestDays: number[]) => {
        try {
            if (!Array.isArray(updatedWorkouts) || !Array.isArray(updatedRestDays)) {
                throw new Error('Invalid schedule data');
            }

            const newSchedule: Schedule = {
                workouts: updatedWorkouts,
                startDate: schedule.startDate,
                restDays: updatedRestDays
            };

            // Save to AsyncStorage
            await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
            await AsyncStorage.setItem('schedule', JSON.stringify(newSchedule));

            // Update backend
            const email = await AsyncStorage.getItem('email');
            if (email) {
                await HttpPatchProfile({
                    email,
                    workouts: JSON.stringify(updatedWorkouts),
                    schedule: JSON.stringify(newSchedule)
                });
            }

            setSchedule(newSchedule);
        } catch (error) {
            console.error('Error updating schedule:', error);
            Alert.alert(t('common.error'), t('schedule.updateError'));
        }
    };

    const handleDragEnd = ({ data }: { data: Workout[] }) => {
        if (Array.isArray(data)) {
            // Reorder restDays array to match the new workout order
            const newRestDays = data.map((_, index) => schedule.restDays[index] || 0);
            updateSchedule(data, newRestDays);
        }
    };

    const handleRestDaysChange = async (workoutIndex: number, restDays: number) => {
        if (restDays < 0 || workoutIndex < 0 || workoutIndex >= schedule.restDays.length) return;
        
        const newRestDays = [...schedule.restDays];
        newRestDays[workoutIndex] = Math.max(0, restDays);
        
        await updateSchedule(schedule.workouts, newRestDays);
    };

    const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<Workout>) => {
        if (!item || !item.id) return null;

        const index = getIndex();
        if (typeof index !== 'number') return null;

        const restDays = schedule.restDays[index] || 0;

        return (
            <View style={styles.workoutContainer}>
                {/* Workout Card */}
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.workoutItem,
                        { 
                            backgroundColor: isActive ? colors.tint + '20' : colors.card,
                            borderColor: colors.tint
                        }
                    ]}
                >
                    <View style={styles.workoutHeader}>
                        <View style={styles.dragHandle}>
                            <Ionicons name="reorder-three" size={24} color={colors.text} />
                        </View>
                        <ThemedText style={styles.workoutTitle}>
                            {item.title || t('schedule.untitledWorkout')}
                        </ThemedText>
                    </View>

                    <View style={styles.workoutPreview}>
                        <ThemedText style={styles.exerciseCount}>
                            {`${item.exercises?.length || 0} ${t('schedule.exercises')}`}
                        </ThemedText>
                    </View>
                </TouchableOpacity>

                {/* Rest Days Card */}
                <View style={[
                    styles.restDaysCard,
                    { backgroundColor: colors.card + '80' ,
                    }
                ]}>
                    <View style={styles.restDaysHeader}>
                        <Ionicons name="time-outline" size={20} color={colors.text} />
                        <ThemedText style={styles.restDaysTitle}>
                            {t('schedule.restDays')}
                        </ThemedText>
                    </View>
                    <View style={[styles.restDaysInputContainer, { borderColor: colors.tint, borderWidth: 1 }]}>
                        <TouchableOpacity 
                            style={styles.restDaysButton}
                            onPress={() => handleRestDaysChange(index, Math.max(0, restDays - 1))}
                        >
                            <Ionicons name="remove" size={20} color={colors.text} />
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.restDaysInput, { color: colors.text }]}
                            value={restDays.toString()}
                            keyboardType="number-pad"
                            onChangeText={(text) => {
                                const value = parseInt(text) || 0;
                                handleRestDaysChange(index, value);
                            }}
                        />
                        <TouchableOpacity 
                            style={styles.restDaysButton}
                            onPress={() => handleRestDaysChange(index, restDays + 1)}
                        >
                            <Ionicons name="add" size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>
                    {t('schedule.manageSchedule')}
                </ThemedText>
            </View>

            <View style={styles.content}>
                <ThemedText style={styles.instructions}>
                    {t('schedule.dragToReorder')}
                </ThemedText>

                {schedule.workouts.length > 0 ? (
                    <DraggableFlatList
                        data={schedule.workouts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id || Math.random().toString()}
                        onDragEnd={handleDragEnd}
                        contentContainerStyle={styles.listContainer}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>
                            {t('schedule.noWorkouts')}
                        </ThemedText>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    instructions: {
        marginBottom: 20,
        opacity: 0.7,
    },
    listContainer: {
        paddingBottom: 20,
    },
    workoutContainer: {
        marginBottom: 15,
    },
    workoutItem: {
        borderRadius: 15,
        padding: 15,
        borderWidth: 2,
        marginBottom: 8,
    },
    workoutHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dragHandle: {
        marginRight: 10,
    },
    workoutTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    workoutPreview: {
        marginTop: 5,
    },
    exerciseCount: {
        opacity: 0.7,
    },
    restDaysCard: {
        borderRadius: 12,
        borderWidth: 2,
        padding: 12,
    },
    restDaysHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    restDaysTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    restDaysInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 5,
        justifyContent: 'center',
    },
    restDaysButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    restDaysInput: {
        width: 40,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        opacity: 0.7,
        textAlign: 'center',
    },
}); 