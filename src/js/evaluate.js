document.addEventListener('DOMContentLoaded', () => {
    const flexBtn = document.getElementById('flexBtn');
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('webcam');
    const progressBar = document.getElementById('challengeProgress');
    const percentLabel = document.getElementById('totalPercent');
    const settingsBtn = document.getElementById('settingsBtn');

    let stream = null;
    let progressInterval = null;

    // Settings button click
    settingsBtn.addEventListener('click', () => {
        alert("Settings panel will open here!");
        // You can replace this with actual settings modal later
    });

    // Flexing button logic
    flexBtn.addEventListener('click', async () => {
        if (!stream) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                cameraContainer.style.display = 'block';
                flexBtn.innerText = "Stop Flexing";
                flexBtn.style.background = "#ff4757"; // Stop button color

                let progress = 0;
                progressInterval = setInterval(() => {
                    progress += 1;
                    if (progress <= 100) {
                        progressBar.style.width = progress + '%';
                        percentLabel.innerText = progress + '%';
                    } else {
                        clearInterval(progressInterval);
                    }
                }, 150);
            } catch (err) {
                alert("Camera access is required to Start Flexing.");
            }
        } else {
            // Stop webcam
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            video.srcObject = null;
            clearInterval(progressInterval);

            cameraContainer.style.display = 'none';
            flexBtn.innerText = "Start Flexing";
            flexBtn.style.background = "var(--accent)";
            progressBar.style.width = "0%";
        }
    });
});
const settingsBtn = document.getElementById('settingsBtn');
settingsBtn.addEventListener('click', () => {
    alert("Settings panel will open here!");
});