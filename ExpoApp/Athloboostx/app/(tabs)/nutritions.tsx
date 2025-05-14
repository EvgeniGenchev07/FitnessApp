import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, TextInput, StyleSheet, TouchableOpacity, ScrollView, StatusBar, FlatList, Alert, ActivityIndicator } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { HttpPatchProfile, HttpGetProfile } from '@/serviceLayer/httpManager';
import Status from '@/serviceLayer/status';
import { UpdateMeals } from '@/serviceLayer/managerHandler';
import { DeletePost } from '@/serviceLayer/postService';

interface Food {
    id: number;
    name: string;
    type: string;
    calories: number;
    carbs: number;
    fats: number;
    proteins: number;
}

interface Meal {
    id: number;
    date: string;
    foods: Food[];
    waterIntake: number;
    waterGoal: number;
    weight: number;
    goalWeight: number;
    dailyCalorieGoal: number;
}

interface User {
    userName: string;
    photo: string;
    photoMimeType: string;
    date: string;
    meals: Meal[];
}

interface ProfileData {
    weight: number;
    goalWeight: number;
    waterGoal: number;
    dailyCalorieGoal: number;
    waterIntake: number;
}

const STATUS_BAR_HEIGHT = 44; // Default iOS status bar height
const default_photo = '@/assets/images/man-avatar-icon-free-vector-3688420316.jpg';

const ProfileHeader = ({ name, photo, date }: { name: string; photo: string; date: string }) => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    return (
        <View style={styles.profileHeader}>
            <Image
                source={photo ? { uri: photo } : require(default_photo)}
                style={[styles.profilePic, { borderColor: colors.primary }]}
            />
            <View style={styles.profileInfo}>
                <ThemedText type={'subtitle'}>{name}</ThemedText>
                <ThemedText type={'default'} style={styles.membershipDate}>
                    {t('nutrition.eliteMember')} {moment(date).format('MMMM YYYY')}
                </ThemedText>
            </View>
        </View>
    );
};

