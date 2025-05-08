import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const TermsScreen = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>{t('terms.title')}</ThemedText>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ThemedText style={[styles.sectionTitle, { color: colors.tint }]}>{t('terms.acceptance.title')}</ThemedText>
                    <ThemedText style={[styles.text, { color: colors.text }]}>
                        {t('terms.acceptance.content')}
                    </ThemedText>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ThemedText style={[styles.sectionTitle, { color: colors.tint }]}>{t('terms.service.title')}</ThemedText>
                    <ThemedText style={[styles.text, { color: colors.text }]}>
                        {t('terms.service.content')}
                    </ThemedText>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ThemedText style={[styles.sectionTitle, { color: colors.tint }]}>{t('terms.accounts.title')}</ThemedText>
                    <ThemedText style={[styles.text, { color: colors.text }]}>
                        {t('terms.accounts.content')}
                    </ThemedText>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ThemedText style={[styles.sectionTitle, { color: colors.tint }]}>{t('terms.privacy.title')}</ThemedText>
                    <ThemedText style={[styles.text, { color: colors.text }]}>
                        {t('terms.privacy.content')}
                    </ThemedText>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ThemedText style={[styles.sectionTitle, { color: colors.tint }]}>{t('terms.intellectual.title')}</ThemedText>
                    <ThemedText style={[styles.text, { color: colors.text }]}>
                        {t('terms.intellectual.content')}
                    </ThemedText>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ThemedText style={[styles.sectionTitle, { color: colors.tint }]}>{t('terms.liability.title')}</ThemedText>
                    <ThemedText style={[styles.text, { color: colors.text }]}>
                        {t('terms.liability.content')}
                    </ThemedText>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ThemedText style={[styles.sectionTitle, { color: colors.tint }]}>{t('terms.changes.title')}</ThemedText>
                    <ThemedText style={[styles.text, { color: colors.text }]}>
                        {t('terms.changes.content')}
                    </ThemedText>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ThemedText style={[styles.sectionTitle, { color: colors.tint }]}>{t('terms.contact.title')}</ThemedText>
                    <ThemedText style={[styles.text, { color: colors.text }]}>
                        {t('terms.contact.content')}
                    </ThemedText>
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
        borderBottomWidth: 1,
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
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.8,
    },
});

export default TermsScreen; 