let serverName = "192.168.7.243";
let manualColor = "#000000";

function show(which) {
  const autoTab = document.getElementById("autotab");
  const manTab = document.getElementById("mantab");
  const setTab = document.getElementById("settab");
  const autoContent = document.getElementById("autocontent");
  const manContent = document.getElementById("mancontent");
  const setContent = document.getElementById("setcontent");
  if (which === "auto") {
    autoTab.className = "tab selected";
    manTab.className = "tab";
    setTab.className = "tab";
    autoContent.className = "tabcontent";
    manContent.className = "tabcontent hidden";
    setContent.className = "tabcontent hidden";
    fetch(`http://${serverName}/auto`);
  } else if (which === "manual") {
    autoTab.className = "tab";
    manTab.className = "tab selected";
    setTab.className = "tab";
    autoContent.className = "tabcontent hidden";
    manContent.className = "tabcontent";
    setContent.className = "tabcontent hidden";
    fetch(`http://${serverName}/manual`);
  } else {
    autoTab.className = "tab";
    manTab.className = "tab";
    setTab.className = "tab selected";
    autoContent.className = "tabcontent hidden";
    manContent.className = "tabcontent hidden";
    setContent.className = "tabcontent";
  }
}

function setManualColor() {
  const color = document.getElementById("colorinput").value;
  const red = parseInt(color.substring(1,3),16);
  const green = parseInt(color.substring(3,5),16);
  const blue = parseInt(color.substring(5,7),16);
  fetch(`http://${serverName}/manual?red=${red}&green=${green}&blue=${blue}`);
}

function setServerName() {
  serverName = document.getElementById("servernameinput").value;
}

function setup() {
  getManualColor();
  getCurrentState();
}

function getManualColor() {
  const colorInput = document.getElementById("colorinput");
  fetch(`http://${serverName}/getmanualcolor`)
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      console.log(`"${text}"`);
      manualColor = text;
      colorInput.value = text;
    });
}

function getCurrentState() {
  fetch(`http://${serverName}/getstate`)
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      console.log(`"${text}"`);
      if (text === "FADING" || text === "WAITING_FOR_FADE") {
        show("auto");
      } else {
        show("manual");
      }
    });
}