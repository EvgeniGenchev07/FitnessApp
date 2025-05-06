import React, { useState } from 'react';
import { View, Text, Image, Modal, TextInput, StyleSheet, TouchableOpacity, ScrollView, StatusBar, FlatList } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Picker } from '@react-native-picker/picker';

const ProfileHeader = () => {
    return (
        <View style={styles.profileHeader}>
            <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.profilePic}
            />
            <View style={styles.profileInfo}>
                <ThemedText type={'subtitle'}>MAXIMUS IRON</ThemedText>
                <ThemedText type={'default'} style={styles.membershipDate}>Elite Member since January 2021</ThemedText>
            </View>
        </View>
    );
};

const EditProfileModal = ({ isVisible, closeModal, saveChanges }) => {
    const [name, setName] = useState("MAXIMUS IRON");
    const [weight, setWeight] = useState("94.5");
    const [goalWeight, setGoalWeight] = useState("88");

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Stats</Text>
                    <TextInput
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="Weight (kg)"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <TextInput
                        value={goalWeight}
                        onChangeText={setGoalWeight}
                        placeholder="Goal Weight (kg)"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => saveChanges({ name, weight, goalWeight })} style={styles.modalButtonPrimary}>
                            <Text style={styles.modalButtonTextPrimary}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const AddFoodModal = ({ visible, closeModal, addFood }) => {
    const [type, setType] = useState('Choose a meal type');
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [typeModalVisible, setTypeModalVisible] = useState(false);

    const handleAdd = () => {
        if (foodName && calories && !isNaN(calories)) {
            addFood({ meal: type, name: foodName, calories: parseInt(calories) });
            setFoodName('');
            setCalories('');
            setType('Choose a meal type');
            closeModal();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Add Food</Text>
                    <TouchableOpacity style={styles.selectBox} onPress={() => setTypeModalVisible(true)}>
                        <Text style={styles.selectText}>{type}</Text>
                        <Ionicons name="chevron-up" size={20} color="#aaa" />
                    </TouchableOpacity>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={typeModalVisible}
                        onRequestClose={() => setTypeModalVisible(false)}
                    >
                        <View style={styles.modalContainerType}>
                            <View style={styles.pickerWrapper}>
                                <TouchableOpacity onPress={() => {
                                    setTypeModalVisible(false);
                                    setType('Breakfast');
                                }} style={styles.modalCloseButton}>
                                    <Text style={styles.modalCloseText}>Done</Text>
                                </TouchableOpacity>
                                <Picker
                                    selectedValue={type}
                                    onValueChange={(itemValue) => setType(itemValue)}
                                    style={styles.picker}
                                    dropdownIconColor="#fff"
                                >
                                    <Picker.Item label="Breakfast" value="Breakfast" />
                                    <Picker.Item label="Brunch" value="Brunch" />
                                    <Picker.Item label="Lunch" value="Lunch" />
                                    <Picker.Item label="Dinner" value="Dinner" />
                                    <Picker.Item label="Snack" value="Snack" />
                                </Picker>

                            </View>
                        </View>
                    </Modal>
                    <TextInput
                        value={foodName}
                        onChangeText={setFoodName}
                        placeholder="Food Name"
                        style={styles.input}
                    />
                    <TextInput
                        value={calories}
                        onChangeText={setCalories}
                        placeholder="Calories"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAdd} style={styles.modalButtonPrimary}>
                            <Text style={styles.modalButtonTextPrimary}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const NutritionPage = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isFoodModalVisible, setFoodModalVisible] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);

    const [profile, setProfile] = useState({
        weight: "94.5",
        goalWeight: "88",
    });

    const [drankGlasses, setDrankGlasses] = useState(0);
    const [foods, setFoods] = useState({
        Breakfast: [
            { name: '6 Egg whites + 2 whole eggs', calories: 320 },
            { name: 'Oatmeal + Protein powder', calories: 450 },
            { name: '6 Egg whites + 2 whole eggs', calories: 320 },
            { name: 'Oatmeal + Protein powder', calories: 450 },
        ],
    });

    const toggleModal = () => setModalVisible(!isModalVisible);
    const toggleFoodModal = () => setFoodModalVisible(!isFoodModalVisible);
    const toggleDeleteMode = () => setDeleteMode(!deleteMode);

    const saveProfileChanges = (newProfile) => {
        setProfile(newProfile);
        toggleModal();
    };

    const addFood = ({ meal, name, calories }) => {
        setFoods(prev => ({
            ...prev,
            [meal]: [...(prev[meal] || []), { name, calories }],
        }));
    };

    const deleteFood = (meal, index) => {
        const updated = [...foods[meal]];
        updated.splice(index, 1);
        setFoods(prev => ({ ...prev, [meal]: updated }));
    };

    const totalCalories = Object.values(foods).flat().reduce((acc, food) => acc + food.calories, 0);
    const dailyGoal = 3240;
    const progress = Math.min(totalCalories / dailyGoal, 1);

    return (
        <ThemedView type={'default'} style={styles.container}>
            <ProfileHeader />
            <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 80}}>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
                        <MaterialCommunityIcons name="pencil" size={12} color="#4FC3F7" />
                    </TouchableOpacity>
                    <Text style={styles.sectionTitle}>Stats</Text>
                    <View style={styles.statsRow}>
                        <View>
                            <Text style={styles.statLabel}>Current</Text>
                            <Text style={styles.statValue}>{profile.weight} kg</Text>
                            <Text style={styles.statChange}>↓ 2.3 kg</Text>
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Goal</Text>
                            <Text style={styles.statValue}>{profile.goalWeight} kg</Text>
                            <Text style={styles.statChange}>6.5 kg to go</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.sectionTitle}>Nutrition Plan</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={toggleDeleteMode} style={{ marginRight: 10 }}>
                                <MaterialCommunityIcons name="delete-outline" size={20} color={deleteMode ? "red" : "#4FC3F7"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleFoodModal}>
                                <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#4FC3F7" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {Object.entries(foods).map(([meal, items]) => (
                        <View key={meal} style={styles.meal}>
                            <Text style={styles.mealTitle}>{meal}</Text>
                            {items.map((item, idx) => (
                                <View key={idx} style={styles.mealItem}>
                                    <Text>{item.name}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>{item.calories} kcal</Text>
                                        {deleteMode && (
                                            <TouchableOpacity onPress={() => deleteFood(meal, idx)}>
                                                <MaterialCommunityIcons name="trash-can-outline" size={18} color="red" style={{ marginLeft: 8 }} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Daily Nutrition</Text>
                    <ProgressBar progress={progress} color="#4FC3F7" style={styles.progressBar} />
                    <Text style={styles.progressLabel}>{totalCalories} / {dailyGoal} kcal</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Water Intake</Text>
                    <View style={styles.glassesContainer}>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <MaterialCommunityIcons
                                key={index}
                                name={index < drankGlasses ? "cup-water" : "cup-outline"}
                                size={28}
                                color={index < drankGlasses ? "#4FC3F7" : "#B0BEC5"}
                                style={styles.glass}
                            />
                        ))}
                    </View>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={8}
                        step={1}
                        minimumTrackTintColor="#4FC3F7"
                        maximumTrackTintColor="#E0E0E0"
                        thumbTintColor="#4FC3F7"
                        value={drankGlasses}
                        onValueChange={setDrankGlasses}
                    />
                    <Text style={styles.waterLabel}>{drankGlasses} / 8 glasses</Text>
                </View>

                <EditProfileModal isVisible={isModalVisible} closeModal={toggleModal} saveChanges={saveProfileChanges} />
                <AddFoodModal visible={isFoodModalVisible} closeModal={toggleFoodModal} addFood={addFood} />
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, height: '100%' },
    profileHeader: {
        marginTop: StatusBar.currentHeight + 40,
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
});

export default NutritionPage;
