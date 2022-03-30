function createCard(imageUrl, thumbnailUrl) {
    let cardLink = document.createElement("a");
    let cardDiv = document.createElement("div");
    let cardImg = document.createElement("img");
    let cardDescription = document.createElement("div");
    cardLink.href = `viewer.html?pano=https://raw.githubusercontent.com/RobbieNesmith/Panoramas/main/${imageUrl}`;
    cardDiv.className = "displayPane";
    cardImg.className = "displayImage";
    cardImg.src = `https://raw.githubusercontent.com/RobbieNesmith/Panoramas/main/${thumbnailUrl}`;
    cardDescription.innerText = imageUrl;
    cardLink.appendChild(cardDiv);
    cardDiv.appendChild(cardImg);
    cardDiv.appendChild(cardDescription);
    return cardLink;
}

async function getPanoInfo() {
    const panoInfo = {};
    const repoInfo = await fetch("https://api.github.com/repos/RobbieNesmith/Panoramas/git/trees/main?recursive=1");
    const repoInfoJson = await repoInfo.json();
    for (let node of repoInfoJson.tree) {
        if (node.type === "blob") {
            let pathSplit = node.path.split("/");
            if (pathSplit.length == 2) {
                if (!(pathSplit[0] in panoInfo)) {
                    panoInfo[pathSplit[0]] = { name: pathSplit[0], panos: [] };
                }
                panoInfo[pathSplit[0]]["panos"].push({
                    imageUrl: node.path,
                    thumbnailUrl: pathSplit.join("/thumbnails/")
                });
            }
        }
    }
    const panoContainer = document.getElementById("panos");
    for (let category of Object.keys(panoInfo)) {
        const categoryHeader = document.createElement("h2");
        const categoryPreview = document.createElement("div");
        categoryHeader.innerText = panoInfo[category]["name"];
        categoryPreview.className = "preview";
        panoContainer.appendChild(categoryHeader);
        for (let pano of panoInfo[category].panos) {
            categoryPreview.appendChild(createCard(pano.imageUrl, pano.thumbnailUrl));
        }
        panoContainer.appendChild(categoryPreview);
    }
}