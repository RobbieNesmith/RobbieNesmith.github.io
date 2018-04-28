var tileNum = 1;
var rcTile = 0;
var isDraggingWs = false;
var isDraggingRc = false;
var dropdowns = {"file": [{"text": "New", "function": "newFile();"},{"text": "Open", "function": "displayLoadDialog();"}, {"text": "Save", "function": "saveFile();"}], "view": [{"text": "Toggle FG/BG (L)", "function": "moveForeground();"}]};
var levelData;
var levelName;
var tmpLevelData;

function setup() {
  tp = document.getElementById('tilepalette');
  wsb = document.getElementById('workspace');
  wsf = document.getElementById('workspacefg');
  ed = document.getElementById('editing');
  ed.innerText = "Editing: Foreground:";
  ed.style.backgroundColor="red";
  for (i = 0; i < 256; i++) {
    e = document.createElement('div');
    im = document.createElement('div');
    e.className = "tileholder";
    e.setAttribute('onclick', 'setSelected(this, 0);');
    e.setAttribute('oncontextmenu', 'setSelected(this, 1)');
    im.className = "tileimage";
    setBG(im,i);
    e.appendChild(im);
    if(i < tileinfo.length) {
      label = document.createElement('div');
      label.className = "tiledescription";
      label.innerHTML = tileinfo[i];
      e.appendChild(label);
    }
    tp.appendChild(e);
  }
  setSelected(tp.children[0], 1);
  setSelected(tp.children[1], 0);
  
  for (i = 0; i < 20 * 15; i++) {
    tl = document.createElement('div');
    tl.className = "tileimage";
    wsb.appendChild(tl);
  }
  for (i = 0; i < 20 * 15; i++) {
    tl = document.createElement('div');
    tl.className = "tileimage";
    wsf.appendChild(tl);
  }
  wsb.setAttribute('onmousedown', 'wsMouseDown(this, event)');
  wsb.setAttribute('onmouseup', 'wsMouseUp()');
  wsb.setAttribute('onmouseleave', 'wsMouseUp()');
  wsb.setAttribute('onmousemove', 'wsMouseMove(this, event)');
  
  wsf.setAttribute('onmousedown', 'wsMouseDown(this, event)');
  wsf.setAttribute('onmouseup', 'wsMouseUp()');
  wsf.setAttribute('onmouseleave', 'wsMouseUp()');
  wsf.setAttribute('onmousemove', 'wsMouseMove(this, event)');
}

function wsMouseDown(el, ev) {
  if (ev.button == 0) {
    isDraggingWs = true;
    placeAtCoords(el, x, y, tileNum);
  } else if (ev.button == 1) {
    setSelectedByIndex(getAtCoords(el, x, y));
  } else if (ev.button == 2) {
    isDraggingRc = true;
    placeAtCoords(el, x, y, rcTile);
  }
}

function wsMouseUp() {
  isDraggingWs = false;
  isDraggingRc = false;
}

function wsMouseMove(el, ev) {
  x = ev.pageX - el.offsetLeft;
  y = ev.pageY - el.offsetTop;
  if (isDraggingWs) {
    placeAtCoords(el, x, y, tileNum);
  } else if (isDraggingRc) {
    placeAtCoords(el, x, y, rcTile);
  }
}

function placeAtCoords(el, x, y, tn) {
  if (x >= 0 && x < 640 && y >= 0 && y < 480) {
    idx = Math.floor(y / 32) * 20 + Math.floor(x / 32);
    setBG(el.children[idx],tn);
  }
}

function getAtCoords(el, x, y) {
  if (x >= 0 && x < 640 && y >= 0 && y < 480) {
    idx = Math.floor(y / 32) * 20 + Math.floor(x / 32);
    px = el.children[idx].style.backgroundPositionX;
    py = el.children[idx].style.backgroundPositionY;
    if (px == "") {
      px = 0;
    } else {
      px = -parseInt(px.substring(0, px.length - 2)) / 32;
    }
    if (py == "") {
      py = 0;
    } else {
      py = -parseInt(py.substring(0, py.length - 2)) / 32;
    }
    setSelectedByIndex(px + 16 * py, 0);
    return px + 16 * py;
  }
}

function setSelected(el, mb) {
  tp = document.getElementById('tilepalette');
  ch = tp.children;
  for (i = 0; i < ch.length; i++) {
    if (mb == 0) {
      ch[i].classList.remove("selected");
    } else if (mb == 1) {
      ch[i].classList.remove("rightsel");
    }
  }
  if (mb == 0) {
    el.className += " selected";
    tileNum = 0;
  } else if (mb == 1) {
    el.className += " rightsel";
    rcTile = 0;
  }
  while (null != el.previousElementSibling) {
    if (mb == 0) {
      tileNum++;
    } else {
      rcTile++;
    }
    el = el.previousElementSibling;
  }
}

function setSelectedByIndex(index, mb) {
  tp = document.getElementById('tilepalette');
  setSelected(tp.children[index], mb)
}

function setBG(el,idx) {
  x = idx % 16;
  y = Math.floor(idx / 16);
  el.style.backgroundPosition = x * -32 + 'px ' + y * -32 + 'px';
}

function getChar (event){
  var keyCode = ('which' in event) ? event.which : event.keyCode;
  if (keyCode == 108 || keyCode == 76) {
    moveForeground();
  }
}

