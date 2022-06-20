function displayScore(score) {
	document.getElementById("pointsSpan").innerText = score;
}

function handleSubmit(evt) {
	const name = evt.target.name.value;
	const score = evt.target.score.value;
	localStorage.removeItem("gemgrabber.score");
	let highScoresJson = localStorage.getItem("gemgrabber.highscores") || "[]";
	let highScoresList = JSON.parse(highScoresJson);
	highScoresList.push({name, score});
	highScoresList.sort((a, b) => b.score - a.score);
	localStorage.setItem("gemgrabber.highscores", JSON.stringify(highScoresList));
	evt.preventDefault();
	top.location.href = "/p5/GemGrabber/HighScores.html";
}

function displayHighScoreEntry(score) {
	if (!score) {
		return;
	}
	const highScoreContainer = document.getElementById("highScore");
	const highScoreHeader = document.createElement("h2");
	const highScoreForm = document.createElement("form");
	const nameLabel = document.createElement("label");
	const nameInput = document.createElement("input");
	const scoreInput = document.createElement("input");
	const submitButton = document.createElement("button");
	highScoreHeader.innerText = "You got a high score!";
	nameLabel.innerText = "Name:";
	nameInput.name = "name";
	highScoreContainer.appendChild(highScoreHeader);
	highScoreContainer.appendChild(highScoreForm);
	highScoreForm.appendChild(nameLabel);
	nameLabel.appendChild(nameInput);
	scoreInput.value = score;
	scoreInput.type = "hidden";
	scoreInput.name = "score";
	highScoreForm.appendChild(scoreInput);
	submitButton.type = "submit";
	submitButton.innerText = "Submit";
	highScoreForm.appendChild(submitButton);
	highScoreForm.addEventListener("submit", handleSubmit);
}

function setupGameOver() {
	const score = localStorage.getItem("gemgrabber.score");
	displayScore(score);
	let highScoresJson = localStorage.getItem("gemgrabber.highscores") || "[]";
	let highScoresList = JSON.parse(highScoresJson);
	if (highScoresList.length < 10 || score > highScoresList[highScoresList.length - 1].score) {
		displayHighScoreEntry(score);
	}
}
