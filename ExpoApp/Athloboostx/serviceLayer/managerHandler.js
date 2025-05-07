import {ValidateLogin,ValidateRegister} from "./validatorManager";
import {HttpGetProfile, HttpGetUser, HttpGetWorkouts, HttpPatchProfile, HttpPostUser} from "./httpManager";
import Status from "@/serviceLayer/status";
import {router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import {Alert} from "react-native";
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
async function PatchProfile(photo,username,bio) {
    try {
        const data = await SecureStore.getItemAsync('user');
        const res = await HttpPatchProfile(data,photo,username,bio);
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
