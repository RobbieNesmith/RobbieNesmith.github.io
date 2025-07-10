const BACKGROUND_COLOR = [100, 200, 200];

let windowMin;
let itersSlider;
let ratioSlider;
let countSlider;
let center;
let lastIters = 0;
let lastRatio = 0;
let lastCount = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
  background(...BACKGROUND_COLOR);
  center = createVector(width / 2, height / 2);
  setUpGui();
}

function circlePart(location, vector, scale, iter) {
  const scaledVector = vector.copy();
  scaledVector.mult(scale)
  const newLocation = location.copy();
  newLocation.add(scaledVector);
  const newScale = scale * ratioSlider.value();
  circle(newLocation.x, newLocation.y, newScale);
  if (iter < itersSlider.value()) {
      for (let i = 1; i < countSlider.value(); i++) {
          const newVector = vector.copy();
          newVector.mult(-1);
          newVector.rotate(i * 2 * PI / countSlider.value());
          circlePart(newLocation, newVector, newScale, iter + 1);
      }
  }
}

function draw() {
  const startingSize = windowMin / 4;
  if(lastRatio === ratioSlider.value() &&
  lastIters === itersSlider.value() &&
  lastCount === countSlider.value()) {
    return;
  }
  background(...BACKGROUND_COLOR);
  circle(center.x, center.y, startingSize);
  
  for (let i = 0; i < countSlider.value(); i++) {
    const newVector = createVector(0, (1 + ratioSlider.value()) / 2);
    newVector.rotate(i * 2 * PI / countSlider.value());
    circlePart(center, newVector, startingSize, 1);
  }
  
  //circlePart(center, createVector(0,(1 + ratioSlider.value()) / 2), startingSize, 1);
  lastRatio = ratioSlider.value();
  lastIters = itersSlider.value();
  lastCount = countSlider.value();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
  center.x = width / 2;
  center.y = height / 2;
	scaleContent();
}

function scaleContent() {
	windowMin = Math.min(windowWidth, windowHeight);
}

function setUpGui() {
  ratioSlider = createSlider(0.1, 0.9, 0.5, 0.01);
  itersSlider = createSlider(1, 10, 5, 1);
  countSlider = createSlider(2, 10, 4, 1);
  updateGui();
}

function updateGui() {
  ratioSlider.position(16, height - 32);
  ratioSlider.size(width - 32);
  itersSlider.position(16, height - 64);
  itersSlider.size(width - 32);
  countSlider.position(16, height - 96);
  countSlider.size(width - 32);
}