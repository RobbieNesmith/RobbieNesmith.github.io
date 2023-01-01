function setupOptions() {
  const spacesSelection = document.getElementById("spacesSelection");
  const spaceKeys = Object.keys(spaces);
  spaceKeys.forEach((s) => {
    const spaceContainer = document.createElement("li");
    const spaceLink = document.createElement("a");
    spaceLink.href = `play.html?cspace=${s}`;
    spaceLink.innerText = spaces[s].name;
    spaceContainer.appendChild(spaceLink);
    spacesSelection.appendChild(spaceContainer);
  });
}