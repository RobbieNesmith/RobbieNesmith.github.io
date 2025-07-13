const BACKGROUND_COLOR = [200, 200, 200];
let windowMin;

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
}

function draw() {
	background(...BACKGROUND_COLOR);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scaleContent();
}

function scaleContent() {
	windowMin = Math.min(windowWidth, windowHeight);
}
