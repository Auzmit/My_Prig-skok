// 1
// определить начальные корды и поставить
// на них облачко со Скокером на нём

// 2
// 'newPlatform' вставить в 'placePlatforms'

import detectCollision from './detectCollision.js';

// board init
let board;
let boardWidth = 600;
let boardHeight = 800;
let context;

// skoker init
let skokerWidth = 46;
let skokerHeight = 46;
let skokerX = boardWidth/2 - skokerWidth/2;
let skokerY = boardHeight*7/8 - skokerHeight*2;
let skokerLeftImage;
let skokerRightImage;
let skoker = {
  image: null,
  x: skokerX,
  y: skokerY,
  width: skokerWidth,
  height: skokerHeight
}

// physics init
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

// platforms init
let arrPlatform = [];
let platformImageWidth = 1000;
let platformImageHeight = 336;
let coeffImageToPlatform = 7;
let platformWidth = platformImageWidth/coeffImageToPlatform;
let platformHeight = platformImageHeight/coeffImageToPlatform;
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
  }

  velocityY = initialVelocityY;
  placePlatforms(arrPlatformImages);
  requestAnimationFrame(update);
  document.addEventListener('keydown', moveSkoker);
}

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  // draw skoker
  skoker.x += velocityX;
  if (skoker.x > board.width) {
    skoker.x = 0;
  } else if (skoker.x + skoker.width < 0) {
    skoker.x = board.width;
  }

  velocityY += gravity;
  skoker.y += velocityY;
  context.drawImage(skoker.image, skoker.x, skoker.y, skoker.width, skoker.height);

  // platforms and velocityY
  for (let i = 0; i < arrPlatform.length; i++) {
    let platform = arrPlatform[i];
    if (velocityY < 0 && skoker.y < boardHeight*3/4) {
      platform.y -= initialVelocityY*0.8; // drop all platforms little bit down
    }
    if (detectCollision(skoker, platform) && velocityY >= 0) {
      velocityY = initialVelocityY; // jump from the platform
    }
    context.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
  }

  while (arrPlatform.length > 0 && arrPlatform[0].y >= boardHeight+10) {
    arrPlatform.shift();
    newPlatform();
    score += 1;
  }

  // score
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
  }
}

function randomInteger(min, max) { // min and max included 
  let randomNumber = Math.random() * (max - min + 1) + min;
  return Math.floor(randomNumber);
}

function placePlatforms() {

  let platformImage = new Image();
  platformImage.src = arrPlatformImages[
    randomInteger(0, arrPlatformImages.length - 1)];

  // 1-st (starting) platform
  let platform = {
    image: platformImage,
    x: boardWidth/2,
    // x: 0,
    y: boardHeight - 70,
    width: platformWidth,
    height: platformHeight
  }

  arrPlatform.push(platform);

  for (let i = 0; i < 6; i++) {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
      image: platformImage,
      x: randomX,
      y: boardHeight - 160*i,
      width: platformWidth,
      height: platformHeight
    }
  
    arrPlatform.push(platform);
  }
}

function newPlatform() {
  let coeffWidthPadding = boardWidth * 0.02;
  let randomX = randomInteger(0 + boardWidth * coeffWidthPadding,
    boardWidth * coeffWidthPadding - platformWidth);

  let platformImage = new Image();
  platformImage.src = arrPlatformImages[
    randomInteger(0, arrPlatformImages.length - 1)];

  let platform = {
    image: platformImage,
    x: randomX,
    y: -platformHeight,
    width: platformWidth,
    height: platformHeight
  }
  if (arrPlatform[arrPlatform.length - 1].y !== platform.y) {
    arrPlatform.push(platform);
  }
}
