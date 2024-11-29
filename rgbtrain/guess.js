function showResults() {
  const usp = new URLSearchParams(window.location.search);
  const cspace = usp.get("cspace");

  const cspaceObj = spaces[cspace];

  const correct = JSON.parse(usp.get("correct"));
  const correctDisplay = cspaceObj.getDisplay(correct);
  const correctCss = cspaceObj.getCss(correct);
  const guess = cspaceObj.guessToObj(usp);
  const guessDisplay = cspaceObj.getDisplay(guess);
  const guessCss = cspaceObj.getCss(guess);

  console.log(correct);
  console.log(guess);
  
  // add result to local storage
  const guessListString = window.localStorage.getItem("guessList");
  let guessList = [];
  if (guessListString) {
    guessList = JSON.parse(guessListString);
  }
  guessList.push({cspace, correct, guess});
  window.localStorage.setItem("guessList", JSON.stringify(guessList));

  const colorToGuess = document.getElementById("colorToGuess");
  colorToGuess.style.backgroundColor = correctCss;
  const correctAnswer = document.getElementById("correctAnswer");
  correctAnswer.innerText = correctDisplay;
  const yourGuess = document.getElementById("yourGuess");
  yourGuess.style.backgroundColor = guessCss;
  const yourAnswer = document.getElementById("yourAnswer");
  yourAnswer.innerText = guessDisplay;
  const playAgain = document.getElementById("playAgain");
  playAgain.href = `play.html?cspace=${cspace}`
}