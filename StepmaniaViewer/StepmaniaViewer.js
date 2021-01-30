const SONG_INFO_KEYS = ["TITLE","SUBTITLE","ARTIST","TITLETRANSLIT","SUBTITLETRANSLIT","ARTISTTRANSLIT","CREDIT","BANNER","BACKGROUND","LYRICSPATH","CDTITLE","MUSIC","OFFSET","SAMPLESTART","SAMPLELENGTH","SELECTABLE","DISPLAYBPM","BPMS","STOPS","BGCHANGES"];

var values = [];
var notes = {};

function readSimFile() {
	values = [];
	notes = {};
	clearElement("stepsArea");
	document.getElementById("stepsArea").style.height = 0;
	clearElement("songInfo");
	let theFile = document.getElementById('fileInput').files[0];
	let levelName = theFile.name;
	let reader = new FileReader();
	reader.onloadend = function(event) {
		if (event.target.readyState == FileReader.DONE) {
			let simFileData = event.target.result;
			parseSimFile(simFileData);
			renderSongInfo(values);
			notes = getNotesEntries(values);
			setupModeSelection(notes);
		}
	}
	reader.readAsText(theFile);
}

function getValue(values, keyName) {
	return values.filter(v => v[0] == keyName);
}


function renderSongInfo(values) {
	let songInfoElement = document.getElementById("songInfo");
	for (let key of SONG_INFO_KEYS) {
		let keyEl = document.createElement("span");
		let valueEl = document.createElement("span");
		keyEl.className = "songInfoLine key";
		valueEl.className = "songInfoLine value";
		keyEl.innerText = `${key}: `;
		let val = getValue(values, key);
		if (val.length) {
			valueEl.innerText = val[0][1];
		}
		songInfoElement.appendChild(keyEl);
		songInfoElement.appendChild(valueEl);
	}
}

function getNotesEntries(values) {
	let notes = {};
	let notesEntries = getValue(values, "NOTES");
	for (let notesEntry of notesEntries) {
		let type = notesEntry[1];
		let difficulty = notesEntry[3];
		let rating = notesEntry[4];
		let radar = notesEntry[5];
		let notesParsed = parseNotes(notesEntry[6]);
		
		if (!(type in notes)) {
			notes[type] = {};
		}
		
		if (!(difficulty in notes[type])) {
			notes[type][difficulty] = {rating, radar, notesParsed};
		}
	}
	return notes;
}

function clearElement(elId) {
	let el = document.getElementById(elId);
	while (el.childElementCount > 0) {
		el.removeChild(el.children[el.childElementCount - 1]);
	}
}

function showDifficultiesForMode() {
	clearElement("difficulty");
	clearElement("stepsArea");
	document.getElementById("stepsArea").style.height = 0;
	let mode = document.getElementById("mode").value;
	let difficultySelector = document.getElementById("difficulty");
	if (mode === "") {
		difficultySelector.disabled = true;
	} else {
		difficultySelector.disabled = false;
		let defaultDifficultyOption = document.createElement("option");
		defaultDifficultyOption.innerText = "Choose a Difficulty";
		defaultDifficultyOption.value = "";
		difficultySelector.appendChild(defaultDifficultyOption);
		difficulties = Object.keys(notes[mode]);
		for (let difficulty of difficulties) {
			let difficultyOption = document.createElement("option");
			difficultyOption.innerText = difficulty;
			difficultyOption.value = difficulty;
			difficultySelector.appendChild(difficultyOption);
		}
	}
}

function showStepsForModeAndDifficulty() {
	clearElement("stepsArea");
	document.getElementById("stepsArea").style.height = 0;
	let mode = document.getElementById("mode").value;
	let difficulty = document.getElementById("difficulty").value;
	if (!(mode === "" || difficulty === "")) {
		let stepsArea = document.getElementById("stepsArea");
		let steps = notes[mode][difficulty]["notesParsed"];
		
		stepsArea.style.height = `${steps.filter(s => s.type == "measureBar").length * 16}em`;
		
		for (let step of steps) {
			if (step.type == "measureBar") {
				let mbEl = document.createElement("div");
				mbEl.className = "measureBar";
				mbEl.style.top = `${step.measure * 4 * 4 + 2}em`;
				stepsArea.appendChild(mbEl);
				continue;
			} else if (step.type == "beatBar") {
				let bbEl = document.createElement("div");
				bbEl.className = "beatBar";
				bbEl.style.top = `${(step.measure + step.beatNumerator / step.beatDenominator) * 4 * 4 + 2}em`;
				stepsArea.appendChild(bbEl);
				continue;
			} else if (step.type == "mine") {
				let mineEl = document.createElement("mine");
				mineEl.className = "mine";
				mineEl.style.left = `${step.track * 4}em`;
				mineEl.style.top = `${(step.measure + step.beatNumerator / step.beatDenominator) * 4 * 4}em`;
				stepsArea.appendChild(mineEl);
				continue;
			}
			let stepEl = document.createElement("div");
			stepEl.className = "step";
			stepEl.style.left = `${step.track * 4}em`;
			stepEl.style.top = `${(step.measure + step.beatNumerator / step.beatDenominator) * 4 * 4}em`;
			stepEl.style.transform = `rotate(${[90,0,180,270][step.track % 4]}deg)`;
			
			let simplifiedDenominator = step.beatDenominator / gcd(step.beatNumerator, step.beatDenominator);
			// Set note color based on location in measure
			switch (simplifiedDenominator) {
				case 1:
				case 2:
				case 4:
					break;
				case 8:
					stepEl.style.backgroundPositionY = "-100%";
					break;
				case 3:
				case 6:
				case 12:
					stepEl.style.backgroundPositionY = "-200%";
					break;
				case 16:
					stepEl.style.backgroundPositionY = "-300%";
					break;
				case 24:
					stepEl.style.backgroundPositionY = "-400%";
					break;
				case 32:
					stepEl.style.backgroundPositionY = "-500%";
					break;
				case 48:
					stepEl.style.backgroundPositionY = "-600%";
					break;
				case 64:
					stepEl.style.backgroundPositionY = "-700%";
					break;
			}
			
			if (step.type == "hold" || step.type == "roll") {
				let holdTail = document.createElement("div");
				holdTail.className = "tail";
				holdTail.style.height = `${step.length * 4 + 4}em`;
				holdTail.style.left = `${step.track * 4}em`;
				holdTail.style.top = `${(step.measure + step.beatNumerator / step.beatDenominator) * 4 * 4}em`;
				let holdTailTop = document.createElement("div");
				let holdTailMiddle = document.createElement("div");
				let holdTailBottom = document.createElement("div");
				holdTailTop.className = step.type == "hold" ? "holdTop" : "rollTop";
				holdTailMiddle.className = step.type == "hold" ? "holdMiddle" : "rollMiddle";
				holdTailBottom.className = step.type == "hold" ? "holdBottom" : "rollBottom";
				holdTail.appendChild(holdTailTop);
				holdTail.appendChild(holdTailMiddle);
				holdTail.appendChild(holdTailBottom);
				stepsArea.appendChild(holdTail);
			}
			
			stepsArea.appendChild(stepEl);
		}
	}
}

