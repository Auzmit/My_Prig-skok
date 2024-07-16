function detectCollision(skoker, cloud) {
  if (cloud.collision) {
    return skoker.x < cloud.x + cloud.width &&    // on x: sk's TopL corner < cl's TopR corner
           skoker.x + skoker.width > cloud.x &&   // on x: sk's TopR corner < cl's TopL corner
           skoker.y < cloud.y + cloud.height &&   // on y: sk's TopL corner < cl's BottomR corner
           skoker.y + skoker.height > cloud.y;    // on y: sk's TopR corner < cl's BottomL corner
  } else return false;
};

export { detectCollision };