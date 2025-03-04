import React from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {ThemedText} from "@/components/ThemedText";
import {ThemedButton} from "@/components/ThemedButton";
import {ThemedBackground} from "@/components/ThemedBackground";
import {router} from "expo-router";

const NotFoundScreen = () => {

    return (
        <ThemedBackground>
            <Image
                source={{uri: "https://cdn-icons-png.flaticon.com/512/2748/2748558.png"}}
                style={styles.image}
            />
            <ThemedText type={'subtitle'}>Oops! Page Not Found</ThemedText>
            <ThemedText type={'description'}>
                The page you are looking for doesn’t exist or has been moved.
            </ThemedText>
            <ThemedButton type={'default'} onPress={() => {

            }}>
                <ThemedText type={'button'}>Go to Home</ThemedText>
            </ThemedButton>
        </ThemedBackground>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#FF5733",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
});

export default NotFoundScreen;
