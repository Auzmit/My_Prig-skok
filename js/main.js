import detectCollision from './detectCollision.js';
import randomInteger from './randomInteger.js';

// board init
let board;
let boardWidth = 600;
let boardHeight = 800;
let context;

// physics init
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

// skoker init
let skokerWidth = 46;
let skokerHeight = 46;
let skokerX = boardWidth/2 - skokerWidth/2;
let skokerY = boardHeight*0.9 - skokerHeight;
let skokerLeftImage;
let skokerRightImage;
let skoker = {
  image: null,
  x: skokerX,
  y: skokerY,
  width: skokerWidth,
  height: skokerHeight
}

// platforms init
let arrPlatform = [];
const platformImageWidth = 1200; // 142,85714285714285714285714285714
const platformImageHeight = 336; // 48
const coeffImageToPlatform = 7;
const platformWidth = (platformImageWidth-200)/coeffImageToPlatform; // 142,85
const platformHeight = platformImageHeight/coeffImageToPlatform; // 48
let platformImage;
let arrPlatformImages = [];
for (let i = 1; i <= 6; i++) {
  arrPlatformImages.push(`./images/clouds/cloud-right-${i}.png`);
  arrPlatformImages.push(`./images/clouds/cloud-left-${i}.png`);
}

// score init
let score = 0;

window.onload = function() {
  board = document.getElementById('board');
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext('2d');

  // load images
  skokerRightImage = new Image();
  skokerRightImage.src = './images/head-right.png';
  skokerLeftImage = new Image();
  skokerLeftImage.src = './images/head-left.png';
  //
  skoker.image = skokerRightImage;
  skokerRightImage.onload = function() {
    context.drawImage(skoker.image, skoker.x, skoker.y, skoker.width, skoker.height);
  };

  velocityY = initialVelocityY;
  placePlatforms(arrPlatformImages);
  requestAnimationFrame(update);
  document.addEventListener('keydown', moveSkoker);
};

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  // draw skoker
  velocityY += gravity;
  skoker.y += velocityY;
  skoker.x += velocityX;
  // jump from side to side of the screen
  if (skoker.x > board.width) {
    skoker.x = 0;
  } else if (skoker.x + skoker.width < 0) {
    skoker.x = board.width;
  };
  //
  context.drawImage(skoker.image, skoker.x, skoker.y, skoker.width, skoker.height);

  // platforms and velocityY
  for (let i = 0; i < arrPlatform.length; i++) {
    let platform = arrPlatform[i];
    if (velocityY < 0 && skoker.y < boardHeight*0.74) {
      platform.y -= initialVelocityY*0.7; // shift all plats little down
    }
    if (detectCollision(skoker, platform) && velocityY >= 0) {
      velocityY = initialVelocityY; // jump from the platform
    }
    context.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
  };

  while (arrPlatform.length > 0 && arrPlatform[0].y >= boardHeight) {
    arrPlatform.shift();
    newPlatform();
    score += 1;
  };

  // score draw
  context.fillStyle = 'black';
  context.font = 'bold 50px Sans-Serif';
  context.fillText(score, 5, 42);
}

function moveSkoker(event) {
  if (event.code == 'ArrowRight' || event.code == 'KeyD') {
    velocityX = 5;
    skoker.image = skokerRightImage;
  } else if (event.code == 'ArrowLeft' || event.code == 'KeyA') {
    velocityX = -5;
    skoker.image = skokerLeftImage;
  };
};

function placePlatforms() {
  let platformImage = new Image();
  platformImage.src = arrPlatformImages[
    randomInteger(0, arrPlatformImages.length - 1)];

  // 1-st (starting) platform
  let platform = {
    image: platformImage,
    x: boardWidth/2 - platformWidth/2,
    y: boardHeight - platformHeight,
    width: platformWidth,
    height: platformHeight
  };
  arrPlatform.push(platform);

  while (arrPlatform[arrPlatform.length - 1].y > 0) {
    newPlatform();
  };
};

function newPlatform() {
  // X-coord randoming with little indent on left & right
  let coeffWidthPadding = 0.02;
  let widthPadding = boardWidth * coeffWidthPadding;
  let randomX = randomInteger(widthPadding,
    boardWidth - widthPadding - platformWidth);

  let platformImage = new Image();
  platformImage.src = arrPlatformImages[
    randomInteger(0, arrPlatformImages.length - 1)];

  let platform = {
    image: platformImage,
    x: randomX,
    y: arrPlatform[arrPlatform.length - 1].y - 100 - randomInteger(0, 60),
    // y: arrPlatform[arrPlatform.length - 1].y - 160,
    width: platformWidth,
    height: platformHeight
  };

  arrPlatform.push(platform);
};
