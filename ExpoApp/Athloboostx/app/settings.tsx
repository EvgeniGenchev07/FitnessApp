import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Switch,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert,
    Platform,
    Linking
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import * as SecureStore from 'expo-secure-store';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import Status from '@/serviceLayer/status';
import { DeleteAccount, Logout } from '@/serviceLayer/managerHandler';

const SettingsScreen = () => {
    const { t } = useLanguage();
    const { theme, setTheme, colors } = useTheme();
    const colorScheme = useColorScheme();
    
    const handleThemeChange = async (value: boolean) => {
        await setTheme(value ? 'dark' : 'light');
    };

    const handleLogout = () => {
        Alert.alert(
            t('settings.confirmLogout'),
            '',
            [
                {
                    text: t('settings.cancel'),
                    style: 'cancel'
                },
                {
                    text: t('settings.confirm'),
                    onPress: async () => {
                        try {
                            const res = await Logout();
                            if(!res || res !== Status.OK){
                                Alert.alert(t('settings.errorLoggingOut'));
                                return;
                            }
                            else{
                                router.replace('/');
                            }
                        } catch (error) {
                            console.error('Error logging out:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            t('settings.confirmDelete'),
            '',
            [
                {
                    text: t('settings.cancel'),
                    style: 'cancel'
                },
                {
                    text: t('settings.confirm'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const res = await DeleteAccount();
                            if(!res || res !== Status.OK){
                                Alert.alert(t('settings.errorDeletingAccount'));
                                return;
                            }
                            else{
                                router.replace('/');
                            }
                        } catch (error) {
                            console.error('Error deleting account:', error);
                        }
                    }
                }
            ]
        );
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>{t('settings.title')}</ThemedText>
            <View style={styles.placeholder} />
        </View>
    );

    const renderSection = (title: string, children: React.ReactNode) => (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
            <View style={styles.sectionContent}>
                {children}
            </View>
            </View>
    );

    const renderOption = (
        title: string,
        icon: string,
        onPress?: () => void,
        rightElement?: React.ReactNode
    ) => (
        <TouchableOpacity 
            style={[styles.option, { backgroundColor: colors.card }]} 
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.optionLeft}>
                <Ionicons name={icon as any} size={22} color={colors.text} style={styles.optionIcon} />
                <ThemedText style={styles.optionText}>{title}</ThemedText>
            </View>
            {rightElement || (onPress && <Ionicons name="chevron-forward" size={20} color={colors.text} />)}
            </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {renderHeader()}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {renderSection("Account", (
                    <>
                        {renderOption("Edit Profile", "person-outline", () => router.push('/editProfile'))}
                        {renderOption("Change Password", "lock-closed-outline", () => router.push('/changePassword'))}
                        {renderOption("Privacy Settings", "shield-outline", () => router.push('/privacy'))}
                    </>
                ))}

                {renderSection("Preferences", (
                    <>
                        {renderOption("Language", "language-outline", () => router.push('/language'))}
                        {renderOption("Dark Mode", "moon-outline", undefined, 
                            <Switch 
                                value={theme === 'dark'} 
                                onValueChange={handleThemeChange}
                                trackColor={{ false: colors.border, true: '#6B4EFF' }}
                                thumbColor={theme === 'dark' ? '#fff' : colors.text}
                            />
                        )}
                    </>
                ))}

                {renderSection("Support", (
                    <>
                        {renderOption("Help Center", "help-circle-outline", () => router.push('/help'))}
                        {renderOption("Report Bug", "bug-outline", () => router.push('/reportBug'))}
                        {renderOption("Contact Us", "mail-outline", () => Linking.openURL('mailto:athloboostx@gmail.com'))}
                    </>
                ))}

                {renderSection("About", (
                    <>
                        {renderOption("Terms of Service", "document-text-outline", () => router.push('/terms'))}
                        {renderOption("Privacy Policy", "shield-checkmark-outline", () => router.push('/privacy'))}
                        {renderOption("App Version", "information-circle-outline", undefined, 
                            <ThemedText style={styles.versionText}>1.0.0</ThemedText>
                        )}
                    </>
                ))}

                <TouchableOpacity 
                    style={[styles.logoutButton, { backgroundColor: colors.card }]} 
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={22} color="#FF3B30" style={styles.optionIcon} />
                    <ThemedText style={[styles.optionText, { color: '#FF3B30' }]}>{t('settings.logout')}</ThemedText>
            </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.deleteButton, { backgroundColor: colors.card }]} 
                    onPress={handleDeleteAccount}
                >
                    <Ionicons name="trash-outline" size={22} color="#FF3B30" style={styles.optionIcon} />
                    <ThemedText style={[styles.optionText, { color: '#FF3B30' }]}>{t('settings.deleteAccount')}</ThemedText>
            </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        opacity: 0.7,
    },
    sectionContent: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 1,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        marginRight: 12,
    },
    optionText: {
        fontSize: 16,
    },
    versionText: {
        fontSize: 14,
        opacity: 0.7,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginTop: 24,
        marginBottom: 12,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
});

export default SettingsScreen;
