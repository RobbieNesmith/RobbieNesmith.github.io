function createCard(courseUrl, courseName, thumbnailUrl) {
  let cardLink = document.createElement("a");
  let cardDiv = document.createElement("div");
  let cardImg = document.createElement("img");
  let cardDescription = document.createElement("div");
  cardLink.href = `https://raw.githubusercontent.com/RobbieNesmith/CustomKart/main/${courseUrl}`;
  cardDiv.className = "displayPane";
  cardImg.className = "displayImage";
  cardImg.src = `https://raw.githubusercontent.com/RobbieNesmith/CustomKart/main/${thumbnailUrl}`;
  cardDescription.innerText = courseName;
  cardLink.appendChild(cardDiv);
  cardDiv.appendChild(cardImg);
  cardDiv.appendChild(cardDescription);
  return cardLink;
}

async function getKartInfo() {
  const kartInfo = {};
  const repoInfo = await fetch("https://api.github.com/repos/RobbieNesmith/CustomKart/git/trees/main?recursive=1");
  const repoInfoJson = await repoInfo.json();
  for (let node of repoInfoJson.tree) {
    if (node.type === "blob") {
      let pathSplit = node.path.split("/");
      if (pathSplit.length == 2) {
        if (!(pathSplit[0] in kartInfo)) {
          kartInfo[pathSplit[0]] = { name: pathSplit[0], courses: [] };
        }
        let courseName = pathSplit[1].split(".")[0];
        kartInfo[pathSplit[0]]["courses"].push({
          courseUrl: node.path,
          courseName,
          thumbnailUrl: `${pathSplit[0]}/thumbnails/${courseName}.png`,
        });
      }
    }
  }
  const courseContainer = document.getElementById("courses");
  for (let category of Object.keys(kartInfo)) {
    const categoryHeader = document.createElement("h2");
    const categoryPreview = document.createElement("div");
    categoryHeader.innerText = kartInfo[category]["name"];
    categoryPreview.className = "preview";
    courseContainer.appendChild(categoryHeader);
    for (let course of kartInfo[category].courses) {
      categoryPreview.appendChild(createCard(course.courseUrl, course.courseName, course.thumbnailUrl));
    }
    courseContainer.appendChild(categoryPreview);
  }
}