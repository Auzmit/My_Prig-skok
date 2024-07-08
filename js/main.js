import detectCollision from './detectCollision.js';
import randomInteger from './randomInteger.js';

// board init
let board;
let boardWidth = 600;
let boardHeight = 800;
let context;
// starting 'f_update' every lntervalledUpdateFreq ms
// with the help of 'setInterval':
let lntervalledUpdate;
let lntervalledUpdateFreq = 16;
let gameOverFlag = false;

// physics init
let initialVelocityX = 0;
let velocityX = initialVelocityX;
// let inialShiftSkokerX = boardWidth/120;
let shiftSkokerX = boardWidth/120;
let initialVelocityY = -boardWidth/71; // 60 => -10
let velocityY = initialVelocityX;
let initialGravity = boardWidth/1500; // 1500 => 0.4
let gravity = initialGravity;

// skoker init
let skokerWidth = boardWidth/13; // 13 => 46,1538...
let skokerHeight = skokerWidth;
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
// const platformImageWidth = 1200;
// const platformImageHeight = 336;
const platformWidth = boardWidth/5;
const platformHeight = platformWidth/3.57;
let arrPlatform = [];
let arrPlatformImages = [];
for (let i = 1; i <= 6; i++) {
  arrPlatformImages.push(`./images/clouds/cloud-right-${i}.png`);
  arrPlatformImages.push(`./images/clouds/cloud-left-${i}.png`);
};
let platformColorsImages = [];
let platformColors = ['blue', 'green',
                      'grey', 'red', 'yellow'];
for (let platformColor of platformColors) {
  platformColorsImages.push(
    `./images/clouds/colored/cloud-right-1-${platformColor}.png`);
  platformColorsImages.push(
    `./images/clouds/colored/cloud-left-1-${platformColor}.png`);
};

// score init
let score = 0;
let pointsForJump = 20;
let pointsForJumpMessage = '';
let pointsForJumpDrawIndex = 0;
let initialPointsForJumpDrawIndex = 10;

window.onload = init();

function init() {
  score = 0;
  gameOverFlag = false;

  board = document.getElementById('board');
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext('2d');

  // load images
  skokerRightImage = new Image();
  skokerRightImage.src = './images/head-right-stroke.png';
  skokerLeftImage = new Image();
  skokerLeftImage.src = './images/head-left-stroke.png';
  //
  skoker.image = skokerRightImage;
  skoker.x = skokerX;
  skoker.y = skokerY;
  skokerRightImage.onload = function() {
    context.drawImage(skoker.image, skoker.x,
      skoker.y, skoker.width, skoker.height);
  };

  velocityX = initialVelocityX;
  velocityY = initialVelocityY;
  placePlatforms(arrPlatformImages);

  // 3-rd variation of looped 'update':
  clearInterval(lntervalledUpdate);
  lntervalledUpdate = setInterval(update, lntervalledUpdateFreq);
  
  document.addEventListener('keydown', moveSkoker);
};

function update() {
  // console.log('update');
  if (skoker.y > boardHeight) {
    gameOver();
    clearInterval(lntervalledUpdate);
  } else {
    context.clearRect(0, 0, board.width, board.height);
    
    // update skoker.x
    skoker.x += velocityX;
    // jump from side to side of the screen
    if (skoker.x > board.width) {
      skoker.x = 0;
    } else if (skoker.x + skoker.width < 0) {
      skoker.x = board.width;
    };
  
    // shift skoker & all platforms little down:
    velocityY += gravity;
    if (velocityY < 0) {
      // shift 2 times platforms,
      // because skoker can jump out from top of screen
      if (skoker.y < boardHeight * 0.4) {
        for (const platform of arrPlatform) {
          platform.y -= velocityY * 2;
        }
      // normal shift - platforms & skoker
      } else if (skoker.y < boardHeight) {
        skoker.y += velocityY;
        for (const platform of arrPlatform) {
          platform.y -= velocityY;
        }
      }
    } else skoker.y += velocityY;
  
    // jump from the platform & draw platform's
    for (const platform of arrPlatform) {
      if (detectCollision(skoker, platform) && velocityY >= 0) {
        detectColor(skoker, platform);
      }
      context.drawImage(platform.image, platform.x,
        platform.y, platform.width, platform.height);
    };
    
    while (arrPlatform[0].y >= boardHeight) {
      arrPlatform.shift();
      newPlatform();
      score += 1;
    };
  
    // score draw
    context.fillStyle = 'black';
    context.font = `bold ${boardWidth/12}px Sans-Serif`;
    context.textAlign = 'left';
    context.fillText(score, boardWidth/120, boardWidth/15);

    // skoker draw
    context.drawImage(skoker.image, skoker.x,
      skoker.y, skoker.width, skoker.height);

    // pointsForJump draw
    if (pointsForJumpDrawIndex > 0) {
      context.fillStyle = 'blue';
      context.font = `bold ${boardWidth/12}px Sans-Serif`;
      context.textAlign = 'center';
      context.fillText(pointsForJumpMessage, skoker.x + skoker.width/2,
        skoker.y + skoker.height*2);  
      
      pointsForJumpDrawIndex -= 1;
    }
  };
  
}

