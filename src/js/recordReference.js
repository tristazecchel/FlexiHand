import { runHandLandmarker, setupWebcam } from './mediapipe.js';
import { normalizeLandmarks } from './gesture.js';
import { saveReferenceGesture } from './referenceGestures.js';


let videoElement;
let latestLandmarks = null;

async function init() { // Starting MediaPipe loop
    videoElement = await setupWebcam();

    let landmarkHistory = [];
    const MAX_HISTORY = 5; // Number of frames to smooth over

    runHandLandmarker((landmarksArray) => {
        if (landmarksArray.length > 0) {
            const current = landmarksArray[0];

            landmarkHistory.push(current); // Add current frame to history

            if (landmarkHistory.length > MAX_HISTORY) { // Keeping only the last MAX_HISTORY frames
                landmarkHistory.shift();
            }

            const smoothed = current.map((_, i) => {
                let sumX = 0, sumY = 0, sumZ = 0;
                landmarkHistory.forEach(frame => {
                    sumX += frame[i].x;
                    sumY += frame[i].y;
                    sumZ += frame[i].z;
                });
                const n = landmarkHistory.length;
                return {
                    x: sumX / n,
                    y: sumY / n,
                    z: sumZ / n
                };
            });

            latestLandmarks = smoothed;
        }
    }, videoElement);
}

init();

// EXERCISE
// Score an exercise
export function scoreExercise(exerciseName) {
    if (!latestLandmarks) {
        alert("No hand detected. Try again.");
        return;
    }

    const normalized = normalizeLandmarks(latestLandmarks);
    const reference = referenceGestures[exerciseName];

    if (!reference) {
        alert(`No reference saved for ${exerciseName}`);
        return;
    }

    const percent = compareGesture(normalized, reference);

    alert(`Your score for ${exerciseName}: ${percent}%`);

    // Ask user for difficulty rating 1-10
    let difficulty = prompt("Rate the difficulty of this exercise (1-10):");
    difficulty = Math.min(Math.max(parseInt(difficulty), 1), 10); // clamp

    console.log(`Exercise: ${exerciseName}, Score: ${percent}%, Difficulty: ${difficulty}`);
}


// Record reference function
export function recordReference(exerciseName) {

    if (!latestLandmarks) {
        alert("No hand detected. Try again.");
        return;
    }

    const normalized = normalizeLandmarks(latestLandmarks);

    // Save to localStorage via referenceGestures
    saveReferenceGesture(exerciseName, normalized);

    console.log("Captured for: ", exerciseName);
    console.log(JSON.stringify(normalized));

    // Stop after logging 1 frame
    alert(`Captured reference landmarks for ${exerciseName}. Check the console.`);
}

window.recordReference = recordReference;

// EXERCISE BUTTONS
document.getElementById('btnScoreOpenPalm').addEventListener('click', () => scoreExercise('openPalm'));
document.getElementById('btnScoreClosedFist').addEventListener('click', () => scoreExercise('closedFist'));

// Onclick call
//document.getElementById('btnOpenPalm').addEventListener('click', () => recordReference('openPalm'));
//document.getElementById('btnClosedFist').addEventListener('click', () => recordReference('closedFist'));
//document.getElementById('btnHook').addEventListener('click', () => recordReference('hook'));
//document.getElementById('btnTabletop').addEventListener('click', () => recordReference('tabletop'));
//document.getElementById('btnThumbBent').addEventListener('click', () => recordReference('thumbBent'));