import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Animated, TouchableOpacity, Platform, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Replace this with your own image

const GetStarted = () => {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#181A1B', '#232323']}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.logoContainer}>
                    <MaterialCommunityIcons name="dumbbell" size={60} color="#ff0019" />
                </View>
                <Text style={styles.subtitle}>ATHLOBOOSTX</Text>
                <Text style={styles.title}>VOLUME UP YOUR{"\n"}BODY GOALS</Text>
                <Image source={require('../assets/images/intro.png')} style={styles.heroImage} resizeMode="cover" />
                <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/login')}>
                    <Text style={styles.ctaButtonText}>START BUILDING YOUR BODY</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/register')}>
                    <Text style={styles.registerText}>DON'T HAVE ANY ACCOUNT? <Text style={styles.registerTextBold}>REGISTER</Text></Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181A1B',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(59, 59, 59, 0.26)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    subtitle: {
        color: '#ff0019',
        fontSize: 18,
        letterSpacing: 2,
        marginBottom: 10,
        fontWeight: '600',
    },
    title: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        letterSpacing: 1,
        lineHeight: 44,
    },
    heroImage: {
        width: width - 40,
        height: width * 0.75,
        borderRadius: 20,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(230, 255, 0, 0.2)',
    },
    ctaButton: {
        backgroundColor: '#ff0019',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 24,
        width: '100%',
        marginBottom: 20,
        shadowColor: '#ff0019',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    ctaButtonText: {
        color: '#181A1B',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 1,
    },
    registerLink: {
        marginTop: 10,
    },
    registerText: {
        color: '#B0B3B8',
        fontSize: 14,
        textAlign: 'center',
    },
    registerTextBold: {
        color: '#ff0019',
        fontWeight: 'bold',
    },
});

export default GetStarted;
