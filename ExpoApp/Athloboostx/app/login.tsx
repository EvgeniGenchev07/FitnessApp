import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ImageBackground, useColorScheme, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Login } from "@/serviceLayer/managerHandler";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface LoginErrors {
    email?: string;
    password?: string;
    login?: string;
}

const LoginScreen: React.FC = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({});

    const OnPressLogin = async () => {
        const errors = await Login(email, password);
        if(errors) {
            setErrors(errors);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ImageBackground 
                style={styles.backgroundImage}
                source={require('@/assets/images/login-pic.png')}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']}
                    style={styles.overlay}
                >
                    <ThemedView type={'blur'} style={styles.formContainer}>
                        <View style={styles.logoContainer}>
                            <MaterialCommunityIcons name="dumbbell" size={50} color="#ff0019" />
                            <ThemedText type={'title'} style={styles.title}>ATHLOBOOSTX</ThemedText>
                        </View>

                        <ThemedView type={'content'} style={styles.inputContainer}>
                            <ThemedText type={'subtitle'} style={styles.welcomeText}>Welcome Back!</ThemedText>
                            
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="email-outline" size={24} color={colors.text} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, errors.email && styles.errorInput, { color: colors.text }]}
                                    placeholder="Email"
                                    placeholderTextColor="#aaa"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                            {errors.email && <ThemedText type={'error'}>{errors.email}</ThemedText>}

                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="lock-outline" size={24} color={colors.text} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Password"
                                    placeholderTextColor="#aaa"
                                    value={password}
                                    secureTextEntry={!isPasswordVisible}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon} 
                                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                >
                                    <MaterialCommunityIcons
                                        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                        size={24}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <ThemedText type={'error'}>{errors.password}</ThemedText>}
                            {errors.login && <ThemedText type={'error'}>{errors.login}</ThemedText>}

                            <ThemedButton
                                type={'default'}
                                style={[styles.loginButton, {borderColor: colors.borderColor}]}
                                onPress={OnPressLogin}
                            >
                                <ThemedText type={'button'}>Login</ThemedText>
                            </ThemedButton>

                            <TouchableOpacity 
                                style={styles.registerLink}
                                onPress={() => router.push('/register')}
                            >
                                <ThemedText type={'default'}>Don't have an account? </ThemedText>
                                <ThemedText type={'button'}>Register</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>
                </LinearGradient>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: width,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        overflow: 'hidden',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
    },
    inputContainer: {
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
    },
    errorInput: {
        borderColor: 'red',
        borderWidth: 1,
    },
    loginButton: {
        marginTop: 20,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    registerLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
});

export default LoginScreen;
