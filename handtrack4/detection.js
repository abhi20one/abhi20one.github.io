 
let detections = {};
const videoElement = document.getElementById('video');
 
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

function gotHands(results) {
    detections = results;
    if (detections.multiHandLandmarks && detections.multiHandLandmarks.length > 0) {
        const handLandmarks = detections.multiHandLandmarks[0];

        const allFingersClose = checkIfFingersAreClose(handLandmarks);    
        const zoomFingersOpen = checkIfZoomFingersOpen(handLandmarks);
        const rotateFingersOpen = checkIfRotateFingersOpen(handLandmarks);


        if (zoomFingersOpen) {
            const thumbTip = handLandmarks[4];
            const indexFingerTip = handLandmarks[12];
            const pinchDistance = dist(thumbTip.x, thumbTip.y, indexFingerTip.x, indexFingerTip.y);
            pinchZoomScale(pinchDistance);       
        } 
                
        if (rotateFingersOpen) {
            const middleFingerTip = handLandmarks[12];
            const middleFingerPosition = middleFingerTip;
            swipeRotate(middleFingerPosition.x, middleFingerPosition.y);         
        } 

        if (allFingersClose) {
            const indexFingerTip = handLandmarks[8]; 
            const indexFingerPosition = indexFingerTip; 
            updateCarPosition(1 - indexFingerPosition.x, indexFingerPosition.y);
            
        }
    }
}

function checkIfRotateFingersOpen(handLandmarks) {
    const thumbMiddleDist = dist(handLandmarks[4].x, handLandmarks[4].y, handLandmarks[8].x, handLandmarks[8].y);  

    const threshold = 0.053; 

    return thumbMiddleDist < threshold;
}

function checkIfZoomFingersOpen(handLandmarks) {
  
    const openAngleThreshold = 170; 


    const thumbOpen = angleBetween(handLandmarks[1], handLandmarks[2], handLandmarks[3]) > 120;
    const indexOpen = angleBetween(handLandmarks[0], handLandmarks[5], handLandmarks[6]) > openAngleThreshold;

    if (thumbOpen && indexOpen   ) {
        return true;
    } 
}

function checkIfFingersAreClose(handLandmarks) {
  
    const ringThumbDist = dist(handLandmarks[4].x, handLandmarks[4].y, handLandmarks[16].x, handLandmarks[16].y);
  
    const threshold = 0.06; 

    return  ringThumbDist < threshold;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function angleBetween(p1, p2, p3) {
    const dx1 = p1.x - p2.x;
    const dy1 = p1.y - p2.y;
    const dx2 = p3.x - p2.x;
    const dy2 = p3.y - p2.y;
    const angle = Math.atan2(dy1, dx1) - Math.atan2(dy2, dx2);
    return Math.abs(angle * 180 / Math.PI); 
}

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
});
camera.start();
