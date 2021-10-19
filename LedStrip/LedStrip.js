let serverName = "192.168.7.243";
let currentTime = "";
let manualColor = "#000000";
let clockConnected = false;
let recentColors = [];

function show(which) {
    const autoTab = document.getElementById("autotab");
    const manTab = document.getElementById("mantab");
    const sunsetTab = document.getElementById("sunsettab");
    const setTab = document.getElementById("settab");
    const autoContent = document.getElementById("autocontent");
    const manContent = document.getElementById("mancontent");
    const sunsetContent = document.getElementById("sunsetcontent");
    const setContent = document.getElementById("setcontent");
    if (which === "auto") {
        autoTab.className = "tab selected";
        manTab.className = "tab";
        sunsetTab.className = "tab";
        setTab.className = "tab";
        autoContent.className = "tabcontent";
        manContent.className = "tabcontent hidden";
        sunsetContent.className = "tabcontent hidden";
        setContent.className = "tabcontent hidden";
        fetch(`http://${serverName}/auto`);
    } else if (which === "manual") {
        autoTab.className = "tab";
        manTab.className = "tab selected";
        sunsetTab.className = "tab";
        setTab.className = "tab";
        autoContent.className = "tabcontent hidden";
        manContent.className = "tabcontent";
        sunsetContent.className = "tabcontent hidden";
        setContent.className = "tabcontent hidden";
        setManualColor();
    } else if (which === "sunset") {
        autoTab.className = "tab";
        manTab.className = "tab";
        sunsetTab.className = "tab selected";
        setTab.className = "tab";
        autoContent.className = "tabcontent hidden";
        manContent.className = "tabcontent hidden";
        sunsetContent.className = "tabcontent";
        setContent.className = "tabcontent hidden";
        fetch(`http://${serverName}/sunset`);
    } else {
        autoTab.className = "tab";
        manTab.className = "tab";
        sunsetTab.className = "tab";
        setTab.className = "tab selected";
        autoContent.className = "tabcontent hidden";
        manContent.className = "tabcontent hidden";
        sunsetContent.className = "tabcontent hidden";
        setContent.className = "tabcontent";
        getServerTime();
        startClockUpdates();
    }
}

function setManualColor() {
    const color = document.getElementById("colorinput").value;
    const red = parseInt(color.substring(1, 3), 16);
    const green = parseInt(color.substring(3, 5), 16);
    const blue = parseInt(color.substring(5, 7), 16);
    fetch(`http://${serverName}/manual?red=${red}&green=${green}&blue=${blue}`)
    .then(r => getRecentColors());
}

function setServerName() {
    serverName = document.getElementById("servernameinput").value;
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("serverName", serverName);
    }
    getCurrentState();
}

function setup() {
    getSavedServerAddress();
    getManualColor();
    getCurrentState();
    getServerTime();
    initFullCalendar();
    getRecentColors();
}

function updateCurrentTime(date) {
    currentTime = date;
}

function displayCurrentTime() {
    document.getElementById("currentTime").innerText = `${currentTime.toDateString()} ${currentTime.toTimeString().split(" ")[0]}`;
}

function getManualColor() {
    const colorInput = document.getElementById("colorinput");
    fetch(`http://${serverName}/getmanualcolor`)
    .then(function (response) {
        return response.text();
    })
    .then(function (text) {
        console.log(`"${text}"`);
        manualColor = text;
        colorInput.value = text;
    });
}

function getCurrentState() {
    let statusHolder = document.getElementById("clockstatus");
    fetch(`http://${serverName}/getstate`)
    .then(function (response) {
        return response.text();
    })
    .then(function (text) {
        console.log(`"${text}"`);
        if (text === "FADING" || text === "WAITING_FOR_FADE") {
            show("auto");
        } else {
            show("manual");
        }
        statusHolder.innerText = "Connected";
        statusHolder.style.color = "green";
        clockConnected = true;
    })
    .catch(function (response) {
        statusHolder.innerText = "Error connecting";
        statusHolder.style.color = "red";
        clockConnected = false;
        show("settings");
    });
}

function startClockUpdates() {
    if (clockConnected) {
        currentTime.setSeconds(currentTime.getSeconds() + 1);
        displayCurrentTime();
        setTimeout(startClockUpdates, 1000);
    }
}

function getServerTime() {
    fetch(`http://${serverName}/getdatetime`)
    .then(res => res.text())
    .then(text => {
        console.log(text);
        updateCurrentTime(new Date(text));
        displayCurrentTime();
    });
}

function setServerTime() {
    let time = document.getElementById("servertimeinput").value;
    let dateTime = new Date(time);
    console.log(dateTime);
    sendSetDateRequest(dateTime);
}

function getSavedServerAddress() {
    if (typeof(Storage) !== "undefined") {
        let savedServerAddress = localStorage.getItem("serverName");
        if (savedServerAddress != null) {
            serverName = savedServerAddress;
        }
    }
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

function getRecentColors() {
    fetch(`http://${serverName}/recent_colors`)
    .then(res => res.json())
    .then(json => {
        recentColors = json;
        displayRecentColors();
    });
}

function displayRecentColors() {
    let recentColorsHolder = document.getElementById("recentColorsHolder");
    while (recentColorsHolder.childElementCount > 0) {
        recentColorsHolder.removeChild(recentColorsHolder.children[recentColorsHolder.children.length - 1]);
    }

    for (let color of recentColors) {
        let e = document.createElement("button");
        e.className = "recentColor";
        e.style.backgroundColor = color;
        e.addEventListener("click", () => {
            let colorInput = document.getElementById("colorinput");
            colorInput.value = color;
            setManualColor();
        });
        recentColorsHolder.appendChild(e);
    }
}