const BACKGROUND_COLOR = [100, 200, 200];

let windowMin;
let itersSlider;
let ratioSlider;
let countSlider;
let outputDiv;
let hpglButton;
let center;
let lastIters = 0;
let lastRatio = 0;
let lastCount = 0;
let showHpgl = "DRAW";
let lastShowHpgl = "DRAW";

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
  renderCircle(newLocation.x, newLocation.y, newScale, showHpgl);
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
  lastCount === countSlider.value() &&
  lastShowHpgl === showHpgl) {
    return;
  }
  outputDiv.elt.innerText = "";
  background(...BACKGROUND_COLOR);
  renderCircle(center.x, center.y, startingSize, showHpgl);
  
  for (let i = 0; i < countSlider.value(); i++) {
    const newVector = createVector(0, (1 + ratioSlider.value()) / 2);
    newVector.rotate(i * 2 * PI / countSlider.value());
    circlePart(center, newVector, startingSize, 1);
  }

  lastRatio = ratioSlider.value();
  lastIters = itersSlider.value();
  lastCount = countSlider.value();
  lastShowHpgl = showHpgl;
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
  outputDiv = createDiv();
  hpglButton = createButton("Toggle HPGL Output");
  hpglButton.mousePressed(toggleHpgl);
  updateGui();
}

function toggleHpgl() {
  if (showHpgl === "DRAW") {
    showHpgl = "BOTH";
  } else {
      showHpgl = "DRAW";
  }
}

function updateGui() {
  ratioSlider.position(16, height - 32);
  ratioSlider.size(width - 32);
  itersSlider.position(16, height - 64);
  itersSlider.size(width - 32);
  countSlider.position(16, height - 96);
  countSlider.size(width - 32);
  outputDiv.position(0, 0);
  outputDiv.size(width, height - 128);
  outputDiv.elt.className = "output";
  hpglButton.position(16, height - 128);
  hpglButton.size(width - 32);
}

function renderCircle(x, y, diameter, mode="DRAW") {
  if (mode === "DRAW") {
    circle(x, y, diameter);
  } else if (mode === "HPGL") {
    outputDiv.elt.innerText += `PU ${x},${y};\n`
    outputDiv.elt.innerText += `CI ${diameter/2};\n`;
  } else if (mode === "BOTH") {
    circle(x, y, diameter);
    outputDiv.elt.innerText += `PU ${x},${y};\n`
    outputDiv.elt.innerText += `CI ${diameter/2};\n`;
  }
}