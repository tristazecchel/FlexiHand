import {auth} from "./firebase.js"; //importing authentication engine 
import{
    createUserWithEmailAndPassword, //importing firebase function for registration
    signInWithEmailAndPassword, //importing firebase funtction for log in 
    setPersistence, //controlling "remember me"
    browserLocalPersistence,
    browserSessionPersistence,
    signOut, //the user logs out ******NEED TO CHCK WITH BUTTON****
} from "firebase/auth";

//LOG IN
export async function loginUser(email,password, rememberMe){

    if(rememberMe){
        await setPersistence(auth, browserLocalPersistence);
    }
    else {
        await setPersistence(auth, browserSessionPersistence);
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}
//Sign up 
export async function registerUser(email, password){
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}
