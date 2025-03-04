import React, {useState} from 'react';
import {View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {router} from "expo-router";

const FitnessScreen = () => {

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['rgba(0,0,0,0.8)', 'transparent']}
            style={styles.background}
        >
            <View style={styles.content}>
                <Text style={styles.title}>ATHLO</Text>
                <Image source={require('@/assets/images/app-icon.png')} style={styles.runnerImage}/>
                <Text style={styles.title}>BOOSTX</Text>

            </View>

            <LinearGradient
                // Background Linear Gradient
                style={styles.blackBox}
                colors={['rgba(60,60,60,0.8)', 'rgba(0,0,0,1)']}
            >
                <View style={styles.tag}>
                    <Text style={styles.tagline}>FIND YOUR</Text>
                    <Text style={styles.tagline}>STRENGTH</Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/(tabs)/profile')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </LinearGradient>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    runnerImage: {
        height: 250,
        resizeMode: 'contain',
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    blackBox: {
        borderRadius: 25,
        width: '80%',
        height: '25%',
        paddingVertical: 20,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '15%',
    },
    tag: {
        marginBottom: '10%',
    },
    tagline: {
        fontSize: 22,
        fontStyle: 'italic',
        color: 'white',
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: '5%'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default FitnessScreen;
