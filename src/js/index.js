import { auth } from "../../firebase/firebase.js";
import {signOut} from "firebase/auth";
document.addEventListener('DOMContentLoaded', () => {
    
    // LOGIN BUTTON
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = "/log_in.html";
        });
    }

    // SIGNUP BUTTON
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            window.location.href = "/sign_up.html";
        });
    }

    // LOG OUT BUTTON
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async() => {
            const confirmLogout = confirm("Are you sure you want to log out?");
            if (confirmLogout) {
                try{
                    await signOut(auth);
                    alert("Log out successful!");
                    window.location.href= "/src/html/index.html";
                }
                catch (error){
                    console.error("Logout failed: ", error.message);
                }
                
            }
        });
    }

    // Feature Cards
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.querySelector('h3').innerText;
            alert(`You clicked on: ${feature}`);
        });
    });

});
