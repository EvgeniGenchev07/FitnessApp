import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import {router} from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import {ThemedText} from "@/components/ThemedText";

const ExerciseEditScreen = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('Choose a type');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [seconds, setSeconds] = useState('');
    const [sets, setSets] = useState('');
    const [restTime, setRestTime] = useState('');
    const [notes, setNotes] = useState('');

    const handleDelete = () => {
        console.log('Exercise deleted');
    };

    const handleSave = () => {
        console.log('Exercise saved');
    };

    const [typeModalVisible, setTypeModalVisible] = useState(false);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={10}
        >
            <View style={styles.top_icon_container}>
                <TouchableOpacity style={styles.top_icon_content} onPress={() => router.back()}>
                    <Icon name="chevron-left" size={25} color="red"/>
                    <ThemedText type={'bar'}>Back</ThemedText>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 5 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View>

            <View style={styles.iconContainer}>
                <Ionicons name="barbell" size={48} color="white" />
            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder='Enter a name' />

            <Text style={styles.label}>Type</Text>
            <TouchableOpacity style={styles.selectBox} onPress={() => setTypeModalVisible(true)}>
                <Text style={styles.selectText}>{type}</Text>
                <Ionicons name="chevron-up" size={20} color="#aaa" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={typeModalVisible}
                onRequestClose={() => setTypeModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.pickerWrapper}>
                        <TouchableOpacity onPress={() => setTypeModalVisible(false)} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseText}>Done</Text>
                        </TouchableOpacity>
                        <Picker
                            selectedValue={type}
                            onValueChange={(itemValue) => setType(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#fff"
                        >
                            <Picker.Item label="Strength" value="Strength" />
                            <Picker.Item label="Cardio" value="Cardio" />
                            <Picker.Item label="Yoga" value="Yoga" />
                            <Picker.Item label="HIIT" value="HIIT" />
                            <Picker.Item label="Pilates" value="Pilates" />
                        </Picker>

                    </View>
                </View>
            </Modal>

            <Text style={styles.label}>Duration</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput style={[styles.input, styles.timeInput]} keyboardType="numeric" value={hours} onChangeText={setHours} placeholder="hh" />
                <TextInput style={[styles.input, styles.timeInput]} keyboardType="numeric" value={minutes} onChangeText={setMinutes} placeholder="mm" />
                <TextInput style={[styles.input, styles.timeInput]} keyboardType="numeric" value={seconds} onChangeText={setSeconds} placeholder="ss" />
            </View>

            <Text style={styles.label}>Sets</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={sets} onChangeText={setSets} placeholder="Sets" />

            <Text style={styles.label}>Rest Time</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={restTime} onChangeText={setRestTime} placeholder='ss' />

            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={[styles.input, { height: 60 }]
                } value={notes} onChangeText={setNotes} multiline
                placeholder='Enter notes here'
            />
            <TouchableOpacity style={styles.deleteButton} onPress={handleSave}>
                <Text style={styles.deleteText}>Save changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete Exercise</Text>
            </TouchableOpacity>

        </View>
</ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    top_icon_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // @ts-ignore
        marginTop: StatusBar.currentHeight + 30,
        alignItems: 'center',
    },
    top_icon_content: {
        flexDirection: 'row',
    },
    top_icon_text: {
        fontSize: 20,
        color: 'red'

    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    label: {
        color: '#aaa',
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        backgroundColor: '#1c1c1e',
        color: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    selectBox: {
        flexDirection: 'row',
        backgroundColor: '#1c1c1e',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectText: {
        color: '#fff',
        fontSize: 16,
    },
    deleteButton: {
        marginTop: 30,
        backgroundColor: 'red',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    deleteText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    picker: {
        color: '#fff',
        backgroundColor: '#1c1c1e',
    },
    timeInput: {
        flex: 1,
        marginHorizontal: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerWrapper: {
        backgroundColor: '#1c1c1e',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 20,
    },
    modalCloseButton: {
        alignItems: 'flex-start',
        paddingVertical: 0,
    },
    modalCloseText: {
        color: '#007aff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ExerciseEditScreen;
