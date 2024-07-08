export default (a, b) => {
  if (b.collision) {
    return a.x < b.x + b.width &&   // on x: a's Top Left corner < b's Top Right corner
           a.x + a.width > b.x &&   // on x: a's Top Right corner < b's Top Left corner
           a.y < b.y + b.height &&  // on y: a's Top Left corner < b's Bottom Right corner
           a.y + a.height > b.y;    // on y: a's Top Right corner < b's Bottom Left corner
  } else return false;
}