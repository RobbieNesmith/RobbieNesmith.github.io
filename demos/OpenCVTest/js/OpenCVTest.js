let streaming = true;
function onOpenCvReady() {
    cv['onRuntimeInitialized'] = () => {
        let video = document.getElementById("videoInput"); // video is the id of video tag
        navigator.mediaDevices.getUserMedia({
			video: {
				width: 480,
				height: 640,
				frameRate: 30,
				facingMode: "environment",
				resizeMode: "crop-and-scale"
			},
			audio: false
		})
		.then(function(stream) {
			video.srcObject = stream;
			video.play();
			let startCVButton = document.getElementById("startCV");
			startCVButton.disabled = false;
			startCVButton.addEventListener("click", () => startCV(stream) );
		})
		.catch(function(err) {
			console.log("An error occurred! " + err);
		});
    }
}

async function printVideoInformation() {
	let videoSettings = await document.getElementById("videoInput").srcObject.getVideoTracks()[0].getSettings();
	let consoleElement = document.getElementById("debugConsole");
	consoleElement.innerText += JSON.stringify(videoSettings);
}

function stopStreaming() {
	streaming = false;
}

function startCV(stream) {
	let startCVButton = document.getElementById("startCV");
	startCVButton.disabled = true;
	let video = document.getElementById("videoInput");
	settings = video.srcObject.getVideoTracks()[0].getSettings();
	let console = document.getElementById("debugConsole");
	console.innerText += `Setting video resolution to ${settings.width}x${settings.height}`;
	let canvasOutput = document.getElementById("canvasOutput");
	video.width = settings.width;
	video.height = settings.height;
	canvasOutput.width = settings.width;
	canvasOutput.height = settings.height;

	// Have to set these up beforehand?
	let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
	let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
	let out = new cv.Mat(video.height, video.width, cv.CV_8UC4);
	let lines = new cv.Mat();
	let cap = new cv.VideoCapture(video);

	const FPS = 30;
	function processVideo() {
		try {
			if (!streaming) {
				// clean and stop.
				src.delete();
				dst.delete();
				out.delete();
				lines.delete();
				cap.delete();
				return;
			}
			let begin = Date.now();
			// start processing.
			cap.read(src);
			cv.Canny(src, dst, 40, 150);
			cv.HoughLinesP(dst, lines, 1, Math.PI / 180, 80, 30, 10);
			cv.cvtColor(dst, out, cv.COLOR_GRAY2BGR);
			let color = new cv.Scalar(255, 0, 0);
			// ++i is way faster because it doesn't need to allocate a temp variable
			for (let i = 0; i < lines.rows && i < 20; ++i) {
				let startPoint = new cv.Point(lines.data32S[i * 4], lines.data32S[i * 4 + 1]);
				let endPoint = new cv.Point(lines.data32S[i * 4 + 2], lines.data32S[i * 4 + 3]);
				cv.line(out, startPoint, endPoint, color);
			}
			
			//cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
			cv.imshow('canvasOutput', out);
			// schedule the next one.
			let delay = 1000/FPS - (Date.now() - begin);
			setTimeout(processVideo, delay);
		} catch (err) {
			console.error(err);
			//utils.printError(err);
		}
	};

	// schedule the first one.
	setTimeout(processVideo, 0);
}
