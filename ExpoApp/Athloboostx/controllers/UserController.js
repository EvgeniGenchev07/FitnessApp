import {router} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = "http://192.168.50.179:5136/user/";
let isRunning = false;

function ValidateLogin(email, password) {
    let formErrors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        formErrors.email = 'Valid email is required';
    }
    if (!password || !/(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[0-9]+)(?=.*\S+).{8,50}/.test(password)) {
        formErrors.password = 'Valid password is required';
    }
    return formErrors;
}

function ValidateRegister(email, password, username) {
    let formErrors = ValidateLogin(email, password);
    if (!username) {
        formErrors.username = 'Valid username is required';
    }
    return formErrors;
}

async function Login(email, password) {
    if (!isRunning) {
        isRunning = true;
        let errorMessage = "";
        await fetch(`${url}${email}/${password}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then(async data => {
                await AsyncStorage.setItem("user", JSON.stringify(data));
                router.push('/(tabs)');
            })
            .catch(error => {
                errorMessage = error;
            });
        isRunning = false;
        return errorMessage;
    }
}

async function Register(email, password, username) {
    if (!isRunning) {
        isRunning = true;
        let errorMessage = "";
        await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username
            })
        })
            .then(response => response.json())
            .then(async data => {
                await AsyncStorage.setItem("user", JSON.stringify(data));
                router.push('/(tabs)');
            })
            .catch(error => {
                errorMessage = error;
            });
        isRunning = false;
        return errorMessage;
    }
}

const _ValidateLogin = ValidateLogin;
export {_ValidateLogin as ValidateLogin};

const _ValidateRegister = ValidateRegister;
export {_ValidateRegister as ValidateRegister};

const _Login = Login;
export {_Login as Login};

const _Register = Register;
export {_Register as Register};

