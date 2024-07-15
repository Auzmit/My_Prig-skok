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
let choosedWorld = '';

// screens
let arrScreens = ['worldsMenu', 'gameWorld'];
let currentScreen = arrScreens[0];
// worlds screen
// let arrWorldsColors = ['yellow', 'multiColours', 'grey',
//   'green', 'black'];
let objWorldsInfo = {
  'yellow': {fillColor: 'rgba(255, 200, 0, 0.4)', name: 'Детский',
    str1: 'всё просто - даже', str2: 'ребёнок справится'},
  'multiColours': {fillColor: 'rgba(255, 200, 0, 0.4)', name: 'Обычная жизнь',
    str1: 'жизнь как она есть:', str2: 'со своими взлётами и падениями'},
  'grey': {fillColor: 'rgba(255, 200, 0, 0.4)', name: 'Нуар',
    str1: 'это сложный мир,', str2: 'но дающий право на ошибку'},
  'green': {fillColor: 'rgba(255, 200, 0, 0.4)', name: 'Green Lives Matter',
    str1: 'движение это жизнь, да?', str2: 'а природа - это и есть движение!'},
  'black': {fillColor: 'rgba(255, 200, 0, 0.4)', name: 'Нуарный кошмар',
    str1: 'на самом деле всё просто -', str2: 'просто не ошибайся)'}
};
let worldNumber = 0;
let rectWidth = canvasWidth*3/6;
let rectHeight = rectWidth*2/8;
let rectShiftY = rectHeight*1.3;
let rectRadii = rectWidth/25;
let rectPosX = canvasWidth/2 - rectWidth/2;
// располагаю первую кнопку так, чтобы все кнопки находились по середине Y
// (расстояние от верхней точки самой верхней кнопки до верха канваса
// равно расстоянию от нижней точки самой нижней кнопки до низа канваса)
let rectPosY = (canvasHeight -
  rectHeight * Object.keys(objWorldsInfo).length -
  (rectShiftY - rectHeight) * (Object.keys(objWorldsInfo).length - 1)) / 2;
for (let world in objWorldsInfo) {
  objWorldsInfo[world].Y = rectPosY;
  rectPosY = rectPosY + rectShiftY;
};

// fonts (web safe):
let fontArial = 'Arial'; // same line thickness
let fontGeorgia = 'Georgia'; // unsame line thickness & numbers are jumping
let fontCourierNew = 'Courier New'; // same line thickness, but slim
let fontTimesNewRoman = 'Times New Roman'; // unsame line thickness
let fontTrebuchetMS = 'Trebuchet MS'; // same to Arial?
let fontVerdana = 'Verdana'; // same line thickness & bold

// physics init
let initialVelocityX = 0;
let velocityX = initialVelocityX;
// let inialShiftSkokerX = canvasWidth/120;
let shiftSkokerX = canvasWidth/105; // 120 - original
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
let pointsForJump = 10;
let pointsForJumpMessage = '';
let pointsForJumpDrawIndex = 0;
let initialPointsForJumpDrawIndex = 10;

// window.onload = initMainMenu();
window.onload = initWorldsMenu();
// window.onload = initGame();
document.addEventListener('click', (event) => {
  if (currentScreen === 'worldsMenu') {
    let coords = canvasMouseCoords(canvas, event);
    let mouseX = coords.x;
    let mouseY = coords.y;
    if ((mouseX >= rectPosX) &&
        (mouseX <= rectPosX + rectWidth)) {
          for (let world in objWorldsInfo) {
            let currRectPosY = objWorldsInfo[world].Y;
            if ((mouseY >= currRectPosY) &&
                (mouseY <= currRectPosY + rectHeight)) {
                  // console.log(world);
              initGame(world);
            };
        };


      // canvas.addEventListener('click', (event) => {
      //     if ((mouseX > rectPosX) &&
      //       (mouseX < rectPosX + rectWidth) &&
      //       (mouseY > currRectPosY) &&
      //       (mouseY < currRectPosY + rectHeight)) {
      //     console.log(worldY[0]);
      //     // choosedWorld = worldY[0].split('WorldY')[0];
      //     choosedWorld = worldY[0];
      //     // console.log(choosedWorld);
      //     initGame()
      //     // initGame();
      //   }
      // })


    };
  }
});

// function initMainMenu() {
//   currentScreen = 'mainMenu';

//   canvas = document.getElementById('canvas');
//   canvas.height = canvasHeight;
//   canvas.width = canvasWidth;
//   context = canvas.getContext('2d');
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   let rectWidth = canvasWidth*3/6;
//   let rectHeight = rectWidth*2/8;
//   let rectPosX = canvasWidth/2 - rectWidth/2;
//   let rectPosY = canvasHeight*2/8;
//   let rectRadii = rectWidth/25;

