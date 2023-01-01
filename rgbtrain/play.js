function startRound() {
  const usp = new URLSearchParams(window.location.search);
  cspace = "rgb";
  if (usp.has("cspace")) {
    cspace = usp.get("cspace");
  }

  if (!cspace in spaces) {
    cspace = "rgb";
  }

  const cspaceObj = spaces[cspace];

  const colorValue = Object.fromEntries(cspaceObj.channels.map(channel => {
    return [channel.name, Math.floor(Math.random() * (channel.max - channel.min) + channel.min)];
  }));

  const colorToGuess = document.getElementById("colorToGuess");
  colorToGuess.style.backgroundColor = cspaceObj.getCss(colorValue);
  const guessHolder = document.getElementById("guessHolder");
  guessHolder.appendChild(cspaceObj.getInput());

  const behindTheScenes = document.getElementById("behindTheScenes");
  const spaceInput = document.createElement("input");
  const correctInput = document.createElement("input");
  spaceInput.name = "cspace";
  spaceInput.value = cspace;
  spaceInput.type = "hidden";
  correctInput.name = "correct";
  correctInput.value = JSON.stringify(colorValue);
  correctInput.type = "hidden";
  behindTheScenes.appendChild(spaceInput);
  behindTheScenes.appendChild(correctInput);
}