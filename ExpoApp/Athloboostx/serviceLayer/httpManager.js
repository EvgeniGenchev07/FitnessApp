import {router} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Status from "@/serviceLayer/status";
const url = "http://192.168.50.179:5000/";
let isRunning = false;



async function Login(email, password) {
    if (!isRunning) {
        isRunning = true;
        let responseMessage = "";
        try {
            const res = await fetch(`${url}user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            });

            const data = await res.json();
            console.log(data);
            if(data == 3){
                responseMessage = { status: Status.Incorrect };
            }
            else responseMessage = { status: Status.OK, data };
        } catch (error) {
            console.error(error);
            responseMessage = { status: Status.ServerError, error };
        }
        isRunning = false;
        return responseMessage;
    }
}

async function Register(email, password, username) {
    if (!isRunning) {
        isRunning = true;
        let responseMessage = "";
        try {
            const user = JSON.stringify({
                email,
                password,
                userName:username
            });
            const res = await fetch(`${url}user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: user
            });

            const data = await res.json();
            console.log(data);
            if(data != 1){
                responseMessage = { status: Status.Invalid };
            }
            else responseMessage = { status: Status.OK, data:user };
        } catch (error) {
            console.error(error);
            responseMessage = { status: Status.ServerError, error };
        }
        isRunning = false;
        return responseMessage;
    }
}

async function GetWorkouts(email){
    if (!isRunning) {
        isRunning = true;
        let responseMessage = "";
        try {
            const res = await fetch(`${url}user/workouts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: email
            });

            const data = await res.json();
            if(!Array.isArray(data)){
                responseMessage = { status: Status.Invalid };
            }
            else responseMessage = { status: Status.OK, data };
        } catch (error) {
            responseMessage = { status: Status.ServerError, error };
        }
        isRunning = false;
        return responseMessage;
    }
}
async function GetUser(email){
    if (!isRunning) {
        isRunning = true;
        let responseMessage = "";
        try {
            const res = await fetch(`${url}user/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( {email})
            });
            const data = await res.json();
            if(data==3){
                responseMessage = { status: Status.Invalid };
            }
            else responseMessage = { status: Status.OK, data };
        } catch (error) {
            responseMessage = { status: Status.ServerError, error };
        }
        isRunning = false;
        return responseMessage;
    }
}
async function UpdateProfile(data){
    if (!isRunning) {
        isRunning = true;
        let responseMessage = "";
        try {
            console.log('Sending to server:', JSON.stringify(data, null, 2));
            const res = await fetch(`${url}user/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    workouts: JSON.stringify(data.workouts)
                })
            });
            
            const responseData = await res.json();
            console.log('Server response:', responseData);
            
            if (res.ok) {
                responseMessage = { status: Status.OK };
            } else {
                responseMessage = { status: Status.ServerError, error: responseData };
            }
        } catch (error) {
            console.error('Server error:', error);
            responseMessage = { status: Status.ServerError, error };
        }
        isRunning = false;
        return responseMessage;
    }
}
const _Login = Login;
export {_Login as HttpGetUser};

const _Register = Register;
export {_Register as HttpPostUser};

const _GetWorkouts = GetWorkouts;
export {_GetWorkouts as HttpGetWorkouts};

const _GetUser = GetUser;
export {_GetUser as HttpGetProfile};
const _UpdateProfile = UpdateProfile;
export {_UpdateProfile as HttpPatchProfile};
