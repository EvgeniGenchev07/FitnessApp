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
import * as Device from 'expo-device';

const ReportBugScreen = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const deviceInfo = {
                platform: Platform.OS,
                version: Platform.Version,
                deviceName: Device.deviceName,
                modelName: Device.modelName,
                osVersion: Device.osVersion,
            };

            const bugReport = {
                title,
                description,
                steps,
                deviceInfo,
                timestamp: new Date().toISOString(),
            };

            // TODO: Implement API call to submit bug report
            console.log('Bug report:', bugReport);

            Alert.alert(
                'Success',
                'Thank you for your report! We will review it shortly.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Error submitting bug report:', error);
            Alert.alert('Error', 'Failed to submit bug report. Please try again.');
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
                <ThemedText style={styles.headerTitle}>Report Bug</ThemedText>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Title *</ThemedText>
                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder="Brief description of the issue"
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
                            placeholder="Detailed description of the bug"
                            placeholderTextColor={colors.text + '80'}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Steps to Reproduce</ThemedText>
                        <TextInput
                            style={[styles.input, styles.textArea, { 
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder="1. First step&#10;2. Second step&#10;3. ..."
                            placeholderTextColor={colors.text + '80'}
                            value={steps}
                            onChangeText={setSteps}
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
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
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
    input: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
    },
    textArea: {
        height: 120,
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

export default ReportBugScreen; 