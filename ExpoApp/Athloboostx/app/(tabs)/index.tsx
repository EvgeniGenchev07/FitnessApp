import React, {useEffect,useCallback, useState} from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Alert,
    ViewStyle,
    TextStyle,
    Animated,
    PanResponder,
    Dimensions,
    Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import {ThemedText} from "@/components/ThemedText";
import {router, useFocusEffect} from "expo-router";
import {LinearGradient} from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HttpPatchProfile } from '@/serviceLayer/httpManager';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Exercise {
    name: string;
    sets: {
        reps: number;
        weight: number;
        restTime: number;
    }[];
    estimatedTime: number;
}

interface Workout {
    id: string;
    title: string;
    exercises: Array<Exercise>;
    order: number;     // Order in the schedule
    lastCompleted?: string; // Last date this workout was completed
}

interface Schedule {
    workouts: Workout[];
    startDate: number;
    restDays: number[];
}

interface UserProfile {
    userName: string;
    photo: string;
    workouts: Workout[];
    schedule: Schedule | null;
}

interface HorizontalCalendarProps {
    onDateSelect: (date: string, isRestDay: boolean) => void;
    schedule: Schedule | null;
    onUpdateSchedule: (updatedSchedule: Schedule) => void;
}

interface WorkoutTimer {
    isActive: boolean;
    currentExercise: number;
    currentSet: number;
    timeRemaining: number;
    isResting: boolean;
    isPaused: boolean;
}

interface WorkoutModalProps {
    visible: boolean;
    onClose: () => void;
    workout: Workout;
    colors: any;
    t: (key: string) => string;
}

