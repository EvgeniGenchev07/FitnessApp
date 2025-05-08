import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const LanguageScreen = () => {
    const { language, setLanguage, t } = useLanguage();
    const { colors } = useTheme();

    const handleLanguageChange = async (newLang: 'en' | 'bg') => {
        await setLanguage(newLang);
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
                <ThemedText style={styles.headerTitle}>{t('language.title')}</ThemedText>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
                <ThemedText style={styles.currentLanguage}>
                    {t('language.currentLanguage')}
                </ThemedText>

                <TouchableOpacity
                    style={[
                        styles.languageOption,
                        { backgroundColor: colors.card },
                        language === 'en' && styles.selectedLanguage
                    ]}
                    onPress={() => handleLanguageChange('en')}
                >
                    <View style={styles.languageInfo}>
                        <ThemedText style={styles.languageName}>
                            {t('language.english')}
                        </ThemedText>
                    </View>
                    {language === 'en' && (
                        <Ionicons name="checkmark-circle" size={24} color="#6B4EFF" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.languageOption,
                        { backgroundColor: colors.card },
                        language === 'bg' && styles.selectedLanguage
                    ]}
                    onPress={() => handleLanguageChange('bg')}
                >
                    <View style={styles.languageInfo}>
                        <ThemedText style={styles.languageName}>
                            {t('language.bulgarian')}
                        </ThemedText>
                    </View>
                    {language === 'bg' && (
                        <Ionicons name="checkmark-circle" size={24} color="#6B4EFF" />
                    )}
                </TouchableOpacity>
            </View>
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
    currentLanguage: {
        fontSize: 16,
        opacity: 0.7,
        marginBottom: 20,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '500',
    },
    selectedLanguage: {
        borderWidth: 1,
        borderColor: '#6B4EFF',
    },
});

export default LanguageScreen; 