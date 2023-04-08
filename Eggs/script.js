const eggColors = ["#ffffff00", "#ffffff", "#9fb3fc", "#fc9fb3", "#b3fc9f", "#f3fc9f", "#9ff3fc", "#fc9ff3"];

let layers = [1, 0, 0, 0];

function incrementLayer(layer) {
  layers[layer] = (layers[layer] + 1) % eggColors.length;
  if (layers[layer] === 0 && layer === 0) {
    layers[layer] = 1;
  }
  document.getElementById(`eggPath${layer}`).style.fill = eggColors[layers[layer]];
}

function decrementLayer(layer) {
  layers[layer] = (layers[layer] - 1 + eggColors.length) % eggColors.length;
  if (layers[layer] === 0 && layer === 0) {
    layers[layer] = eggColors.length - 1;
  }
  document.getElementById(`eggPath${layer}`).style.fill = eggColors[layers[layer]];
}

function loadEgg() {
  const usp = new URLSearchParams(top.location.search);
  console.log(usp);
  const a = parseInt(usp.get("a") || "1") || 1;
  const b = parseInt(usp.get("b") || "0") || 0;
  const c = parseInt(usp.get("c") || "0") || 0;
  const d = parseInt(usp.get("d") || "0") || 0;
  console.log({ a, b, c, d });
  layers = [a, b, c, d];
  for (let layer = 0; layer < layers.length; layer++) {
    document.getElementById(`eggPath${layer}`).style.fill = eggColors[layers[layer]];
  }
}


// yoink
// https://stackoverflow.com/questions/60241398/how-to-download-and-svg-element-as-an-svg-file
function downloadSVGasTextFile() {
  const base64doc = btoa(document.getElementById("eggSvg").outerHTML);
  const a = document.createElement("a");
  const e = new MouseEvent("click");

  a.download = `Egg${layers.join("")}.svg`;
  a.href = `data:text/html;base64,${base64doc}`;
  a.dispatchEvent(e);
  let downloadButton = document.getElementById("downloadButton");
  downloadButton.innerText = "Downloading!";
  downloadButton.disabled = true;
  setTimeout(resetDownloadButton, 2000);
}

function resetDownloadButton() {
  let downloadButton = document.getElementById("downloadButton");
  downloadButton.innerText = "Download your Egg!";
  downloadButton.disabled = false;
}

function copyEggShareLink() {
  navigator.clipboard.writeText(`${top.location.href.split("?")[0]}?a=${layers[0]}&b=${layers[1]}&c=${layers[2]}&d=${layers[3]}`);
  let copyButton = document.getElementById("copyButton");
  copyButton.innerText = "Copied!";
  copyButton.disabled = true;
  setTimeout(resetCopyButton, 2000);
}

function resetCopyButton() {
  let copyButton = document.getElementById("copyButton");
  copyButton.innerText = "Copy Egg sharing link!";
  copyButton.disabled = false;
}