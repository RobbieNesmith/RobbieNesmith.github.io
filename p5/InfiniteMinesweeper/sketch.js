const IMAGE_TILE_SIZE = 8;
const RENDERED_TILE_SIZE = 32;
const TILE_SCALE = RENDERED_TILE_SIZE / IMAGE_TILE_SIZE;
const CHUNK_SIZE = 16;
const TOUCH_SLOP = 8;
const HOLD_DELAY = 200;
const HOLD_TIME = 500;
const MINE_DENSITY = 0.2;

STATE_BLANK = 0;
STATE_REVEALED = 100;
STATE_FLAGGED = 200;
STATE_UNKNOWN = 300;

const tile = {
  mine: false,
  state: STATE_BLANK,
  neighborMines: undefined,
}

let mouseClickX = 0;
let mouseClickY = 0;
let mouseDragX = 0;
let mouseDragY = 0;
let dragging = false;
let windowX = 0;
let windowY = 0;

let clickTime = 0;

let allMinesImage = null;
let mineNumbers = [];
let blankTile = null;
let unknownTile = null;
let flagTile = null;
let deadTile = null;

let dead = false;

let chunks = [];

let backgroundGraphics = null;

function preload() {
  allMinesImage = loadImage("assets/images/8x8mines.png");
}

function setupMines() {
  blankTile = allMinesImage.get(0, 0, IMAGE_TILE_SIZE, IMAGE_TILE_SIZE);
  unknownTile = allMinesImage.get(IMAGE_TILE_SIZE, 0, IMAGE_TILE_SIZE, IMAGE_TILE_SIZE);
  flagTile = allMinesImage.get(IMAGE_TILE_SIZE * 2, 0, IMAGE_TILE_SIZE, IMAGE_TILE_SIZE);
  deadTile = allMinesImage.get(IMAGE_TILE_SIZE, IMAGE_TILE_SIZE * 3, IMAGE_TILE_SIZE, IMAGE_TILE_SIZE);

  for (let mineCount = 0; mineCount < 9; mineCount++) {
    mineNumbers.push(allMinesImage.get((mineCount % 4) * IMAGE_TILE_SIZE, (1 + Math.floor(mineCount / 4)) * IMAGE_TILE_SIZE, IMAGE_TILE_SIZE, IMAGE_TILE_SIZE));
  }
}

function reset() {
  windowX = 0;
  windowY = 0;
  chunks = [];
  dead = false;
  const gameOverModalHolder = document.getElementById("game-over-modal-holder");
  gameOverModalHolder.style.display = "none";
  renderBackground(backgroundGraphics);
  drawBackground(backgroundGraphics);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundGraphics = createGraphics(windowWidth, windowHeight);
  backgroundGraphics.noSmooth();
  setupMines();
  noSmooth();
  noLoop();
  renderBackground(backgroundGraphics);
  drawBackground(backgroundGraphics);
}

function draw() {
  drawBackground(backgroundGraphics);
  if (mouseIsPressed && !dragging) {
    const now = millis();
    const holdTime = now - clickTime;
    if (holdTime > HOLD_DELAY) {
      push();
      noFill();
      stroke(0, 255, 0);
      strokeWeight(10);
      arc(mouseX, mouseY, RENDERED_TILE_SIZE * 1.5, RENDERED_TILE_SIZE * 1.5, 0, min((holdTime - HOLD_DELAY) / HOLD_TIME * TWO_PI, TWO_PI));
      pop();
    }
    if (holdTime > HOLD_DELAY + HOLD_TIME) {
      noLoop();
    }
  }
}

function renderBackground(graphicsObject) {
  graphicsObject.push();
  graphicsObject.background(200);
  const minChunkX = Math.floor((-windowX - mouseDragX) / (CHUNK_SIZE * RENDERED_TILE_SIZE));
  const maxChunkX = Math.ceil(minChunkX + width / (CHUNK_SIZE * RENDERED_TILE_SIZE) + 1);
  const minChunkY = Math.floor((-windowY - mouseDragY) / (CHUNK_SIZE * RENDERED_TILE_SIZE));
  const maxChunkY = Math.ceil(minChunkY + height / (CHUNK_SIZE * RENDERED_TILE_SIZE) + 1);
  for (row = minChunkY; row < maxChunkY; row++) {
    for (col = minChunkX; col < maxChunkX; col++) {
      renderChunk(getChunk(col, row), windowX + mouseDragX + col * CHUNK_SIZE * RENDERED_TILE_SIZE, windowY + mouseDragY + row * CHUNK_SIZE * RENDERED_TILE_SIZE, graphicsObject);
    }
  }
  if (dead) {
    graphicsObject.noStroke();
    graphicsObject.fill(0, 0, 0, 128);
    graphicsObject.rect(0, 0, width, height);
    graphicsObject.pop();
  }
}

