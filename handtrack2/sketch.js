let cubeX = window.innerWidth / 2;
let cubeY = window.innerHeight / 2;
let cubeSize = 100; // Default cube size
let previousPinchDistance = 0; // Store the previous pinch distance
let pinchThreshold = 0.05; // Threshold for detecting pinch in/out
let sizeChangeRate = 30; // The amount by which the cube size changes with each pinch
let targetCubeSize = cubeSize; // Store target size for smoother transition
let targetX = cubeX;
let targetY = cubeY;

// Update the cube's position and size based on hand landmark coordinates and pinch distance
function updateCubePosition(x, y, pinchDistance) {
    // Convert normalized coordinates to screen dimensions
    targetX = x * window.innerWidth;
    targetY = y * window.innerHeight;

    // Track pinch in or pinch out
    if (previousPinchDistance !== 0) {
        // If the pinch is getting smaller (pinch in)
        if (pinchDistance < previousPinchDistance - pinchThreshold) {
            targetCubeSize -= sizeChangeRate; // Decrease size incrementally
        }
        // If the pinch is getting larger (pinch out)
        else if (pinchDistance > previousPinchDistance + pinchThreshold) {
            targetCubeSize += sizeChangeRate; // Increase size incrementally
        }
    }

    // Clamp the target size to stay within a minimum and maximum size range
    targetCubeSize = constrain(targetCubeSize, 50, 300); // Min size 50, max size 300

    // Smooth the transition of cube size (interpolate slowly towards target size)
    cubeSize = lerp(cubeSize, targetCubeSize, 0.1); // 0.1 is the smoothing factor

    // Update previous pinch distance
    previousPinchDistance = pinchDistance;

    // Smooth the position with lerp for more natural movement
    cubeX = lerp(cubeX, targetX, 0.1); // Smooth position
    cubeY = lerp(cubeY, targetY, 0.1); // Smooth position
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

function draw() {
    background(0);

    // Position cube based on hand landmark coordinates
    translate(cubeX - width / 2, cubeY - height / 2, 0);
    rotateY(frameCount * 0.01);
    rotateX(frameCount * 0.01);
    box(cubeSize); // Draw the cube with the smoothed size
}
