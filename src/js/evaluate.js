import { setupWebcam, runHandLandmarker } from './mediapipe.js';
import { normalizeLandmarks } from './gesture.js';
import { referenceGestures } from './referenceGestures.js';
import { compareGesture } from './gestureComparison.js';
import { auth } from "../../firebase/firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    const flexBtn = document.getElementById('flexBtn');
    const cameraContainer = document.getElementById('cameraContainer');
    const referenceContainer = document.getElementById('referenceContainer');
    const referenceCanvas = document.getElementById('referenceCanvas');
    const referenceLabel = document.getElementById('referenceLabel');
    const progressBar = document.getElementById('challengeProgress');
    const timerLabel = document.getElementById('timerLabel');
    const percentLabel = document.getElementById('totalPercent');
    const circleProgress = document.querySelector('.circle-progress');
    const liveScoreEl = document.getElementById('liveScore');
    const scoringUI = document.getElementById('scoringUI');
    const exerciseNameEl = document.getElementById('exerciseName');
    const percentScoreEl = document.getElementById('percentScore');
    const difficultyInput = document.getElementById('difficultyInput');
    const nextBtn = document.getElementById('nextBtn');

    let latestLandmarks = null;
    let currentTestIndex = 0;
    let results = [];
    const exercises = ['openPalm', 'closedFist', 'hook', 'tabletop', 'thumbBent'];
    let videoElement = null;
    let stream = null;
    let timerInterval = null;
    let scoreInterval = null;
    let livePercent = 0;

    const TIMER_DURATION = 10; // seconds

    function updateCircleProgress(pct) {
        const deg = Math.round((pct / 100) * 360);
        circleProgress.style.background =
            `conic-gradient(var(--accent) ${deg}deg, var(--white) ${deg}deg)`;
        percentLabel.innerText = pct + '%';
    }

    function prettyExerciseName(name) {
        return name.replace(/([A-Z])/g, ' $1').trim();
    }

    // ---- Reference skeleton drawing ----
    function drawReferenceSkeleton(exercise) {
        const ref = referenceGestures[exercise];
        if (!ref || !referenceCanvas) return;

        const ctx = referenceCanvas.getContext('2d');
        const rect = referenceCanvas.parentElement.getBoundingClientRect();
        referenceCanvas.width = rect.width;
        referenceCanvas.height = rect.height;

        ctx.clearRect(0, 0, referenceCanvas.width, referenceCanvas.height);

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        ref.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        });

        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;
        const padding = 30;
        const drawW = referenceCanvas.width - padding * 2;
        const drawH = referenceCanvas.height - padding * 2;
        const scale = Math.min(drawW / rangeX, drawH / rangeY);
        const offsetX = padding + (drawW - rangeX * scale) / 2;
        const offsetY = padding + (drawH - rangeY * scale) / 2;

        function toCanvas(i) {
            const p = ref[i];
            return {
                x: offsetX + (p.x - minX) * scale,
                y: offsetY + (p.y - minY) * scale
            };
        }

        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20],
            [5, 9], [9, 13], [13, 17]
        ];

        ctx.strokeStyle = 'rgba(32, 178, 170, 0.8)';
        ctx.lineWidth = 3;
        connections.forEach(([a, b]) => {
            const p1 = toCanvas(a);
            const p2 = toCanvas(b);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });

        ctx.fillStyle = 'rgba(32, 178, 170, 1)';
        ref.forEach((_, i) => {
            const p = toCanvas(i);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    // ---- Generic countdown on the progress bar ----
    function startCountdown(duration, onComplete) {
        let remaining = duration;
        progressBar.style.width = '100%';
        timerLabel.textContent = remaining + 's';

        timerInterval = setInterval(() => {
            remaining--;
            const pct = (remaining / duration) * 100;
            progressBar.style.width = pct + '%';
            timerLabel.textContent = remaining + 's';

            if (remaining <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                onComplete();
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (scoreInterval) {
            clearInterval(scoreInterval);
            scoreInterval = null;
        }
        progressBar.style.width = '0%';
        timerLabel.textContent = '';
    }

    function computeCurrentScore(exercise) {
        if (!latestLandmarks) return 0;
        const normalized = normalizeLandmarks(latestLandmarks);
        const reference = referenceGestures[exercise];
        if (!reference) return 0;
        return compareGesture(normalized, reference);
    }

    // ---- Exercise evaluation flow ----
    function startNextTest() {
        if (currentTestIndex >= exercises.length) {
            finishEvaluation();
            return;
        }

        const exercise = exercises[currentTestIndex];
        const prettyName = prettyExerciseName(exercise);

        // Update reference skeleton
        referenceLabel.textContent = `Reference: ${prettyName}`;
        drawReferenceSkeleton(exercise);

        // Hide scoring UI, show live score
        scoringUI.style.display = 'none';
        livePercent = 0;
        liveScoreEl.textContent = '0%';
        liveScoreEl.style.display = 'block';

        // Live-update score every 200ms during the countdown
        scoreInterval = setInterval(() => {
            livePercent = computeCurrentScore(exercise);
            liveScoreEl.textContent = livePercent + '%';
        }, 200);

        // Start the 10-second timer
        startCountdown(TIMER_DURATION, () => {
            // Stop live scoring
            clearInterval(scoreInterval);
            scoreInterval = null;

            // Capture final score
            livePercent = computeCurrentScore(exercise);
            liveScoreEl.style.display = 'none';

            // Show ranking UI with final score
            exerciseNameEl.textContent = `Exercise: ${prettyName}`;
            percentScoreEl.textContent = `Score: ${livePercent}%`;
            scoringUI.style.display = 'block';
            scoringUI.dataset.percent = livePercent;
            difficultyInput.value = '';
            difficultyInput.focus();
        });
    }

    // Handle next button — save difficulty and move on
    nextBtn.addEventListener('click', () => {
        const difficulty = parseInt(difficultyInput.value);
        if (!difficulty || difficulty < 1 || difficulty > 10) {
            alert('Please rate the difficulty from 1 to 10.');
            return;
        }

        const exercise = exercises[currentTestIndex];
        const percent = parseInt(scoringUI.dataset.percent) || 0;

        results.push({ exercise, percent, difficulty });

        // Update total progress circle
        const totalPct = Math.round(((currentTestIndex + 1) / exercises.length) * 100);
        updateCircleProgress(totalPct);

        scoringUI.style.display = 'none';
        currentTestIndex++;
        startNextTest();
    });

    // Flexing button logic
    flexBtn.addEventListener('click', async () => {
        if (!stream) {
            try {
                cameraContainer.style.display = 'block';
                referenceContainer.style.display = 'flex';
                flexBtn.innerText = "Stop Flexing";
                flexBtn.style.background = "#ff4757";

                // Initialize MediaPipe webcam & handLandmarker
                videoElement = await setupWebcam();
                stream = videoElement.srcObject;

                runHandLandmarker((landmarksArray) => {
                    if (landmarksArray.length > 0) {
                        latestLandmarks = landmarksArray[0];
                    }
                }, videoElement);

                // Start first exercise
                startNextTest();

            } catch (err) {
                alert("Camera access is required to Start Flexing.");
            }
        } else {
            // Stop flexing — reset everything and return to idle state
            stopTimer();
            scoringUI.style.display = 'none';
            liveScoreEl.style.display = 'none';
            cameraContainer.style.display = 'none';
            referenceContainer.style.display = 'none';
            currentTestIndex = 0;
            results = [];
            updateCircleProgress(0);
            flexBtn.innerText = "Start Flexing";
            flexBtn.style.background = '';
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }
    });

   async function finishEvaluation() {
    stopTimer();
    scoringUI.style.display = 'none';
    liveScoreEl.style.display = 'none';

    alert('Evaluation complete! Check console for results.');
    console.log('Evaluation Results:', results);

    // Save results to localStorage so the Progress tab can read them
    localStorage.setItem('evaluationResults', JSON.stringify(results));

    console.log("FINISH EVALUATION CALLED");
    console.log("Current user:", auth.currentUser);

    const user = auth.currentUser;

    if (user) {
        try {
            await addDoc(
                collection(db, "users", user.uid, "evaluations"),
                {
                    exercises: results,
                    createdAt: serverTimestamp()
                }
            );

            console.log("Evaluation saved to Firestore");

        } catch (error) {
            console.error("Error saving evaluation:", error);
        }
    } else {
        console.log("Null");
    }

    // Reset session
    currentTestIndex = 0;
    results = [];
    cameraContainer.style.display = 'none';
    referenceContainer.style.display = 'none';
    updateCircleProgress(0);

    flexBtn.innerText = "Start Flexing";
    flexBtn.style.background = '';

    if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
    }
}
});
