import detectCollision from './detectCollision.js';
import randomInteger from './randomInteger.js';

// board init
let board;
let boardWidth = 600;
let boardHeight = 800;
let context;
let cl;

// physics init
let initialvelocityX = 0;
let velocityX = initialvelocityX;
let initialVelocityY = -boardWidth/71; // 60 => -10
let velocityY = initialvelocityX;
let gravity = boardWidth/1500; // 1500 => 0.4

// skoker init
let skokerWidth = boardWidth/13; // 13 => 46,1538...
let skokerHeight = skokerWidth;
let skokerX = boardWidth/2 - skokerWidth/2;
// let skokerY = boardHeight - boardWidth*0.5 - skokerHeight;
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
// let platformImage;
let arrPlatform = [];
let arrPlatformImages = [];
for (let i = 1; i <= 6; i++) {
  arrPlatformImages.push(`./images/clouds/cloud-right-${i}.png`);
  arrPlatformImages.push(`./images/clouds/cloud-left-${i}.png`);
}

// score init
let score = 0;

let state = {
  canvas: {
    board,
    boardWidth,
    boardHeight,
    context
  },
  physics: {
    velocityX,
    velocityY,
    initialVelocityY,
    gravity
  },
  character: {
    skokerWidth,
    skokerHeight,
    skokerX,
    skokerY,
    skokerLeftImage,
    skokerRightImage,
    skoker
  },
  platforms: {
    platformWidth,
    platformHeight,
    arrPlatform,
    arrPlatformImages
  },
  score
}

window.onload = init();

function init() {
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
  skoker.x = skokerX;
  skoker.y = skokerY;
  skokerRightImage.onload = function() {
    context.drawImage(skoker.image, skoker.x,
      skoker.y, skoker.width, skoker.height);
  };

  velocityX = initialvelocityX;
  velocityY = initialVelocityY;
  placePlatforms(arrPlatformImages);

  // !!!
  // requestAnimationFrame(update);
  // console.log(cl);

  // if (typeof cl !== "undefined") {
  //   console.log('clearInterval');
  // } else {
  //   clearInterval(cl);
  //   console.log('cl is', typeof cl);
  //   // console.log('not clear...');
  // }
  // setInterval(update, 1000);
  // if (::cl.isInitialized) clearInterval(cl);
  cl = setInterval(update, 16); // 16
  // setInterval(update, 16);
  // console.log('cl is', typeof cl, cl);
  // cl;
  // console.log(cl);

  document.addEventListener('keydown', moveSkoker);
};

function update() {
  // requestAnimationFrame(update);
  // if (typeof cl() === undefined) clearInterval(cl);
  clearInterval(cl);
  // console.log(cl);
  cl = setInterval(update, 16);
  // console.log(cl);
  // console.log(typeof cl);
  // const cl = setInterval(update, 16);
  // cl();
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
  context.drawImage(skoker.image, skoker.x,
    skoker.y, skoker.width, skoker.height);

  // platforms and velocityY
  for (let i = 0; i < arrPlatform.length; i++) {
    let platform = arrPlatform[i];
    if (velocityY < 0 && skoker.y < boardHeight*0.73) {
      // shift all plats little down:
      platform.y -= initialVelocityY*0.7;
    }
    if (detectCollision(skoker, platform) && velocityY >= 0) {
      velocityY = initialVelocityY; // jump from the platform
      // console.log('jump');
    }
    context.drawImage(platform.image, platform.x,
      platform.y, platform.width, platform.height);
  };

  // arrPlatform.length > 0
  while (arrPlatform[0].y >= boardHeight) {
    arrPlatform.shift();
    newPlatform();
    score += 1;
  };

  // score draw
  context.fillStyle = 'black';
  context.font = `bold ${boardWidth/12}px Sans-Serif`;
  // console.log(context.font);
  context.fillText(score, boardWidth/120, boardWidth/15);
}

function moveSkoker(event) {
  if (event.code == 'ArrowRight' || event.code == 'KeyD') {
    velocityX = boardWidth/120;
    skoker.image = skokerRightImage;
  } else if (event.code == 'ArrowLeft' || event.code == 'KeyA') {
    velocityX = -boardWidth/120;
    skoker.image = skokerLeftImage;
  } else if (event.code == 'KeyR') {
    // clearInterval(cl);
    init();
    // velocityX = 0;
    // context.clearRect(0, 0, board.width, board.height);
    // skoker.image = skokerLeftImage;
  };
};

function placePlatforms() {
  arrPlatform = [];
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
  let widthPadding = boardWidth*0.02;
  let randomX = randomInteger(widthPadding,
    boardWidth - widthPadding - platformWidth);

  let platformImage = new Image();
  platformImage.src = arrPlatformImages[
    randomInteger(0, arrPlatformImages.length - 1)];

  let platform = {
    image: platformImage,
    x: randomX,
    y: arrPlatform[arrPlatform.length - 1].y - boardWidth/6
      - randomInteger(0, boardWidth/10.5),
    // y: arrPlatform[arrPlatform.length - 1].y - 160,
    width: platformWidth,
    height: platformHeight
  };

  arrPlatform.push(platform);
};
