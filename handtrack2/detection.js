// detection.js
let detections = {};
const videoElement = document.getElementById('video');

// Initialize MediaPipe Hands
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(gotHands);

// Callback function to handle detected hand landmarks
function gotHands(results) {
    detections = results;
    if (detections.multiHandLandmarks && detections.multiHandLandmarks.length > 0) {
        const handLandmarks = detections.multiHandLandmarks[0];

        // Check if all fingers are open with higher angle threshold
        const allFingersOpen = checkIfAllFingersOpen(handLandmarks);

        // Only move cube if all fingers are open
        if (allFingersOpen) {
            const thumbTip = handLandmarks[4]; // Thumb tip landmark
            const indexFingerTip = handLandmarks[8]; // Index finger tip landmark
            const pinchDistance = dist(thumbTip.x, thumbTip.y, indexFingerTip.x, indexFingerTip.y);
            const indexFingerPosition = indexFingerTip; // We use index finger position for movement

            // Send pinch distance and hand position to p5.js for updating cube
            updateCubePosition(1-indexFingerPosition.x, indexFingerPosition.y, pinchDistance);
        }
    }
}

// Function to check if all fingers are open (returns true if all are open)
function checkIfAllFingersOpen(handLandmarks) {
    // Angle thresholds for open and closed fingers
    const openAngleThreshold = 160; // Higher threshold for open fingers
    const closedAngleThreshold =50; // Lower threshold for closed fingers (e.g., 40°)

    // Check if each finger is fully open
    const thumbOpen = angleBetween(handLandmarks[2], handLandmarks[3], handLandmarks[4]) > openAngleThreshold;
    const indexOpen = angleBetween(handLandmarks[0], handLandmarks[5], handLandmarks[6]) > openAngleThreshold;
    const middleOpen = angleBetween(handLandmarks[0], handLandmarks[9], handLandmarks[10]) > openAngleThreshold;
    const ringOpen = angleBetween(handLandmarks[0], handLandmarks[13], handLandmarks[14]) > openAngleThreshold;
    const pinkyOpen = angleBetween(handLandmarks[0], handLandmarks[17], handLandmarks[18]) > openAngleThreshold;

    // If all fingers are open, return true
    if (thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen) {
        return true;
    } else {
        // If any finger is too closed, return false (no movement allowed)
        const thumbClosed = angleBetween(handLandmarks[2], handLandmarks[3], handLandmarks[4]) < closedAngleThreshold;
        const indexClosed = angleBetween(handLandmarks[0], handLandmarks[5], handLandmarks[6]) < closedAngleThreshold;
        const middleClosed = angleBetween(handLandmarks[0], handLandmarks[9], handLandmarks[10]) < closedAngleThreshold;
        const ringClosed = angleBetween(handLandmarks[0], handLandmarks[13], handLandmarks[14]) < closedAngleThreshold;
        const pinkyClosed = angleBetween(handLandmarks[0], handLandmarks[17], handLandmarks[18]) < closedAngleThreshold;

        // Prevent movement if any finger is closed (angle less than the closed threshold)
        if (thumbClosed || indexClosed || middleClosed || ringClosed || pinkyClosed) {
            return false; // No movement if any finger is closed
        }
    }
    return false; // If any finger is closed, stop movement
}

// Function to calculate the angle between three points (for finger joint angles)
function angleBetween(p1, p2, p3) {
    const dx1 = p1.x - p2.x;
    const dy1 = p1.y - p2.y;
    const dx2 = p3.x - p2.x;
    const dy2 = p3.y - p2.y;

    const angle = Math.atan2(dy1, dx1) - Math.atan2(dy2, dx2);
    return Math.abs(angle * 180 / Math.PI); // Return angle in degrees
}

// Initialize the camera
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
});
camera.start();
