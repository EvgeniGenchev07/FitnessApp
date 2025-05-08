import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const feedbackTypes = [
    { id: 'feature', label: 'Feature Request' },
    { id: 'improvement', label: 'Improvement Suggestion' },
    { id: 'other', label: 'Other' }
];

const FeedbackScreen = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!type || !title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const feedback = {
                type,
                title,
                description,
                platform: Platform.OS,
                version: Platform.Version,
                timestamp: new Date().toISOString(),
            };

            // TODO: Implement API call to submit feedback
            console.log('Feedback:', feedback);

            Alert.alert(
                'Success',
                'Thank you for your feedback! We appreciate your input.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert('Error', 'Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                <ThemedText style={styles.headerTitle}>Send Feedback</ThemedText>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Feedback Type *</ThemedText>
                        <View style={styles.typeOptions}>
                            {feedbackTypes.map((feedbackType) => (
                                <TouchableOpacity
                                    key={feedbackType.id}
                                    style={[
                                        styles.typeOption,
                                        { backgroundColor: colors.card },
                                        type === feedbackType.id && styles.selectedType
                                    ]}
                                    onPress={() => setType(feedbackType.id)}
                                >
                                    <ThemedText style={[
                                        styles.typeText,
                                        type === feedbackType.id && styles.selectedTypeText
                                    ]}>
                                        {feedbackType.label}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Title *</ThemedText>
                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder="Brief summary of your feedback"
                            placeholderTextColor={colors.text + '80'}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Description *</ThemedText>
                        <TextInput
                            style={[styles.input, styles.textArea, { 
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder="Detailed description of your feedback"
                            placeholderTextColor={colors.text + '80'}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: colors.buttonBackground }]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <ThemedText style={styles.submitButtonText}>
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </ThemedText>
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
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    typeOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedType: {
        borderColor: '#6B4EFF',
        backgroundColor: '#6B4EFF20',
    },
    typeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    selectedTypeText: {
        color: '#6B4EFF',
    },
    input: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
    },
    textArea: {
        height: 150,
        paddingTop: 12,
    },
    submitButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FeedbackScreen; 