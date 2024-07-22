import { canvasMouseCoords } from './canvasMouseCoords.js';
import { detectCollision } from './detectCollision.js';
import { randomInteger, randomLeftOrRight } from './random.js';
import { addMovementToGreenPlatforms } from './addMovementToGreenPlatforms.js';

// canvas init
let canvas;
let canvasWidth = 600;
let widthPadding = canvasWidth*0.02;
let canvasHeight = 800;
let context;
// starting 'f_updateGame' every 'lntervalledUpdateFreq' ms
// with the help of 'setInterval':
let lntervalledUpdateGame;
let lntervalledUpdateFreq = 16;
// let lntervalledUpdateFreq = 48;
let gameOverFlag = false;

// screens
let currentWorldColor = '';
let arrScreens = ['worldsMenu', 'gameWorld'];
let currentScreen = arrScreens[0];
// worlds screen
let objWorldsInfo = {
  'multiColours': {fillColor: 'rgba(255, 255, 255, 0.4)', name: 'Обычная жизнь',
    str1: 'жизнь как она есть:', str2: 'со своими взлётами и падениями'},
  'yellow': {fillColor: 'rgba(255, 200, 0, 0.4)', name: 'Детский',
    str1: 'всё просто - даже', str2: 'ребёнок справится'},
  'grey': {fillColor: 'rgba(150, 150, 150, 0.4)', name: 'Нуар',
    str1: 'это сложный мир,', str2: 'но дающий право на ошибку'},
  'green': {fillColor: 'rgba(0, 200, 0, 0.4)', name: 'Green Lives Matter',
    str1: 'движение это жизнь, да?', str2: 'а природа - это и есть движение!'},
  'black': {fillColor: 'rgba(0, 0, 0, 0.4)', name: 'Нуарный кошмар',
    str1: 'на самом деле всё просто -', str2: 'просто не ошибайся)'},
  'red': {fillColor: 'rgba(255, 0, 0, 0.4)', name: 'БА-ДА-БУ-У-УМ!!!',
    str1: 'а ты знаешь,', str2: 'что такое rocket jump?'},
  'blue': {fillColor: 'rgba(0, 0, 255, 0.4)', name: 'Зазеркалье',
    str1: 'тоже всё несложно,..', str2: 'если сойти с ума предварительно'}
};
let rectWidth = canvasWidth*3/6;
let rectHeight = rectWidth*2/8;
let rectShiftY = rectHeight*1.3;
let rectRadii = rectWidth/25;
let rectPosX = canvasWidth/2 - rectWidth/2;
// I position first button so that all buttons are in middle of Y
// (distance from top point of topmost button to top canvas
// is equal to distance from bottom point of lowest button to bottom of canvas)
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
};

// platforms init
// original image width = 1200
// original image height = 336
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
let platformColors = ['blue', 'green', 'grey', 'red', 'yellow'];
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
let initialPointsForJumpDrawIndex = 18;
let audioAirJump = new Audio();
    audioAirJump.src = './sounds/puk_air-jump.mp3';
let audioClick = new Audio();
    audioClick.src = './sounds/click_button.mp3';

// isons of sounds
let imageSound = new Image();
let isSoundOn = true;
let iconSoundWidth = canvasWidth*0.07;
let iconSoundHeight = iconSoundWidth;
let iconSoundOffset = canvasWidth*0.02;
let iconSoundPosX = canvasWidth - iconSoundOffset - iconSoundWidth;
let iconSoundPosY = iconSoundOffset;
// new random death sound
let newRandomAudioDeath = new Audio();

// audio
let audioDeath = new Audio();
let arrAudioDeath = [
  '-blin-zachem-ya-syuda-prishel.mp3',   
  'ay-menya-snaypnuli-v-polte.mp3',      
  'bolno-v-noge.mp3',
  'brue.mp3',
  'da-idi-tyi.mp3',
  'daladna.mp3',
  'davai-po-novoi-misha.mp3',
  'eralash.mp3',
  'eto-fiasko-bratan.mp3',
  'golos-beshenogo-gitlera-iz-mema-kotoryiy-nesoglasen.mp3',
  'grustnaya-violonchel.mp3',
  'kto-kuda-a-ya-po-delam.mp3',
  'ne-nihya.mp3',
  'nepravilno-poprobuy-esch-raz.mp3',    
  'nope.mp3',
  'nu-che-narod-pognali1.mp3',
  'nu-naher.mp3',
  'o-kurva.mp3',
  'pojili-i-hvatit.mp3',
  'vot-eto-povorot.mp3',
  'vsego-horoshego.mp3',
  'ya-maslinu-poymal.mp3'
];