const EditProfileModal = ({ isVisible, closeModal, saveChanges, initialData }: { 
    isVisible: boolean; 
    closeModal: () => void; 
    saveChanges: (data: Partial<ProfileData>) => void;
    initialData: ProfileData;
}) => {
    const { t } = useLanguage();
    const { colors } = useTheme();
    const [weight, setWeight] = useState(initialData.weight.toString());
    const [goalWeight, setGoalWeight] = useState(initialData.goalWeight.toString());
    const [waterGoal, setWaterGoal] = useState(initialData.waterGoal.toString());
    const [dailyCalorieGoal, setDailyCalorieGoal] = useState(initialData.dailyCalorieGoal.toString());

    const handleSave = async () => {
        try {
            
            
            saveChanges({
                weight: parseFloat(weight),
                goalWeight: parseFloat(goalWeight),
                waterGoal: parseInt(waterGoal),
                dailyCalorieGoal: parseInt(dailyCalorieGoal)
            });
            closeModal();
        } catch (error) {
            Alert.alert(t('common.error'), t('nutrition.updateError'));
        }
    };

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={[styles.modalBackground, { backgroundColor: colors.modalBackground }]}>
                <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
                    <ThemedText type={'subtitle'} style={styles.modalTitle}>{t('nutrition.stats')}</ThemedText>
                    <TextInput
                        value={weight}
                        onChangeText={setWeight}
                        placeholder={t('nutrition.weight')}
                        keyboardType="numeric"
                        style={[styles.input, { borderColor: colors.border }]}
                    />
                    <TextInput
                        value={goalWeight}
                        onChangeText={setGoalWeight}
                        placeholder={t('nutrition.goalWeight')}
                        keyboardType="numeric"
                        style={[styles.input, { borderColor: colors.border }]}
                    />
                    <TextInput
                        value={waterGoal}
                        onChangeText={setWaterGoal}
                        placeholder={t('nutrition.waterGoal')}
                        keyboardType="numeric"
                        style={[styles.input, { borderColor: colors.border }]}
                    />
                    <TextInput
                        value={dailyCalorieGoal}
                        onChangeText={setDailyCalorieGoal}
                        placeholder={t('nutrition.dailyCalorieGoal')}
                        keyboardType="numeric"
                        style={[styles.input, { borderColor: colors.border }]}
                    />
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={closeModal} style={[styles.modalButton, { backgroundColor: colors.button }]}>
                            <ThemedText type={'default'}>{t('common.cancel')}</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={[styles.modalButtonPrimary, { backgroundColor: colors.primary }]}>
                            <ThemedText type={'default'} style={{ color: '#fff' }}>{t('common.save')}</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const AddFoodModal = ({ visible, closeModal, addFood }: {
    visible: boolean;
    closeModal: () => void;
    addFood: (food: { meal: string; name: string; calories: number }) => void;
}) => {
    const { t } = useLanguage();
    const { colors } = useTheme();
    const [type, setType] = useState('Choose a meal type');
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [typeModalVisible, setTypeModalVisible] = useState(false);

    const handleAdd = () => {
        if (foodName && calories && !isNaN(parseInt(calories))) {
            addFood({ meal: type, name: foodName, calories: parseInt(calories) });
            setFoodName('');
            setCalories('');
            setType('Choose a meal type');
            closeModal();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={[styles.modalBackground, { backgroundColor: colors.modalBackground }]}>
                <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
                    <ThemedText type={'subtitle'} style={styles.modalTitle}>{t('nutrition.addFood')}</ThemedText>
                    <TouchableOpacity 
                        style={[styles.selectBox, { borderColor: colors.border }]} 
                        onPress={() => setTypeModalVisible(true)}
                    >
                        <ThemedText type={'default'}>{type}</ThemedText>
                        <Ionicons name="chevron-up" size={20} color={colors.text} />
                    </TouchableOpacity>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={typeModalVisible}
                        onRequestClose={() => setTypeModalVisible(false)}
                    >
                        <View style={[styles.modalContainerType, { backgroundColor: colors.modalBackground }]}>
                            <View style={[styles.pickerWrapper, { backgroundColor: colors.card }]}>
                                <TouchableOpacity onPress={() => {
                                    setTypeModalVisible(false);
                                    setType('Breakfast');
                                }} style={styles.modalCloseButton}>
                                    <ThemedText type={'default'} style={{ color: colors.primary }}>{t('common.done')}</ThemedText>
                                </TouchableOpacity>
                                <Picker
                                    selectedValue={type}
                                    onValueChange={(itemValue) => setType(itemValue)}
                                    style={[styles.picker, { color: colors.text }]}
                                >
                                    <Picker.Item label={t('nutrition.breakfast')} value="Breakfast" />
                                    <Picker.Item label={t('nutrition.brunch')} value="Brunch" />
                                    <Picker.Item label={t('nutrition.lunch')} value="Lunch" />
                                    <Picker.Item label={t('nutrition.dinner')} value="Dinner" />
                                    <Picker.Item label={t('nutrition.snack')} value="Snack" />
                                </Picker>
                            </View>
                        </View>
                    </Modal>

                    <TextInput
                        value={foodName}
                        onChangeText={setFoodName}
                        placeholder={t('nutrition.foodName')}
                        style={[styles.input, { borderColor: colors.border }]}
                    />
                    <TextInput
                        value={calories}
                        onChangeText={setCalories}
                        placeholder={t('nutrition.calories')}
                        keyboardType="numeric"
                        style={[styles.input, { borderColor: colors.border }]}
                    />
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={closeModal} style={[styles.modalButton, { backgroundColor: colors.button }]}>
                            <ThemedText type={'default'}>{t('common.cancel')}</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAdd} style={[styles.modalButtonPrimary, { backgroundColor: colors.primary }]}>
                            <ThemedText type={'default'} style={{ color: '#fff' }}>{t('common.add')}</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const CalendarStrip = ({ selectedDate, onDateSelect }: { selectedDate: Date; onDateSelect: (date: Date) => void }) => {
    const { t } = useLanguage();
    const { colors } = useTheme();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
    }).reverse();

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.calendarStrip}
        >
            {dates.map((date) => {
                const isSelected = moment(date).isSame(selectedDate, 'day');
                return (
                    <TouchableOpacity
                        key={date.toISOString()}
                        style={[
                            styles.calendarDay,
                            { backgroundColor: isSelected ? colors.primary : colors.card }
                        ]}
                        onPress={() => onDateSelect(date)}
                    >
                        <ThemedText 
                            type={'default'} 
                            style={[
                                styles.calendarDayText,
                                { color: isSelected ? '#fff' : colors.text }
                            ]}
                        >
                            {moment(date).format('ddd')}
                        </ThemedText>
                        <ThemedText 
                            type={'subtitle'} 
                            style={[
                                styles.calendarDateText,
                                { color: isSelected ? '#fff' : colors.text }
                            ]}
                        >
                            {moment(date).format('D')}
                        </ThemedText>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const NutritionPage = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalVisible, setModalVisible] = useState(false);
    const [isFoodModalVisible, setFoodModalVisible] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileData>({
        weight: 0,
        goalWeight: 0,
        waterGoal: 2000,
        dailyCalorieGoal: 2000,
        waterIntake: 0
    });
    const [meals, setMeals] = useState<Meal[]>([]);
    const [userInfo, setUserInfo] = useState<User>({
        userName: '',
        photo: '',
        photoMimeType: '',
        date: '',
        meals: []
    });

    useEffect(() => {
        loadProfileData();
        loadMeals();
    }, []);

    useEffect(() => {
        loadMeals();
    }, [selectedDate]);

    const loadProfileData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('profile');
            const userData = JSON.parse(userDataString || '{}');
            const mealsData = await AsyncStorage.getItem('meals');
            const meals = JSON.parse(mealsData || '[]');
            setUserInfo({
                userName: userData.userName,
                photo: userData.photo ? `data:${userData.photoMimeType};base64,${userData.photo}` : '',
                photoMimeType: userData.photoMimeType || 'image/jpeg',
                date: userData.date || new Date().toISOString(),
                meals: meals || []
            });
            
            const todayMeal = meals?.[0] || {
                id: 0,
                date: new Date().toISOString(),
                foods: [],
                waterIntake: 0,
                waterGoal: 2000,
                dailyCalorieGoal: 2000,
                weight: 0,
                goalWeight: 0
            };

            setProfile({
                weight: todayMeal.weight || 0,
                goalWeight: todayMeal.goalWeight || 0,
                waterGoal: todayMeal.waterGoal || 2000,
                dailyCalorieGoal: todayMeal.dailyCalorieGoal || 2000,
                waterIntake: todayMeal.waterIntake || 0
            });
        } catch (error) {
            Alert.alert(t('common.error'), t('nutrition.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const loadMeals = async () => {
        try {
            const mealsData = await AsyncStorage.getItem('meals');
            const meals = JSON.parse(mealsData || '[]');
            setMeals(meals || []);
        } catch (error) {
            console.error('Load meals error:', error);
            Alert.alert(t('common.error'), t('nutrition.loadError'));
        }
    };

    const toggleModal = () => setModalVisible(!isModalVisible);
    const toggleFoodModal = () => setFoodModalVisible(!isFoodModalVisible);
    const toggleDeleteMode = () => setDeleteMode(!deleteMode);

    const saveProfileChanges = async (newProfile: Partial<ProfileData>) => {
        setProfile(prev => ({ ...prev, ...newProfile }));
        toggleModal();
    };

    const handleWaterEffect = async (value: number) => {
        setProfile(prev => ({ ...prev, waterIntake: value }));
    }
    const handleWaterChange = async (value: number) => {
        try {

            const currentMeals = [...meals];
            const todayMeal: Meal = currentMeals.find(m => moment(m.date).isSame(selectedDate, 'day')) || {
                id: 0,
                date: selectedDate.toISOString(),
                foods: [],
                waterIntake: 0,
                waterGoal: profile.waterGoal,
                dailyCalorieGoal: profile.dailyCalorieGoal,
                weight: profile.weight,
                goalWeight: profile.goalWeight
            };
            
            todayMeal.waterIntake = value;
            const index = currentMeals.findIndex(m => moment(m.date).isSame(selectedDate, 'day'));
            if (index === -1) {
                currentMeals.push(todayMeal);
            }
            else {
                currentMeals[index] = todayMeal;
            }

            const res = await UpdateMeals(todayMeal);
            if (!res || res != Status.OK) {
                Alert.alert(t('common.error'), t('nutrition.addFoodError'));
                return;
            }

            setMeals(currentMeals);
            setProfile(prev => ({ ...prev, waterIntake: value }));
        } catch (error) {
            Alert.alert(t('common.error'), t('nutrition.waterUpdateError'));
        }
    };

    const addFood = async ({ meal, name, calories }: { meal: string; name: string; calories: number }) => {
        try {

            const currentMeals = [...meals];
            let todayMeal: Meal = currentMeals.find(m => moment(m.date).isSame(selectedDate, 'day')) || {
                id: 0,
                date: selectedDate.toISOString(),
                foods: [],
                waterIntake: profile.waterIntake,
                waterGoal: profile.waterGoal,
                dailyCalorieGoal: profile.dailyCalorieGoal,
                weight: profile.weight,
                goalWeight: profile.goalWeight
            };
            if(todayMeal.foods) todayMeal.foods = [];
            const newFood: Food = {
                id: Math.floor(Math.random() * 2147483647),
                name,
                type: meal,
                calories,
                carbs: 0,
                fats: 0,
                proteins: 0
            };

            todayMeal.foods.push(newFood);
            const index = currentMeals.findIndex(m => moment(m.date).isSame(selectedDate, 'day'));
            if (index === -1) {
                currentMeals.push(todayMeal);
            }
            else {
                currentMeals[index] = todayMeal;
            }

            const res = await UpdateMeals(todayMeal);
            if (!res || res != Status.OK) {
                Alert.alert(t('common.error'), t('nutrition.addFoodError'));
                return;
            }

            setMeals(currentMeals);
            toggleFoodModal();
        } catch (error) {
            console.error('Add food error:', error);
            Alert.alert(t('common.error'), t('nutrition.addFoodError'));
        }
    };

    const deleteFood = async (mealId: number) => {
        try {
            const currentMeals = [...meals];
            const index = currentMeals.findIndex(m => moment(m.date).isSame(selectedDate, 'day'));

            if (index != -1) {
                const todayMeal = currentMeals[index];
                todayMeal.foods = todayMeal.foods.filter(f => f.id !== mealId);
                currentMeals[index] = todayMeal;
                const res = await UpdateMeals(todayMeal);
                if (res != Status.OK) {
                    Alert.alert(t('common.error'), t('nutrition.deleteError'));
                    return;
                }
            }
                setMeals(currentMeals);
            }
         catch (error) {
            Alert.alert(t('common.error'), t('nutrition.deleteError'));
        }
    };

    const groupMealsByType = (meals: Meal[]): Record<string, Food[]> => {
        const todayMeal = meals.find(m => moment(m.date).isSame(selectedDate, 'day'));
        if (!todayMeal) return {};

        return todayMeal?.foods?.reduce((acc, food) => {
            if (!acc[food.type]) acc[food.type] = [];
            acc[food.type].push(food);
            return acc;
        }, {} as Record<string, Food[]>);
    };

    const totalCalories = meals
        .find(m => moment(m.date).isSame(selectedDate, 'day'))
        ?.foods?.reduce((acc, food) => acc + food.calories, 0) || 0;

    const progress = Math.min(totalCalories / profile.dailyCalorieGoal, 1);
    const waterProgress = Math.min(profile.waterIntake / profile.waterGoal, 1);

    if (loading) {
        return (
            <ThemedView type={'default'} style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
            </ThemedView>
        );
    }

    return (
        <ThemedView type={'default'} style={styles.container}>
            <View style={{ height: STATUS_BAR_HEIGHT }} />
            <ProfileHeader name={userInfo.userName} photo={userInfo.photo} date={userInfo.date} />
            <CalendarStrip 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
            />
            <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 80}}>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.button }]} onPress={toggleModal}>
                        <MaterialCommunityIcons name="pencil" size={12} color={colors.primary} />
                    </TouchableOpacity>
                    <ThemedText type={'subtitle'}>{t('nutrition.stats')}</ThemedText>
                    <View style={styles.statsRow}>
                        <View>
                            <ThemedText type={'default'} style={styles.statLabel}>{t('nutrition.current')}</ThemedText>
                            <ThemedText type={'subtitle'}>{profile.weight} kg</ThemedText>
                            <ThemedText type={'default'} style={[styles.statChange, { color: colors.success }]}>
                                ↓ {Math.abs(profile.weight - profile.goalWeight).toFixed(1)} kg
                            </ThemedText>
                        </View>
                        <View>
                            <ThemedText type={'default'} style={styles.statLabel}>{t('nutrition.goal')}</ThemedText>
                            <ThemedText type={'subtitle'}>{profile.goalWeight} kg</ThemedText>
                            <ThemedText type={'default'} style={[styles.statChange, { color: colors.success }]}>
                                {Math.abs(profile.weight - profile.goalWeight).toFixed(1)} kg {t('nutrition.toGo')}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <ThemedText type={'subtitle'}>{t('nutrition.nutritionPlan')}</ThemedText>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={toggleDeleteMode} style={{ marginRight: 10 }}>
                                <MaterialCommunityIcons 
                                    name="delete-outline" 
                                    size={20} 
                                    color={deleteMode ? colors.error : colors.primary} 
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleFoodModal}>
                                <MaterialCommunityIcons name="plus-circle-outline" size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {Object.entries(groupMealsByType(meals)||[]).map(([mealType, foods]) => (
                        <View key={mealType} style={styles.meal}>
                            <ThemedText type={'subtitle'}>{mealType}</ThemedText>
                            {foods.map((food, idx) => (
                                <View key={idx} style={styles.mealItem}>
                                    <ThemedText type={'default'}>{food.name}</ThemedText>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <ThemedText type={'default'}>{food.calories} kcal</ThemedText>
                                        {deleteMode && (
                                            <TouchableOpacity onPress={() => deleteFood(food.id)}>
                                                <MaterialCommunityIcons 
                                                    name="trash-can-outline" 
                                                    size={18} 
                                                    color={colors.error} 
                                                    style={{ marginLeft: 8 }} 
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <ThemedText type={'subtitle'}>{t('nutrition.dailyNutrition')}</ThemedText>
                    <ProgressBar progress={progress} color={colors.primary} style={styles.progressBar} />
                    <ThemedText type={'default'} style={styles.progressLabel}>
                        {totalCalories} / {profile.dailyCalorieGoal} kcal
                    </ThemedText>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <ThemedText type={'subtitle'}>{t('nutrition.waterIntake')}</ThemedText>
                    <View style={styles.glassesContainer}>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <MaterialCommunityIcons
                                key={index}
                                name={index < Math.floor(profile.waterIntake / 250) ? "cup-water" : "cup-outline"}
                                size={28}
                                color={index < Math.floor(profile.waterIntake / 250) ? '#ff0019' : colors.text}
                                style={styles.glass}
                            />
                        ))}
                    </View>
                    <View style={styles.sliderContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={profile.waterGoal}
                            step={50}
                            value={profile.waterIntake}
                            onSlidingComplete={handleWaterChange}
                            onValueChange={handleWaterEffect}
                            minimumTrackTintColor="#ff0019"
                            maximumTrackTintColor={colors.border}
                            thumbTintColor="#ff0019"
                        />
                        <ThemedText type={'default'} style={styles.waterLabel}>
                            {profile.waterIntake} / {profile.waterGoal} ml
                        </ThemedText>
                    </View>
                    <ProgressBar progress={waterProgress} color="#ff0019" style={styles.progressBar} />
                </View>

                <EditProfileModal 
                    isVisible={isModalVisible} 
                    closeModal={toggleModal} 
                    saveChanges={saveProfileChanges}
                    initialData={profile}
                />
                <AddFoodModal 
                    visible={isFoodModalVisible} 
                    closeModal={toggleFoodModal} 
                    addFood={addFood} 
                />
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, height: '100%' },
    profileHeader: {
        marginTop: STATUS_BAR_HEIGHT + 40,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 20,
        borderWidth: 2,
        borderColor: '#4FC3F7',
    },
    picker: {
        color: '#fff',
        backgroundColor: '#1c1c1e',
    },
    profileInfo: { flex: 1 },
    membershipDate: { fontSize: 14, color: 'gray', marginTop: 4 },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: '#f6f9fa',
        padding: 5,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statLabel: { fontSize: 14, color: 'gray' },
    statValue: { fontSize: 22, fontWeight: 'bold', marginVertical: 4 },
    statChange: { fontSize: 12, color: '#4CAF50' },
    meal: { marginTop: 10 },
    mealTitle: { fontSize: 16, fontWeight: 'bold' },
    mealTime: { fontSize: 14, color: 'gray', marginBottom: 8 },
    mealItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    progressBar: { height: 10, borderRadius: 5, marginTop: 10 },
    progressLabel: { textAlign: 'center', marginTop: 6, fontSize: 14, color: 'gray' },
    glassesContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 },
    glass: { margin: 6 },
    waterLabel: { textAlign: 'center', marginTop: 10, fontWeight: '500', fontSize: 16 },
    modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '85%' },
    closeButton: { position: 'absolute', top: 12, right: 12 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 10 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    modalButton: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, width: '48%', alignItems: 'center' },
    modalButtonPrimary: { backgroundColor: '#4FC3F7', padding: 10, borderRadius: 8, width: '48%', alignItems: 'center' },
    modalButtonText: { color: '#333', fontWeight: 'bold' },
    modalButtonTextPrimary: { color: '#fff', fontWeight: 'bold' },
    selectBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectText: {
        fontSize: 16,
    },
    deleteButton: {
        marginTop: 30,
        backgroundColor: 'red',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    deleteText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    timeInput: {
        flex: 1,
        marginHorizontal: 4,
    },
    modalContainerType: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerWrapper: {
        backgroundColor: '#1c1c1e',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 20,
    },
    modalCloseButton: {
        alignItems: 'flex-start',
        paddingVertical: 0,
    },
    modalCloseText: {
        color: '#007aff',
        fontSize: 18,
        fontWeight: '600',
    },
    sliderContainer: {
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    calendarStrip: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginBottom: 10,
    },
    calendarDay: {
        width: 60,
        height: 70,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    calendarDayText: {
        fontSize: 12,
        marginBottom: 4,
    },
    calendarDateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NutritionPage;
