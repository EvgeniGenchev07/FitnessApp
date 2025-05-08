import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import * as SecureStore from 'expo-secure-store';

interface PrivacySettings {
    profileVisibility: 'public' | 'private' | 'friendsOnly';
    analytics: boolean;
    crashReports: boolean;
    marketing: boolean;
}

const PrivacyScreen = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    const [settings, setSettings] = useState<PrivacySettings>({
        profileVisibility: 'public',
        analytics: true,
        crashReports: true,
        marketing: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await SecureStore.getItemAsync('privacySettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Error loading privacy settings:', error);
        }
    };

    const saveSettings = async (newSettings: PrivacySettings) => {
        try {
            await SecureStore.setItemAsync('privacySettings', JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving privacy settings:', error);
        }
    };

    const handleVisibilityChange = (visibility: 'public' | 'private' | 'friendsOnly') => {
        saveSettings({ ...settings, profileVisibility: visibility });
    };

    const handleToggle = (key: keyof PrivacySettings) => {
        if (key !== 'profileVisibility') {
            saveSettings({ ...settings, [key]: !settings[key] });
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>{t('privacy.title')}</ThemedText>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>
                        {t('privacy.profileVisibility')}
                    </ThemedText>
                    <View style={styles.visibilityOptions}>
                        {(['public', 'private', 'friendsOnly'] as const).map((visibility) => (
                            <TouchableOpacity
                                key={visibility}
                                style={[
                                    styles.visibilityOption,
                                    { backgroundColor: colors.card },
                                    settings.profileVisibility === visibility && styles.selectedVisibility
                                ]}
                                onPress={() => handleVisibilityChange(visibility)}
                            >
                                <ThemedText style={styles.visibilityText}>
                                    {t(`privacy.${visibility}`)}
                                </ThemedText>
                                {settings.profileVisibility === visibility && (
                                    <Ionicons name="checkmark-circle" size={24} color="#6B4EFF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>
                        {t('privacy.dataCollection')}
                    </ThemedText>
                    <View style={styles.toggleOptions}>
                        {(['analytics', 'crashReports', 'marketing'] as const).map((option) => (
                            <View
                                key={option}
                                style={[styles.toggleOption, { backgroundColor: colors.card }]}
                            >
                                <ThemedText style={styles.toggleText}>
                                    {t(`privacy.${option}`)}
                                </ThemedText>
                                <Switch
                                    value={settings[option]}
                                    onValueChange={() => handleToggle(option)}
                                    trackColor={{ false: colors.border, true: '#6B4EFF' }}
                                    thumbColor={settings[option] ? '#fff' : colors.text}
                                />
                            </View>
                        ))}
                    </View>
                </View>
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
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        opacity: 0.7,
    },
    visibilityOptions: {
        gap: 12,
    },
    visibilityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
    },
    selectedVisibility: {
        borderWidth: 1,
        borderColor: '#6B4EFF',
    },
    visibilityText: {
        fontSize: 16,
        fontWeight: '500',
    },
    toggleOptions: {
        gap: 12,
    },
    toggleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default PrivacyScreen; 