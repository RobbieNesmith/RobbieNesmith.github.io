var boardSize = 16;
var address = "192.168.0.13";
var port = 80;

function setServer() {
  address = document.getElementById("address").value;
  port = document.getElementById("port").value;
  serverInfo = document.getElementById("serverinfo");
  serverInfo.innerText = address + ":" + port;
}

function setupPage() {
  placeHolder = document.getElementById("placeholder");
  serverInfo = document.getElementById("serverinfo");
  serverInfo.innerText = address + ":" + port;
  for (i = 0; i < boardSize * boardSize; i++) {
    e = document.createElement("div");
    e.setAttribute("onclick", "setColor(this,"
      + Math.floor(i / boardSize) + "," + i % boardSize + ")");
    e.className = "pixel";
    placeHolder.appendChild(e);
  }
  getAll();
}

function setColor(e, row, col) {
  color = document.getElementById("colorselector").value;
  red = parseInt(color.substring(1,3),16);
  green = parseInt(color.substring(3,5),16);
  blue = parseInt(color.substring(5,7),16);
  queryString = "http://" + address + ":" + port
    + "/put?row=" + row + "&col=" +  col
    + "&red=" + red + "&green=" + green + "&blue=" + blue;
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      e.style.backgroundColor = color;
    }
  };
  xhr.open("GET", queryString, true);
  xhr.send();
}

function getAll() {
  queryString = "http://" + address + ":" + port + "/getall";
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      result = JSON.parse(this.responseText);
      placeHolder = document.getElementById("placeholder");
      for (i = 0; i < boardSize * boardSize; i++) {
        color = "rgb(" + result[3 * i] + ","
                       + result[3 * i + 1] + ","
                       + result[3 * i + 2] + ")";
        placeHolder.children[i].style.backgroundColor = color;
      }
    }
  };
  xhr.open("GET", queryString, true);
  xhr.send();
}
