import React, { useState } from 'react';
import {View, Text, Image, Modal, TextInput, StyleSheet, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";

// Profile component
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

// Edit Profile Modal
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

// Main Nutrition Screen Component
const NutritionPage = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [profile, setProfile] = useState({
        weight: "94.5",
        goalWeight: "88",
    });

    const [drankGlasses, setDrankGlasses] = useState(0);
    const totalGlasses = 8;

    const toggleModal = () => setModalVisible(!isModalVisible);

    const saveProfileChanges = (newProfile) => {
        setProfile(newProfile);
        toggleModal();
    };

    return (
        <ThemedView type={'default'} style={styles.container}>
            <ProfileHeader />
            <ScrollView>

            {/* Stats */}
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

            {/* Nutrition Plan */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Nutrition Plan</Text>

                <View style={styles.meal}>
                    <Text style={styles.mealTitle}>Breakfast</Text>
                    <Text style={styles.mealTime}>6:30 AM</Text>
                    <View style={styles.mealItem}>
                        <Text>6 Egg whites + 2 whole eggs</Text>
                        <Text>320 kcal</Text>
                    </View>
                    <View style={styles.mealItem}>
                        <Text>Oatmeal + Protein powder</Text>
                        <Text>450 kcal</Text>
                    </View>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Daily Nutrition</Text>
                <ProgressBar progress={0.75} color="#4FC3F7" style={styles.progressBar} />
                <Text style={styles.progressLabel}>2,450 / 3,240 kcal</Text>
            </View>

            {/* Water Intake */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Water Intake</Text>

                <View style={styles.glassesContainer}>
                    {Array.from({ length: totalGlasses }).map((_, index) => (
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
                    maximumValue={totalGlasses}
                    step={1}
                    minimumTrackTintColor="#4FC3F7"
                    maximumTrackTintColor="#E0E0E0"
                    thumbTintColor="#4FC3F7"
                    value={drankGlasses}
                    onValueChange={setDrankGlasses}
                />

                <Text style={styles.waterLabel}>{drankGlasses} / {totalGlasses} glasses</Text>
            </View>

            <EditProfileModal
                isVisible={isModalVisible}
                closeModal={toggleModal}
                saveChanges={saveProfileChanges}
            />
            </ScrollView>

        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        height: '100%'
    },
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
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    membershipDate: {
        fontSize: 14,
        color: 'gray',
        marginTop: 4,
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: '#f6f9fa',
        padding: 5,
        borderRadius: 20,
        elevation: 3, // for Android shadow
        shadowColor: '#000', // for iOS shadow
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statLabel: {
        fontSize: 14,
        color: 'gray',
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    statChange: {
        fontSize: 12,
        color: '#4CAF50',
    },
    meal: {
        marginTop: 10,
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    mealTime: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 8,
    },
    mealItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    progressLabel: {
        textAlign: 'center',
        marginTop: 6,
        fontSize: 14,
        color: 'gray',
    },
    glassesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    glass: {
        margin: 6,
    },
    waterLabel: {
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '500',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    modalButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    modalButtonPrimary: {
        backgroundColor: '#4FC3F7',
        padding: 10,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    modalButtonTextPrimary: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default NutritionPage;
