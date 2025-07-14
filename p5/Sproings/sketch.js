const BACKGROUND_COLOR = [200, 200, 200];
let windowMin;

let nodes = [];
let springs = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
}

function draw() {
	background(...BACKGROUND_COLOR);
    for (let node of nodes) {
        circle(node.x, node.y, node.weight);
    }
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scaleContent();
}

function scaleContent() {
	windowMin = Math.min(windowWidth, windowHeight);
}

function mousePressed() {
    nodes.push({
        x: mouseX,
        y: mouseY,
        weight: 100
    });
}