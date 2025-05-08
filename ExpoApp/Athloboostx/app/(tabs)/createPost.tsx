import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { API_URL } from '@/config';
import { getUserId } from '@/utils/auth';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const CreatePostScreen = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [showImageOptions, setShowImageOptions] = useState(false);
    const captionInputRef = useRef<TextInput>(null);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                setImage(result.assets[0].uri);
                setShowImageOptions(false);
            }
        } catch (error) {
            Alert.alert(t('common.error'), t('createPost.imageError'));
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(t('common.error'), t('createPost.cameraPermissionError'));
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                setImage(result.assets[0].uri);
                setShowImageOptions(false);
            }
        } catch (error) {
            Alert.alert(t('common.error'), t('createPost.cameraError'));
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const addTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handlePost = async () => {
        if (!image) {
            Alert.alert(t('common.error'), t('createPost.noImagesError'));
            return;
        }

        setLoading(true);
        try {
            const userId = await getUserId();
            const formData = new FormData();
            
            formData.append('image', {
                uri: image,
                type: 'image/jpeg',
                name: 'image.jpg',
            } as any);

            formData.append('caption', caption);
            formData.append('location', location);
            formData.append('tags', JSON.stringify(tags));
            formData.append('email', userId);

            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            Alert.alert(t('common.success'), t('createPost.successMessage'));
            setImage(null);
            setCaption('');
            setLocation('');
            setTags([]);
        } catch (error) {
            Alert.alert(t('common.error'), t('createPost.postError'));
        } finally {
            setLoading(false);
        }
    };

    const ImageOptionsModal = () => (
        <Modal
            visible={showImageOptions}
            transparent
            animationType="fade"
            onRequestClose={() => setShowImageOptions(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowImageOptions(false)}
            >
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        style={[styles.optionButton, { borderBottomColor: colors.border }]}
                        onPress={pickImage}
                    >
                        <Ionicons name="images" size={24} color={colors.primary} />
                        <ThemedText type={'default'} style={styles.optionText}>
                            {t('createPost.chooseFromGallery')}
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={takePhoto}
                    >
                        <Ionicons name="camera" size={24} color={colors.primary} />
                        <ThemedText type={'default'} style={styles.optionText}>
                            {t('createPost.takePhoto')}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ThemedView type={'default'} style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            setImage(null);
                            setCaption('');
                            setLocation('');
                            setTags([]);
                            router.back();
                        }}
                        style={[styles.headerButton, { backgroundColor: colors.button }]}
                    >
                        <ThemedText type={'default'}>{t('common.cancel')}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handlePost}
                        disabled={loading || !image}
                        style={[
                            styles.headerButton,
                            styles.postButton,
                            { backgroundColor: image ? colors.primary : colors.button }
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <ThemedText type={'default'} style={{ color: '#fff' }}>
                                {t('createPost.post')}
                            </ThemedText>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.imageSection}>
                        {image ? (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: image }} style={styles.image} />
                                <TouchableOpacity
                                    style={[styles.removeImage, { backgroundColor: colors.error }]}
                                    onPress={removeImage}
                                >
                                    <Ionicons name="close" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.placeholderContainer, { backgroundColor: colors.card }]}
                                onPress={() => setShowImageOptions(true)}
                            >
                                <MaterialCommunityIcons
                                    name="image-plus"
                                    size={50}
                                    color={colors.text}
                                />
                                <ThemedText type={'default'} style={styles.placeholderText}>
                                    {t('createPost.addImage')}
                                </ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.inputSection}>
                        <TextInput
                            ref={captionInputRef}
                            style={[styles.captionInput, { color: colors.text }]}
                            placeholder={t('createPost.writeCaption')}
                            placeholderTextColor={colors.text + '80'}
                            multiline
                            value={caption}
                            onChangeText={setCaption}
                        />


                    </View>
                </ScrollView>
                <ImageOptionsModal />
            </ThemedView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: StatusBar.currentHeight||40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    headerButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButton: {
        minWidth: 80,
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    imageSection: {
        padding: 16,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 4/3,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    removeImage: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderContainer: {
        width: '100%',
        aspectRatio: 4/3,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(0,0,0,0.1)',
    },
    placeholderText: {
        marginTop: 8,
        opacity: 0.7,
    },
    inputSection: {
        padding: 16,
    },
    captionInput: {
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    locationInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    tagsSection: {
        marginBottom: 16,
    },
    tagsInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    addTagButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    tagsList: {
        flexDirection: 'row',
        marginTop: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
    },
    tagText: {
        color: '#fff',
        marginRight: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    optionText: {
        marginLeft: 12,
        fontSize: 16,
    },
});

export default CreatePostScreen; 