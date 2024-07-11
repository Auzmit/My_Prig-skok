export default (canvas, event) => {
  // getBoundingClientRect() returns object providing information
  // about size of element and its position relative to the viewport.
  const canvasInfo = canvas.getBoundingClientRect();
  const x = event.clientX - canvasInfo.left;
  const y = event.clientY - canvasInfo.top;

  // console.log({x, y});
  return {x, y};
};
