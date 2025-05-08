import {ValidateLogin,ValidateRegister} from "./validatorManager";
import {HttpGetProfile, HttpGetUser, HttpGetWorkouts, HttpPatchProfile, HttpPostUser} from "./httpManager";
import Status from "@/serviceLayer/status";
import {router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import {Alert} from "react-native";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
async function Login(email, password) {
    const formErrors = ValidateLogin(email, password);
    if (Object.keys(formErrors).length !== 0) {
        return formErrors;
    } else {
        const message = await HttpGetUser(email, password);
        if (!message || message.status !== Status.OK) {
            console.log(message);
            let error = {};
            error.login = "Invalid email or password";
            return error;
        }else {
            await SecureStore.setItemAsync('user',email);
            router.push("/(tabs)");
        }
    }
}

async function Register(email, password,username) {
    const formErrors = ValidateRegister(email, password, username);
    if (Object.keys(formErrors).length !== 0) {
        setErrors(formErrors);
    } else {
        const message = await HttpPostUser(email, password, username);
        if (!message || message.status !== Status.OK) {
            let error = {};
            error.register = "Account already exists";
            return error;
        }else {
            console.log(message.data);
            await SecureStore.setItemAsync('user',email);
            router.push("/(tabs)");
        }
    }
}

function IsLoggedIn() {
    const data = SecureStore.getItem('user');
    return !!data;

}

async function GetWorkouts() {
    const data = await SecureStore.getItemAsync('user');
    const res = await HttpGetWorkouts(data);
    if (!res || res.status !== Status.OK) {
        await Updates.reloadAsync();
    }else {
        return res.data;
    }
}

async function GetProfile() {
    try {

        const data = await SecureStore.getItemAsync('user');
        const res = await HttpGetProfile(data);
        if (!res || res.status !== Status.OK) {
            console.log(res);
            await Updates.reloadAsync();
        } else {
            return res.data;
        }
    }
    catch (err) {
        console.log(err);
        router.push('/login');
    }
}
async function PatchProfile(data) {
    try {
        const user = await SecureStore.getItemAsync('user');
        const res = await HttpPatchProfile({email:user,...data});
        if (!res || res.status !== Status.OK) {
            Alert.alert("Something happened");
        } else {
            return res.status;
        }
    }
    catch (err) {
        console.log(err);
        router.push('/login');
    }
}
async function LocalSaveProfile(){
    const data = await GetProfile();
    await asyncStorage.setItem('workouts',JSON.stringify( data.workouts));
    await asyncStorage.setItem('profile',JSON.stringify( {userName:data.userName ,photo:data.photo,bio:data.bio,likes:data.likes,followers:data.followers,following:data.following}));
    await asyncStorage.setItem('posts',JSON.stringify( data.posts));
    await asyncStorage.setItem('meals',JSON.stringify( data.meals));
    await asyncStorage.setItem('schedule',JSON.stringify( data.schedule));

}
async function SaveWorkout(workout) {
    try {
        // Generate a smaller ID that fits within int32 range
        const generateId = () => Math.floor(Math.random() * 2147483647); // Max int32 value

        // Ensure each exercise has a name and proper ID
        const processedWorkout = {
            ...workout,
            exercises: workout.exercises.map((ex, i) => ({
                ...ex,
                name: ex.name || `Exercise ${i + 1}`,
                id: ex.id || generateId(),
                sets: ex.sets.map(set => ({
                    reps: parseInt(set.reps.toString()) || 0,
                    weight: parseInt(set.weight.toString()) || 0,
                    restTime: parseInt(set.restTime.toString()) || 60
                }))
            }))
        };

        // Get existing workouts
        let workouts = await AsyncStorage.getItem('workouts');
        console.log('Current workouts in storage:', workouts);
        workouts = workouts ? JSON.parse(workouts) : [];
        console.log('Parsed workouts:', workouts);

        // If workout has an ID, update existing workout, otherwise add new
        const existingIndex = workouts.findIndex(w => w.id === processedWorkout.id);
        if (existingIndex !== -1) {
            console.log('Updating existing workout at index:', existingIndex);
            workouts[existingIndex] = processedWorkout;
        } else {
            console.log('Adding new workout');
            processedWorkout.id = generateId(); // Generate new ID for new workouts
            workouts.push(processedWorkout);
        }

        console.log('Updated workouts array:', JSON.stringify(workouts, null, 2));

        // Save to AsyncStorage
        await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
        console.log('Saved to AsyncStorage');

        // Update on server
        const user = await SecureStore.getItemAsync('user');
        const dataToSend = {
            email: user,
            workouts: workouts
        };
        console.log('Sending to server:', JSON.stringify(dataToSend, null, 2));
        const res = await HttpPatchProfile(dataToSend);
        
        if (!res || res.status !== Status.OK) {
            console.error('Server update failed:', res);
            return Status.ServerError;
        }
        console.log('Server update successful');
        return Status.OK;
    } catch (error) {
        console.error('Error saving workout:', error);
        return Status.ServerError;
    }
}
const _Login = Login;
export {_Login as Login};
const _Register = Register;
export {_Register as Register};
const _IsLoggedIn = IsLoggedIn;
export {_IsLoggedIn as IsLoggedIn};
const _GetWorkouts = GetWorkouts;
export {_GetWorkouts as GetWorkouts};
const _GetProfile = GetProfile;
export {_GetProfile as GetProfile};
const _PatchProfile = PatchProfile;
export {_PatchProfile as PatchProfile};
const _LocalSaveProfile = LocalSaveProfile;
export {_LocalSaveProfile as LocalSaveProfile};
const _SaveWorkout = SaveWorkout;
export {_SaveWorkout as SaveWorkout};
