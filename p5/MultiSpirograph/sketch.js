const BACKGROUND_COLOR = [200, 200, 200];
let windowMin;

let circles = [];
let points = [];

for (let i = 0; i < 10; i++) {
	let radius = Math.pow(0.5, i);
	circles.push({radius, phase: 0});
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
}

function draw() {
	background(...BACKGROUND_COLOR);
	const currentPoint = {x: 0, y: 0};
	for (let i in circles) {
		const circle = circles[i];
		ellipse(width / 2 + (currentPoint.x * windowMin / 4), height / 2 + (currentPoint.y * windowMin / 4), circle.radius * windowMin / 2);
		 const nextStep = polarToCartesian(circle.radius, circle.phase);
		 currentPoint.x += nextStep.x;
		 currentPoint.y += nextStep.y;
		 circle.phase += (Math.PI / 256) * Math.pow((i + 1), 0.5);
		 if (i == circles.length - 1) {
			points.push(currentPoint);
		 }
	}
	for (let pointIndex = 0; pointIndex < points.length - 2; pointIndex++) {
		const currentpoint = points[pointIndex];
		const nextPoint = points[pointIndex + 1];
		line(currentpoint.x * windowMin / 4 + width / 2, currentpoint.y * windowMin / 4 + height / 2, nextPoint.x * windowMin / 4 + width / 2, nextPoint.y * windowMin / 4 + height / 2);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scaleContent();
}

function scaleContent() {
	windowMin = Math.min(windowWidth, windowHeight);
}

function polarToCartesian(r, theta) {
	return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
}