function moveSkoker(event) {
  if (event.code == 'ArrowRight' || event.code == 'KeyD') {
    velocityX = shiftSkokerX;
    skoker.image = skokerRightImage;
  } else if (event.code == 'ArrowLeft' || event.code == 'KeyA') {
    velocityX = -shiftSkokerX;
    skoker.image = skokerLeftImage;
  } else if (event.code == 'KeyR') {
    if (gameOverFlag) init();
  } else if (event.code == 'Space') {
    pointsForJumpDrawIndex = initialPointsForJumpDrawIndex;
    if (score >= pointsForJump) {
      velocityY = initialVelocityY;
      score -= pointsForJump;
      pointsForJumpMessage = `-${pointsForJump}`;
    } else {
      pointsForJumpMessage = `need ${pointsForJump} \n points`;
    }
  }
};

function placePlatforms() {
  arrPlatform = [];
  let platformImage = new Image();
  platformImage.src = arrPlatformImages[
    randomInteger(0, arrPlatformImages.length - 1)];

  // 1-st (starting) platform
  let platform = {
    collision: true,
    color: 'white',
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
  let widthPadding = boardWidth*0.02;
  let randomX = randomInteger(widthPadding,
    boardWidth - widthPadding - platformWidth);

  let platformImage = new Image();
  
  let platform = {
    collision: true,
    color: 'white',
    image: platformImage,
    x: randomX,
    y: arrPlatform[arrPlatform.length - 1].y - boardWidth/6
      - randomInteger(0, boardWidth/10.5),
    width: platformWidth,
    height: platformHeight
  };

  // platforms' white & colored images
  if (randomInteger(1, 100) >= 85) {
    platform.image.src = platformColorsImages[
      randomInteger(0, platformColorsImages.length - 1)];
    platform.color = platform.image.src.split('-').pop().split('.')[0];
    // console.log(platform.color);
  } else {
    // color: 'white'
    platformImage.src = arrPlatformImages[
      randomInteger(0, arrPlatformImages.length - 1)];
  }

  let devCheckColor = 'blue';
  // dev-check certain color
  // platform.image.src =
  //   `./images/clouds/colored/cloud-left-1-${devCheckColor}.png`;
  // platform.color = platform.image.src.split('-').pop().split('.')[0];

  // dev-check certain color between white
  if (platform.color !== 'white') {
    platform.image.src =
      `./images/clouds/colored/cloud-left-1-${devCheckColor}.png`;
    platform.color = devCheckColor;
  }

  arrPlatform.push(platform);
};

function detectColor(skoker, platform) {
  velocityY = initialVelocityY;
  let side = '';
  if (randomInteger(0, 1) === 0) {
    side = 'right';
  } else side = 'left';

  if (platform.color === 'yellow') {
    velocityY = initialVelocityY * 2.2;
  } else if (platform.color === 'blue') {
    // mirroring skoker & platforms
    velocityX = -velocityX;
    if (skoker.image === skokerRightImage) {
      skoker.image = skokerLeftImage;
    } else skoker.image = skokerRightImage;

    for (let currentPlatform of arrPlatform) {
      let platformCenter = currentPlatform.x + platformWidth/2;
      if (platformCenter >= boardWidth/2) {
        platformCenter = boardWidth/2 - (platformCenter - boardWidth/2);
      } else {
        platformCenter = boardWidth/2 + (boardWidth/2 - platformCenter);
      }
      currentPlatform.x = platformCenter - platformWidth/2;
    }
  } else if (platform.color === 'grey') {
    // grey turns to black
    platform.color = 'black';
    platform.image.src = 
      `./images/clouds/colored/cloud-${side}-1-black.png`;
  } else if (platform.color === 'black') {
    // black disappear
    platform.image.src = './images/clouds/transparent_1x1.png';
    platform.collision = false;
  } else if (platform.color === 'red') {
    // explodes - farther skoker is from the center of the platform,
    // harder kicks him away along X & disappear
    let xDistanceSkokerPlatform = (skoker.x + skoker.width/2)
      - (platform.x + platform.width/2);
    let coeffShiftSkokerX = xDistanceSkokerPlatform/(platform.width/2);
    coeffShiftSkokerX *= 0.3;

    coeffShiftSkokerX += (coeffShiftSkokerX >= 0) ? 1 : -1;
    velocityX = shiftSkokerX * coeffShiftSkokerX;

    platform.image.src = './images/clouds/transparent_1x1.png';
    platform.collision = false;

  } else if (platform.color === 'green') {
    
  } 
}

function gameOver() {
  gameOverFlag = true;

  let gradient = context.createLinearGradient(0, 0, boardWidth, 0);
  gradient.addColorStop("0","magenta");
  gradient.addColorStop("0.5","blue");
  gradient.addColorStop("1.0","red");

  let gameOverSize = boardWidth/6.5;
  context.fillStyle = gradient;
  context.font = `bold ${gameOverSize}px Sans-Serif`;
  context.textAlign = 'center';
  context.fillText('Game Over', boardWidth/2, boardWidth/2);

  context.fillStyle = 'black';
  context.font = `bold ${boardWidth/15}px Sans-Serif`;
  context.textAlign = 'center';
  context.fillText('(press R to restart)', boardWidth/2,
    boardWidth/2 + gameOverSize*0.98);
}
