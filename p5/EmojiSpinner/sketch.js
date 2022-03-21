const TWISTYNESS = 8;
const TIME_STEP = 0.001;
const NUM_OBJECTS = 40;
const BACKGROUND_COLOR = [64, 192, 160];
const SHADOW_COLOR = BACKGROUND_COLOR.map(v => v * 0.9);
const EMOJIS = ["😀","🤣","😅","😊","😍","😗","😺","🤩","😐","🙄","😥","😯","😁","😃","😆","😋","😘","😙","🙂","🤔","😑","😏","😮","😪","😂","😄","😉","😎","🥰","😚","🤗","🤨","😶","😣","🤐","😫","🤑","🤯","😱","🙃"];
const EMOJI_OFFSET = Math.floor(Math.random() * EMOJIS.length);

let t = 0;


let windowMin, FOV, EMOJI_SCALE;

function setup() {
	createCanvas(windowWidth, windowHeight);
	scaleContent();
}

function draw() {
	background(...BACKGROUND_COLOR);
	t += TIME_STEP;
	let objects = [];
	for (let i = 0; i < NUM_OBJECTS; i++) {
		const objt = (t + i / NUM_OBJECTS) % 1;
		objects.push({
			loc: getLoc(objt),
			size: getSize(objt),
			emoji:EMOJIS[(EMOJI_OFFSET + i) % EMOJIS.length]
		});
	}
	renderShadows(objects);
	renderObjects(objects);
}

function getLoc(t) {
	const scale = Math.sqrt(1 - Math.pow((2 * t - 1), 2));
	const x = Math.cos(Math.PI * t) * scale;
	const y = Math.sin(Math.PI * t) * scale;
	return new p5.Vector(Math.cos(Math.PI * t * TWISTYNESS) * scale, 2 * t - 1, Math.sin(Math.PI * t * TWISTYNESS) * scale + 2);
}

function getSize(t) {
	 return Math.sqrt(1 - Math.pow((2 * t - 1), 2));
}

function getPerspective(v, fov) {
	return new p5.Vector(fov * v.x / v.z, fov * v.y / v.z);
}

function getOrthographic(v) {
	return new p5.Vector(v.x, v.z);
}

function renderShadows(objects) {
	push();
	fill(...SHADOW_COLOR);
	noStroke();
	translate(width / 2, height / 2);
	for (let object of objects) {
		const perspLoc = getPerspective({...object.loc, y: 1.2}, FOV);
		const perspScale = EMOJI_SCALE * object.size / object.loc.z;
		ellipse(perspLoc.x, perspLoc.y, perspScale, perspScale / 2);
	}
	pop();
}

function renderObjects(objects) {
	push();
	translate(width / 2, height / 2);
	objects.sort((a,b)=>b.loc.z-a.loc.z);
	for (let i = 0; i < objects.length; i++) {
		const object = objects[i];
		const persploc = getPerspective(object.loc, FOV);
		const perspScale = EMOJI_SCALE * object.size / object.loc.z;
		textSize(perspScale);
		textAlign(CENTER);
		text(object.emoji, persploc.x, persploc.y);
	}
	pop();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scaleContent();
}

function scaleContent() {
	windowMin = Math.min(windowWidth, windowHeight);
	FOV = windowMin / 3;
	EMOJI_SCALE = windowMin / 12;
}