const BACKGROUND_COLOR = [200, 200, 200];

const TOUCH_SLOP = 10;

const STATE_IDLE = "STATE_IDLE";
const STATE_CREATE = "STATE_CREATE";
const STATE_CONNECT = "STATE_CONNECT";
const STATE_MOVE = "STATE_MOVE";
const STATE_DELETE = "STATE_DELETE";

let windowMin;

let nodes = [];
let springs = [];

let state = STATE_IDLE;
let activeNode = null;
let clickStart = null;

let grabButton;
let editButton;
let deleteButton;

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
  render();
  setupGui();
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
    if (activeNode) {
        if (state === STATE_CONNECT) {
          render();
          line(activeNode.position.x, activeNode.position.y, mouseX, mouseY);
        }
        if (state === STATE_MOVE) {
            activeNode.position.x = mouseX;
            activeNode.position.y = mouseY;
            render();
        }
    }
}

function mouseReleased() {
    handleRelease();
}

function touchEnded() {
    handleRelease();
}

function handleClick() {
    clickStart = createVector(mouseX, mouseY);
    for (let node of nodes) {
      if (clickStart.dist(node.position) < node.weight) {
        if (state == STATE_IDLE) {
          state = STATE_CONNECT;
        }
        activeNode = node;
      }
    }
    if (state === STATE_IDLE) {
        state = STATE_CREATE;
    }
}

function handleRelease() {
    const clickEnd = createVector(mouseX, mouseY);
    if (state === STATE_CREATE) {
        nodes.push({
          position: createVector(mouseX, mouseY),
          weight: 20
        });
    } else if (state === STATE_CONNECT) {
        for (let node of nodes) {
            if (clickEnd.dist(node.position) < node.weight) {
                springs.push({
                    a: activeNode,
                    b: node,
                    springLength: activeNode.position.dist(node.position),
                    springStiff: 0.5
                });
            }
        }
    } else if (state === STATE_DELETE) {
       if (activeNode && clickEnd.dist(clickStart) < TOUCH_SLOP &&
         clickEnd.dist(activeNode.position) < activeNode.weight) {
           springs = springs.filter(sp => sp.a != activeNode && sp.b != activeNode);
           nodes = nodes.filter(n => n != activeNode);
       }
    }
    render();
    activeNode = null;
    if (state === STATE_CREATE || state === STATE_CONNECT) {
      state = STATE_IDLE;
    }
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

function setGrab() {
    state = STATE_MOVE;
}

function setEdit() {
    state = STATE_IDLE;
}

function setDelete() {
    state = STATE_DELETE;
}

function setupGui () {
  grabButton = createButton("Grab");
  grabButton.mousePressed(setGrab);
  editButton = createButton("Edit");
  editButton.mousePressed(setEdit);
  deleteButton = createButton("Delete");
  deleteButton.mousePressed(setDelete);
  updateGui();
}

function updateGui() {
  const paddedSpace = width - 32;
  grabButton.position(16, height - 32);
  grabButton.size(paddedSpace / 3);
  editButton.position(16 + paddedSpace / 3, height - 32);
  editButton.size(paddedSpace / 3);
  deleteButton.position(width - 16 - paddedSpace / 3, height - 32);
  deleteButton.size(paddedSpace / 3);
}