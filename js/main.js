import canvasMouseCoords from './canvasMouseCoords.js';
import detectCollision from './detectCollision.js';
import randomInteger from './randomInteger.js';

// canvas init
let canvas;
let canvasWidth = 600;
let widthPadding = canvasWidth*0.02;
let canvasHeight = 800;
let context;
// starting 'f_updateGame' every lntervalledUpdateFreq ms
// with the help of 'setInterval':
let lntervalledUpdateGame;
let lntervalledUpdateFreq = 16;
let gameOverFlag = false;

// physics init
let initialVelocityX = 0;
let velocityX = initialVelocityX;
// let inialShiftSkokerX = canvasWidth/120;
let shiftSkokerX = canvasWidth/120;
let initialVelocityY = -canvasWidth/71; // 60 => -10
// let initialVelocityY = -canvasWidth/50; // 60 => -10
let velocityY = initialVelocityX;
let initialGravity = canvasWidth/1500; // 1500 => 0.4
let gravity = initialGravity;

// skoker init
let skokerWidth = canvasWidth/13; // 13 => 46,1538...
let skokerHeight = skokerWidth;
let skokerX = canvasWidth/2 - skokerWidth/2;
let skokerY = canvasHeight*0.9 - skokerHeight;
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
let platformWidth = canvasWidth/5;
let platformHeight = platformWidth/3.57;
let shiftPlatformX = shiftSkokerX;
// let shiftPlatformX;
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

// window.onload = initGame();
window.onload = initMenu();

function initMenu() {
  canvas = document.getElementById('canvas');
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  let menuRectWidth = canvasWidth*3/6;
  let menuRectHeight = menuRectWidth*2/8;
  let menuRectPosX = canvasWidth/2 - menuRectWidth/2;
  let menuRectPosY = canvasHeight*2/8;
  let menuRectRadii = menuRectWidth/25;

  // button Play
  context.strokeStyle = "magenta";
  context.beginPath();
  context.roundRect(menuRectPosX, menuRectPosY,
    menuRectWidth, menuRectHeight, menuRectRadii);
  context.stroke();

  canvas.addEventListener('click', (event) => {
    let coords = canvasMouseCoords(canvas, event);
    // console.log(coords);
    // console.log(menuRectPosX, );
    let mouseX = coords.x;
    let mouseY = coords.y;
    if ((mouseX > menuRectPosX) && (mouseX < menuRectPosX + menuRectWidth) &&
        (mouseY > menuRectPosY) && (mouseY < menuRectPosY + menuRectHeight)) {
      context.fill(240, 20, 140);
      // console.log('play click');
    }
    // else {
    //   context.fill(128, 10, 50);
    // };
  });

  // canvas.addEventListener('click', (event) => {
  //   let coords = canvasMouseCoords(canvas, event);
  //   console.log(coords.x);
  // });
};

function initGame() {
  score = 0;
  gameOverFlag = false;

  canvas = document.getElementById('canvas');
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

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

  // 3-rd variation of looped 'updateGame':
  clearInterval(lntervalledUpdateGame);
  lntervalledUpdateGame = setInterval(updateGame, lntervalledUpdateFreq);
  
  document.addEventListener('keydown', skokerControls);
};

function updateGame() {
  // console.log('updateGame');
  if (skoker.y > canvasHeight) {
    gameOver();
    clearInterval(lntervalledUpdateGame);
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // updateGame skoker.x
    skoker.x += velocityX;
    // jump from side to side of the screen
    if (skoker.x > canvas.width) {
      skoker.x = 0;
    } else if (skoker.x + skoker.width < 0) {
      skoker.x = canvas.width;
    };
  
    // shift skoker & all platforms little down:
    velocityY += gravity;
    if (velocityY < 0) {
      // hard-defined scroll - shift 2 times only platforms,
      // because skoker can jump out from top of screen
      if (skoker.y < canvasHeight * 0.4) {
        for (const platform of arrPlatform) {
          platform.y -= velocityY * 2;
        }
      // normal scroll - shift on Y platforms & skoker
      } else if (skoker.y < canvasHeight) {
        skoker.y += velocityY;
        for (const platform of arrPlatform) {
          platform.y -= velocityY;
        }
      }
    // shift on Y only skoker
    } else skoker.y += velocityY;

    // shift on X green platforms
    for (const platform of arrPlatform) {
      if (platform.color === 'green') {
        shiftXGreen(platform);
      }
    }
  
    // jump from the platform & draw platform's
    for (const platform of arrPlatform) {
      if (detectCollision(skoker, platform) && velocityY >= 0) {
        detectColor(skoker, platform);
      }
      context.drawImage(platform.image, platform.x,
        platform.y, platform.width, platform.height);
    };
    
    while (arrPlatform[0].y >= canvasHeight) {
      arrPlatform.shift();
      newPlatform();
      score += 1;
    };
  
    // score draw
    context.fillStyle = 'black';
    context.font = `bold ${canvasWidth/12}px Sans-Serif`;
    context.textAlign = 'left';
    context.fillText(score, canvasWidth/120, canvasWidth/15);

    // skoker draw
    context.drawImage(skoker.image, skoker.x,
      skoker.y, skoker.width, skoker.height);

    // pointsForJump draw
    if (pointsForJumpDrawIndex > 0) {
      context.fillStyle = 'blue';
      context.font = `bold ${canvasWidth/12}px Sans-Serif`;
      context.textAlign = 'center';
      context.fillText(pointsForJumpMessage, skoker.x + skoker.width/2,
        skoker.y + skoker.height*2);  
      
      pointsForJumpDrawIndex -= 1;
    }
  };
}