const getWorkoutForDate = (date: moment.Moment, schedule: Schedule | null): { workout: Workout | null; isRestDay: boolean } => {
    if (!schedule?.workouts?.length) return { workout: null, isRestDay: false };
    
    const startDate = moment(schedule.startDate).startOf('day');
    const currentDate = date.startOf('day');
    const daysDiff = currentDate.diff(startDate, 'days');
    
    // If it's the start date, return the first workout
    if (daysDiff === 0) {
        return { workout: schedule.workouts[0], isRestDay: false };
    }
    
    // If daysDiff is negative, return the first workout
    if (daysDiff < 0) {
        return { workout: schedule.workouts[0], isRestDay: false };
    }

    // Calculate which day in the cycle this is (starting from day 1)
    let totalDaysInCycle = 0;
    schedule.workouts.forEach((_, index) => {
        totalDaysInCycle += 1; // Workout day
        totalDaysInCycle += schedule.restDays[index] || 0; // Rest days
    });

    // Get the day number within the current cycle (1-based, since day 0 is handled above)
    const dayInCycle = ((daysDiff - 1) % totalDaysInCycle) + 1;

    // Find which workout this day corresponds to
    let currentDay = 0;
    for (let i = 0; i < schedule.workouts.length; i++) {
        // If this is a workout day
        if (dayInCycle === currentDay) {
            return { workout: schedule.workouts[i], isRestDay: false };
        }
        
        // Move to the rest days
        currentDay++;
        
        // Check if we're in the rest days after this workout
        const restDays = schedule.restDays[i] || 0;
        if (dayInCycle >= currentDay && dayInCycle < currentDay + restDays) {
            return { workout: null, isRestDay: true };
        }
        
        // Move past the rest days
        currentDay += restDays;
    }

    // If we somehow get here, return the first workout
    return { workout: schedule.workouts[0], isRestDay: false };
};

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({ onDateSelect, schedule, onUpdateSchedule }) => {
    const [selectedDate, setSelectedDate] = useState(moment());
    const { colors } = useTheme();
    const { t } = useLanguage();

    const generateDates = () => {
        let dates = [];
        for (let i = -3; i <= 10; i++) {
            dates.push(moment().add(i, 'days'));
        }
        return dates;
    };

    const dates = generateDates();

    const handleDatePress = (date: moment.Moment) => {
        setSelectedDate(date);
        const { workout, isRestDay } = getWorkoutForDate(date, schedule);
        if (onDateSelect) onDateSelect(date.format('YYYY-MM-DD'), isRestDay);
    };

    return (
        <View style={styles.calendarSection}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContainer}
            >
                {dates.map((date, index) => {
                    const isSelected = selectedDate.isSame(date, 'day');
                    const { workout, isRestDay } = getWorkoutForDate(date, schedule);
                    const isToday = date.isSame(moment(), 'day');
                    
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dateItem, 
                                isSelected && styles.selectedDateItem,
                                isToday && styles.todayDateItem,
                                { 
                                    backgroundColor: isSelected 
                                        ? (colors.tint)
                                        : isToday 
                                            ? colors.card + '80'
                                            : colors.card 
                                }
                            ]}
                            onPress={() => handleDatePress(date)}
                        >
                            <ThemedText style={[
                                styles.dayText, 
                                isSelected && styles.selectedDayText,
                                isToday && !isSelected && styles.todayDayText
                            ]}>
                                {date.format('ddd')}
                            </ThemedText>
                            <ThemedText style={[
                                styles.dateText, 
                                isSelected && styles.selectedDateText,
                                isToday && !isSelected && styles.todayDateText
                            ]}>
                                {date.format('D')}
                            </ThemedText>
                            {!isRestDay && workout && (
                                <View style={[
                                    styles.workoutIndicator,
                                    { backgroundColor: colors.tint }
                                ]} />
                            )}
                            {isRestDay && (
                                <View style={[
                                    styles.restDayIndicator,
                                    { backgroundColor: colors.text + '80' }
                                ]} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

interface ScheduleManagerProps {
    workouts: Workout[];
    onUpdateSchedule: (updatedWorkouts: Workout[]) => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ workouts, onUpdateSchedule }) => {
    const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
    const { colors } = useTheme();
    const { t } = useLanguage();

    const handleReorder = (fromIndex: number, toIndex: number): void => {
        const newWorkouts = [...workouts];
        const [movedWorkout] = newWorkouts.splice(fromIndex, 1);
        newWorkouts.splice(toIndex, 0, movedWorkout);
        
        // Update order property for all workouts
        const updatedWorkouts = newWorkouts.map((workout: Workout, index: number) => ({
            ...workout,
            order: index
        }));
        
        onUpdateSchedule(updatedWorkouts);
    };

    const handleRestDaysChange = (workoutId: string, restDays: number): void => {
        const updatedWorkouts = workouts.map((workout: Workout) => 
            workout.id === workoutId 
                ? { ...workout, restDays } 
                : workout
        );
        onUpdateSchedule(updatedWorkouts);
    };

    return (
        <View style={styles.scheduleManager}>
            <ThemedText style={styles.sectionTitle}>{t('schedule.manageSchedule')}</ThemedText>
            <ScrollView style={styles.scheduleList}>
                {workouts.map((workout: Workout, index: number) => (
                    <View key={workout.id} style={styles.scheduleItem}>
                        <View style={styles.workoutInfo}>
                            <TouchableOpacity 
                                style={styles.reorderButton}
                                onPress={() => setEditingWorkout(workout)}
                            >
                                <Ionicons name="reorder-three" size={24} color={colors.text} />
                            </TouchableOpacity>
                            <ThemedText style={styles.workoutTitle}>{workout.title}</ThemedText>
                        </View>
                        <View style={styles.restDaysControl}>
                            <ThemedText style={styles.restDaysLabel}>
                                {t('schedule.restDays')}:
                            </ThemedText>
                            <View style={styles.restDaysButtons}>
                                <TouchableOpacity 
                                    style={styles.restDaysButton}
                                    onPress={() => handleRestDaysChange(workout.id, Math.max(0, workout.restDays - 1))}
                                >
                                    <Ionicons name="remove" size={20} color={colors.text} />
                                </TouchableOpacity>
                                <ThemedText style={styles.restDaysValue}>
                                    {workout.restDays}
                                </ThemedText>
                                <TouchableOpacity 
                                    style={styles.restDaysButton}
                                    onPress={() => handleRestDaysChange(workout.id, workout.restDays + 1)}
                                >
                                    <Ionicons name="add" size={20} color={colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
            
            {editingWorkout && (
                <Modal
                    visible={!!editingWorkout}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setEditingWorkout(null)}
                >
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <ThemedText style={styles.modalTitle}>
                                {t('schedule.reorderWorkouts')}
                            </ThemedText>
                            <ScrollView style={styles.reorderList}>
                                {workouts.map((workout: Workout, index: number) => (
                                    <TouchableOpacity
                                        key={workout.id}
                                        style={styles.reorderItem}
                                        onPress={() => {
                                            handleReorder(
                                                workouts.findIndex((w: Workout) => w.id === editingWorkout.id),
                                                index
                                            );
                                            setEditingWorkout(null);
                                        }}
                                    >
                                        <ThemedText style={styles.reorderItemText}>
                                            {workout.title}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setEditingWorkout(null)}
                            >
                                <ThemedText style={styles.closeButtonText}>
                                    {t('common.close')}
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const WorkoutTimer: React.FC<{
    workout: Workout;
    onComplete: () => void;
    colors: any;
    t: (key: string) => string;
}> = ({ workout, onComplete, colors, t }) => {
    const [timer, setTimer] = useState<WorkoutTimer>({
        isActive: true,
        currentExercise: 0,
        currentSet: 0,
        timeRemaining: 0,
        isResting: false,
        isPaused: false
    });
    const [exerciseStartTime, setExerciseStartTime] = useState<number>(Date.now());
    const [totalTime, setTotalTime] = useState<number>(0);
    const [animation] = useState(new Animated.Value(0));

    const exercise = workout.exercises[timer.currentExercise];
    const currentSet = exercise.sets[timer.currentSet];
    const isLastSet = timer.currentSet === exercise.sets.length - 1;
    const isLastExercise = timer.currentExercise === workout.exercises.length - 1;

    // Single effect to handle all timer logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        
        if (timer.isActive && !timer.isPaused) {
            if (timer.timeRemaining > 0) {
                // Countdown timer
                interval = setInterval(() => {
                    setTimer(prev => ({
                        ...prev,
                        timeRemaining: prev.timeRemaining - 1
                    }));
                }, 1000);
            } else {
                // Timer reached zero - handle transition
                if (timer.isResting) {
                    // Rest period ended, start next set
                    if (isLastSet) {
                        if (isLastExercise) {
                            // Workout complete
                            setTimer(prev => ({ ...prev, isActive: false }));
                            onComplete();
                        } else {
                            // Move to next exercise
                            const nextExercise = workout.exercises[timer.currentExercise + 1];
                            const nextSetDuration = nextExercise.sets[0].reps * 5; // 5 seconds per rep
                            setTimer(prev => ({
                                ...prev,
                                currentExercise: prev.currentExercise + 1,
                                currentSet: 0,
                                isResting: false,
                                timeRemaining: nextSetDuration,
                                isPaused: false
                            }));
                            startAnimation(nextSetDuration);
                        }
                    } else {
                        // Start next set
                        const nextSetDuration = exercise.sets[timer.currentSet + 1].reps * 5; // 5 seconds per rep
                        setTimer(prev => ({
                            ...prev,
                            currentSet: prev.currentSet + 1,
                            isResting: false,
                            timeRemaining: nextSetDuration,
                            isPaused: false
                        }));
                        startAnimation(nextSetDuration);
                    }
                } else {
                    // Set completed, start rest period
                    const restTime = currentSet?.restTime || 90;
                    setTimer(prev => ({
                        ...prev,
                        isResting: true,
                        timeRemaining: restTime,
                        isPaused: false
                    }));
                    startAnimation(restTime);
                }
            }
        }
        return () => clearInterval(interval);
    }, [timer.isActive, timer.timeRemaining, timer.isResting, timer.isPaused, isLastSet, isLastExercise, currentSet, exercise]);

    const togglePause = () => {
        if (timer.isPaused) {
            resumeAnimation(timer.timeRemaining);
        } else {
            pauseAnimation();
        }
        setTimer(prev => ({
            ...prev,
            isPaused: !prev.isPaused
        }));
    };

    const completeSet = () => {
        if (!timer.isResting) {
            const restTime = currentSet?.restTime || 90;
            setTimer(prev => ({
                ...prev,
                isResting: true,
                timeRemaining: restTime,
                isPaused: false
            }));
            startAnimation(restTime);
        }
    };

    const startWorkout = () => {
        if (!currentSet) return;
        
        // Start with the first set
        setTimer({
            isActive: true,
            currentExercise: 0,
            currentSet: 0,
            timeRemaining: currentSet.reps * 5, // 5 seconds per rep
            isResting: false,
            isPaused: false
        });
        setExerciseStartTime(Date.now());
        startAnimation(currentSet.reps * 5);
    };

    const startAnimation = (duration: number) => {
        animation.setValue(0);
        Animated.timing(animation, {
            toValue: 1,
            duration: duration * 1000,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();
    };

    const pauseAnimation = () => {
        animation.stopAnimation();
    };

    const resumeAnimation = (remainingTime: number) => {
        Animated.timing(animation, {
            toValue: 1,
            duration: remainingTime * 1000,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
        const completedSets = workout.exercises
            .slice(0, timer.currentExercise)
            .reduce((sum, ex) => sum + ex.sets, 0) + timer.currentSet;
        return (completedSets / totalSets) * 100;
    };

    const formatExerciseDetails = (exercise: Exercise) => {
        const totalReps = exercise.sets.reduce((acc, set) => acc + set.reps, 0);
        const totalWeight = exercise.sets.reduce((acc, set) => acc + (set.weight || 0), 0);
        return `${exercise.sets.length}x${totalReps}${totalWeight > 0 ? ` @ ${totalWeight}kg` : ''}`;
    };

    return (
        <ScrollView 
            style={[styles.workoutTimerContainer, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.workoutTimerContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.timerHeader, { minHeight: 180 }]}>
                <View style={[styles.timerTimeContainer, { 
                    flex: 1,
                    paddingRight: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
                }]}>
                    <ThemedText style={[styles.timerText, { 
                        fontSize: 60,
                        lineHeight: 65,
                        color: colors.text,
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 4,
                        fontVariant: ['tabular-nums'],
                        letterSpacing: 1
                    }]}>
                        {timer.timeRemaining === 0 && !timer.isResting ? 'GO!' : formatTime(timer.timeRemaining)}
                    </ThemedText>
                </View>
                <View style={[styles.circularTimer, { 
                    width: 160,
                    height: 160,
                    justifyContent: 'center',
                    alignItems: 'center'
                }]}>
                    <Svg width={160} height={160}>
                        {/* Background circle */}
                        <Circle
                            cx={80}
                            cy={80}
                            r={70}
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth={12}
                            fill="none"
                        />
                        {/* Progress circle */}
                        <AnimatedCircle
                            cx={80}
                            cy={80}
                            r={70}
                            stroke={colors.tint}
                            strokeWidth={12}
                            fill="none"
                            strokeDasharray="439.82"
                            strokeDashoffset={animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [439.82, 0]
                            })}
                            transform={`rotate(-90, 80, 80)`}
                        />
                    </Svg>
                    <TouchableOpacity 
                        style={[styles.playPauseButton, { 
                            position: 'absolute',
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: colors.tint,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5
                        }]}
                        onPress={togglePause}
                    >
                        <Ionicons 
                            name={timer.isPaused ? "play" : "pause"} 
                            size={32} 
                            color="white" 
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.currentExercise, { 
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 20,
                marginTop: 30,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
            }]}>
                <ThemedText style={[styles.exerciseTitle, { 
                    fontSize: 28,
                    color: colors.text,
                    marginBottom: 15
                }]}>
                    {exercise.name}
                </ThemedText>
                {currentSet && (
                    <>
                        {timer.isResting ? (
                            <View style={[styles.restTimeInfo, {
                                backgroundColor: colors.tint + '20',
                                padding: 20,
                                borderRadius: 12,
                                alignItems: 'center'
                            }]}>
                                <Ionicons name="time-outline" size={32} color={colors.tint} />
                                <ThemedText style={[styles.restTimeText, {
                                    fontSize: 24,
                                    color: colors.text,
                                    marginTop: 12,
                                    textAlign: 'center'
                                }]}>
                                    {t('workout.restBetweenSets')}
                                </ThemedText>
                                <ThemedText style={[styles.restTimeCountdown, {
                                    fontSize: 36,
                                    color: colors.tint,
                                    marginTop: 8,
                                    fontWeight: 'bold'
                                }]}>
                                    {timer.timeRemaining}s
                                </ThemedText>
                            </View>
                        ) : (
                            <>
                                <ThemedText style={[styles.setInfo, { 
                                    fontSize: 20,
                                    color: colors.text,
                                    opacity: 0.8,
                                    marginBottom: 20
                                }]}>
                                    {`${t('workout.set')} ${timer.currentSet + 1}/${exercise.sets.length}`}
                                </ThemedText>
                                <View style={[styles.currentSetInfo, {
                                    backgroundColor: colors.tint + '20',
                                    padding: 15,
                                    borderRadius: 12,
                                    marginBottom: 20
                                }]}>
                                    <View style={styles.currentSetRow}>
                                        <Ionicons name="repeat" size={24} color={colors.tint} />
                                        <ThemedText style={[styles.currentSetText, { 
                                            fontSize: 18,
                                            color: colors.text,
                                            marginLeft: 12
                                        }]}>
                                            {`${currentSet.reps} ${t('workout.reps')}`}
                                        </ThemedText>
                                    </View>
                                    {currentSet.weight > 0 && (
                                        <View style={styles.currentSetRow}>
                                            <Ionicons name="barbell" size={24} color={colors.tint} />
                                            <ThemedText style={[styles.currentSetText, { 
                                                fontSize: 18,
                                                color: colors.text,
                                                marginLeft: 12
                                            }]}>
                                                {`${currentSet.weight}kg`}
                                            </ThemedText>
                                        </View>
                                    )}
                                    <View style={styles.currentSetRow}>
                                        <Ionicons name="time-outline" size={24} color={colors.tint} />
                                        <ThemedText style={[styles.currentSetText, { 
                                            fontSize: 18,
                                            color: colors.text,
                                            marginLeft: 12
                                        }]}>
                                            {`${currentSet.restTime}s ${t('workout.rest')}`}
                                        </ThemedText>
                                    </View>
                                </View>
                            </>
                        )}
                    </>
                )}
            </View>

            <View style={[styles.upcomingExercises, { marginTop: 30, marginBottom: 40 }]}>
                <ThemedText style={[styles.upcomingTitle, { 
                    fontSize: 22,
                    color: colors.text,
                    marginBottom: 15
                }]}>
                    {t('workout.upcomingExercises')}
                </ThemedText>
                {workout.exercises.slice(timer.currentExercise + 1).map((ex, index) => (
                    <View key={index} style={[styles.upcomingExercise, { 
                        padding: 20,
                        backgroundColor: colors.card,
                        borderRadius: 12,
                        marginBottom: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2
                    }]}>
                        <ThemedText style={[styles.upcomingExerciseName, { 
                            fontSize: 18,
                            color: colors.text,
                            marginBottom: 8
                        }]}>
                            {ex.name}
                        </ThemedText>
                        <ThemedText style={[styles.upcomingExerciseDetails, { 
                            fontSize: 16,
                            color: colors.text,
                            opacity: 0.8
                        }]}>
                            {formatExerciseDetails(ex)}
                        </ThemedText>
                    </View>
                ))}
            </View>

            {currentSet && !timer.isResting && (
                <TouchableOpacity 
                    style={[styles.completeSetButton, {
                        backgroundColor: colors.tint,
                        padding: 15,
                        borderRadius: 12,
                        alignItems: 'center',
                        marginTop: 20
                    }]}
                    onPress={completeSet}
                >
                    <ThemedText style={[styles.completeSetText, {
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 'bold'
                    }]}>
                        {t('workout.completeSet')}
                    </ThemedText>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const WorkoutModal: React.FC<WorkoutModalProps> = ({ visible, onClose, workout, colors, t }) => {
    const [pan] = useState(new Animated.ValueXY());
    const screenHeight = Dimensions.get('window').height;
    const modalHeight = screenHeight * 0.85;
    const [isClosing, setIsClosing] = useState(false);

    const completeWorkout = async () => {
        try {
            // Update local storage
            const storedSchedule = await AsyncStorage.getItem('schedule');
            if (storedSchedule) {
                const schedule = JSON.parse(storedSchedule);
                const newSchedule = {
                    ...schedule,
                    startDate: Date.now() // Reset the start date to now
                };
                await AsyncStorage.setItem('schedule', JSON.stringify(newSchedule));
                
                // Update backend
                const email = await AsyncStorage.getItem('email');
                if (email) {
                    await HttpPatchProfile({
                        email,
                        schedule: JSON.stringify(newSchedule)
                    });
                }
            }
        } catch (error) {
            console.error('Error completing workout:', error);
            Alert.alert(t('common.error'), t('schedule.updateError'));
        }
    };

    // Reset pan value when modal becomes visible
    useEffect(() => {
        if (visible) {
            pan.setValue({ x: 0, y: 0 });
            setIsClosing(false);
        }
    }, [visible]);

    const handleClose = () => {
        if (isClosing) return; // Prevent multiple close animations
        setIsClosing(true);
        onClose();
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            if (gesture.dy > 0 && !isClosing) { // Only allow dragging down if not closing
                pan.y.setValue(gesture.dy);
            }
        },
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dy > modalHeight * 0.3 && !isClosing) {
                // If dragged down more than 30% of modal height, close it
                setIsClosing(true);
                Animated.timing(pan, {
                    toValue: { x: 0, y: modalHeight },
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    handleClose();
                });
            } else {
                // Otherwise, snap back to top
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start();
            }
        },
    });

    const modalStyle = {
        transform: [{ translateY: pan.y }],
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View 
                    style={[
                        styles.workoutModalContent,
                        { 
                            backgroundColor: colors.card,
                            height: modalHeight,
                        },
                        modalStyle
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.modalHandle} />
                    <WorkoutTimer 
                        workout={workout}
                        onComplete={async () => {
                            await completeWorkout(); // Update the schedule
                            handleClose(); // Close the modal
                            router.replace('/'); // Navigate back to index page
                        }}
                        colors={colors}
                        t={t}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
};

const TodayWorkoutSection: React.FC<{
    schedule: Schedule | null;
    colors: any;
    t: (key: string) => string;
    selectedDate?: string;
    currentWorkout: Workout | null;
}> = ({ schedule, colors, t, selectedDate, currentWorkout }) => {
    if (currentWorkout) {
        return (
            <View style={styles.todayWorkoutCard}>
                <LinearGradient
                    colors={[colors.tint, colors.tint + '80']}
                    style={styles.todayWorkoutGradient}
                >
                    <View style={styles.workoutHeader}>
                        <ThemedText style={styles.todayWorkoutTitle}>
                            {currentWorkout.title}
                        </ThemedText>
                    </View>

                    <View style={styles.exercisesList}>
                        {currentWorkout.exercises.map((exercise, index) => (
                            <View 
                                key={index} 
                                style={styles.exerciseItem}
                            >
                                <View style={styles.exerciseContent}>
                                    <ThemedText style={styles.exerciseName}>
                                        {`${index + 1}. ${exercise.name}`}
                                    </ThemedText>
                                    <View style={styles.exerciseDetails}>
                                        <View style={styles.exerciseDetail}>
                                            <Ionicons name="repeat" size={16} color="white" />
                                            <ThemedText style={styles.exerciseDetailText}>
                                                {`${exercise.sets.reduce((acc, set) => acc + set.reps, 0)}`}
                                            </ThemedText>
                                        </View>
                                        <View style={styles.exerciseDetail}>
                                            <Ionicons name="fitness" size={16} color="white" />
                                            <ThemedText style={styles.exerciseDetailText}>
                                                {`${exercise.sets.length}`}
                                            </ThemedText>
                                        </View>
                                        <View style={styles.exerciseDetail}>
                                            <Ionicons name="time-outline" size={16} color="white" />
                                            <ThemedText style={styles.exerciseDetailText}>
                                                {`${exercise.estimatedTime} min`}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.todayWorkoutCard}>
            <LinearGradient
                colors={[colors.card, colors.card + '80']}
                style={styles.todayWorkoutGradient}
            >
                <ThemedText style={styles.noWorkoutText}>
                    {t('schedule.noWorkoutScheduled')}
                </ThemedText>
                <TouchableOpacity 
                    style={styles.createWorkoutButton}
                    onPress={() => router.push({
                        pathname: '/manageWorkout',
                        params: { edit: 'true' }
                    })}
                >
                    <ThemedText style={styles.createWorkoutText}>
                        {t('schedule.createWorkout')}
                    </ThemedText>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

export default function HomeScreen() {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRestDay, setIsRestDay] = useState(false);
    const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
    const { colors } = useTheme();
    const { t } = useLanguage();

    useEffect(() => {
        loadUserData();
    }, []);
    useFocusEffect(
        useCallback(() => {
            loadUserData();
        }, [])
    );

    const loadUserData = async () => {
        try {
            setLoading(true);
            let profile = await AsyncStorage.getItem('profile');
            let storedWorkouts = await AsyncStorage.getItem('workouts');
            let storedSchedule = await AsyncStorage.getItem('schedule');
            
            //@ts-ignore
            profile = JSON.parse(profile);
            
            let workouts: Workout[] = [];
            try {
                //@ts-ignore
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
            } catch {
                workouts = [];
            }
            
            let schedule: Schedule;
            try {
                //@ts-ignore
                const parsedSchedule = JSON.parse(storedSchedule);
                if (parsedSchedule && Array.isArray(parsedSchedule.restDays)) {
                    schedule = {
                        ...parsedSchedule,
                        workouts: workouts // Ensure we use the validated workouts
                    };
                } else {
                    schedule = {
                        workouts,
                        startDate: Date.now(),
                        restDays: new Array(workouts.length).fill(0)
                    };
                }
            } catch {
                schedule = {
                    workouts,
                    startDate: Date.now(),
                    restDays: new Array(workouts.length).fill(0)
                };
            }

            //@ts-ignore
            setUserData({...profile, workouts, schedule});
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date: string, isRestDay: boolean) => {
        const selectedMoment = moment(date).startOf('day');
        const { workout, isRestDay: restDay } = getWorkoutForDate(selectedMoment, userData?.schedule || null);
        
        const totalDaysInCycle = userData?.schedule?.workouts.reduce((total, _, i) => 
            total + 1 + (userData?.schedule?.restDays[i] || 0), 0) || 0;
        const dayInCycle = ((selectedMoment.diff(moment(userData?.schedule?.startDate).startOf('day'), 'days') - 1) % totalDaysInCycle) + 1;
        
        setSelectedDate(date);
        setIsRestDay(restDay);
        setCurrentWorkout(workout);
    };

    useEffect(() => {
        if (userData?.schedule) {
            const today = moment();
            const { workout, isRestDay: restDay } = getWorkoutForDate(today, userData.schedule);
            
            // Log for debugging
            console.log('Today:', today.format('YYYY-MM-DD'));
            console.log('Is Rest Day:', restDay);
            console.log('Today Workout:', workout?.title);
            
            setIsRestDay(restDay);
            setCurrentWorkout(workout);
            setSelectedDate(today.format('YYYY-MM-DD'));
        }
    }, [userData?.schedule]);

    const convertToImage = (photo: any) => {
        if (!photo) {
            return null;
        }
        try {
            if (typeof photo === 'string') {
                if (photo.startsWith('data:image')) {
                    return photo;
                }
                return `data:image/jpeg;base64,${photo}`;
            }
            if (Array.isArray(photo)) {
                const binaryString = photo.map(byte => String.fromCharCode(byte)).join('');
                const base64String = btoa(binaryString);
                return `data:image/jpeg;base64,${base64String}`;
            }
            return null;
        } catch (error) {
            console.error('Error converting photo:', error);
            return null;
        }
    };

    const updateSchedule = async (updatedSchedule: Schedule) => {
        try {
            // Ensure workouts are ordered correctly
            const orderedWorkouts = updatedSchedule.workouts.map((workout, index) => ({
                ...workout,
                order: index
            }));

            const finalSchedule = {
                ...updatedSchedule,
                workouts: orderedWorkouts
            };

            // Update local storage
            await AsyncStorage.setItem('schedule', JSON.stringify(finalSchedule));
            
            // Update backend
            const email = await AsyncStorage.getItem('email');
            if (email) {
                await HttpPatchProfile({
                    email,
                    schedule: JSON.stringify(finalSchedule)
                });
            }

            // Update local state
            setUserData(prev => prev ? {
                ...prev,
                schedule: finalSchedule
            } : null);

        } catch (error) {
            console.error('Error updating schedule:', error);
            Alert.alert(t('common.error'), t('schedule.updateError'));
        }
    };

    const getNextWorkout = (): Workout | null => {
        if (!userData?.schedule?.workouts?.length) return null;

        const schedule = userData.schedule;
        const now = moment();
        const startDate = moment(schedule.startDate);
        const daysDiff = now.diff(startDate, 'days');

        let totalDays = 0;
        schedule.workouts.forEach((_, index) => {
            totalDays += 1; // Workout day
            totalDays += schedule.restDays[index] || 0; // Rest days
        });

        // Normalize daysDiff to be within the cycle
        const normalizedDaysDiff = ((daysDiff % totalDays) + totalDays) % totalDays;

        let dayCounter = 0;
        for (let i = 0; i < schedule.workouts.length; i++) {
            // Check if this is the next workout day
            if (normalizedDaysDiff === dayCounter) {
                return schedule.workouts[i];
            }
            dayCounter++;

            // Skip rest days
            const restDays = schedule.restDays[i] || 0;
            dayCounter += restDays;
        }

        // If we've gone through all workouts, return the first one
        return schedule.workouts[0];
    };

    const completeWorkout = async () => {
        if (!userData?.schedule) return;

        const newSchedule: Schedule = {
            ...userData.schedule,
            startDate: Date.now() // Reset the start date to now
        };

        try {
            // Update local storage
            await AsyncStorage.setItem('schedule', JSON.stringify(newSchedule));
            
            // Update backend
            const email = await AsyncStorage.getItem('email');
            if (email) {
                await HttpPatchProfile({
                    email,
                    schedule: JSON.stringify(newSchedule)
                });
            }

            // Update local state
            setUserData(prev => prev ? {
                ...prev,
                schedule: newSchedule
            } : null);

        } catch (error) {
            console.error('Error completing workout:', error);
            Alert.alert(t('common.error'), t('schedule.updateError'));
        }
    };

    const handleStartWorkout = () => {
        const today = moment();
        const { workout } = getWorkoutForDate(today, userData?.schedule || null);
        if (workout) {
            setCurrentWorkout(workout); // Ensure workout is set before showing modal
            setIsModalVisible(true);
        } else {
            router.push({
                pathname: '/manageWorkout',
                params: { edit: 'true' }
            });
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.tint} />
            </View>
        );
    }

    const today = moment();
    const { workout: selectedWorkout } = getWorkoutForDate(today, userData?.schedule || null);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Image 
                    source={userData?.photo ? { uri: convertToImage(userData.photo) } : require('../../assets/images/man-avatar-icon-free-vector-3688420316.jpg')} 
                    style={styles.profilePic} 
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText style={styles.welcome}>{`${t('home.welcome')} ${userData?.userName || 'User'}`}</ThemedText>
                <ThemedText style={styles.subtitle}>{t('home.welcomeBack')}</ThemedText>

                <HorizontalCalendar 
                    onDateSelect={handleDateSelect}
                    schedule={userData?.schedule || null}
                    onUpdateSchedule={updateSchedule}
                />

                {!isRestDay && (
                    <TouchableOpacity 
                        style={styles.starterBox}
                        onPress={handleStartWorkout}
                    >
                        <LinearGradient
                            colors={[colors.tint, colors.tint + '80']}
                            style={styles.starterGradient}
                        >
                            <View style={styles.iconRow}>
                                <ThemedText style={styles.starterText}>
                                    {currentWorkout ? t('home.startWorkout') : t('schedule.createWorkout')}
                                </ThemedText>
                                <TouchableOpacity style={styles.starterIcon}>
                                    <Ionicons name="barbell" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {!isRestDay && (
                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>
                            {t('home.todaysWorkout')}
                        </ThemedText>
                    </View>
                )}

                {isRestDay ? (
                    <View style={styles.todayWorkoutCard}>
                        <LinearGradient
                            colors={[colors.card, colors.card + '80']}
                            style={styles.todayWorkoutGradient}
                        >
                            <View style={styles.restDayContent}>
                                <View style={styles.restDayIcon}>
                                    <Ionicons name="bed-outline" size={40} color={colors.text} />
                                </View>
                                <ThemedText style={styles.restDayTitleText}>
                                    {t('schedule.restDay')}
                                </ThemedText>
                                <ThemedText style={styles.restDayDescriptionText}>
                                    {t('schedule.restDayDescription')}
                                </ThemedText>
                                <View style={styles.restDayTips}>
                                    <View style={styles.restDayTip}>
                                        <Ionicons name="water-outline" size={20} color={colors.text} />
                                        <ThemedText style={styles.restDayTipText}>
                                            {t('schedule.restDayHydration')}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.restDayTip}>
                                        <Ionicons name="nutrition-outline" size={20} color={colors.text} />
                                        <ThemedText style={styles.restDayTipText}>
                                            {t('schedule.restDayNutrition')}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.restDayTip}>
                                        <Ionicons name="moon-outline" size={20} color={colors.text} />
                                        <ThemedText style={styles.restDayTipText}>
                                            {t('schedule.restDaySleep')}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                ) : (
                    <TodayWorkoutSection 
                        schedule={userData?.schedule || null}
                        colors={colors}
                        t={t}
                        selectedDate={selectedDate}
                        currentWorkout={currentWorkout}
                    />
                )}

                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>{t('home.trainingPath')}</ThemedText>
                    <TouchableOpacity onPress={() => router.push('/schedule')}>
                        <ThemedText style={styles.schedule}>{t('common.schedule')}</ThemedText>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 100}}>
                    {userData?.workouts?.map((workout, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => router.push({
                                pathname: '/manageWorkout',
                                params: { workout: JSON.stringify(workout) }
                            })}
                            style={styles.workoutCard}
                        >
                            <LinearGradient
                                colors={[colors.tint, colors.tint + 'CC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.workoutCardGradient}
                            >
                                <View style={styles.workoutCardContent}>
                                    <ThemedText style={styles.workoutCardTitle} numberOfLines={2}>
                                        {workout.title || ''}
                                    </ThemedText>
                                    
                                    <View style={styles.workoutCardInfo}>
                                        <View style={styles.workoutCardInfoItem}>
                                            <Ionicons name="barbell" size={16} color="white" />
                                            <ThemedText style={styles.workoutCardInfoText}>
                                                {`${workout.exercises?.length || 0} ${t('schedule.exercises')}`}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View style={styles.workoutCardInfo}>
                                        <View style={styles.workoutCardInfoItem}>
                                            <Ionicons name="time-outline" size={16} color="white" />
                                            <ThemedText style={styles.workoutCardInfoText}>
                                                {`${workout.exercises.reduce((acc, ex) => acc + ex.estimatedTime, 0)} min`}
                                            </ThemedText>
                                        </View>
                                    </View>

                                    <View style={styles.workoutCardExercises}>
                                        {workout.exercises?.length > 2 && (
                                            <ThemedText style={styles.workoutCardMore}>
                                                {`+${workout.exercises.length - 2} ${t('workout.more')}`}
                                            </ThemedText>
                                        )}
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity 
                        onPress={() => router.push({
                            pathname: '/manageWorkout',
                            params: { edit: 'true' }
                        })}
                        style={styles.workoutCard}
                    >
                        <View style={[styles.addCard, { backgroundColor: colors.card }]}>
                            <View style={styles.addCardContent}>
                                <View style={styles.addCardIcon}>
                                    <Ionicons name="add" size={32} color={colors.tint} />
                                </View>
                                <ThemedText style={styles.addCardText}>
                                    {t('schedule.createWorkout')}
                                </ThemedText>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>


                {currentWorkout && (
                    <WorkoutModal
                        visible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        workout={currentWorkout}
                        colors={colors}
                        t={t}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        alignItems: 'flex-end',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    subtitle: {
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 20,
    },
    starterBox: {
        margin: 20,
        borderRadius: 15,
        overflow: 'hidden',
    },
    starterGradient: {
        padding: 20,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    starterText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    starterIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        paddingHorizontal: 20,
    },
    dateItem: {
        width: 60,
        height: 90,
        borderRadius: 15,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    selectedDateItem: {
        borderWidth: 2,
    },
    dayText: {
        fontSize: 14,
        marginBottom: 5,
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    selectedDayText: {
        color: 'white',
    },
    selectedDateText: {
        color: 'white',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    schedule: {
        fontSize: 14,
        opacity: 0.7,
    },
    card: {
        width: 200,
        height: 250,
        borderRadius: 15,
        marginLeft: 20,
        padding: 15,
        justifyContent: 'space-between',
    },
    cardImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
    },
    cardTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    cardSubtitle: {
        color: 'white',
        opacity: 0.8,
    },
    plusCard: {
        width: 200,
        height: 250,
        borderRadius: 15,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    cardSmall: {
        width: 150,
        height: 200,
        borderRadius: 15,
        marginLeft: 20,
        padding: 15,
        justifyContent: 'space-between',
    },
    cardSmallImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    cardSmallTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    scheduleManager: {
        margin: 20,
        borderRadius: 15,
        overflow: 'hidden',
    },
    scheduleList: {
        maxHeight: 400,
    },
    scheduleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    workoutInfo: {
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    } as ViewStyle,
    reorderButton: {
        padding: 5,
        marginRight: 10,
    },
    workoutTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    restDaysControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    restDaysLabel: {
        marginRight: 10,
        fontSize: 14,
    },
    restDaysButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 5,
    },
    restDaysButton: {
        padding: 5,
    },
    restDaysValue: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        maxHeight: '80%',
        borderRadius: 15,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    reorderList: {
        maxHeight: 400,
    },
    reorderItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    reorderItemText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    nextWorkoutSection: {
        margin: 20,
        marginTop: 0,
    },
    nextWorkoutCard: {
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 10,
    },
    nextWorkoutGradient: {
        padding: 20,
    },
    nextWorkoutTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    completeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    completeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    calendarSection: {
        marginBottom: 20,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    scheduleButton: {
        padding: 5,
    },
    workoutIndicator: {
        position: 'absolute',
        bottom: 5,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CAF50', // Green for workout days
    } as ViewStyle,
    restDayIndicator: {
        position: 'absolute',
        bottom: 5,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFA500', // Orange for rest days
    } as ViewStyle,
    selectedDateInfo: {
        marginTop: 20,
        padding: 15,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginHorizontal: 20,
    },
    selectedDateTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    restDayText: {
        fontSize: 16,
        opacity: 0.7,
    },
    workoutInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    workoutInfoSubtitle: {
        fontSize: 14,
        opacity: 0.7,
    },
    todayWorkoutCard: {
        marginHorizontal: 20,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    todayWorkoutGradient: {
        padding: 20,
    },
    workoutHeader: {
        marginBottom: 15,
    },
    todayWorkoutTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    exercisesList: {
        marginTop: 10,
    },
    exerciseItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    exerciseContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exerciseName: {
        color: 'white',
        fontSize: 16,
        flex: 1,
        marginRight: 10,
    },
    exerciseDetails: {
        flexDirection: 'row',
        gap: 12,
    },
    exerciseDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    exerciseDetailText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 4,
    },
    noWorkoutText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 15,
    },
    createWorkoutButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    createWorkoutText: {
        color: 'white',
        fontSize: 16,
    },
    workoutTimerContainer: {
        flex: 1,
    },
    workoutTimerContent: {
        padding: 20,
        paddingTop: 30,
    },
    timerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    timerTimeContainer: {
        flex: 1,
    },
    timerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    circularTimer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    playPauseButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    currentExercise: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    } as ViewStyle,
    exerciseTitle: {
        fontSize: 28,
        color: 'white',
        marginBottom: 15,
    } as TextStyle,
    setInfo: {
        fontSize: 20,
        color: 'white',
        opacity: 0.8,
        marginBottom: 20,
    } as TextStyle,
    restTimeInfo: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    } as ViewStyle,
    restTimeText: {
        fontSize: 24,
        color: 'white',
        marginTop: 12,
        textAlign: 'center',
    } as TextStyle,
    restTimeCountdown: {
        fontSize: 36,
        color: 'white',
        marginTop: 8,
        fontWeight: 'bold',
    } as TextStyle,
    currentSetInfo: {
        gap: 12,
    } as ViewStyle,
    currentSetRow: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    currentSetText: {
        flex: 1,
    } as TextStyle,
    workoutCard: {
        width: 200,
        marginLeft: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    } as ViewStyle,
    workoutCardGradient: {
        borderRadius: 16,
        overflow: 'hidden',
    } as ViewStyle,
    workoutCardContent: {
        padding: 16,
        height: 180,
        justifyContent: 'space-between',
    } as ViewStyle,
    workoutCardTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 12,
    } as TextStyle,
    workoutCardInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 8,
    } as ViewStyle,
    workoutCardInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    } as ViewStyle,
    workoutCardInfoText: {
        color: 'white',
        fontSize: 13,
        opacity: 0.9,
    } as TextStyle,
    workoutCardExercises: {
        gap: 8,
    } as ViewStyle,
    workoutCardExercise: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
    } as ViewStyle,
    workoutCardExerciseText: {
        color: 'white',
        fontSize: 13,
        flex: 1,
        marginRight: 8,
    } as TextStyle,
    workoutCardExerciseSets: {
        color: 'white',
        fontSize: 12,
        opacity: 0.8,
    } as TextStyle,
    workoutCardMore: {
        color: 'white',
        fontSize: 12,
        opacity: 0.7,
        textAlign: 'center',
        marginTop: 4,
    } as TextStyle,
    addCard: {
        borderRadius: 16,
        overflow: 'hidden',
        height: 180,
    } as ViewStyle,
    addCardContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderStyle: 'dashed',
        borderRadius: 16,
    } as ViewStyle,
    addCardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    } as ViewStyle,
    addCardText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        opacity: 0.8,
    } as TextStyle,
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    } as ViewStyle,
    workoutModalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingTop: 10,
    } as ViewStyle,
    modalHandle: {
        width: 40,
        height: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 10,
    } as ViewStyle,
    restDayContent: {
        padding: 20,
        alignItems: 'center',
    } as ViewStyle,
    restDayIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    } as ViewStyle,
    restDayTitleText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    } as TextStyle,
    restDayDescriptionText: {
        fontSize: 16,
        opacity: 0.8,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    } as TextStyle,
    restDayTips: {
        width: '100%',
        gap: 12,
    } as ViewStyle,
    restDayTip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: 12,
        borderRadius: 12,
        gap: 12,
    } as ViewStyle,
    restDayTipText: {
        fontSize: 14,
        flex: 1,
    } as TextStyle,
    completeSetButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20
    } as ViewStyle,
    completeSetText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    } as TextStyle,
});
