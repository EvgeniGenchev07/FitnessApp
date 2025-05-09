import React, {useEffect,useCallback, useState} from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import {ThemedText} from "@/components/ThemedText";
import {router, useFocusEffect} from "expo-router";
import {GetProfile} from "@/serviceLayer/managerHandler";
import {LinearGradient} from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
}

interface UserProfile {
    userName: string;
    photo: string;
    workouts: Workout[];
    schedule:null
}

// @ts-ignore
const HorizontalCalendar = ({ onDateSelect }) => {
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
    // @ts-ignore
    const handleDatePress = (date) => {
        setSelectedDate(date);
        if (onDateSelect) onDateSelect(date.format('YYYY-MM-DD'));

    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            {dates.map((date, index) => {
                const isSelected = selectedDate.isSame(date, 'day');
                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dateItem, 
                            isSelected && styles.selectedDateItem,
                            { backgroundColor: isSelected ? colors.tint : colors.card }
                        ]}
                        onPress={() => handleDatePress(date)}
                    >
                        <ThemedText style={[styles.dayText, isSelected && styles.selectedDayText]}>
                            {date.format('ddd')}
                        </ThemedText>
                        <ThemedText style={[styles.dateText, isSelected && styles.selectedDateText]}>
                            {date.format('D')}
                        </ThemedText>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

export default function HomeScreen() {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
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
            let workouts = await AsyncStorage.getItem('workouts');
            let schedule = await AsyncStorage.getItem('schedule');
            //@ts-ignore
                profile = JSON.parse(profile);
            //@ts-ignore
                workouts = JSON.parse(workouts);
            //@ts-ignore
                schedule = JSON.parse(schedule);
            //@ts-ignore
            setUserData({...profile,workouts: workouts,schedule:schedule});
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };

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

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.tint} />
            </View>
        );
    }

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

                <TouchableOpacity style={styles.starterBox}>
                    <LinearGradient
                        colors={[colors.tint, colors.tint + '80']}
                        style={styles.starterGradient}
                    >
                        <View style={styles.iconRow}>
                            <ThemedText style={styles.starterText}>{t('home.startWorkout')}</ThemedText>
                            <TouchableOpacity style={styles.starterIcon}>
                                <Ionicons name="barbell" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <HorizontalCalendar onDateSelect={handleDateSelect} />

                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>{t('home.todaysWorkout')}</ThemedText>
                    <TouchableOpacity onPress={() => router.push('/manageWorkout')}>
                        <ThemedText style={styles.viewAll}>{t('common.viewAll')}</ThemedText>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {userData?.workouts?.map((workout, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => router.push({
                                pathname: '/manageWorkout',
                                params: { workout: JSON.stringify(workout) }
                            })}
                        >
                            { /*[workout.bgColor, `${workout.bgColor}80`]*/}
                            <LinearGradient
                                colors={['#000','#fff']}
                                style={styles.card}
                            >
                                <ThemedText style={styles.cardTitle}>{workout.title}</ThemedText>
                                <ThemedText style={styles.cardSubtitle}>
                                    {t('home.exercises', { count: workout?.exercises?.length })}
                                </ThemedText>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity 
                        onPress={() => router.push({
                            pathname: '/manageWorkout',
                            params: { edit: 'true' }
                        })}
                    >
                        <View style={[styles.plusCard, { backgroundColor: colors.card }]}>
                            <ThemedText style={styles.plusIcon}>+</ThemedText>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>{t('home.trainingPath')}</ThemedText>
                    <TouchableOpacity onPress={() => router.push('/manageWorkout')}>
                        <ThemedText style={styles.viewAll}>{t('common.viewAll')}</ThemedText>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 48}}>
                    {userData?.workouts?.map((workout, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => router.push({
                                pathname: '/manageWorkout',
                                params: { workout: JSON.stringify(workout) }
                            })}
                        >
                            <LinearGradient
                                colors={[workout.bgColor, `${workout.bgColor}80`]}
                                style={styles.cardSmall}
                            >
                                <Image 
                                    source={workout.image ? { uri: workout.image } : require('../../assets/images/app-icon.png')} 
                                    style={styles.cardSmallImage} 
                                    resizeMode="contain" 
                                />
                                <ThemedText style={styles.cardSmallTitle}>{workout.title}</ThemedText>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity 
                        onPress={() => router.push({
                            pathname: '/manageWorkout',
                            params: { edit: 'true' }
                        })}
                    >
                        <View style={[styles.plusCard, { backgroundColor: colors.card }]}>
                            <ThemedText style={styles.plusIcon}>+</ThemedText>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
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
        height: 80,
        borderRadius: 15,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
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
    viewAll: {
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
});