function moveForeground() {
  fg = document.getElementById("workspacefg");
  if (fg.style.marginTop == "") {
    fg.style.marginTop = "-1000%";
    ed = document.getElementById('editing');
    ed.innerText = "Editing: Background:";
    ed.style.backgroundColor="green";
  } else {
    fg.style.marginTop = "";
    ed = document.getElementById('editing');
    ed.innerText = "Editing: Foreground:";
    ed.style.backgroundColor="red";
  }
}

function createDropdown(el, ddname) {
  ddm = document.createElement('div');
  ddm.className = 'toolbardropdown';
  ddm.setAttribute('onmouseleave', 'selfDestruct(this);');
  items = dropdowns[ddname];
  for (i = 0; i < items.length; i++) {
    ddi = document.createElement('div');
    ddi.className = 'dropdownitem';
    ddi.innerText = items[i]['text'];
    ddi.setAttribute('onclick',items[i]['function']);
    ddm.appendChild(ddi);
  }
  el.appendChild(ddm);
}

function selfDestruct(e) {
  e.parentNode.removeChild(e);
}

function displayLoadDialog() {
  var grayout = document.createElement('div');
  var loadDialogContainer = document.createElement('div');
  var dragDropTarget = document.createElement('input');
  var loadButton = document.createElement('button');
  dragDropTarget.type = "file";
  dragDropTarget.id = "dragDropTarget";
  dragDropTarget.width = "90%";
  dragDropTarget.setAttribute('onchange', 'readFile()');
  loadButton.id = "loadbutton";
  loadButton.innerText = "Load File";
  loadButton.disabled = true;
  loadButton.setAttribute('onclick', 'loadFileToEditor()');
  grayout.id = 'grayout';
  grayout.setAttribute('onclick', 'closeLoadDialog(event)');
  loadDialogContainer.id = "loadDialogContainer";
  loadDialogContainer.setAttribute('onclick', 'blockEventPropagation(event);');
  loadDialogContainer.appendChild(dragDropTarget);
  loadDialogContainer.appendChild(document.createElement('br'));
  loadDialogContainer.appendChild(loadButton);
  grayout.appendChild(loadDialogContainer);
  document.body.appendChild(grayout);
}

function closeLoadDialog(event) {
  greyout = document.getElementById('grayout');;
  document.body.removeChild(greyout);
}

function blockEventPropagation(event) {
  event.stopPropagation();
}

function readFile() {
  console.log("reading file");
  theFile = document.getElementById('dragDropTarget').files[0];
  levelName = theFile.name;
  var reader = new FileReader();
  reader.onloadend = function(event) {
    if (event.target.readyState == FileReader.DONE) {
      tmpLevelData = event.target.result;
      document.getElementById('loadbutton').disabled = false;
    }
  }
  reader.readAsBinaryString(theFile);
}

function loadFileToEditor() {
  levelData = tmpLevelData;
  tmpLevelData = "";
  closeLoadDialog();
  var bgoffset = 88;
  var fgoffset = 756;
  var bg = document.getElementById('workspace');
  var fg = document.getElementById('workspacefg');
  for (var i = 0; i < 20 * 15; i++) {
    var x = (i % 20) * 32;
    var y = (i / 20) * 32;
    var tile = levelData.charCodeAt(bgoffset + i * 2);
    placeAtCoords(bg, x, y, tile);
  }
  for (var i = 0; i < 20 * 15; i++) {
    var x = (i % 20) * 32;
    var y = (i / 20) * 32;
    var tile = levelData.charCodeAt(fgoffset + i * 2);
    placeAtCoords(fg, x, y, tile);
  }
}

function newFile() {
  levelData = "";
  var bg = document.getElementById('workspace');
  var fg = document.getElementById('workspacefg');
  for (var i = 0; i < 20 * 15; i++) {
    var x = (i % 20) * 32;
    var y = (i / 20) * 32;
    placeAtCoords(bg, x, y, 0);
  }
  for (var i = 0; i < 20 * 15; i++) {
    var x = (i % 20) * 32;
    var y = (i / 20) * 32;
    placeAtCoords(fg, x, y, 0);
  }
}

function saveFile() {
  var bgoffset = 88;
  var fgoffset = 756;
  var bg = document.getElementById('workspace');
  var fg = document.getElementById('workspacefg');
  
  var firstChunk = levelData.substr(0, bgoffset);
  var secondChunk = levelData.substr(688, 68);
  var thirdChunk = levelData.substr(1356, levelData.length);
  var bgData = "";
  var fgData = "";
  for (var i = 0; i < 20 * 15; i++) {
    var x = (i % 20) * 32;
    var y = (i / 20) * 32;
    var tile = levelData.charCodeAt(bgoffset + i * 2);
    bgData += String.fromCharCode(getAtCoords(bg, x, y, tile));
    bgData += String.fromCharCode(0);
  }
  for (var i = 0; i < 20 * 15; i++) {
    var x = (i % 20) * 32;
    var y = (i / 20) * 32;
    var tile = levelData.charCodeAt(fgoffset + i * 2);
    fgData += String.fromCharCode(getAtCoords(fg, x, y, tile));
    fgData += String.fromCharCode(0);
  }
  levelData = firstChunk + bgData + secondChunk + fgData + thirdChunk;
  var outfile = "";
  for (var i = 0; i < levelData.length; i++) {
    var outChar = levelData.charCodeAt(i).toString(16);
    if (outChar.length == 1) {
      outfile += "0";
    }
    outfile += outChar;
  }
  
  var dlLink = document.createElement('a');
  dlLink.href = "data:text/plain," + outfile;
  dlLink.style.display = "none";
  dlLink.download = levelName;
  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
}