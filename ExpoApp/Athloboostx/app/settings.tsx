import React, {useState} from 'react';
import {View, Text, Switch, Image, TouchableOpacity, StyleSheet, ScrollView, StatusBar} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import {ThemedView} from "@/components/ThemedView";
import {router} from "expo-router";

const SettingsScreen = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top_icon_container}>
                <TouchableOpacity style={styles.top_icon_content} onPress={() => router.push('/test')}>
                    <Icon name="chevron-left" size={25} color="black"/>
                    <Text style={styles.top_icon_text}>Back</Text>
                </TouchableOpacity>
            </View>
            {/*<View style={styles.profileContainer}>
                <Image source={require('@/assets/images/man-avatar-icon-free-vector-3688420316.jpg')}
                       style={styles.profileImage}/>
                <TouchableOpacity style={styles.editIcon}>
                    <Text style={styles.editText}>✎</Text>
                </TouchableOpacity>
                <Text style={styles.name}>John Doe</Text>
                <Text style={styles.address}>123 Maple Street, Anytown, PA 17101</Text>
            </View>*/}
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
            <TouchableOpacity style={styles.switchContainer}>
                <Text style={styles.optionText}>Language</Text>
                <Icon name="chevron-right" style={styles.icon_option}/>
            </TouchableOpacity>
            <View style={styles.switchContainer}>
                <Text style={styles.optionText}>Dark Mode</Text>
                <Switch style={styles.switch} value={darkMode} onValueChange={() => setDarkMode(!darkMode)}/>
            </View>
            <TouchableOpacity style={styles.switchContainer}>
                <Text style={styles.optionText}>Location</Text>
                <Icon name="chevron-right" style={styles.icon_option}/>
            </TouchableOpacity>
            <View style={styles.switchContainer}>
                <Text style={styles.optionText}>Email Notifications</Text>
                <Switch style={styles.switch} value={emailNotifications}
                        onValueChange={() => setEmailNotifications(!emailNotifications)}/>
            </View>
            <View style={styles.switchContainer}>
                <Text style={styles.optionText}>Push Notifications</Text>
                <Switch style={styles.switch} value={pushNotifications}
                        onValueChange={() => setPushNotifications(!pushNotifications)}/>
            </View>
            <Text style={styles.sectionTitle}>RESOURCES</Text>
            <TouchableOpacity style={styles.switchContainer}>
                <Text style={styles.optionText}>Report Bug</Text>
                <Icon name="chevron-right" style={styles.icon_option}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchContainer}>
                <Text style={styles.optionText}>Contact Us</Text>
                <Icon name="chevron-right" style={styles.icon_option}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchContainer}>
                <Text style={styles.optionText}>Rate us</Text>
                <Icon name="chevron-right" style={styles.icon_option}/>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    top_icon_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    top_icon_content: {
        flexDirection: 'row',
    },
    top_icon_text: {
        fontSize: 20,
        color: 'red'

    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: -20,
        zIndex: 90
    },
    editIcon: {
        position: 'relative',
        bottom: 10,
        marginLeft: '15%',
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 5,
        zIndex: 99
    },
    editText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10
    },
    address: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'rgba(200,200,200,1)',
        marginTop: 20,
        marginBottom: 20
    },
    optionText: {
        fontSize: 16,
        marginLeft: 15
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: 'rgba(200,200,200,0.2)', //rgba(235,228,228,0.27)
        marginBottom: 12,
        borderRadius: 7,
        height: 50,
    },
    switch: {
        marginRight: 10
    },
    icon_option: {
        fontSize: 25,
        color: 'rgba(180,180,180,1)',
        marginRight: 5,
    }
});
export default SettingsScreen;
