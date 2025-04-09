import {Tabs} from 'expo-router';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {NavigationContainer} from "@react-navigation/native";
import {transparent} from "react-native-paper/lib/typescript/styles/themes/v2/colors";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <NavigationContainer>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    //@ts-ignore
                    tabBarStyle:Platform.select({
                        ios: {
                            position: 'absolute',
                            elevation: 30,
                            shadowOpacity: 1,
                            shadowColor: Colors[colorScheme ?? 'light'].shadow,
                            outline: 'none',
                            width: '90%',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            borderRadius: 50,
                            bottom: 20,
                            left: 'center',
                            right: 'center',
                            borderTopWidth: 0,
                            backgroundColor:Colors[colorScheme ?? 'light'].background
                        },
                        default: {
                            position: 'absolute',
                            elevation: 0,
                            shadowOpacity: 5,
                            shadowColor: Colors[colorScheme ?? 'light'].shadow,
                            outline: 'none',
                            width: '90%',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            borderRadius: 50,
                            bottom: 20,
                            left: 'center',
                            right: 'center',
                            borderTopWidth: 0,
                            backgroundColor:Colors[colorScheme ?? 'light'].background
                        },
                    }),
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({color}) => <IconSymbol size={28} name="square.grid.2x2" color={color}/>,
                    }}
                />
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: 'Explore',
                        tabBarIcon: ({color}) => <MaterialIcons name='article' size={28} color={color} />,
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({color}) => <IconSymbol size={28} name="person" color={color}/>,
                    }}
                />
            </Tabs>
        </NavigationContainer>
    );
}
