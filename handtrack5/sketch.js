let targetRotateX = 0;
let targetRotateY = 0;
let currentRotateX = 0;
let currentRotateY = 0;

let carModel;
let carTexture;
let carX = window.innerWidth / 2;
let carY = window.innerHeight / 2;
let carSize = 100;
let carVelocityX = 0;
let carVelocityY = 0;
let damping = 0.95;  // Adjust this for momentum effect

let previousPinchDistance = 0;
let pinchThreshold = 0.08;
let sizeChangeRate = 60;

let targetCarSize = carSize;
let targetX = carX;
let targetY = carY;

function preload() {
  // carModel = loadModel('12140_Skull_v3_L2.obj', true);
  carModel = loadModel('Intergalactic_Spaceship-(Wavefront).obj', true);
  carTexture = loadImage('red.jpg');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

function draw() {
  background(0);
  
  // ortho();

  // Smooth rotation using lerp
  currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
  currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);

  // Move car towards target position
  carX = lerp(carX, targetX, 0.1);
  carY = lerp(carY, targetY, 0.1);

  // Apply damping to momentum effect
  // carVelocityX *= damping;
  // carVelocityY *= damping;

  // Scale size smoothly
  carSize = lerp(carSize, targetCarSize, 0.1);

  translate(carX - width / 2, carY - height / 2, 0);
  scale(carSize / 100);

  // rotateX(radians(100));  
  // rotateY(radians(100));  
  
  rotateX(currentRotateX);
  rotateY(currentRotateY);
   

    // console.log(currentRotateX);
    // console.log(currentRotateY);



  texture(carTexture);
  model(carModel);

  // Update positions with current velocities
  // carX += carVelocityX;
  // carY += carVelocityY;

    // Move car towards target position
    carX = lerp(carX, targetX, 0.1);
    carY = lerp(carY, targetY, 0.1);
}



let movThreshold = 0.01;
let movPos = 0.02;
let p = 0.5;
let q = 0.5;
let previousP = 0.5;
let previousQ = 0.5;
function updateCarPosition(x, y) {

  if (x > previousA + movThreshold) {
    p += movPos;
  } else if (x < previousA - movThreshold) {
    p -= movPos;
  }

  if (y > previousB + movThreshold) {
    q += movPos;
  } else if (y < previousB - movThreshold) {
    q -= movPos;
  }

  targetX = p * window.innerWidth;
  targetY = q * window.innerHeight;
  
  // targetX = x * window.innerWidth;
  // targetY = y * window.innerHeight;


  // console.log(targetX);
  // console.log("X",x);
  // console.log("targetX",targetX);

  // console.log("Y",carVelocityY);


  // Set velocities towards target position for momentum effect
  // carVelocityX = (targetX - carX) * 0.1;
  // carVelocityY = (targetY - carY) * 0.1;

  previousA = x;
  previousB = y;
}



function pinchZoomScale(pinchDistance) {
  
  if (previousPinchDistance !== 0) {
    if (pinchDistance < previousPinchDistance - pinchThreshold) {
      targetCarSize -= sizeChangeRate;
    } else if (pinchDistance > previousPinchDistance + pinchThreshold) {
      targetCarSize += sizeChangeRate;
    }
  }

  // Constrain size
  targetCarSize = constrain(targetCarSize, 100, 1000);
  previousPinchDistance = pinchDistance;
}

let rotThreshold = 0.01;
let x = 0;
let y = 0;
let previousA = 0;
let previousB = 0;

function swipeRotate(a, b) {
  // if (a > previousA + rotThreshold) {
  //   x += 0.01;
  // } else if (a < previousA - rotThreshold) {
  //   x -= 0.01;
  // }

  if (b > previousB + rotThreshold) {
    y += 0.01;
  } else if (b < previousB - rotThreshold) {
    y -= 0.01;
  }


  if (a > previousA + rotThreshold) {
    if ((y >= 0.16 && y <= 0.50) || (y >= 0.83 && y <= 1.16) || (y >= 1.50&& y <= 1.83) 
      || (y >= 2.16 && y <= 2.50) || (y >= 2.83 && y <= 3.16) || (y >= 3.50 && y <= 4.83)
      || (y <=-0.16 && y >= -0.50) || (y <= -0.83 && y >= -1.16) || (y <= -1.50&& y >= -1.83) 
      || (y <= -2.16 && y >= -2.50) || (y <= -2.83 && y >= -3.16) || (y <= -3.50 && y >= -4.83)) {
      x -= 0.01; 
    } else {
      x += 0.01;  
    }
  } else if (a < previousA - rotThreshold) {  // Check if 'a' is less than the previous value minus the threshold
    if ((y >= 0.16 && y <= 0.50) || (y >= 0.83 && y <= 1.16) || (y >= 1.50&& y <= 1.83) 
      || (y >= 2.16 && y <= 2.50) || (y >= 2.83 && y <= 3.16) || (y >= 3.50 && y <= 4.83)
      || (y <=-0.16 && y >= -0.50) || (y <= -0.83 && y >= -1.16) || (y <= -1.50&& y >= -1.83) 
      || (y <= -2.16 && y >= -2.50) || (y <= -2.83 && y >= -3.16) || (y <= -3.50 && y >= -4.83)) {
      x += 0.01; 
    } else {
      x -= 0.01;  
    }
  }
  
  

  
  // console.log(x);
  // console.log(y);

  // 0.16,   0.83,   1.50,   2.16,   2.83,   3.50,   4.16,   4.83,   5.50
  // 0.50,   1.16,   1.83,   2.50,   3.16,   4.83,   5.50,   6.16,   6.83



  // Map x and y for smoother rotation
  targetRotateX = map(y, 1, -1, -PI*3, PI*3);
  targetRotateY = map(x, 1, -1, -PI*3, PI*3);

 

  previousA = a;
  previousB = b;

 
}
