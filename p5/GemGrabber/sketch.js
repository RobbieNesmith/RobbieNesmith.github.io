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
let elapsed = 0;

let gameOver = false;

const numGems = 20;

let clockSounds = [];
let retractSounds = [];
let grabSounds = [];
let missSounds = [];
let jawsOpenSounds = [];

let gemSprites;
let gameBackground;
let gemColors = [
	"#fc92c0",
	"#f25a46",
	"#fcad37",
	"#fced62",
	"#6fe84a",
	"#64b8fc",
	"#ac3cf2",
	];

function playSoundFromArray(soundArray, pan) {
	const sound = soundArray[Math.floor(Math.random() * soundArray.length)];
	sound.pan(pan);
	sound.play();
}

function loopSoundFromArray(soundArray, pan) {
	const sound = soundArray[Math.floor(Math.random() * soundArray.length)];
	sound.pan(pan);
	sound.loop();
}

function panSoundFromArray(soundArray, pan) {
	for (let sound of soundArray) {
		if (sound.isLooping || sound.isPlaying) {
			sound.pan(pan);
		}
	}
}

function stopSoundFromArray(soundArray) {
	for(let sound of soundArray) {
		if (sound.isLooping || sound.isPlaying) {
			sound.stop();
		}
	}
}

function preload() {
	clockSounds.push(loadSound("assets/sounds/Clock1.wav"));
	clockSounds.push(loadSound("assets/sounds/Clock2.wav"));
	clockSounds.push(loadSound("assets/sounds/Clock3.wav"));
	clockSounds.push(loadSound("assets/sounds/Clock4.wav"));
	grabSounds.push(loadSound("assets/sounds/Grab1.wav"));
	grabSounds.push(loadSound("assets/sounds/Grab2.wav"));
	grabSounds.push(loadSound("assets/sounds/Grab2.wav"));
	missSounds.push(loadSound("assets/sounds/Miss1.wav"));
	missSounds.push(loadSound("assets/sounds/Miss2.wav"));
	retractSounds.push(loadSound("assets/sounds/RetractLoop.wav"));
	jawsOpenSounds.push(loadSound("assets/sounds/JawsOpen1.wav"));
	jawsOpenSounds.push(loadSound("assets/sounds/JawsOpen2.wav"));

	gemSprites = loadImage("assets/images/GemGrabberGems.png");
	gameBackground = loadImage("assets/images/Background.png");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
	generateGems(numGems);
	imageMode(CENTER);
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
	elapsed += delta;
	if (elapsed > 1000 && time > 1) {
		playSoundFromArray(clockSounds, 0);
		elapsed -= 1000;
	}
	if (extendAmount > 0) {
		const pos = getClawPosition();
		if (extending) {
			extendAmount += baseExtendSpeed * extendSpeed * delta / 1000;
			holdingGem = gems.find(g => Math.abs(g.x - pos.x) < 5 && Math.abs(g.y - pos.y) < 5 );
			if(pos.x < -80 || pos.y < -80 || pos.x >= 80 || pos.y >= 160 || holdingGem) {
				if (holdingGem) {
					playSoundFromArray(grabSounds, pos.x / 160);
				} else {
					playSoundFromArray(missSounds, pos.x / 160);
				}
				loopSoundFromArray(retractSounds, pos.x / 160);
				extending = false;
				extendSpeed = holdingGem ? 4 / holdingGem.size : 1;
				if(holdingGem) {
					gems = gems.filter(g => g !== holdingGem);
				}
			}
		} else {
			extendAmount -= baseExtendSpeed * extendSpeed * delta / 1000;
			panSoundFromArray(retractSounds, pos.x / 160);
		}
	} else {
		if (holdingGem) {
			score += Math.floor(holdingGem.size * 10);
			holdingGem = null;
			extendSpeed = 1;
		}
		stopSoundFromArray(retractSounds);
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
	image(gameBackground, 0, 80, 160, 160);
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
		renderGem(holdingGem, 2 * cos(theta), 2 * sin(theta));
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

function renderGem(gem, x, y) {
	image(gem.sprite, x, y, gem.size * 2, gem.size * 2);
}

function renderGems() {
	for (let gem of gems) {
		renderGem(gem, gem.x, gem.y);
	}
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
	const imageWidth = gemSprites.width;
	const imageHeight = gemSprites.height;
	const xSpriteCount = 4;
	const ySpriteCount = 4;
	const xSpriteSize = imageWidth / xSpriteCount;
	const ySpriteSize = imageHeight / ySpriteCount;
	for (let i = 0; i < numGems; i++) {
		const overlayImage = createImage(xSpriteSize, ySpriteSize);
		const spriteX = Math.floor(Math.random() * 4);
		const spriteY = Math.floor(Math.random() * 4);
		const gemSprite = gemSprites.get(spriteX * xSpriteSize, spriteY * ySpriteSize, xSpriteSize, ySpriteSize);
		const gemColor = color(gemColors[Math.floor(Math.random() * gemColors.length)])
		overlayImage.loadPixels();
		gemSprite.loadPixels();
		for (let i = 0; i < overlayImage.width * overlayImage.height; i++) {
			overlayImage.pixels[i * 4] = red(gemColor);
			overlayImage.pixels[i * 4 + 1] = green(gemColor);
			overlayImage.pixels[i * 4 + 2] = blue(gemColor);
			overlayImage.pixels[i * 4 + 3] = gemSprite.pixels[i * 4 + 3];
		}
		overlayImage.updatePixels();
		gemSprite.blend(overlayImage, 0, 0, xSpriteSize, ySpriteSize, 0, 0, xSpriteSize, ySpriteSize, OVERLAY);
		gems.push({
			x: Math.random() * 150 - 75,
			y: Math.random() * 110 + 40,
			size: Math.random() * 4 + 4,
			sprite: gemSprite,
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
		playSoundFromArray(jawsOpenSounds, 0);
	}
}
