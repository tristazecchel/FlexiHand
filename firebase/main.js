import {registerUser, loginUser} from "./auth.js";
import {auth} from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { sendPasswordResetEmail} from "firebase/auth";


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

        const errorMsg = document.getElementById("logError");
        errorMsg.textContent= "";
        //handling number of failed login attempts
        let attempts = localStorage.getItem("loginAttempts");
        attempts = attempts ? parseInt(attempts): 0;

        if (attempts>=5) {
            try{
                await sendPasswordResetEmail(auth, email);
                alert("You have run out of attempts. Please check your email.");
            }
            catch(err) {
                alert("Too many failed attempts. Please try again later.");
            }
            return;
        }
        

        try{
            const user = await loginUser(email, password, rememberMe);
            console.log("Logged in: ", user.uid);

            //reset attempts when log in succeeds 
            localStorage.removeItem("loginAttempts");

            //redirect after log in (***NEED TO CHANGE!!!***)
            window.location.href= "/src/html/index.html";
        }
        catch(error){
            
            attempts++;
            localStorage.setItem("loginAttempts", attempts);
            console.error("Failed to log in: ",error.message);
            
            switch (error.code){
                case "auth/wrong-password":{
                    errorMsg.textContent= "Incorrect Password.";
                    break;}
                case "auth/user-not-found":{
                    errorMsg.textContent = "Incorrect Email. Please try again.";
                    break;
                }
                case "auth/invalid-email":{
                    errorMsg.textContent = "Incorrect email.";
                    break;
                }
                case "auth/invalid-credential":{
                    errorMsg.textContent = "Incorrect email or password."
                    break;}
                default:{ errorMsg.textContent = "System failed to log in. Please try again.";}
            }
            if (attempts>=5){
                alert("Exceeded number of attempts. Please check your email.");
            }
        }
    });
}