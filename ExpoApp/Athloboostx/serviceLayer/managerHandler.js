import {ValidateLogin,ValidateRegister} from "./validatorManager";
import {HttpGetProfile, HttpGetUser, HttpGetWorkouts, HttpPatchProfile, HttpPostUser} from "./httpManager";
import Status from "@/serviceLayer/status";
import {router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import {Alert} from "react-native";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setTheUsername} from "whatwg-url-without-unicode";
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
    const data = await GetProfile()
    console.log(data);
    await asyncStorage.setItem('workouts', JSON.stringify(data.workouts));
    await asyncStorage.setItem('profile', JSON.stringify({
        userName: data.userName,
        photo: data.photo,
        bio: data.bio,
        likes: data.likes,
        followers: data.followers,
        following: data.following
    }));
    await asyncStorage.setItem('posts', JSON.stringify(data.posts));
    await asyncStorage.setItem('meals', JSON.stringify(data.meals));
    await asyncStorage.setItem('schedule', JSON.stringify(data.schedule));
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

        let workouts = await AsyncStorage.getItem('workouts');
        workouts = workouts ? JSON.parse(workouts) : [];

        // If workout has an ID, update existing workout, otherwise add new
        const existingIndex = workouts.findIndex(w => w.id === processedWorkout.id);
        if (existingIndex !== -1) {
            workouts[existingIndex] = processedWorkout;
        } else {
            processedWorkout.id = generateId(); // Generate new ID for new workouts
            workouts.push(processedWorkout);
        }
        await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
        const user = await SecureStore.getItemAsync('user');
        const dataToSend = {
            email: user,
            workout: processedWorkout
        };
        const res = await HttpPatchProfile(dataToSend);
        
        if (!res || res.status !== Status.OK) {
            console.error('Server update failed:', res);
            return Status.ServerError;
        }
        return Status.OK;
    } catch (error) {
        console.error('Error saving workout:', error);
        return Status.ServerError;
    }
}
async function DeleteWorkout(workoutId) {
    try {
        let workouts = await AsyncStorage.getItem('workouts');
        workouts = workouts ? JSON.parse(workouts) : [];
        const index = workouts.findIndex(w => w.id === workoutId);
        if (index !== -1) {
            workouts.splice(index, 1);
        }
        await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
        const user = await SecureStore.getItemAsync('user');
        const dataToSend = {
            email: user,
            rmWorkout: workoutId,
        };
        const res = await HttpPatchProfile(dataToSend);

        if (!res || res.status !== Status.OK) {
            console.error('Server update failed:', res);
            return Status.ServerError;
        }
        return Status.OK;
    } catch (error) {
        console.error('Error saving workout:', error);
        return Status.ServerError;
    }
}
async function UpdateUserProfileData(newUserData) {
    try {

        let userData = await AsyncStorage.getItem('profile');
        userData = userData ? JSON.parse(userData) : {};
        userData.userName = newUserData.userName;
        userData.bio = newUserData.bio;
        userData.photo = newUserData.photo;
        await AsyncStorage.setItem('profile', JSON.stringify(userData));
        const user = await SecureStore.getItemAsync('user');
        const dataToSend = {
            email: user,
            userName: userData.userName,
            bio: userData.bio,
            photo: userData.photo,
        };
        console.log(dataToSend);
        const res = await HttpPatchProfile(dataToSend);

        if (!res || res.status !== Status.OK) {
            console.error('Server update failed:', res);
            return Status.ServerError;
        }
        return Status.OK;
    } catch (error) {
        console.error('Error saving profile data:', error);
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
const _DeleteWorkout = DeleteWorkout;
export {_DeleteWorkout as DeleteWorkout};
const _UpdateUserProfileData = UpdateUserProfileData;
export {_UpdateUserProfileData as UpdateUserProfile};
