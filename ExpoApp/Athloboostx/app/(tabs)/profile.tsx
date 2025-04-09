import React from 'react';
import {View, Text, StyleSheet, Image, FlatList, TouchableOpacity, useColorScheme} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PostsTab from './../posts';
import ReelsTab from './../workouts';
import SavedTab from './../meals';
import posts from "./../posts";
import {ThemedText} from "@/components/ThemedText";
import {ThemedBackground} from "@/components/ThemedBackground";
import {ThemedView} from "@/components/ThemedView";
import {Colors} from "@/constants/Colors";
import {ThemedButton} from "@/components/ThemedButton";
import Icon from "react-native-vector-icons/Feather";
import { Ionicons, Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
const Tab = createMaterialTopTabNavigator();

function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
    return (
        <ThemedView type={'default'} style={styles.container}>
            <View style={styles.profileContainer}>
                <TouchableOpacity>
                <Image source={require('@/assets/images/man-avatar-icon-free-vector-3688420316.jpg')}
                       style={styles.profileImage}/>
                    <View style={styles.editIcon}>
                        <Text style={styles.editText}>✎</Text>
                    </View>
                </TouchableOpacity>
                <ThemedText type={'subtitle'}>John Doe</ThemedText>

                <ThemedText style={styles.description} type={'description'}>123 Maple Street, Anytown, PA 17101</ThemedText>

                <View style={styles.stats}>
                    <View style={styles.stats_el}>
                        <ThemedText type={'defaultBold'}>100</ThemedText>
                        <ThemedText type={'description'}>Followers</ThemedText>
                    </View>
                    <View style={styles.stats_el}>
                        <ThemedText type={'defaultBold'}>1000</ThemedText>
                        <ThemedText type={'description'}>Followers</ThemedText>
                    </View>
                    <View style={styles.stats_el}>
                        <ThemedText type={'defaultBold'}>100000</ThemedText>
                        <ThemedText type={'description'}>Likes</ThemedText>
                    </View>
                </View>
                <View style={styles.container_buttons}>

                    <ThemedButton type={"default"} style={styles.follow_button}>
                        <ThemedText type={"button"}>Follow</ThemedText>
                    </ThemedButton>
                    <ThemedButton type={"icon"} style={{marginLeft:10}}>
                        <Ionicons style={[styles.icon_social,{color: colors.borderColor}]} name="share-social" size={24} />
                    </ThemedButton>
                </View>
            </View>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: 'white',
                    tabBarStyle: {backgroundColor: colors.background},
                    tabBarIndicatorStyle: {backgroundColor: 'white'},
                    tabBarInactiveTintColor: 'gray'
                }}>
                <Tab.Screen name="Posts" component={PostsTab} />
                <Tab.Screen name="Workouts" component={ReelsTab}/>
                <Tab.Screen name="Favorite Foods" component={SavedTab} />
            </Tab.Navigator>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: 200,
        marginTop: 10
    },
    stats_el:{
        flexDirection: 'column',
        marginInline: 20,
        alignItems: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 15
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
        width: '20%',
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
    description:{
        marginTop: 20,
    },
    info: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5
    },
    container_buttons:{
        flexDirection: 'row',
        marginInline: 20,
        marginBottom: 10,
        marginTop:-10
    },
    follow_button:{
        width: '50%',
    },
    icon_social:{
        paddingRight: 10,
        paddingLeft: 10,
    }
});

export default ProfileScreen;
