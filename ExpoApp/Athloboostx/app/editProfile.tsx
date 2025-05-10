import React, {useCallback, useState} from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import {router, useFocusEffect} from "expo-router";
import {ThemedButton} from "@/components/ThemedButton";
import {UpdateUserProfile} from "@/serviceLayer/managerHandler"; // To allow image picking
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Status from "@/serviceLayer/status";
export default function EditProfileScreen() {
    const [name, setName] = useState('John Doe');
    const [bio, setBio] = useState('This is my bio...');
    const [profileImage, setProfileImage] = useState(
        require('@/assets/images/man-avatar-icon-free-vector-3688420316.jpg')
    );
    useFocusEffect(
        useCallback(() =>{
            AsyncStorage.getItem('profile').then(res=> {
                if (res != null) {
                    const profile = JSON.parse(res);
                    setProfileImage(profile.photo||require('@/assets/images/man-avatar-icon-free-vector-3688420316.jpg'));
                    setName(profile.userName);
                    setBio(profile.bio);
                } else{
                    Alert.alert("Cannot find profile data!");
                }

            })
        }, [])
    );
    const [imageArray,setImageArray] = useState('');
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            allowsMultipleSelection: false,
            mediaTypes: 'images',
            aspect: [4, 4],
            quality: 0.1,
        });

        if (result && !result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage({ uri });
            const base64String = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setImageArray(base64String);
        }
    };

    const handleSave = async () => {
        const res = await UpdateUserProfile({photo:imageArray,userName:name,bio:bio});
        if(!res||res!==Status.OK) Alert.alert('Something went wrong!');
        else router.back();
    };

    return (
        <ThemedView type="default" style={styles.container}>
            {/* Back Button to Profile Screen */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.profileContainer}>
                {/* Editable Profile Image */}
                <TouchableOpacity onPress={pickImage}>
                    <Image source={profileImage} style={styles.profileImage} />
                </TouchableOpacity>

                {/* Editable Name */}
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                />

                {/* Editable Bio */}
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell us about yourself"
                    multiline
                />

                {/* Save Button */}
                <ThemedButton type={'default'} style={styles.saveButton} onPress={handleSave}>
                    <ThemedText type="button">Save Changes</ThemedText>
                </ThemedButton>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    backButton: {
        marginTop: 20,
        marginBottom: 30,
    },
    profileContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    editIcon: {
        position: 'relative',
        bottom: 10,
        left: 10,
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 5,
    },
    editText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        color: '#ccc',
        marginBottom: 15,
    },
    textArea: {
        height: 80,
    },
    saveButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginTop: 20,
        width: '70%',
    },
});

