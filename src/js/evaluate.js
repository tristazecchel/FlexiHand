document.addEventListener('DOMContentLoaded', () => {
    // 1. CHART INITIALIZATION
    const chartContainer = document.getElementById('activityChart');
    const weeklyData = [30, 65, 40, 85, 50, 20, 45]; 

    weeklyData.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '0%';
        chartContainer.appendChild(bar);
        setTimeout(() => { bar.style.height = value + '%'; }, 100);
    });

    // 2. MAIN FLEXING LOGIC
    const flexBtn = document.getElementById('flexBtn');
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('webcam');
    const progressBar = document.getElementById('challengeProgress');
    const percentLabel = document.getElementById('totalPercent');
    
    let stream = null;
    let progressInterval = null;

    flexBtn.addEventListener('click', async () => {
        if (!stream) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                
                cameraContainer.style.display = 'block';
                flexBtn.innerText = "Stop Flexing";
                flexBtn.style.background = "#ff4757"; 

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
            // STOP LOGIC
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
document.addEventListener('DOMContentLoaded', () => {
    const flexBtn = document.getElementById('flexBtn');
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('webcam');
    const progressBar = document.getElementById('challengeProgress');
    const percentLabel = document.getElementById('totalPercent');
    
    let stream = null;
    let progressInterval = null;

    flexBtn.addEventListener('click', async () => {
        if (!stream) {
            try {
                // Activate Camera
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                
                // UI State: Active
                cameraContainer.style.display = 'block';
                flexBtn.innerText = "Stop Flexing";
                flexBtn.style.background = "#ff4757"; // Stop Red

                // Simulate progress increment
                let progress = 0;
                progressInterval = setInterval(() => {
                    progress += 1;
                    if (progress <= 100) {
                        progressBar.style.width = progress + '%';
                        percentLabel.innerText = progress + '%';
                    }
                }, 200);
                
            } catch (err) {
                alert("Please enable camera access to start flexing!");
            }
        } else {
            // Deactivate Camera
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            video.srcObject = null;
            clearInterval(progressInterval);
            
            // UI State: Idle
            cameraContainer.style.display = 'none';
            flexBtn.innerText = "Start Flexing";
            flexBtn.style.background = "var(--accent)";
            progressBar.style.width = "0%";
        }
    });
});