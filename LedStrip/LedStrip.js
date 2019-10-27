let serverName = "192.168.7.243";
let currentTime = "";
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
    setManualColor();
  } else {
    autoTab.className = "tab";
    manTab.className = "tab";
    setTab.className = "tab selected";
    autoContent.className = "tabcontent hidden";
    manContent.className = "tabcontent hidden";
    setContent.className = "tabcontent";
    getServerTime();
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
  getServerTime();
  setServerAddress();
}

function updateCurrentTime(date) {
  currentTime = date;
  document.getElementById("currentTime").innerText = `${date.toDateString()} ${date.toTimeString().split(" ")[0]}`;
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

function getServerTime() {
  fetch(`http://${serverName}/getdatetime`)
    .then(res => res.text())
    .then(text => {
        console.log(text);
        updateCurrentTime(new Date(text));
    });
}

function setServerTime() {
  let time = document.getElementById("servertimeinput").value;
  let dateTime = new Date(time);
  console.log(dateTime);
  sendSetDateRequest(dateTime);
}

function setServerAddress() {
  document.getElementById("servernameinput").value = serverName;
}

function setServerTimeAuto() {
  let dateTime = new Date();
  sendSetDateRequest(dateTime);
}

function sendSetDateRequest(date) {
  fetch(`http://${serverName}/setdatetime?year=${date.getFullYear() - 2000}&month=${date.getMonth() + 1}&day=${date.getDate()}&hour=${date.getHours()}&minute=${date.getMinutes()}&second=${date.getSeconds()}`)
  .then((res) => getServerTime())
}