function skokerControls(event) {
  if (event.code == 'ArrowRight' || event.code == 'KeyD') {
    velocityX = shiftSkokerX;
    skoker.image = skokerRightImage;
  } else if (event.code == 'ArrowLeft' || event.code == 'KeyA') {
    velocityX = -shiftSkokerX;
    skoker.image = skokerLeftImage;
  } else if (event.code == 'KeyR') {
    if (gameOverFlag) initGame();
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
  platformImage.src = './images/clouds/transparent_1x1.png';
  // platformImage.src = arrPlatformImages[
  //   randomInteger(0, arrPlatformImages.length - 1)];

  // 1-st (starting) platform
  let platform = {
    collision: false,
    color: 'transparent',
    image: platformImage,
    x: canvasWidth/2 - platformWidth/2,
    y: canvasHeight - platformHeight,
    // y: canvasHeight,
    width: platformWidth,
    height: platformHeight
  };
  arrPlatform.push(platform);

  while (arrPlatform[arrPlatform.length - 1].y >= 0) {
    newPlatform();
  };
};

function newPlatform() {
  // X-coord randoming with little indent on left & right
  let randomX = randomInteger(widthPadding,
    canvasWidth - widthPadding - platformWidth);

  let platformImage = new Image();
  
  let platform = {
    collision: true,
    color: 'white',
    image: platformImage,
    x: randomX,
    y: arrPlatform[arrPlatform.length - 1].y - canvasWidth/6
      - randomInteger(0, canvasWidth/10.5),
    width: platformWidth,
    height: platformHeight
  };

  // add colored platforms & images to them
  if (randomInteger(1, 100) >= 85) {
    platform.image.src = platformColorsImages[
      randomInteger(0, platformColorsImages.length - 1)];
    platform.color = platform.image.src.split('-').pop().split('.')[0];
    // add movement to green platforms
    if (platform.color === 'green') {
      platform.movingSpeedOnX = shiftPlatformX*randomInteger(100, 110)/100;
      platform.movingOnX = '';
      if (randomInteger(0, 1) === 0) {
        platform.movingOnX = '-';
      } else platform.movingOnX = '+';
    };
  } else {
    // add images to other - white - platforms
    platformImage.src = arrPlatformImages[
      randomInteger(0, arrPlatformImages.length - 1)];
  };
  
  function devCheckColors(checkingColor) {
      // dev-check certain color
    platform.image.src =
      `./images/clouds/colored/cloud-left-1-${checkingColor}.png`;
    platform.color = platform.image.src.split('-').pop().split('.')[0];
  
      // dev-check certain color between white
    // if (platform.color !== 'white') {
    //   platform.image.src =
    //     `./images/clouds/colored/cloud-left-1-${checkingColor}.png`;
    //   platform.color = checkingColor;
    // }
    if (platform.color === 'green') {
      platform.movingSpeedOnX = shiftPlatformX*randomInteger(100, 110)/100;
      platform.movingOnX = '';
      if (randomInteger(0, 1) === 0) {
        platform.movingOnX = '-';
      } else platform.movingOnX = '+';
    };
  };
  // colors: blue, green, grey, red, yellow, black
  devCheckColors('grey');

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
      if (platformCenter >= canvasWidth/2) {
        platformCenter = canvasWidth/2 - (platformCenter - canvasWidth/2);
      } else {
        platformCenter = canvasWidth/2 + (canvasWidth/2 - platformCenter);
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
    platform.collision = false;
    platform.color = 'transparent';
    platform.image.src = './images/clouds/transparent_1x1.png';

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

function shiftXGreen(platform) {
  if (platform.movingOnX === '+') {
    if (platform.x + platform.width + shiftPlatformX <=
      canvasWidth - widthPadding) {
        platform.x += platform.movingSpeedOnX;
    } else {
      platform.movingOnX = '-';
      shiftXGreen(platform);
    }
  } else if (platform.movingOnX === '-') {
    if (platform.x + shiftPlatformX >= widthPadding) {
      platform.x -= platform.movingSpeedOnX;
    } else {
      platform.movingOnX = '+';
      shiftXGreen(platform);
    }
  }
}

function gameOver() {
  gameOverFlag = true;

  let gradient = context.createLinearGradient(0, 0, canvasWidth, 0);
  gradient.addColorStop("0","magenta");
  gradient.addColorStop("0.5","blue");
  gradient.addColorStop("1.0","red");

  let gameOverSize = canvasWidth/6.5;
  context.fillStyle = gradient;
  context.font = `bold ${gameOverSize}px Sans-Serif`;
  context.textAlign = 'center';
  context.fillText('Game Over', canvasWidth/2, canvasWidth/2);

  context.fillStyle = 'black';
  context.font = `bold ${canvasWidth/15}px Sans-Serif`;
  context.textAlign = 'center';
  context.fillText('(press R to restart)', canvasWidth/2,
    canvasWidth/2 + gameOverSize*0.98);
}
