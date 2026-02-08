import { runHandLandmarker, setupWebcam } from './mediapipe.js';
import { normalizeLandmarks } from './gesture.js';


let videoElement;
let latestLandmarks = null;

async function init() { // Starting MediaPipe loop
    videoElement = await setupWebcam();

    runHandLandmarker((landmarksArray) => {
        if (landmarksArray.length > 0) {
            latestLandmarks = landmarksArray[0];
        }
    }, videoElement);
}

init();

// Record reference function
export function recordReference(exerciseName) {

    if (!latestLandmarks) {
        console.warn("No hand detected. Try again.");
        return;
    }

    const normalized = normalizeLandmarks(latestLandmarks);

    console.log(`Captured for ${exerciseName}`);
    console.log(JSON.stringify(normalized, null, 2));

    // Stop after logging 1 frame
    alert(`Captured reference landmarks for ${exerciseName}. Check the console.`);
}

window.recordReference = recordReference;

// Onclick call
document.getElementById('btnOpenPalm').addEventListener('click', () => recordReference('openPalm'));
document.getElementById('btnClosedFist').addEventListener('click', () => recordReference('closedFist'));
document.getElementById('btnHook').addEventListener('click', () => recordReference('hook'));
document.getElementById('btnTabletop').addEventListener('click', () => recordReference('tabletop'));
document.getElementById('btnThumbBent').addEventListener('click', () => recordReference('thumbBent'));