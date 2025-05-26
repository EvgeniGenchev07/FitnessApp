import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, useColorScheme, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Login, Register } from "@/serviceLayer/managerHandler";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface RegisterErrors {
    email?: string;
    password?: string;
    username?: string;
    register?: string;
}

const RegisterScreen: React.FC = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState<RegisterErrors>({});

    const OnPressRegister = async () => {
        const errors = await Register(email, password, username);
        if(errors) {
            setErrors(errors);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ImageBackground 
                style={styles.backgroundImage}
                source={require('@/assets/images/register-pic.png')}
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
                            <ThemedText type={'subtitle'} style={styles.welcomeText}>Create Account</ThemedText>
                            
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="account-outline" size={24} color={colors.text} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, errors.username && styles.errorInput, { color: colors.text }]}
                                    placeholder="Username"
                                    placeholderTextColor="#aaa"
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </View>
                            {errors.username && <ThemedText type={'error'}>{errors.username}</ThemedText>}

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
                                    style={[styles.input, errors.password && styles.errorInput, { color: colors.text }]}
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
                            {errors.register && <ThemedText type={'error'}>{errors.register}</ThemedText>}

                            <ThemedButton
                                type={'default'}
                                style={[styles.registerButton, {borderColor: colors.borderColor}]}
                                onPress={OnPressRegister}
                            >
                                <ThemedText type={'button'}>Register</ThemedText>
                            </ThemedButton>

                            <TouchableOpacity 
                                style={styles.loginLink}
                                onPress={() => router.push('/login')}
                            >
                                <ThemedText type={'default'}>Already have an account? </ThemedText>
                                <ThemedText type={'button'}>Login</ThemedText>
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
    registerButton: {
        marginTop: 20,
        textAlign: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 25,
    },
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
});

export default RegisterScreen;
