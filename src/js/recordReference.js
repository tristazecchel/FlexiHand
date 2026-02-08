import { runHandLandmarker, setupWebcam } from './mediapipe.js';
import { normalizeLandmarks } from './gesture.js';


let videoElement;

// Initialize webcam on page load
async function initWebcam() {
    videoElement = await setupWebcam(); // this attaches stream to #webcam
}
initWebcam();

// Record reference function
export function recordReference(exerciseName) {
    console.log(`Perform the exercise: ${exerciseName}`);

    runHandLandmarker((landmarksArray) => {
        const landmarks = landmarksArray[0]; // first detected hand
        if (!landmarks) {
            console.warn("No hand detected. Try again.");
            return;
        }

        const normalized = normalizeLandmarks(landmarks);

        console.log(`Normalized landmarks for ${exerciseName}:`);
        console.log(JSON.stringify(normalized, null, 2));

        // Stop after logging 1 frame
        alert(`Captured reference landmarks for ${exerciseName}. Check the console.`);
    }, videoElement);
}

window.recordReference = recordReference;

// Onclick call
document.getElementById('btnOpenPalm').addEventListener('click', () => recordReference('openPalm'));
document.getElementById('btnClosedFist').addEventListener('click', () => recordReference('closedFist'));
document.getElementById('btnHook').addEventListener('click', () => recordReference('hook'));
document.getElementById('btnTabletop').addEventListener('click', () => recordReference('tabletop'));
document.getElementById('btnThumbBent').addEventListener('click', () => recordReference('thumbBent'));