function drawBackground(backgroundGraphics) {
  image(backgroundGraphics, 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  backgroundGraphics = createGraphics(windowWidth, windowHeight);
  backgroundGraphics.noSmooth();
  renderBackground(backgroundGraphics);
  drawBackground(backgroundGraphics);
}

function handleClickStart() {
  if (dead) {
    return;
  }
  mouseClickX = mouseX;
  mouseClickY = mouseY;
  clickTime = millis();
  loop();
}

function mouseDragged() {
  if (dead) {
    return;
  }
  const dx = mouseX - mouseClickX;
  const dy = mouseY - mouseClickY;
  if (mag(dx, dy) > TOUCH_SLOP) {
    dragging = true;
  }
  if (dragging) {
    mouseDragX = mouseX - mouseClickX;
    mouseDragY = mouseY - mouseClickY;
    noLoop();
    renderBackground(backgroundGraphics);
    drawBackground(backgroundGraphics);
  }
}

function touchStarted() {
  if (touches.length === 1) {
    handleClickStart();
  }
}

function mousePressed() {
  handleClickStart();
}

function mouseReleased() {
  if (dead) {
    return;
  }
  if (dragging) {
    windowX += mouseDragX;
    windowY += mouseDragY;
  } else {
    const tileX = Math.floor((mouseX - windowX) / RENDERED_TILE_SIZE);
    const tileY = Math.floor((mouseY - windowY) / RENDERED_TILE_SIZE);
    const now = millis();
    if (now - clickTime > HOLD_DELAY + HOLD_TIME) {
      handleLongClick(tileX, tileY);
    } else {
      handleClick(tileX, tileY);
    }
  }
  dragging = false;
  mouseDragX = 0;
  mouseDragY = 0;
  renderBackground(backgroundGraphics);
  drawBackground(backgroundGraphics);
  noLoop();
}

function generateChunk(chunkX, chunkY, mineDensity) {
  let chunk = [];
  for (let row = 0; row < CHUNK_SIZE; row++) {
    chunk.push([]);
    for (let col = 0; col < CHUNK_SIZE; col++) {
      chunk[row].push({
        mine: Math.random() < mineDensity,
        state: STATE_BLANK,
        neighborMines: undefined
      });
    }
  }
  return {x: chunkX, y: chunkY, chunk};
}

function renderChunk(chunk, x, y, graphicsObject) {
  graphicsObject.push();
  graphicsObject.translate(x, y);
  graphicsObject.scale(TILE_SCALE);
  for(let row = 0; row < CHUNK_SIZE; row++) {
    for (let col = 0; col < CHUNK_SIZE; col++) {
      if (chunk === undefined) {
        graphicsObject.image(blankTile, row * IMAGE_TILE_SIZE, col * IMAGE_TILE_SIZE);
        continue;
      }
      const tileMine = chunk.chunk[row][col].mine;
      const tileState = chunk.chunk[row][col].state;
      const tileNeighborMines = chunk.chunk[row][col].neighborMines;

      if (tileState === STATE_BLANK) {
        graphicsObject.image(blankTile, row * IMAGE_TILE_SIZE, col * IMAGE_TILE_SIZE);
      } else if (tileState === STATE_REVEALED) {
        if (tileMine) {
          graphicsObject.image(deadTile, row * IMAGE_TILE_SIZE, col * IMAGE_TILE_SIZE);
        } else if (tileNeighborMines !== undefined) {
          graphicsObject.image(mineNumbers[tileNeighborMines], row * IMAGE_TILE_SIZE, col * IMAGE_TILE_SIZE);
        }
      } else if (tileState === STATE_FLAGGED) {
        graphicsObject.image(flagTile, row * IMAGE_TILE_SIZE, col * IMAGE_TILE_SIZE);
      } else if (tileState === STATE_UNKNOWN) {
        graphicsObject.image(unknownTile, row * IMAGE_TILE_SIZE, col * IMAGE_TILE_SIZE);
      }
    }
  }
  graphicsObject.pop();
}

function handleClick(tileX, tileY) {
  revealTile(tileX, tileY);
}

function handleLongClick(tileX, tileY) {
  const tile = getTile(tileX, tileY);
  if (tile.state === STATE_BLANK) {
    tile.state = STATE_FLAGGED;
  } else if (tile.state === STATE_FLAGGED) {
    tile.state = STATE_UNKNOWN;
  } else if (tile.state === STATE_UNKNOWN) {
    tile.state = STATE_BLANK;
  }
}

function revealTile(tileX, tileY) {
  const chunkX = Math.floor(tileX / CHUNK_SIZE);
  const chunkY = Math.floor(tileY / CHUNK_SIZE);
  let chunk = getChunk(chunkX, chunkY);
  if (chunk === undefined) {
    chunk = generateChunk(chunkX, chunkY, MINE_DENSITY);
    const subTileX = tileX - chunkX * CHUNK_SIZE;
    const subTileY = tileY - chunkY * CHUNK_SIZE;
    for (let col = -1; col < 2; col++) {
      const x = subTileX + col;
      for (let row = -1; row < 2; row++) {
        const y = subTileY + row;
        if (x > 0 && x < CHUNK_SIZE - 1 && y > 0 && y < CHUNK_SIZE - 1) {
          chunk.chunk[x][y].mine = false;
        }
      }
    }
    chunks.push(chunk);
  }
  const tile = getTile(tileX, tileY);
  if (tile.state !== STATE_BLANK) {
    return;
  }
  tile.state = STATE_REVEALED;
  if (!tile.mine && tile.neighborMines === undefined) {
    tile.neighborMines = computeTileNeighbors(tileX, tileY);
  }
  if (!tile.mine && tile.neighborMines === 0) {
    for (let col = -1; col < 2; col++) {
      for (let row = -1; row < 2; row++) {
        try {
          revealTile(tileX + col, tileY + row);
        } catch (e) {
          console.log("ouchie");
        }
      }
    }
  }
  if (tile.mine) {
    dead = true;
    const gameOverModalHolder = document.getElementById("game-over-modal-holder");
    const uncoveredCounter = document.getElementById("uncovered-counter");
    const markedCounter = document.getElementById("marked-counter");
    const correctMarkedCounter = document.getElementById("correct-marked-counter");
    const unknownCounter = document.getElementById("unknown-counter");
    let uncoveredCount = 0;
    let markedCount = 0;
    let correctMarkedCount = 0;
    let unknownCount = 0;
    for (let chunk of chunks) {
      for (let col of chunk.chunk) {
        for (let tile of col) {
          if (tile.state === STATE_REVEALED) {
            uncoveredCount++;
          } else if (tile.state === STATE_FLAGGED) {
            markedCount++;
            if (tile.mine) {
              correctMarkedCount++;
            }
          } else if (tile.state === STATE_UNKNOWN) {
            unknownCount++;
          }
        }
      }
    }
    uncoveredCounter.innerText = uncoveredCount;
    markedCounter.innerText = markedCount;
    correctMarkedCounter.innerText = correctMarkedCount;
    unknownCounter.innerText = unknownCount;
    gameOverModalHolder.style.display = "flex";
  }
}

function getChunk(chunkX, chunkY) {
  return chunks.filter(ch => ch.x === chunkX && ch.y === chunkY)[0];
}

function mod(a, b) {
  if (a > 0) {
    return a % b;
  }

}

function getTile(tileX, tileY) {
  const chunkX = Math.floor(tileX / CHUNK_SIZE);
  const chunkY = Math.floor(tileY / CHUNK_SIZE);
  const subTileX = tileX - chunkX * CHUNK_SIZE;
  const subTileY = tileY - chunkY * CHUNK_SIZE;
  let chunk = getChunk(chunkX, chunkY);
  if (chunk === undefined) {
    chunk = generateChunk(chunkX, chunkY, MINE_DENSITY);
    chunks.push(chunk);
  }
  return chunk.chunk[subTileX][subTileY];
}

function computeTileNeighbors(tileX, tileY) {
  let neighborMines = 0;
  for (let col = -1; col < 2; col++) {
    for (let row = -1; row < 2; row++) {
      if (getTile(tileX + col, tileY + row).mine && !(row === 0 && col === 0)) {
        neighborMines++;
      }
    }
  }
  return neighborMines;
}