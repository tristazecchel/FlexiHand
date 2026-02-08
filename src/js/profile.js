import { auth } from "../../firebase/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const profilePic = document.getElementById("profilePic");
    const defaultAvatar = document.getElementById("defaultAvatar");
    const userEmail = document.getElementById("userEmail");

    let currentUid = null;

    function showProfilePic(src) {
        profilePic.src = src;
        profilePic.style.display = "block";
        defaultAvatar.style.display = "none";
    }

    function showDefaultAvatar() {
        profilePic.style.display = "none";
        defaultAvatar.style.display = "flex";
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUid = user.uid;

            /* Show user email */
            userEmail.textContent = user.email;

            /* Load this user's saved profile image */
            const savedImage = localStorage.getItem(`profileImage_${currentUid}`);
            if (savedImage) {
                showProfilePic(savedImage);
            } else {
                showDefaultAvatar();
            }
        } else {
            currentUid = null;
            showDefaultAvatar();
            userEmail.textContent = "Not logged in";
        }
    });

    /* Upload new profile image */
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file || !currentUid) return;

        const reader = new FileReader();
        reader.onload = () => {
            showProfilePic(reader.result);
            localStorage.setItem(`profileImage_${currentUid}`, reader.result);
        };
        reader.readAsDataURL(file);
    });

    /* Example dynamic values */
    document.getElementById("streak").textContent = 0;
    document.getElementById("evaluations").textContent = 0;
});
