let audioCtx;
let analyserL, analyserR;
let splitter;
let merger;
let loudnessL, loudnessR;
let dbElementL, dbElementR;
let diffElement;

let diffOverTime = 0;
let diffChart = [];
let diffLog = [];
let diffOverTimeLog = [];

const MAX_DOT = 2000;

let running = false;

async function setupContext() {
  const mic = await getInput();
  const source = audioCtx.createMediaStreamSource(mic);

  source.connect(splitter)
  splitter.connect(analyserL, 0);
  splitter.connect(analyserR, 1);
  //analyserL.connect(merger, 0, 0);
  //analyserR.connect(merger, 0, 1);
  //merger.connect(audioCtx.destination);
}

function getInput() {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      autoGainControl: true,
      noiseSuppresion: false,
      latency: 0
    }
  });
}

function setup() {
	audioCtx = new(window.AudioContext || window.webkitAudioContext)();
	analyserL = audioCtx.createAnalyser();
	analyserR = audioCtx.createAnalyser();
	splitter = audioCtx.createChannelSplitter(2);
	merger = audioCtx.createChannelMerger(2);

	analyserL.fftSize = 32;
	analyserR.fftSize = 32;
	loudnessL = new Float32Array(analyserL.frequencyBinCount);
	loudnessR = new Float32Array(analyserR.frequencyBinCount);

	dbElementL = document.getElementById("decibelsL");
	dbElementR = document.getElementById("decibelsR");
  diffElement = document.getElementById("diff");

  setupContext();

  let canvas = createCanvas(640, 380);
  canvas.parent("canvasHolder");
  frameRate(5);
}

function draw() {
  if (running) {
    analyserL.getFloatFrequencyData(loudnessL);
    analyserR.getFloatFrequencyData(loudnessR);

    const leftVolume = Math.max(...loudnessL);
    const rightVolume = Math.max(...loudnessR);
    const diffVolume = rightVolume - leftVolume;
    if (diffVolume) {
      diffOverTime += diffVolume;
    }

    if (diffOverTime > MAX_DOT) {
      diffOverTime = MAX_DOT;
    }

    if (diffOverTime < -MAX_DOT) {
      diffOverTime = -MAX_DOT;
    }

    if (diffChart.length < 600) {
      diffChart.push(diffVolume);
    } else {
      diffChart = [];
    }

    diffLog.push(diffVolume);
    diffOverTimeLog.push(diffOverTime);

    dbElementL.innerText = leftVolume;
    dbElementR.innerText = rightVolume;
    diffElement.innerText = diffVolume;
    background(200,200,255);
    rect(20, 20, 600, 100);
    rect(20, 140, 600, 100);
    rect(20, 260, 600, 100);

    const diffX = map(diffVolume, -30, 30, 20, 620);
    line(diffX, 20, diffX, 120);
    const dotX = map(diffOverTime, -MAX_DOT, MAX_DOT, 20, 620);
    line(dotX, 140, dotX, 240);

    for (let i = 0; i < diffChart.length; i++) {
      const c = lerpColor(color(255, 0, 0), color(0, 0, 255), map(diffChart[i], -30, 30, 0, 1));
      push();
      stroke(c);
      line(20 + i, 260, 20 + i, 360);
      pop();
    }
  }
}

function toggleRunning() {
  running = !running;
  let buttonText = running ? "Stop" : "Start";
  let buttonClass = running ? "btn btn-danger" : "btn btn-success";
  let buttonElement = document.getElementById("runToggle");
  buttonElement.innerText = buttonText;
  buttonElement.className = buttonClass;
}

function exportData() {
  let output = "Volume difference,Volume difference smoothed\r\n";
  for (let i = 0; i < diffLog.length; i++) {
    output += `${diffLog[i]},${diffOverTimeLog[i]}\r\n`;
  }

  let dlLink = document.createElement('a');
  dlLink.href = "data:text/csv;charset=utf-8," + encodeURI(output);
  dlLink.style.display = "none";
  dlLink.download = "meeting.csv";
  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
}