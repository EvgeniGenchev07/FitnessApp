import React,{useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import {Colors} from "@/constants/Colors";
import {ThemedText} from "@/components/ThemedText";

// @ts-ignore
const HorizontalCalendar = ({ onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(moment());

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
                        style={[styles.dateItem, isSelected && styles.selectedDateItem]}
                        onPress={() => handleDatePress(date)}
                    >
                        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                            {date.format('ddd')}
                        </Text>
                        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                            {date.format('D')}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};
    const workouts = [
    { title: 'Pogo Hops', sets: '20 sets', color: '#B892F0', image: require('../../assets/images/app-icon.png') },
    { title: 'Bodyweight Squat', sets: '30 sets', color: '#F49C5A', image: require('../../assets/images/app-icon.png') },
    { title: 'Lunges', sets: '15 sets', color: '#D69CF9', image: require('../../assets/images/app-icon.png') },
];

const trainingPaths = [
    { title: 'Weightloss', image: require('../../assets/images/app-icon.png'), bgColor: '#B8959E' },
    { title: 'Muscle gain', image: require('../../assets/images/app-icon.png'), bgColor: '#80AFAF' },
];


export default function HomeScreen() {
    const [selectedDate, setSelectedDate] = useState('');
    const colorScheme = useColorScheme();
    const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
    // @ts-ignore
    const handleDateSelect = (date) => {
        console.log('Selected date:', date);
        setSelectedDate(date);
    };

    return (
        <SafeAreaView style={[styles.container,{backgroundColor:colors.background}]}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../../assets/images/man-avatar-icon-free-vector-3688420316.jpg')} style={[styles.profilePic]} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>

            <ThemedText style={styles.welcome}>Hello Tracy,</ThemedText>
            <Text style={styles.subtitle}>Welcome back.</Text>

            {/* Workout Starter */}
            <View style={styles.starterBox}>
                <Text style={styles.starterText}>How would you like to start your workout today?</Text>
                <View style={styles.iconRow}>
                    <TouchableOpacity style={styles.starterIcon}>
                        <Ionicons name="walk" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.starterIcon}>
                        <Ionicons name="barbell" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <HorizontalCalendar onDateSelect={handleDateSelect} />

            {/* Today's Workout */}
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Today's Workout</ThemedText>
                <Text style={styles.viewAll}>view all</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {workouts.map((item, index) => (
                    <View key={index} style={[styles.card, { backgroundColor: item.color }]}>
                        <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardSubtitle}>{item.sets}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Training Path */}
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Training Path</ThemedText>
                <Text style={styles.viewAll}>view all</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 48}}>
                {trainingPaths.map((item, index) => (
                    <View key={index} style={[styles.cardSmall, { backgroundColor: item.bgColor }]}>
                        <Image source={item.image} style={styles.cardSmallImage} resizeMode="contain" />
                        <Text style={styles.cardSmallTitle}>{item.title}</Text>
                    </View>
                ))}
            </ScrollView>
            </ScrollView>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    dateItem: {
        width: 60,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#eee',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedDateItem: {
        backgroundColor: '#6B4EFF',
    },
    dayText: {
        fontSize: 14,
        color: '#444',
    },
    dateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    selectedDayText: {
        color: '#fff',
    },
    selectedDateText: {
        color: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#F2F3FA',
        paddingHorizontal: 10,
    },
    header: {
        marginTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
    },
    welcome: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 10,
    },
    subtitle: {
        color: '#777',
        marginBottom: 20,
    },
    starterBox: {
        backgroundColor: '#6B4EFF',
        borderRadius: 15,
        padding: 20,
    },
    starterText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 15,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    starterIcon: {
        backgroundColor: '#9C89FF',
        borderRadius: 10,
        padding: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    viewAll: {
        fontSize: 14,
        color: '#6B4EFF',
    },
    card: {
        width: 140,
        height: 200,
        borderRadius: 15,
        padding: 15,
        marginRight: 15,
        justifyContent: 'flex-end',
    },
    cardImage: {
        position: 'absolute',
        top: 10,
        width: '100%',
        height: 120,
    },
    cardTitle: {
        fontWeight: '700',
        fontSize: 16,
        color: '#fff',
    },
    cardSubtitle: {
        color: '#fff',
        fontSize: 12,
    },
    cardSmall: {
        width: 140,
        height: 160,
        borderRadius: 15,
        padding: 15,
        marginRight: 15,
        justifyContent: 'flex-end',
    },
    cardSmallImage: {
        position: 'absolute',
        top: 10,
        width: '100%',
        height: 100,
    },
    cardSmallTitle: {
        fontWeight: '700',
        fontSize: 16,
        color: '#fff',
    },
});
