function setupHighScores() {
	localStorage.removeItem("gemgrabber.score");          
	let highScoresJson = localStorage.getItem("gemgrabber.highscores") || "[]";
	let highScoresList = JSON.parse(highScoresJson);
	const scoreOl = document.getElementById("scores");
	for (let score of highScoresList) {
		const li = document.createElement("li");
		li.innerText = `${score.score} - ${score.name}`;
		scoreOl.appendChild(li);
	}
}
