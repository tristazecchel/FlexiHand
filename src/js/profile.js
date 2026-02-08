document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const profilePic = document.getElementById("profilePic");

    // Load saved image
    const saved = localStorage.getItem("profileImage");
    if (saved) profilePic.src = saved;

    // Upload new image
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

    // Example values (can be replaced with real data)
    document.getElementById("streak").textContent = 0;
    document.getElementById("signs").textContent = 0;
    document.getElementById("lessons").textContent = 0;
});
