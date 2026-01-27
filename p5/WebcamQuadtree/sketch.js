let webcam;
let quadtree = [];
let depthSlider;
let samplesSlider;
let differenceSlider;

function setup() {
  createCanvas(640,480);
  webcam = createCapture(VIDEO, {flipped: true});
  webcam.hide();
  depthSlider = createSlider(0, 7, 5, 1);
  samplesSlider = createSlider(1, 10, 1, 1);
  differenceSlider = createSlider(0, 100, 20, 1);
}

function draw() {
  resizeCanvas(webcam.width, webcam.height);
  const webcamFrame = webcam.get(0,0,webcam.width, webcam.height);
  const tree = createTree(webcamFrame, depthSlider.value(), differenceSlider.value(), samplesSlider.value(), samplesSlider.value());
  renderTree(tree);
}

function sampleGrid(imageToSample, startX,startY,w,h, xCount, yCount) {
  let accumulatedColor = [0, 0, 0, 0];
  for (let xStep = 0; xStep < xCount; xStep++) {
    x = startX + xStep * int(w / xCount - 1);
    for (let yStep = 0; yStep < yCount; yStep++) {
      y = startY + yStep * int(h / yCount - 1);
      accumulatedColor = addColor(accumulatedColor, imageToSample.get(min(x, imageToSample.width - 1),min(y, imageToSample.height - 1)));
    }
  }
  return scaleColor(accumulatedColor, 1 / (xCount * yCount));
}

function addColor(colorA, colorB) {
  return [colorA[0] + colorB[0], colorA[1] + colorB[1], colorA[2] + colorB[2], 255];
}

function scaleColor(colorA, scalar) {
  return [colorA[0] * scalar, colorA[1] * scalar, colorA[2] * scalar, 255];
}

function colorDifference(colorA, colorB) {
  return sqrt(
    pow(colorA[0] - colorB[0], 2) +
    pow(colorA[1] - colorB[1], 2) +
    pow(colorA[2] - colorB[2], 2)
  );
}

function childrenDifference(children) {
  let maxDifference = 0;
  for (i = 0; i < children.length; i++) {
    for (j = i + 1; j < children.length; j++) {
      maxDifference = max(maxDifference, colorDifference(children[i].color, children[j].color));
    }
  }
  return maxDifference;
}

function getChildren(treeNode) {
  return [
    {
      x: treeNode.x,
      y: treeNode.y,
      w: treeNode.w / 2,
      h: treeNode.h / 2
    },
    {
      x: treeNode.x + treeNode.w / 2,
      y: treeNode.y,
      w: treeNode.w / 2,
      h: treeNode.h / 2
    },
    {
      x: treeNode.x,
      y: treeNode.y + treeNode.h / 2,
      w: treeNode.w / 2,
      h: treeNode.h / 2
    },
    {
      x: treeNode.x + treeNode.w / 2,
      y: treeNode.y + treeNode.h / 2,
      w: treeNode.w / 2,
      h: treeNode.h / 2
    }
  ];
}

function getNodeColor(sourceImage, node, xCount, yCount) {
  return sampleGrid(sourceImage, node.x, node.y, node.w, node.h, xCount, yCount);
}

function addChildren(sourceImage, node, depth, maxDepth, diffThreshold, xCount, yCount) {
  const children = getChildren(node);
  for(let child of children) {
    child.color = getNodeColor(sourceImage, child, xCount, yCount);
  }
  const maxDifference = childrenDifference(children);
  if (maxDifference > diffThreshold) {
    node.children = children;
  }
  if (depth < maxDepth) {
    for (let child of children) {
      addChildren(sourceImage, child, depth + 1, maxDepth, diffThreshold, xCount, yCount);
    }
  }
}

function createTree(sourceImage, maxDepth, diffThreshold, xCount, yCount) {
  const startingNode = {
    x: 0,
    y: 0,
    w: sourceImage.width,
    h: sourceImage.height
  };
  startingNode.color = getNodeColor(sourceImage, startingNode, xCount, yCount);
  addChildren(sourceImage, startingNode, 0, maxDepth, diffThreshold, xCount, yCount);
  return startingNode;
}

function renderTree(node) {
  push();
  //noStroke();
  if (!node.children) {
    fill(node.color);
    rect(node.x, node.y, node.w, node.h);
  }
  pop();
  for (let child of node.children || []) {
    renderTree(child);
  }
}


// get color for node
// if depth < max depth:
// get colors for children
// if different enough, add children
