let targetRotateX = 0;
let targetRotateY = 0;
let currentRotateX = 0;
let currentRotateY = 0;

let carModel;  
let carX = window.innerWidth / 2;
let carY = window.innerHeight / 2;
let carSize = 100;
let previousPinchDistance = 0;
let pinchThreshold = 0.04;
let sizeChangeRate = 35; 

let targetCarSize = carSize;
let targetX = carX;
let targetY = carY;

function preload() {
  carModel = loadModel('12140_Skull_v3_L2.obj', true);
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

function draw() {
  background(0);

  translate(carX - width / 2, carY - height / 2, 0);
  scale(carSize / 100);

  currentRotateX += (targetRotateX - currentRotateX) * 1;
  currentRotateY += (targetRotateY - currentRotateY) * 1;

  rotateX(currentRotateX);
  rotateY(currentRotateY);

  model(carModel); 
}

function updateCarPosition(x, y) {
  targetX = x * window.innerWidth;
  targetY = y * window.innerHeight;

  carX = lerp(carX, targetX, 0.1);
  carY = lerp(carY, targetY, 0.1);
}

function pinchZoomScale(pinchDistance) {

  if (previousPinchDistance !== 0) {
    if (pinchDistance < previousPinchDistance - pinchThreshold) {
      targetCarSize -= sizeChangeRate; 
    } else if (pinchDistance > previousPinchDistance + pinchThreshold) {
      targetCarSize += sizeChangeRate;  
    }
  }

  targetCarSize = constrain(targetCarSize, 50, 500);  

  carSize = lerp(carSize, targetCarSize, 0.1);

  previousPinchDistance = pinchDistance;

}

let rotThreshold = 0.01;
let x = 0;
let y = 0;
let previousA = 0;
let previousB = 0;

function swipeRotate(a, b) {
  console.log("a", a);
  console.log("b", b);

  if (a > previousA + rotThreshold) {
    x += 0.0001;  
  } else if (a < previousA - rotThreshold) {
    x -= 0.0001; 
  }

 
  if (b > previousB + rotThreshold) {
    y += 0.0001;  
  } else if (b < previousB - rotThreshold) {
    y -= 0.0001;  
  }

  console.log("x", x);
  console.log("y", y);
 
  targetRotateX = map(y, 1, -1, -PI*256, PI*256);  
  targetRotateY = map(x, 1, -1, -PI*256, PI*256);   

 
  currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
  currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);
 
  previousA = a;
  previousB = b;
}
