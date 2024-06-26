let windowMin, windowX, windowY;
let lastMillis = 0;

let swingTimer = 0;
let extendAmount = 0;
let extending = false;
const baseExtendSpeed = 60;
let extendSpeed = 1;

let gems = [];
let holdingGem = null;

const startingTime = 60;
let score = 0;
let time = startingTime + 3;

let gameOver = false;

const numGems = 20;

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
	generateGems(numGems);
}

function draw() {
	background(64);
	rect(windowX, windowY, windowMin, windowMin);
	const now = millis()
	update(now - lastMillis);
	lastMillis = now;
	render();
}

function update(delta) {
	if (extendAmount > 0) {
		if (extending) {
			extendAmount += baseExtendSpeed * extendSpeed * delta / 1000;
			const pos = getClawPosition();
			holdingGem = gems.find(g => Math.abs(g.x - pos.x) < 5 && Math.abs(g.y - pos.y) < 5 );
			if(pos.x < -80 || pos.y < -80 || pos.x >= 80 || pos.y >= 160 || holdingGem) {
				extending = false;
				extendSpeed = holdingGem ? 4 / holdingGem.size : 1;
				if(holdingGem) {
					gems = gems.filter(g => g !== holdingGem);
				}
			}
		} else {
			extendAmount -= baseExtendSpeed * extendSpeed * delta / 1000;
		}
	} else {
		if (holdingGem) {
			score += Math.floor(holdingGem.size * 10);
			holdingGem = null;
			extendSpeed = 1;
		}
		swingTimer += delta / 1000;
	}
	time -= delta / 1000;
	if (time <= 0 && extendAmount <= 0 && !gameOver && ! holdingGem) {
		gameOver = true;
		localStorage.setItem("gemgrabber.score", score);
		top.location.href = "GameOver.html";
	}
}

function render() {
	push();
	translate(width / 2, windowY);
	scale(windowMin / 160);
	renderClaw();
	renderGems();
	text(`Time: ${Math.min(60, Math.max(0, Math.floor(time)))}`, -72, 16);
	textAlign(RIGHT);
	text(`Score: ${score}`, 72, 16);
	if (time > startingTime) {
		renderCountdown();
	}
	pop();
}

function renderClaw() {
	const theta = getClawTheta();
	const pos = getClawPosition();
	if (holdingGem) {
		push();
		translate(pos.x, pos.y);
		rotate(theta);
		noStroke();
		fill(127,127,0);
		ellipse(2, 0, holdingGem.size, holdingGem.size);
		pop();
	}
	if (extendAmount <= 0) {
		push();
		stroke(127, 0, 0);
		rotate(theta);
		line(4,0,12,0);
		pop();
	} else {
		line(0,0,pos.x, pos.y);
	}
	ellipse(pos.x, pos.y, 4, 4);
}

function renderGems() {
	push();
	noStroke();
	fill(127,127, 0);
	for (let gem of gems) {
		ellipse(gem.x, gem.y, gem.size, gem.size);
	}
	pop();
}

function renderCountdown() {
	push();
	const timeLeft = time - startingTime;
	textSize(timeLeft * -4 + 52);
	textAlign(CENTER);
	text(Math.ceil(timeLeft), 0, 80);
	pop();
}

function getClawTheta() {
	return Math.PI * sin(swingTimer) / 4 + Math.PI / 2;
}

function getClawPosition() {
	const theta = getClawTheta();
	return {
		x: (extendAmount + 4) * cos(theta),
		y: (extendAmount + 4) * sin(theta)
	}
}

function generateGems(numGems) {
	for (let i = 0; i < numGems; i++) {
		gems.push({
			x: Math.random() * 150 - 75,
			y: Math.random() * 110 + 40,
			size: Math.random() * 4 + 4
		});
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scaleContent();
}

function scaleContent() {
	windowMin = Math.min(windowWidth, windowHeight);
	windowX = (windowWidth - windowMin) / 2;
	windowY = (windowHeight - windowMin) / 2;
	rect(windowX, windowY, windowMin, windowMin);
}

function mousePressed() {
	if (extendAmount <= 0 && time < startingTime) {
		extendAmount = extendSpeed;
		extending = true;
	}
}
