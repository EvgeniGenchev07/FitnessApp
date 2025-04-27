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

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <NavigationContainer>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarItemStyle: {
                        height: 60, // Ensure the button has a proper height
                        paddingTop: 15,
                    },
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
                            backgroundColor: Colors[colorScheme ?? 'light'].background,
                            paddingHorizontal: 15, // Adjust padding if necessary
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
                            backgroundColor: Colors[colorScheme ?? 'light'].background,
                            paddingHorizontal: 15, // Adjust padding if necessary
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
                    name="createPost"
                    options={{
                        tabBarItemStyle: {
                            marginBottom: 40,
                            borderRadius: 30, // Ensure the button is circular
                            backgroundColor: Colors[colorScheme ?? 'light'].background,
                            height: 60, // Circle size (same width and height)
                            width: 60,  // Circle size (same width and height)
                            top: -20,
                            zIndex: 2, // Ensure it's above other tab items
                            elevation: 20,
                        },
                        title: 'Create Post',
                        tabBarIcon: ({color}) => <IconSymbol size={28} name='plus' color={color}/>,
                    }}
                />
                <Tabs.Screen
                    name="nutritions"
                    options={{
                        title: 'Nutrition',
                        tabBarIcon: ({color}) => <IconSymbol size={28} name="n.circle.fill" color={color}/>,
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
