import { boardWidth, boardHeight, platformWidth,
  platformHeight, arrPlatform, arrPlatformImages } from "./main.js";
import randomInteger from "./randomInteger.js";

function placePlatforms() {
// const placePlatforms = () => {
  // arrPlatform = [];
  // platformImage.src = arrClouds[randomIntFromInterval(1, 6)];

  // from 'min' to 'max' (included)

  let platformImage = new Image();
  platformImage.src = arrPlatformImages[
    randomInteger(0, arrPlatformImages.length - 1)];
  console.log(platformImage);
  // 1-st (starting) platform
  let platform = {
    image: platformImage,
    x: boardWidth,
    // x: 0,
    y: boardHeight - 70,
    width: platformWidth,
    // width: boardWidth,
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

  for (let i = 0; i < 6; i++) {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    // platformImage.src = arrClouds[randomIntFromInterval(1, 6)];
    let platform = {
      image: platformImage,
      x: randomX,
      y: boardHeight - 160*i,
      // y: boardHeight - 300,
      width: platformWidth,
      height: platformHeight
    }
  
    arrPlatform.push(platform);
    // for (let i = 0; i < arrPlatform.length; i++) {
    //   console.log(arrPlatform[i]);  
    // }
    // console.log('add more');
  }
  console.log('asdasd');
}

function newPlatform() {
// const newPlatform = () => {
  let randomX = Math.floor(Math.random() * boardWidth*3/4);
  // platformImage.src = arrClouds[randomIntFromInterval(1, 6)];

  let platformImage = new Image();
  platformImage.src = arrPlatformImages[randomInteger(0, 6)];

    let platform = {
      image: platformImage,
      x: randomX,
      // y: -platformHeight,
      y: -platformHeight,
      width: platformWidth,
      height: platformHeight
    }
    if (arrPlatform[arrPlatform.length - 1].y !== platform.y) {
      arrPlatform.push(platform);
    }
    // console.log(arrPlatform[arrPlatform.length - 1].y, platform.y);
    // console.log(arrPlatform[arrPlatform.length - 1].y - platform.y);
    // console.log('-');
    // if ((arrPlatform[arrPlatform.length - 1].y - platform.y < 55
    //   && (arrPlatform[arrPlatform.length - 1].y - platform.y > -55))
    // ) {
    //   platform.y -= platformHeight*1;
    // }
    // console.log(arrPlatform[arrPlatform.length - 1].y, platform.y);
    // console.log(arrPlatform[arrPlatform.length - 1].y - platform.y);
    // arrPlatform.push(platform);
    // for (let i = 0; i < arrPlatform.length; i++) {
    //   console.log(arrPlatform[i]);  
    // }
    // console.log('add 1');
    // console.log(arrPlatform[arrPlatform.length - 1].y, platform.y);
}

export { placePlatforms, newPlatform };