//   // button Worlds
//   context.fillStyle = 'rgba(255, 200, 0, 0.4)';
//   context.strokeStyle = 'black';
//   context.beginPath();
//   context.roundRect(rectPosX, rectPosY,
//     rectWidth, rectHeight, rectRadii);
//   context.fill();
//   context.stroke();
//   // text
//   context.font = `bold ${canvasWidth/15}px ${fontTimesNewRoman}`;
//   context.textAlign = 'center';
//   context.textBaseline = 'middle';
//   context.fillStyle = '#000000';
//   context.fillText('Миры', rectPosX + rectWidth/2,
//     rectPosY + rectHeight/2);

//   // canvas.addEventListener('click', (event) => {
//   //   let coords = canvasMouseCoords(canvas, event);
//   //   // console.log(coords);
//   //   // console.log(rectPosX, );
//   //   let mouseX = coords.x;
//   //   let mouseY = coords.y;
//   //   if ((mouseX > rectPosX) &&
//   //       (mouseX < rectPosX + rectWidth) &&
//   //       (mouseY > rectPosY) &&
//   //       (mouseY < rectPosY + rectHeight)) {
//   //     // context.fill(240, 20, 140);
//   //     console.log('play click');
//   //     initWorldsMenu();
//   //     // initGame();
//   //   }
//   // });
// };

function initWorldsMenu() {
  currentScreen = 'worldsMenu';

  canvas = document.getElementById('canvas');
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  let fontSizeWorldName = canvasWidth/20;

  let arrWorldNameAndY = [];
  worldNumber = 0;

  for (let world in objWorldsInfo) {
    // console.log(objWorldsInfo[world]);
    // rectangle
    context.fillStyle = objWorldsInfo[world].fillColor;
    context.strokeStyle = 'black';
    context.beginPath();
    context.roundRect(rectPosX, objWorldsInfo[world].Y,
      rectWidth, rectHeight, rectRadii);
    context.fill();
    context.stroke();
    
    // text
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.font = `bold ${fontSizeWorldName}px ${fontTimesNewRoman}`;
    context.fillStyle = '#000000';
    context.fillText(objWorldsInfo[world].name, rectPosX + rectWidth/2,
      objWorldsInfo[world].Y + rectHeight/12);
    context.font = `bold ${fontSizeWorldName/1.8}px ${fontTimesNewRoman}`;
    context.fillText(objWorldsInfo[world].str1, rectPosX + rectWidth/2,
      objWorldsInfo[world].Y + rectHeight/20 + fontSizeWorldName*1.2);
    context.fillText(objWorldsInfo[world].str2, rectPosX + rectWidth/2,
      objWorldsInfo[world].Y + rectHeight/20 + fontSizeWorldName*1.7);
  }

  // function buttonWorld(fillColor, worldName, des1, des2) {
  //   // rectangle
  //   rectPosY = rectPosY + rectHeight*1.3;
  //   context.fillStyle = fillColor;
  //   context.strokeStyle = 'black';
  //   context.beginPath();
  //   context.roundRect(rectPosX, rectPosY,
  //     rectWidth, rectHeight, rectRadii);
  //   context.fill();
  //   context.stroke();

  //   arrWorldNameAndY.push([arrWorldsColors[worldNumber], rectPosY]);
  //   worldNumber += 1;

  //   // text
  //   context.textAlign = 'center';
  //   context.textBaseline = 'top';
  //   context.font = `bold ${fontSizeWorldName}px ${fontTimesNewRoman}`;
  //   context.fillStyle = '#000000';
  //   context.fillText(worldName, rectPosX + rectWidth/2,
  //     rectPosY + rectHeight/12);
  //   context.font = `bold ${fontSizeWorldName/1.8}px ${fontTimesNewRoman}`;
  //   context.fillText(des1, rectPosX + rectWidth/2,
  //     rectPosY + rectHeight/20 + fontSizeWorldName*1.2);
  //   context.fillText(des2, rectPosX + rectWidth/2,
  //     rectPosY + rectHeight/20 + fontSizeWorldName*1.7);
  // };

  // // yellow - Детский
  // buttonWorld('rgba(255, 200, 0, 0.4)', 'Детский',
  //   'всё просто - даже', 'ребёнок справится');

  // // multiColours - Обычная жизнь
  // buttonWorld('rgba(255, 200, 0, 0.4)', 'Обычная жизнь',
  //   'жизнь как она есть:', 'со своими взлётами и падениями');

  // // grey - Нуар
  // buttonWorld('rgba(255, 200, 0, 0.4)', 'Нуар',
  //   'это сложный мир,', 'но дающий право на ошибку');
  
  // // green - Green Lives Matter
  // buttonWorld('rgba(255, 200, 0, 0.4)', 'Green Lives Matter',
  //   'движение это жизнь, да?', 'а природа - это и есть движение!');
  
  // // black - Нуарный кошмар
  // buttonWorld('rgba(255, 200, 0, 0.4)', 'Нуарный кошмар',
  //   'на самом деле всё просто -', 'просто не ошибайся)');

  // // action on click (& select in future updates...)
  // for (let worldY of arrWorldNameAndY) {
  //   canvas.addEventListener('click', (event) => {
  //     let currRectPosY = worldY[1];
  //     let coords = canvasMouseCoords(canvas, event);
  //     let mouseX = coords.x;
  //     let mouseY = coords.y;
  //       if ((mouseX > rectPosX) &&
  //         (mouseX < rectPosX + rectWidth) &&
  //         (mouseY > currRectPosY) &&
  //         (mouseY < currRectPosY + rectHeight)) {
  //       console.log(worldY[0]);
  //       // choosedWorld = worldY[0].split('WorldY')[0];
  //       choosedWorld = worldY[0];
  //       // console.log(choosedWorld);
  //       initGame()
  //       // initGame();
  //     }
  //   })
  // };
};

