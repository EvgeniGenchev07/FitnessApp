import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    Text,
    SafeAreaView,
    StatusBar
} from 'react-native';
import {useRouter} from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import {Colors} from "@/constants/Colors";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {ThemedButton} from "@/components/ThemedButton";

const ChangePasswordScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [secureTextEntryCurr, setSecureTextEntryCurr] = useState(false);
    const [secureTextEntryNew, setSecureTextEntryNew] = useState(false);
    const [secureTextEntryConf, setSecureTextEntryConf] = useState(false);

    const handleChangePassword = () => {
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        router.push('/test');
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
            <ThemedView type={'top_bar'}>
                <TouchableOpacity style={styles.top_icon_content} onPress={() => router.push('/test')}>
                    <Icon name="chevron-left" size={28} color="red"/>
                    <ThemedText type={'bar'}>Back</ThemedText>
                </TouchableOpacity>
            </ThemedView>

            <ThemedView type={'content'}>

                <ThemedView type={'content_input'}>

                    <TextInput
                        style={[styles.input, {color: colors.text}, {backgroundColor: colors.inputColor}]}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        value={currentPassword}
                        secureTextEntry={!secureTextEntryCurr}
                        keyboardType="visible-password"
                        onChangeText={setCurrentPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureTextEntryCurr(!secureTextEntryCurr)}>
                        <Icon
                            style={[styles.eye_icon, {backgroundColor: colors.inputColor}]}
                            name={secureTextEntryCurr ? "eye" : "eye-off"}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </ThemedView>
                <ThemedView type={'content_input'}>

                    <TextInput
                        style={[styles.input, {color: colors.text}, {backgroundColor: colors.inputColor}]}
                        placeholder="New Password"
                        placeholderTextColor="#aaa"
                        value={newPassword}
                        secureTextEntry={!secureTextEntryNew}
                        keyboardType="visible-password"
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureTextEntryNew(!secureTextEntryNew)}>
                        <Icon
                            style={[styles.eye_icon, {backgroundColor: colors.inputColor}]}
                            name={secureTextEntryNew ? "eye" : "eye-off"}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </ThemedView>
                <ThemedView type={'content_input'}>

                    <TextInput
                        style={[styles.input, {color: colors.text}, {backgroundColor: colors.inputColor}]}
                        placeholder="Conform Password"
                        placeholderTextColor="#aaa"
                        value={confirmNewPassword}
                        secureTextEntry={!secureTextEntryConf}
                        keyboardType="visible-password"
                        onChangeText={setConfirmNewPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureTextEntryConf(!secureTextEntryConf)}>
                        <Icon
                            style={[styles.eye_icon, {backgroundColor: colors.inputColor}]}
                            name={secureTextEntryConf ? "eye" : "eye-off"}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </ThemedView>
                {error ? <ThemedText type={'error'}>{error}</ThemedText> : null}
                <ThemedButton onPress={handleChangePassword}
                              type={'default'}>
                    <ThemedText type={'button'}> Change Password</ThemedText>
                </ThemedButton>
            </ThemedView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    top_icon_content: {
        flexDirection: 'row',
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
});

export default ChangePasswordScreen;
