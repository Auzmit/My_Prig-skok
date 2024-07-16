function randomInteger(min, max) {
  let randomNumber = Math.random() * (max - min + 1) + min;
  return Math.floor(randomNumber);
}

function randomLeftOrRight() {
  if (randomInteger(0, 1) === 0) {
    return 'right';
  } else return 'left';
}

export { randomInteger, randomLeftOrRight };