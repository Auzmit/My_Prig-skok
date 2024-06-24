import { velocityX } from "./main.js";

let velocityX = 0;

const moveSkoker = (event) => {
  if (event.code == 'ArrowRight' || event.code == 'KeyD') {
    // velocityX = 5;
    skoker.image = skokerRightImage;
  } else if (event.code == 'ArrowLeft' || event.code == 'KeyA') {
    // velocityX = -5;
    skoker.image = skokerLeftImage;
  }
}
export { moveSkoker, velocityX };