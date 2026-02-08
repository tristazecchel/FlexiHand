import { auth } from "../../firebase/firebase.js";
import { sendPasswordResetEmail } from "firebase/auth";

const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {

    forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("resetEmail").value;
    const message = document.getElementById("resetMessage");

    console.log("SUBMIT CLICKED");
    console.log("EMAIL ENTERED:", email);

    try {
        await sendPasswordResetEmail(auth, email);
        console.log("RESET SUCCESS");
        message.style.color = "green";
        message.textContent = "Reset email sent!";
    } catch (error) {
        console.log("RESET ERROR:", error.code);
        message.style.color = "red";
        message.textContent = error.code;
    }
});
    // forgotForm.addEventListener("submit", async (e) => {
    //     e.preventDefault();

    //     const email = document.getElementById("resetEmail").value;
    //     const message = document.getElementById("resetMessage");

    //     message.textContent = "";

    //     try {
    //         await sendPasswordResetEmail(auth, email);
    //         message.style.color = "green";
    //         message.textContent = "Password reset email sent!";
    //     } catch (error) {
    //         message.style.color = "red";
    //         message.textContent = "Error sending reset email.";
    //         console.log("Reset error:", error.code);
    //     }
    // });
}