// window.onload = initMainMenu();
window.onload = initWorldsMenu();
// window.onload = initGame();

document.addEventListener('click', (event) => {
  if (currentScreen === 'worldsMenu') {
    let coords = canvasMouseCoords(canvas, event);
    let mouseX = coords.x;
    let mouseY = coords.y;
    // select world
    if ((mouseX >= rectPosX) &&
        (mouseX <= rectPosX + rectWidth)) {
          for (let worldColor in objWorldsInfo) {
            let currRectPosY = objWorldsInfo[worldColor].Y;
            if ((mouseY >= currRectPosY) &&
                (mouseY <= currRectPosY + rectHeight)) {
              currentWorldColor = worldColor;
              if (isSoundOn) audioClick.play();
              initGame();
            }
        }
    };
    // sound settings
    if ((mouseX >= iconSoundPosX) &&
        (mouseX <= iconSoundPosX + iconSoundWidth) &&
        (mouseY >= iconSoundPosY) &&
        (mouseY <= iconSoundPosY + iconSoundHeight)) {
      isSoundOn = !isSoundOn;
      iconsSounds();
    };
  }
});

document.addEventListener('keydown', (event) => {
  if (currentScreen === 'gameWorld') {
    if (gameOverFlag) {
      if (event.code === 'Escape') {
        audioDeath.pause();
        audioDeath.currentTime = 0;
        clearInterval(lntervalledUpdateGame);
        initWorldsMenu();
      } else if (event.code === 'KeyR') {
        audioDeath.pause();
        audioDeath.currentTime = 0;
        initGame();
      }
    } else {
      skokerControls(event);
    }
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
// };

function initWorldsMenu() {
  currentScreen = 'worldsMenu';

  canvas = document.getElementById('canvas');
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  let fontSizeWorldName = canvasWidth/20;

  // wolrds buttons
  for (let world in objWorldsInfo) {
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
  };

  // selected world's stroke - bad idea cause of need to redraw all menu
  // context.lineWidth = 6;
  // context.strokeStyle = 'black';
  // context.beginPath();
  // context.roundRect(rectPosX, objWorldsInfo.multiColours.Y,
  //   rectWidth, rectHeight, rectRadii);
  // context.stroke();
  // context.lineWidth = 1;

  iconsSounds();
};

function initGame() {
  currentScreen = 'gameWorld';

  score = 0;
  gameOverFlag = false;

  canvas = document.getElementById('canvas');
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  // iconsSounds();
  // context.drawImage(imageIconDeathSounds, 0, 0);

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
  placePlatforms();

  // 3-rd variation of looped 'updateGame':
  clearInterval(lntervalledUpdateGame);
  lntervalledUpdateGame = setInterval(updateGame, lntervalledUpdateFreq);
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
    };
  
    // jump from the platform & draw platform's
    for (const platform of arrPlatform) {
      if (detectCollision(skoker, platform) && velocityY >= 0) {
        // jump's sound in f_detectColor
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
    context.lineWidth = 1.7;
    context.strokeText(score, canvasWidth/60, canvasWidth/13);
    context.lineWidth = 1;

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

    // iconsSounds();
  }
};

function skokerControls(event) {
  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    velocityX = shiftSkokerX;
    skoker.image = skokerRightImage;
  } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    velocityX = -shiftSkokerX;
    skoker.image = skokerLeftImage;
  // air jump
  } else if (event.code === 'Space' || event.code === 'KeyW'
    || event.code === 'ArrowUp') {
    pointsForJumpDrawIndex = initialPointsForJumpDrawIndex;
    if (score ) {
      velocityY = initialVelocityY;
      score -= pointsForJump;
      pointsForJumpMessage = `-${pointsForJump}`;

      if (isSoundOn) {
        // audioAirJump.src = './sounds/trampoline_jumps/0.mp3';
        audioAirJump.currentTime = 0;
        audioAirJump.play();
      }
    } else {
      // pointsForJumpMessage = `нужно ${pointsForJump} очков`;
      pointsForJumpMessage = `мало очков`;
    }
  }
};

function placePlatforms() {
  arrPlatform = [];
  let platformImage = new Image();
  platformImage.src = './images/clouds/transparent_1x1.png';

  // 1-st (starting) platform
  let platform = {
    collision: false,
    color: 'transparent',
    image: platformImage,
    x: canvasWidth/2 - platformWidth/2,
    y: canvasHeight - platformHeight,
    width: platformWidth,
    height: platformHeight
  };
  arrPlatform.push(platform);
    
  while (arrPlatform[arrPlatform.length - 1].y >= 0) {
    newPlatform();
  }
};

function newPlatform() {
  // X-coord randoming with little indent on left & right
  let randomX = randomInteger(widthPadding,
    canvasWidth - widthPadding - platformWidth);
  // let randomX = randomInteger(platformWidth + widthPadding,
  //   canvasWidth - widthPadding - platformWidth*2);

  let platformImage = new Image();
  platformImage.src = arrPlatformImages[
    randomInteger(0, arrPlatformImages.length - 1)];
  
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

  // adding colored platforms & images to them
  if (currentWorldColor === 'multiColours') {
    if (randomInteger(1, 100) >= 65) {
      platform.image.src = platformColorsImages[
        randomInteger(0, platformColorsImages.length - 1)];
      platform.color = platform.image.src.split('-').pop().split('.')[0];
    };
  } else {
    platform.image.src =
      `./images/clouds/colored/cloud-left-1-${currentWorldColor}.png`;
    platform.color = currentWorldColor;
  };
  addMovementToGreenPlatforms(platform, shiftPlatformX);

  arrPlatform.push(platform);
};

function detectColor(skoker, platform) {
  // normal jump
  velocityY = initialVelocityY;
  // init jump audio
  let audioDetectColor = new Audio();

  if (platform.color === 'yellow') {
    velocityY = initialVelocityY * 2.2;

    if (isSoundOn) {
      audioDetectColor.src = `./sounds/trampoline_jumps/${randomInteger(1, 2)}.mp3`;
      audioDetectColor.play();
    }

  } else if (platform.color === 'blue') {
    // mirroring platforms
    for (let currentPlatform of arrPlatform) {
      let platformCenter = currentPlatform.x + platformWidth/2;
      if (platformCenter >= canvasWidth/2) {
        platformCenter = canvasWidth/2 - (platformCenter - canvasWidth/2);
      } else {
        platformCenter = canvasWidth/2 + (canvasWidth/2 - platformCenter);
      }
      currentPlatform.x = platformCenter - platformWidth/2;
    };

    if (isSoundOn) {
      audioDetectColor.src = './sounds/swipe.mp3';
      audioDetectColor.play();
    }

  } else if (platform.color === 'grey') {
    // grey turns to black
    platform.color = 'black';
    platform.image.src = 
      `./images/clouds/colored/cloud-${randomLeftOrRight()}-1-black.png`;

  } else if (platform.color === 'black') {
    // disappearance Black platforms
    platform.collision = false;
    platform.color = 'transparent';
    platform.image.src = './images/clouds/transparent_1x1.png';

  } else if (platform.color === 'red') {
    // explodes & disappear - farther skoker is from the center of the platform,
    // harder kicks him away along X & turns him in direction which he is moving
    velocityY = initialVelocityY * 1.3;

    let xDistanceSkokerPlatform = (skoker.x + skoker.width/2)
      - (platform.x + platform.width/2);
    let coeffShiftSkokerX = xDistanceSkokerPlatform/(platform.width/2);
    coeffShiftSkokerX *= 0.3;

    coeffShiftSkokerX += (coeffShiftSkokerX >= 0) ? 1 : -1;
    velocityX = shiftSkokerX * coeffShiftSkokerX;
    if (velocityX < 0) {
      skoker.image = skokerLeftImage;
    } else skoker.image = skokerRightImage;

    platform.image.src = './images/clouds/transparent_1x1.png';
    platform.color = 'transparent';
    platform.collision = false;

    if (isSoundOn) {
      audioDetectColor.src = './sounds/explosion.mp3';
      audioDetectColor.play();
    }

  } else if (platform.color === 'green') {
    // do nothing - the platform drives itself anyway
  };
  
  if (isSoundOn) {
    if (!audioDetectColor.src) {
      audioDetectColor.src = './sounds/trampoline_jumps/0.mp3';
      audioDetectColor.play();
    }
  }
}

function shiftXGreen(platform) {
  if (platform.moveDirectionX === '+') {
    if (platform.x + platform.width + shiftPlatformX <=
      canvasWidth - widthPadding) {
        platform.x += platform.moveSpeedX;
    } else {
      platform.moveDirectionX = '-';
      shiftXGreen(platform);
    }
  } else if (platform.moveDirectionX === '-') {
    if (platform.x + shiftPlatformX >= widthPadding) {
      platform.x -= platform.moveSpeedX;
    } else {
      platform.moveDirectionX = '+';
      shiftXGreen(platform);
    }
  }
};

function gameOver() {
  gameOverFlag = true;
  
  let textSizeGameOver = canvasWidth/11;
  let textSizeOtherStrs = textSizeGameOver/1.5;
  let textsEndOfGame = {
    gameOver: 'Игра окончена',
    RToRestart: '«R» - рестарт,',
    EscToMenu: '«Esc» - возврат в меню'
  };
  
  // 'Игра окончена' string
  let gradient = context.createLinearGradient(0, 0, canvasWidth, 0);
  gradient.addColorStop('0', 'FireBrick');
  gradient.addColorStop('0.5', 'red');
  gradient.addColorStop('1', 'DarkRed');
  context.fillStyle = gradient;
  context.strokeStyle = 'black';
  context.font = `bold ${textSizeGameOver}px ${fontVerdana}`;
  context.textAlign = 'center';
  context.fillText(textsEndOfGame.gameOver, canvasWidth/2, canvasWidth/2);
  context.lineWidth = 2;
  context.strokeText(textsEndOfGame.gameOver, canvasWidth/2, canvasWidth/2);
  context.lineWidth = 1;

  // other end-of-game strings
  context.fillStyle = 'black';
  context.font = `bold ${textSizeOtherStrs}px ${fontVerdana}`;
  context.textAlign = 'center';
    // texts
  context.fillText(textsEndOfGame.RToRestart, canvasWidth/2,
    canvasWidth/2 + textSizeGameOver*2);
  context.fillText(textsEndOfGame.EscToMenu, canvasWidth/2,
    canvasWidth/2 + textSizeGameOver*3);
    // strokes
  context.strokeStyle = 'white';
  context.lineWidth = 1.3;
  context.strokeText(textsEndOfGame.RToRestart, canvasWidth/2,
    canvasWidth/2 + textSizeGameOver*2);
  context.strokeText(textsEndOfGame.EscToMenu, canvasWidth/2,
    canvasWidth/2 + textSizeGameOver*3);
  context.lineWidth = 1;
  
  if (isSoundOn) {
    // play new(!) random death sound
    do {
      newRandomAudioDeath.src = `./sounds/death/${arrAudioDeath[
        randomInteger(0, arrAudioDeath.length - 1)]}`;
    } while (audioDeath.src === newRandomAudioDeath.src);
    audioDeath.src = newRandomAudioDeath.src;
    audioDeath.play();
  }
};

function iconsSounds() {  
  if (isSoundOn) {
    imageSound.src = './images/icons_of_sounds/icon_sound-on.png';
  } else {
    imageSound.src = 'images/icons_of_sounds/icon_sound-off.png';
  };
  imageSound.onload = function() {
    context.drawImage(imageSound, iconSoundPosX,
      iconSoundPosY, iconSoundWidth, iconSoundHeight);
  };
}
