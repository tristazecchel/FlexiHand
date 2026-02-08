document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const profilePic = document.getElementById("profilePic");

    /* Load saved profile image */
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        profilePic.src = savedImage;
    }

    /* Upload new profile image */
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            profilePic.src = reader.result;
            localStorage.setItem("profileImage", reader.result);
        };
        reader.readAsDataURL(file);
    });

    /* Example dynamic values */
    document.getElementById("streak").textContent = 0;
    document.getElementById("evaluations").textContent = 0;
});

