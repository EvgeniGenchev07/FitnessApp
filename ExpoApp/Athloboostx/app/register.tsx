import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, ImageBackground} from 'react-native';
import {useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {Colors} from "@/constants/Colors";
import Icon from "react-native-vector-icons/Feather";
import {Login, Register} from "@/serviceLayer/managerHandler";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import {ThemedButton} from "@/components/ThemedButton";

const RegisterScreen: React.FC = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});

    const OnPressRegister = async () => {
        const errors = await Register(email, password,username);
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
                    <ThemedText type={'title'}>Register</ThemedText>
                    <TextInput
                        style={[styles.input, errors.username && styles.errorInput, {color: colors.text}, {backgroundColor: colors.inputColor}, {marginBottom: '2%'}]}
                        placeholder="Username"
                        placeholderTextColor="#aaa"
                        value={username}
                        onChangeText={setUsername}
                    />
                    {errors.username && <ThemedText type={'error'}>{errors.username}</ThemedText>}
                    <TextInput
                        style={[styles.input, errors.email && styles.errorInput, {color: colors.text}, {backgroundColor: colors.inputColor}]}
                        placeholder="E-mail"
                        placeholderTextColor="#aaa"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    {errors.email && <ThemedText type={'error'}>{errors.email}</ThemedText>}
                    <ThemedView type={'content_input'}>

                        <TextInput
                            style={[styles.input, errors.password && styles.errorInput, {color: colors.text}, {backgroundColor: colors.inputColor}]}
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
                    {errors.register && <ThemedText type={'error'}>{errors.register}</ThemedText>}
                    <ThemedButton type={'default'}
                                  onPress={OnPressRegister}>
                        <ThemedText type={"button"}>Register</ThemedText>
                    </ThemedButton>
                </ThemedView>
                <ThemedView type={'side_content'}>
                    <TouchableOpacity onPress={() => router.push('/login')}>
                        <ThemedText type={'defaultBold'}>Already have an account?
                            <ThemedText type={'button'}> Login</ThemedText></ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    container_image: {
        flex: 1,
        position: 'absolute',
        zIndex: -2,
        height: '70%',
        width: '105%',
        top: 0,
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
    },
});

export default RegisterScreen;
