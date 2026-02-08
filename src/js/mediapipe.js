import {
    HandLandmarker,
    FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

async function createHandLandmarker() { // WASM
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate:"GPU",
        },
        runningMode:"LIVE_STREAM",
        numHands: 1,
        minHandDetectionConfidence: 0.5, // Minimum confidence number for palm detection model
        minHandPresenceConfidence: 0.5, // Minimum confidence number for hand presence in the hand landmark model -> defaults to palm detection if below number
        minTrackingConfidence: 0.5, // Defaults to hand detection if below number
    });
    return handLandmarker;
}

// Setting up webcam
export async function setupWebcam() {
    const video = document.getElementById("webcam"); // Connecting to webcam
    if (!video) { // If webcam not found
        throw new Error("Webcam not found");
    }

    const stream = await navigator.mediaDevices.getUserMedia( // Asks for access to webcam
        {video: true} // Only want video, no audio
    );
    video.srcObject = stream; // Displays video as a live stream

    return new Promise((resolve) => {
        video.onloadedmetadata = () => { // When stream data has been loaded
            video.play(); // Start stream feed
            resolve(video);
        };
    });
}

// Drawing landmarks
export function drawResults(canvas, video, results) {
    if (!canvas) return; // Checking if canvas is working

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears entire canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw

    if (results.landmarks && results.landmarks.length > 0) { // Checking if 1 hand is detected
        // Results.landmark: array of type "hands" that each has "x, y, z" -> holds the coordinates of each landmark
        ctx.fillStyle = "red" // Dots are red
        results.landmark[0].forEach((point) => { // Only for the first detected hand, goes through all landmarks
            ctx.beginPath();
            ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI); // Draws a circle at each landmark
            ctx.fill();
        });
    }
}

export async function runHandLandmarker(onLandmarksDetected, video) {
    if (!video) {
        console.error("No video element found");
        return;
    }

    //const video = await setupWebcam(); // Calls webcam function
    const canvas = document.getElementById("output"); // Gets canvas
    if (!canvas) {
        console.warn("Canvas element not found. Landmarks will not be drawn.");
    }
    const handLandmarker = await createHandLandmarker(); // Loading MediaPipe Hand Landmark model

    // Run detection
    async function onFrame() {
        const results = handLandmarker.detectForVideo(video, Date.now()); // Runs hand detection on the current video frame
        if (canvas) drawResults(canvas, video, results); // Calls drawing function

        if (results.landmarks && results.landmarks.length > 0) {
            onLandmarksDetected(results.landmarks);
        }
        
        requestAnimationFrame(onFrame); // Creates smooth detection + drawing loop (~60 times per second)
    }

    onFrame(); // Starts loop immediately

}