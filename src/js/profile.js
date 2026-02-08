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

    /* Upload new profile image (resized to fit localStorage) */
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file || !currentUid) return;

        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const size = 256;
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d");

                /* Crop to square from center, then draw at 256×256 */
                const min = Math.min(img.width, img.height);
                const sx = (img.width - min) / 2;
                const sy = (img.height - min) / 2;
                ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

                const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                showProfilePic(dataUrl);
                try {
                    localStorage.setItem(`profileImage_${currentUid}`, dataUrl);
                } catch (e) {
                    console.warn("Could not save profile image:", e);
                }
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

    /* Example dynamic values */
    document.getElementById("streak").textContent = 0;
    document.getElementById("evaluations").textContent = 0;
});
