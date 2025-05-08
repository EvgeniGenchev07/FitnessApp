import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
    const { colors } = useTheme();
    const { t } = useLanguage();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarItemStyle: {
                    height: 60,
                    paddingTop: 15,
                },
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                        elevation: 30,
                        shadowOpacity: 1,
                        shadowColor: colors.shadow,
                        outline: 'none',
                        width: '90%',
                        marginLeft: '5%',
                        marginRight: 'auto',
                        borderRadius: 50,
                        bottom: 20,
                        borderTopWidth: 0,
                        backgroundColor: colors.background,
                        paddingHorizontal: 15,
                    },
                    default: {
                        position: 'absolute',
                        elevation: 0,
                        shadowOpacity: 5,
                        shadowColor: colors.shadow,
                        outline: 'none',
                        marginLeft: '5%',
                        marginRight: 'auto',
                        width: '90%',
                        borderRadius: 50,
                        bottom: 20,
                        borderTopWidth: 0,
                        backgroundColor: colors.background,
                        paddingHorizontal: 15,
                    },
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.home'),
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.2x2" color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: t('tabs.explore'),
                    tabBarIcon: ({ color }) => <MaterialIcons name="article" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="createPost"
                options={{
                    tabBarItemStyle: {
                        marginBottom: 40,
                        borderRadius: 30,
                        backgroundColor: colors.background,
                        height: 60,
                        width: 60,
                        top: -20,
                        zIndex: 2,
                        elevation: 20,
                    },
                    title: t('tabs.createPost'),
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus" color={color} />,
                }}
            />
            <Tabs.Screen
                name="nutritions"
                options={{
                    title: t('tabs.nutrition'),
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="n.circle.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('tabs.profile'),
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
                }}
            />
        </Tabs>
    );
}