function initGame(worldColor) {
  currentScreen = 'gameWorld';

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
  placePlatforms(worldColor);

  // 3-rd variation of looped 'updateGame':
  clearInterval(lntervalledUpdateGame);
  lntervalledUpdateGame = setInterval(updateGame, lntervalledUpdateFreq);
  
  document.addEventListener('keydown', skokerControls);
  canvas.addEventListener('keydown', menuControls);
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
    context.strokeStyle = 'white';
    context.font = `bold ${canvasWidth/12}px ${fontVerdana}`;
    context.textAlign = 'left';
    context.fillText(score, canvasWidth/60, canvasWidth/13);
    context.strokeText(score, canvasWidth/60, canvasWidth/13);

    // skoker draw
    context.drawImage(skoker.image, skoker.x,
      skoker.y, skoker.width, skoker.height);

    // pointsForJump draw
    if (pointsForJumpDrawIndex > 0) {
      context.fillStyle = 'blue';
      context.font = `bold ${canvasWidth/12}px ${fontTimesNewRoman}`;
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

function menuControls(event) {
  document.removeEventListener('keydown', skokerControls);
  if (event.code == 'Escape') {
    clearInterval(lntervalledUpdateGame);
    initMainMenu();
  }
};

function worldsControls(event) {

};

function placePlatforms(worldColor) {
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
    newPlatform(worldColor);
  };
};

function newPlatform(worldColor) {
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
  if (randomInteger(1, 100) >= 65) {
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
  
  function devCheckColors(worldColor) {
      // dev-check certain color
    platform.image.src =
      `./images/clouds/colored/cloud-left-1-${worldColor}.png`;
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
  // if (choosedWorld !== 'multiColours') {
  //   // devCheckColors('yellow');
  //   devCheckColors(choosedWorld);
  // }

  // console.log(worldColor);
  if (worldColor !== 'multiColors') {
    console.log(worldColor);
    devCheckColors(worldColor);
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
    // // mirroring skoker
    // velocityX = -velocityX;
    // if (skoker.image === skokerRightImage) {
    //   skoker.image = skokerLeftImage;
    // } else skoker.image = skokerRightImage;

    // mirroring platforms
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
  
  let gameOverSize = canvasWidth/10;
  
  // 'Игра окончена'
  let gradient = context.createLinearGradient(0, 0, canvasWidth, 0);
  gradient.addColorStop('0', 'FireBrick');
  // gradient.addColorStop('0', 'blue');
  gradient.addColorStop('0.5', 'red');
  // gradient.addColorStop('1', 'DarkRed');
  gradient.addColorStop('1', 'DarkRed');
  context.fillStyle = gradient;
  context.strokeStyle = 'black';
  context.font = `bold ${gameOverSize}px ${fontTimesNewRoman}`;
  context.textAlign = 'center';
  context.fillText('Игра окончена', canvasWidth/2, canvasWidth/2);
  context.strokeText('Игра окончена', canvasWidth/2, canvasWidth/2);

  // 'нажмите "R" для рестарта'
  context.fillStyle = 'black';
  context.strokeStyle = 'white';
  // context.font = `bold ${gameOverSize/1.7}px ${fontArial}`;
  // context.font = `bold ${gameOverSize/1.7}px ${fontCourierNew}`;
  // context.font = `bold ${gameOverSize/1.7}px ${fontGeorgia}`;
  // context.font = `bold ${gameOverSize/1.8}px ${fontTimesNewRoman}`;
  context.font = `bold ${gameOverSize/1.7}px ${fontTrebuchetMS}`;
  // context.font = `bold ${gameOverSize/1.7}px ${fontVerdana}`;
  context.textAlign = 'center';
  context.fillText('нажмите «R» для рестарта', canvasWidth/2,
    canvasWidth/2 + gameOverSize);
  context.strokeText('нажмите «R» для рестарта', canvasWidth/2,
    canvasWidth/2 + gameOverSize);
}
