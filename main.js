// board
let board;
let boardWidth = 600;
let boardHeight = 800;
let context;

// skoker
let skokerWidth = 46;
let skokerHeight = 46;
let skokerX = boardWidth/2 - skokerWidth/2;
let skokerY = boardHeight*7/8 - skokerHeight;
let skokerLeftImage;
let skokerRightImage;
let skoker = {
  image: null,
  x: skokerX,
  y: skokerY,
  width: skokerWidth,
  height: skokerHeight
}


// physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -9;
let gravity = 0.4;

// platforms
let arrPlatform = [];
let platformImageWidth = 1200;
let platformImageHeight = 336;
let coeffImageToPlatform = 7;
let platformWidth = platformImageWidth/coeffImageToPlatform;
let platformHeight = platformImageHeight/coeffImageToPlatform;
let platformImage;

// clouds
// let arrClouds = [];
// for (let i = 1; i <= 6; i++) {
//   arrClouds.push(`./images/clouds/cloud-right-${i}.png`);
//   arrClouds.push(`./images/clouds/cloud-left-${i}.png`);
// }
// console.log(arrClouds);

let score = 0;

window.onload = function() {
  board = document.getElementById('board');
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext('2d');

  // draw skoker
  // context.fillStyle = 'green';
  // context.fillRect(skoker.x, skoker.y, skoker.width, skoker.height);

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
  //
  platformImage = new Image();
  // platformImage.src = './images/cloud-done-2.35.png';
  platformImage.src = './images/clouds/cloud-left-1.png';
  // platformImage.src = './images/cloud.png';
  // platformImage.src = arrClouds[randomIntFromInterval(1, 6)];

  
  // skoker.image = skokerRightImage;
  // skokerRightImage.onload = function() {
  //   context.drawImage(skoker.image, skoker.x, skoker.y, skoker.width, skoker.height);
  // }

  velocityY = initialVelocityY;
  placePlatforms();
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

  // platforms
  for (let i = 0; i < arrPlatform.length; i++) {
    let platform = arrPlatform[i];
    if (i !== 0) {
      let previousPlatform = arrPlatform[i-1];
    }
    if (velocityY < 0 && skoker.y < boardHeight*3/4) {
      platform.y -= initialVelocityY*0.8; // drop platform down
    }
    if (detectCollision(skoker, platform) && velocityY >= 0) {
      velocityY = initialVelocityY; // jump from the platform
    }
    if (typeof previousPlatform !== 'undefined') {
      if (platform.y - previousPlatform.y > 50) {
        context.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
      }
      // else console.log(platform.y - previousPlatform.y);
    } else {
      context.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
    }
  }

  while (arrPlatform.length > 0 && arrPlatform[0].y >= boardHeight) {
    arrPlatform.shift();
    newPlatform();
  }
}

function moveSkoker(e) {
  if (e.code == 'ArrowRight' || e.code == 'KeyD') {
    velocityX = 4;
    skoker.image = skokerRightImage;
  } else if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
    velocityX = -4;
    skoker.image = skokerLeftImage;
  }
}

// function randomIntFromInterval(min, max) { // min and max included 
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

function placePlatforms() {
  arrPlatform = [];
  // platformImage.src = arrClouds[randomIntFromInterval(1, 6)];

  // 1-st (starting) platform
  let platform = {
    image: platformImage,
    x: boardWidth/2,
    y: boardHeight - 70,
    width: platformWidth,
    height: platformHeight
  }

  arrPlatform.push(platform);

  // platform = {
  //   image: platformImage,
  //   x: boardWidth/2,
  //   y: boardHeight - 250,
  //   width: platformWidth,
  //   height: platformHeight
  // }

  // arrPlatform.push(platform);

  for (let i = 0; i < 4; i++) {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    // platformImage.src = arrClouds[randomIntFromInterval(1, 6)];
    let platform = {
      image: platformImage,
      x: randomX,
      y: boardHeight - 160*i - 150,
      // y: boardHeight - 300,
      width: platformWidth,
      height: platformHeight
    }
  
    arrPlatform.push(platform);
  }
}

function newPlatform() {
  let randomX = Math.floor(Math.random() * boardWidth*3/4);
  // platformImage.src = arrClouds[randomIntFromInterval(1, 6)];
    let platform = {
      image: platformImage,
      x: randomX,
      // y: -platformHeight,
      y: -platformHeight,
      width: platformWidth,
      height: platformHeight
    }
  
    arrPlatform.push(platform);
}

function detectCollision(a, b) {
  return a.x < b.x + b.width &&   // on x: a's Top Left corner < b's Top Right corner
         a.x + a.width > b.x &&   // on x: a's Top Right corner < b's Top Left corner
         a.y < b.y + b.height &&  // on y: a's Top Left corner < b's Bottom Right corner
         a.y + a.height > b.y;    // on y: a's Top Right corner < b's Bottom Left corner
}