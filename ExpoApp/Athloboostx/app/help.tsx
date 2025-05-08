import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const faqs = [
    {
        question: 'How do I create a workout?',
        answer: 'To create a workout, go to the home screen and tap the "+" button. You can then add exercises, set reps and weights, and save your workout.'
    },
    {
        question: 'How do I track my progress?',
        answer: 'Your progress is automatically tracked in the Statistics tab. You can view your workout history, personal records, and progress charts.'
    },
    {
        question: 'Can I share my workouts?',
        answer: 'Yes! You can share your workouts with friends by tapping the share button on any workout. They can then import it into their app.'
    },
    {
        question: 'How do I change my profile settings?',
        answer: 'Go to the Settings tab and tap on "Edit Profile". Here you can update your personal information, profile picture, and preferences.'
    }
];

const HelpScreen = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    const handleContactSupport = () => {
        Linking.openURL('mailto:athloboostx@gmail.com');
    };

    const handleReportBug = () => {
        router.push('/reportBug');
    };

    const handleSendFeedback = () => {
        router.push('/feedback');
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
                <ThemedText style={styles.headerTitle}>{t('help.title')}</ThemedText>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>
                        {t('help.faq')}
                    </ThemedText>
                    {faqs.map((faq, index) => (
                        <View
                            key={index}
                            style={[styles.faqItem, { backgroundColor: colors.card }]}
                        >
                            <ThemedText style={styles.question}>
                                {faq.question}
                            </ThemedText>
                            <ThemedText style={styles.answer}>
                                {faq.answer}
                            </ThemedText>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>
                        {t('help.contact')}
                    </ThemedText>
                    <TouchableOpacity
                        style={[styles.contactOption, { backgroundColor: colors.card }]}
                        onPress={handleContactSupport}
                    >
                        <Ionicons name="mail-outline" size={24} color={colors.text} />
                        <ThemedText style={styles.contactText}>
                            {t('help.contact')}
                        </ThemedText>
                        <Ionicons name="chevron-forward" size={20} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.contactOption, { backgroundColor: colors.card }]}
                        onPress={handleReportBug}
                    >
                        <Ionicons name="bug-outline" size={24} color={colors.text} />
                        <ThemedText style={styles.contactText}>
                            {t('help.report')}
                        </ThemedText>
                        <Ionicons name="chevron-forward" size={20} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.contactOption, { backgroundColor: colors.card }]}
                        onPress={handleSendFeedback}
                    >
                        <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
                        <ThemedText style={styles.contactText}>
                            {t('help.feedback')}
                        </ThemedText>
                        <Ionicons name="chevron-forward" size={20} color={colors.text} />
                    </TouchableOpacity>
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
    faqItem: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    answer: {
        fontSize: 14,
        opacity: 0.7,
        lineHeight: 20,
    },
    contactOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    contactText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
    },
});

export default HelpScreen; 