function setupModeSelection(notesEntries) {
	clearElement("mode");
	clearElement("difficulty");
	clearElement("stepsArea");
	document.getElementById("stepsArea").style.height = 0;
	let modeSelector = document.getElementById("mode");
	let difficultySelector = document.getElementById("difficulty");
	difficultySelector.disabled = true;
	let defaultModeOption = document.createElement("option");
	defaultModeOption.innerText = "Choose a mode";
	defaultModeOption.value = "";
	modeSelector.appendChild(defaultModeOption);
	for (let mode of Object.keys(notesEntries)) {
		let modeOption = document.createElement("option");
		modeOption.innerText = mode;
		modeOption.value = mode;
		modeSelector.appendChild(modeOption);
	}
}

function parseNotes(notes) {
	let notesOut = [];
	let measures = notes.split(",");
	for (let measureIndex in measures) {
		notesOut.push({
				"type": "measureBar",
				"measure": Number(measureIndex)
		});
		beats = measures[measureIndex].trim().split(/\r?\n/);
		let beatsInMeasure = beats.length;
		for (let beatIndex in beats) {
			let gcdBeat = beatsInMeasure / gcd(Number(beatIndex), beatsInMeasure)
			if (gcdBeat == 1 || gcdBeat == 2 || gcdBeat == 4) {
				notesOut.push({
					"type": "beatBar",
					"measure": Number(measureIndex),
					"beatNumerator": Number(beatIndex),
					"beatDenominator": beatsInMeasure
				});
			}
			let tracks = beats[beatIndex].trim().split("");
			for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
				switch (tracks[trackIndex]) {
					case "1":
						notesOut.push({
								"type": "tap",
								"track": Number(trackIndex),
								"measure": Number(measureIndex),
								"beatNumerator": Number(beatIndex),
								"beatDenominator": beatsInMeasure
						});
						break;
					case "2":
						notesOut.push({
								"type": "hold",
								"track": Number(trackIndex),
								"measure": Number(measureIndex),
								"beatNumerator": Number(beatIndex),
								"beatDenominator": beatsInMeasure
						});
						break;
					case "3":
						for (let i = notesOut.length - 1; i >= 0; i--) {
							let note = notesOut[i];
							if (note.track == Number(trackIndex) && (note.type == "hold" || note.type == "roll")) {
								end = (Number(measureIndex) + Number(beatIndex) / beatsInMeasure) * 4;
								start = (note.measure + note.beatNumerator / note.beatDenominator) * 4;
								note.length = end - start;
								break;
							}
						}
						break;
					case "4":
						notesOut.push({
								"type": "roll",
								"track": Number(trackIndex),
								"measure": Number(measureIndex),
								"beatNumerator": Number(beatIndex),
								"beatDenominator": beatsInMeasure
						});
						break;
					case "M":
						notesOut.push({
								"type": "mine",
								"track": Number(trackIndex),
								"measure": Number(measureIndex),
								"beatNumerator": Number(beatIndex),
								"beatDenominator": beatsInMeasure
						});
						break;
				}
			}
		}
	}
	return notesOut;
}

// Using https://en.wikipedia.org/wiki/Binary_GCD_algorithm 

function gcd(u, v)
{
    // Base cases
    //  gcd(n, n) = n
    if (u == v)
        return u;
    
    //  Identity 1: gcd(0, n) = gcd(n, 0) = n
    if (u == 0)
        return v;
    if (v == 0)
        return u;

    if (u % 2 == 0) { // u is even
        if (v % 2 == 1) // v is odd
            return gcd(u/2, v); // Identity 3
        else // both u and v are even
            return 2 * gcd(u/2, v/2); // Identity 2

    } else { // u is odd
        if (v % 2 == 0) // v is even
            return gcd(u, v/2); // Identity 3

        // Identities 4 and 3 (u and v are odd, so u-v and v-u are known to be even)
        if (u > v)
            return gcd((u - v)/2, v);
        else
            return gcd((v - u)/2, u);
    }
}
