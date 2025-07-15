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
let tempNode = null;
let clickStart = null;
let gravityVector;
let paused = true;

let grabButton;
let editButton;
let deleteButton;
let pauseButton;

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
  render();
  setupGui();
  gravityVector = createVector(0,10);
}

function draw() {
  if (!paused) {
	  accelerateNodes();
    moveNodes();
  }
  render();
}

function accelerateNodes() {
  for (let spring of springs) {
      const springLength = spring.b.position.dist(spring.a.position);
      const lengthDiff = springLength - spring.springLength;
      const aAccel = spring.b.position.copy();
      const bAccel = spring.a.position.copy();
      aAccel.sub(spring.a.position);
      aAccel.normalize();
      aAccel.mult(lengthDiff * spring.springStiff);
      bAccel.sub(spring.b.position);
      bAccel.normalize();
      bAccel.mult(lengthDiff * spring.springStiff);
      if (!spring.a.pinned) {
          bAccel.mult(0.5);
      }
      spring.b.velocity.add(bAccel);
      if (!spring.b.pinned) {
          aAccel.mult(0.5);
      }
      spring.a.velocity.add(aAccel);
  }
  for (let node of nodes) {
      node.velocity.add(gravityVector);
  }
}

function moveNodes() {
  for (let node of nodes) {
      if (node.pinned) {
          continue;
      }
      node.velocity.mult(node.damp);
      const scaledVelocity = node.velocity.copy();
      scaledVelocity.mult(deltaTime/1000);
      node.position.add(scaledVelocity);
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
    handleClick();
}

function touchStarted() {
   handleClick();
}

function mouseDragged() {
    if (tempNode) {
        if (state === STATE_MOVE) {
            tempNode.position.x = mouseX;
            tempNode.position.y = mouseY;
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
    } else if (state === STATE_MOVE && activeNode) {
        tempNode = {
          position: createVector(mouseX, mouseY),
          weight: 20,
          velocity: createVector(0,0),
          acceleration: createVector(0,0),
          damp: 0.95,
          pinned: true,
        };
        springs.push({
          a: activeNode,
          b: tempNode,
          springLength: 0,
          springStiff: 1.5,
        });
    }
}

function handleRelease() {
    const clickEnd = createVector(mouseX, mouseY);
    if (state === STATE_CREATE) {
        nodes.push({
          position: createVector(mouseX, mouseY),
          weight: 20,
          velocity: createVector(0,0),
          acceleration: createVector(0,0),
          damp: 0.95,
          pinned: false,
        });
    } else if (state === STATE_CONNECT) {
        for (let node of nodes) {
          if (clickEnd.dist(node.position) < node.weight) {
            if (node == activeNode) {
              node.pinned = !node.pinned;
            } else {
              springs.push({
                a: activeNode,
                b: node,
                springLength: activeNode.position.dist(node.position),
                springStiff: 1.5,
              });
            }
          }
        }
    } else if (state === STATE_DELETE) {
       if (activeNode && clickEnd.dist(clickStart) < TOUCH_SLOP &&
         clickEnd.dist(activeNode.position) < activeNode.weight) {
           springs = springs.filter(sp => sp.a != activeNode && sp.b != activeNode);
           nodes = nodes.filter(n => n != activeNode);
       }
    }
    activeNode = null;
    springs = springs.filter(sp => sp.b != tempNode);
    tempNode = null;
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
    if (state === STATE_CONNECT) {
      line(activeNode.position.x, activeNode.position.y, mouseX, mouseY);
    }
    push();
    for (let node of nodes) {
        if (node.pinned) {
            fill(0);
        } else {
            fill(255);
        }
        circle(node.position.x, node.position.y, node.weight);
    }
    pop();
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

function playPause() {
  paused = !paused;
  pauseButton.elt.innerText = paused ? "Play" : "Pause";
}

function setupGui () {
  grabButton = createButton("Grab");
  grabButton.mousePressed(setGrab);
  editButton = createButton("Edit");
  editButton.mousePressed(setEdit);
  deleteButton = createButton("Delete");
  deleteButton.mousePressed(setDelete);
  pauseButton = createButton("Play");
  pauseButton.mousePressed(playPause);
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
  pauseButton.position(16, 16);
}