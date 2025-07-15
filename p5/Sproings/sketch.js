const BACKGROUND_COLOR = [200, 200, 200];
const STATE_IDLE = "STATE_IDLE";
const STATE_CREATE = "STATE_CREATE";
const STATE_CONNECT = "STATE_CONNECT";
const STATE_MOVE = "STATE_MOVE";
const STATE_DELETE = "STATE_DELETE";

let windowMin;

let nodes = [];
let springs = [];

let state = STATE_IDLE;
let connectingNode = null;
let clickStart = null;

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
  render();
}

function draw() {
	
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scaleContent();
}

function scaleContent() {
	windowMin = Math.min(windowWidth, windowHeight);
}

function mousePressed() {
    handleClick();
}

function touchStarted() {
   handleClick();
}

function mouseDragged() {
    if (connectingNode) {
        render();
        line(connectingNode.position.x, connectingNode.position.y, mouseX, mouseY);
    }
}

function mouseReleased() {
    handleRelease();
}

function touchEnded() {
    handleRelease();
}

function handleClick() {
    if (state === STATE_IDLE) {
        clickStart = createVector(mouseX, mouseY);
        state = STATE_CREATE;
        for (let node of nodes) {
            if (clickStart.dist(node.position) < node.weight) {
                state = STATE_CONNECT;
                connectingNode = node;
            }
        }
    }
}

function handleRelease() {
    if (state === STATE_CREATE) {
        nodes.push({
          position: createVector(mouseX, mouseY),
          weight: 20
        });
    } else if (state === STATE_CONNECT) {
        const clickEnd = createVector(mouseX, mouseY);
        for (let node of nodes) {
            if (clickEnd.dist(node.position) < node.weight) {
                springs.push({
                    a: connectingNode,
                    b: node,
                    springLength: connectingNode.position.dist(node.position),
                    springStiff: 0.5
                });
            }
        }
    }
    render();
    connectingNode = null;
    state = STATE_IDLE;
}

function render() {
    background(...BACKGROUND_COLOR);
    for (let spring of springs) {
        line(
          spring.a.position.x, spring.a.position.y,
          spring.b.position.x, spring.b.position.y);
    }
    for (let node of nodes) {
        circle(node.position.x, node.position.y, node.weight);
    }
}