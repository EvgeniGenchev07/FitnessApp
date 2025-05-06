import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, useColorScheme} from 'react-native';
import {useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from "@/constants/Colors";
import Icon from "react-native-vector-icons/Feather";
import {Login} from "@/serviceLayer/managerHandler";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {ThemedButton} from "@/components/ThemedButton";

const LoginScreen: React.FC = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});

    const OnPressLogin = async () => {
        const errors = await Login(email, password);
        if(errors) {
            setErrors(errors);
        }
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
            <ImageBackground style={styles.container_image}
                             source={require('@/assets/images/splash.png')}>
            </ImageBackground>
            <ThemedView type={'blur'}>

                <ThemedView type={'content'}>

                    <ThemedText type={'title'}>Login</ThemedText>
                    <TextInput
                        style={[styles.input, errors.email && styles.errorInput, {color: colors.text}, {backgroundColor: colors.inputColor}]}
                        placeholder="E-mail"
                        placeholderTextColor="#aaa"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    <ThemedView type={'content_input'}>

                        <TextInput
                            style={[styles.input, {color: colors.text}, {backgroundColor: colors.inputColor}]}
                            placeholder="Password"
                            placeholderTextColor="#aaa"
                            value={password}
                            secureTextEntry={!isPasswordVisible}
                            keyboardType="visible-password"
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <Icon
                                style={[styles.eye_icon, {backgroundColor: colors.inputColor}]}
                                name={isPasswordVisible ? "eye" : "eye-off"}
                                size={24}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </ThemedView>
                    {errors.password && <ThemedText type={'error'}>{errors.password}</ThemedText>}
                    {errors.login && <ThemedText type={'error'}>{errors.login}</ThemedText>}
                    <ThemedButton
                        type={'default'}
                        onPress={OnPressLogin}>
                        <ThemedText type={'button'}>Login</ThemedText>
                    </ThemedButton>
                </ThemedView>
                <ThemedView type={'side_content'}>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <ThemedText type={'defaultBold'}>Don't you have an account?
                            <ThemedText type={'button'}> Register</ThemedText>
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    container_image: {
        flex: 1,
        position: 'absolute',
        zIndex: -2,
        height: '70%',
        width: '105%',
        top: 1,
        left: 0,
        resizeMode: 'contain',
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: '4%',
    },
    eye_icon: {
        position: "absolute",
        right: 15,
        bottom: '-10%',
    },
    errorInput: {
        borderColor: "red",
        borderWidth: 1,
    }
});

export default LoginScreen;
