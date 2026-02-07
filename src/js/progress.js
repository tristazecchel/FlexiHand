document.addEventListener('DOMContentLoaded', () => {
    // Initialize Chart Bars
    const chartContainer = document.getElementById('activityChart');
    const weeklyData = [15, 40, 25, 60, 35, 10, 50]; 

    weeklyData.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '0%';
        chartContainer.appendChild(bar);
        setTimeout(() => { bar.style.height = value + '%'; }, 200);
    });

    // Webcam Toggle Logic
    const flexBtn = document.getElementById('flexBtn');
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('webcam');
    
    let stream = null;

    flexBtn.addEventListener('click', async () => {
        if (!stream) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                cameraContainer.style.display = 'block';
                flexBtn.innerText = "Stop";
                flexBtn.style.background = "#ff4757"; 
            } catch (err) {
                alert("Camera access denied.");
            }
        } else {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            cameraContainer.style.display = 'none';
            flexBtn.innerText = "Start Flexing";
            flexBtn.style.background = "var(--accent)";
        }
    });
});