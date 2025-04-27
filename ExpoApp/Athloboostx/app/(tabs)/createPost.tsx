import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Pressable,
    Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function CreatePostScreen() {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [isGallery, setIsGallery] = useState(false); // To toggle between Camera and Gallery
    const [cameraPermission, setCameraPermission] = useState(null);

    const user = {
        name: 'Jordan Fit',
        avatar: 'https://i.pravatar.cc/100?img=2',
    };

    useEffect(() => {
        // Request camera permission and open camera by default when the page loads
        const requestCameraPermission = async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            setCameraPermission(status === 'granted');
            if (status === 'granted') {
                takePhoto(); // Open the camera once permission is granted
            }
        };

        requestCameraPermission();
    }, []);

    // Pick images from the gallery
    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map((asset) => asset.uri);
            setImages(newImages); // Set selected images
            setIsImageSelected(true); // Enable caption and post button
        }
    };

    // Take a photo using the camera
    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImages([result.assets[0].uri]); // Set captured image
            setIsImageSelected(true); // Enable caption and post button
        }
    };

    // Handle deleting an image
    const handleDeleteImage = (index) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setImages((prev) => prev.filter((_, i) => i !== index));
        setDeleteIndex(null);
    };

    // Show the delete button when an image is long-pressed
    const handleLongPress = (index) => {
        setDeleteIndex(index);
        // Fade-in effect for delete button
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable style={{ flex: 1 }} onPress={() => setDeleteIndex(null)}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View style={styles.header}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <Text style={styles.username}>{user.name}</Text>
                </View>

                {/* Camera or Gallery View */}
                {!isImageSelected ? (
                    <View style={styles.imageSelectionContainer}>
                        {isGallery ? (
                            <TouchableOpacity
                                style={styles.imageButton}
                                onPress={pickImages}
                            >
                                <Feather name="image" size={24} color="#fff" />
                                <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={styles.imageButton}
                                    onPress={takePhoto}
                                >
                                    <Ionicons name="camera" size={24} color="#fff" />
                                    <Text style={styles.imageButtonText}>Take Photo</Text>
                                </TouchableOpacity>

                                {/* Switch to Gallery Button */}
                                <TouchableOpacity
                                    style={styles.switchToGalleryButton}
                                    onPress={() => setIsGallery(true)} // Switch to gallery
                                >
                                    <Feather name="image" size={24} color="#fff" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                ) : (
                    <View style={styles.selectedImagesContainer}>
                        {/* Display Selected Images */}
                        {images.map((uri, idx) => (
                            <View key={idx} style={styles.imageWrapper}>
                                <TouchableOpacity onLongPress={() => handleLongPress(idx)}>
                                    <Image source={{ uri }} style={styles.image} />
                                </TouchableOpacity>

                                {deleteIndex === idx && (
                                    <Animated.View
                                        style={[styles.deleteButton, { opacity: fadeAnim }]}
                                    >
                                        <TouchableOpacity
                                            style={styles.deleteButtonContent}
                                            onPress={() => handleDeleteImage(idx)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#fff" />
                                        </TouchableOpacity>
                                    </Animated.View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Caption Input (only visible after selecting images) */}
                {isImageSelected && (
                    <>
                        <TextInput
                            placeholder="Write a caption..."
                            placeholderTextColor="#888"
                            multiline
                            style={styles.input}
                            value={content}
                            onChangeText={setContent}
                        />

                        {/* Post Button */}
                        <TouchableOpacity style={styles.postButton}>
                            <Text style={styles.postButtonText}>Post</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    username: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    imageSelectionContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imageButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    switchToGalleryButton: {
        position: 'absolute',
        left: 20,
        bottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 50,
    },
    selectedImagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 30,
    },
    imageWrapper: {
        position: 'relative',
        width: '48%',
        height: 120,
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 5,
        zIndex: 10,
    },
    deleteButtonContent: {
        backgroundColor: '#ff3b30',
        padding: 4,
        borderRadius: 50,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        fontSize: 16,
        color: '#333',
        minHeight: 120,
        textAlignVertical: 'top',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 25,
    },
    postButton: {
        marginTop: 40,
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    postButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
