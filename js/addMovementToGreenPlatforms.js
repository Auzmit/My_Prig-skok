import { randomInteger } from './random.js';

function addMovementToGreenPlatforms(platform, shiftPlatformX) {
  if (platform.color === 'green') {
    platform.moveSpeedX = shiftPlatformX*randomInteger(15, 95)/100;
    platform.moveDirectionX = '';
    if (randomInteger(0, 1) === 0) {
      platform.moveDirectionX = '-';
    } else platform.moveDirectionX = '+';
  };
};

export { addMovementToGreenPlatforms };