import {registerUser, loginUser} from "./auth.js";
import {auth} from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user)=> {
    if (user) {
        console.log("User still logged in: ", user.uid);
    }
    else {
        console.log("No user logged in");
    }
})
const regForm = document.querySelector("#regForm");

//SIGN UP
if (regForm){
regForm.addEventListener("submit", async (e) => { //when submitted function runs here 
    e.preventDefault(); //prevent refresh after submit 

    
    const email = document.querySelector("#regUsername").value ;
    const password = document.querySelector("#regPassword").value ;
    const confirmPassword = document.querySelector("#confirmPassword").value ;

    //checking if passwords match 
    if (password !== confirmPassword) {
        console.error("Please match the passwords");
        return;
    }
    try {
        const user = await registerUser(email,password);
        console.log("Registered as: ", user.uid);
    } catch (error) {
        console.error("Error: ", error.message);
    }

}); }

//LOG IN
const loginForm= document.querySelector("#loginForm");

if(loginForm){
    loginForm.addEventListener("submit", async (e)=> {
        e.preventDefault();

        const email = document.querySelector("#logUsername").value ;
        const password = document.querySelector("#logPassword").value ;
        const rememberMe = document.querySelector("#remember").checked ;

        try{
            const user = await loginUser(email, password, rememberMe);
            console.log("Logged in: ", user.uid);
        }
        catch(error){
            console.error("Failed to log in: ",error.message);
        }
    });
}