var tileNum = 1;
var rcTile = 0;
var isDraggingWs = false;
var isDraggingRc = false;
var dropdowns = {"file": [{"text": "New", "function": "newFile();"},{"text": "Open", "function": "displayLoadDialog();"}, {"text": "Save", "function": "saveFile();"}], "view": [{"text": "Toggle FG/BG (L)", "function": "moveForeground();"}]};
var levelData;
var levelName;
var tmpLevelData;
var layer = 1; // 0 = background 1 = foreground
var tileGridFG;
var tileGridBG;
var mobList;

function setup() {
  tp = document.getElementById('tilepalette');
  wsb = document.getElementById('workspace');
  wsf = document.getElementById('workspacefg');
  ed = document.getElementById('editing');
  ed.innerText = "Editing: Foreground:";
  ed.style.backgroundColor="red";
  for (i = 0; i < 340; i++) {
    e = document.createElement('div');
    im = document.createElement('div');
    e.className = "tileholder";
    e.setAttribute('onclick', 'setSelectedByIndex(' + i + ', 0);');
    e.setAttribute('oncontextmenu', 'setSelectedByIndex(' + i + ', 1)');
    im.className = "tileimage";
    setBG(im,i);
    e.appendChild(im);
    if(i < tileinfo.length) {
      label = document.createElement('div');
      label.className = "tiledescription";
      label.innerText = "(" + i + "): " + tileinfo[i];
      e.appendChild(label);
    } else {
      label = document.createElement('div');
      label.className = "tiledescription";
      label.innerText = "(" + i + ")";
      e.appendChild(label);
    }
    tp.appendChild(e);
  }
  setSelectedByIndex(0, tileNum);
  setSelectedByIndex(1, rcTile);
  
  tileGridFG = [];
  tileGridBG = [];
  
  for (i = 0; i < 20 * 15; i++) {
    tl = document.createElement('div');
    tl.className = "tileimage";
    wsb.appendChild(tl);
    tileGridFG.push(0);
    tileGridBG.push(0);
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
    placeAtIndex(layer, coordsToIndex(x, y), tileNum);
  } else if (ev.button == 1) {
    setSelectedByIndex(getAtIndex(layer, coordsToIndex(x, y)), 0);
  } else if (ev.button == 2) {
    isDraggingRc = true;
    placeAtIndex(layer, coordsToIndex(x, y), rcTile);
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
    placeAtIndex(layer, coordsToIndex(x, y), tileNum);
  } else if (isDraggingRc) {
    placeAtIndex(layer, coordsToIndex(x, y), rcTile);
  }
}

function coordsToIndex(x, y) {
  if (x >= 0 && x < 640 && y >= 0 && y < 480) {
    return Math.floor(y / 32) * 20 + Math.floor(x / 32);
  } else {
    return -1;
  }
}

function placeAtIndex(layer, idx, tn) {
  if (idx >= 0 && idx < 20 * 15) {
    if (layer === 1) {
      tileGridFG[idx] = tn;
      el = document.getElementById("workspacefg");
      setBG(el.children[idx], tn);
    } else {
      tileGridBG[idx] = tn;
      el = document.getElementById("workspace");
      setBG(el.children[idx], tn);
    }
  }
}

function getAtIndex(layer, idx) {
  if (idx >= 0 && idx < 20 * 15) {
    if (layer === 1) {
      return tileGridFG[idx];
    } else {
      return tileGridBG[idx];
    }
  }
}

function setSelectedByIndex(index, mb) {
  if (mb == 0) {
    tileNum = index;
  } else {
    rcTile = index;
  }
  tp = document.getElementById('tilepalette');
  ch = tp.children;
  el = ch[index];
  for (i = 0; i < ch.length; i++) {
    if (mb == 0) {
      ch[i].classList.remove("selected");
    } else if (mb == 1) {
      ch[i].classList.remove("rightsel");
    }
  }
  if (mb == 0) {
    el.className += " selected";
  } else if (mb == 1) {
    el.className += " rightsel";
  }
}

function setBG(el, idx) {
  x = idx % 16;
  y = Math.floor(idx / 16);
  el.style.backgroundPosition = x * -32 + 'px ' + y * -32 + 'px';
}

function getChar (event){
  var keyCode = ('which' in event) ? event.which : event.keyCode;
  // L key switches layer
  if (keyCode == 108 || keyCode == 76) {
    moveForeground();
  }
  
}

function moveForeground() {
  fg = document.getElementById("workspacefg");
  ed = document.getElementById('editing');
  if (layer === 1) {
    layer = 0;
    fg.style.opacity = 0;
    ed.innerText = "Editing: Background:";
    ed.style.backgroundColor="green";
  } else {
    layer = 1;
    fg.style.opacity = 1;
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
  var numMobsOffset = 1360;
  var bg = document.getElementById('workspace');
  var fg = document.getElementById('workspacefg');
  for (var i = 0; i < 20 * 15; i++) {
    var tile = levelData.charCodeAt(bgoffset + i * 2);
	tile += levelData.charCodeAt((bgoffset + i * 2 + 1)) * 256;
    placeAtIndex(0, i, tile);
  }
  for (var i = 0; i < 20 * 15; i++) {
    var tile = levelData.charCodeAt(fgoffset + i * 2);
	tile += levelData.charCodeAt((fgoffset + i * 2 + 1)) * 256;
    placeAtIndex(1, i, tile);
  }
  var numMobs = levelData.charCodeAt(numMobsOffset);
  console.log("Loading " + numMobs + " mobs.");
  var mobInfo = document.getElementById('mobinfo');
  for (var i = mobInfo.children.length - 1; i >= 0; i--) {
    mobInfo.removeChild(mobInfo.children[i]);
  }
  var mobDelim = String.fromCharCode(255);
  mobDelim += mobDelim;
  mobDelim += mobDelim;
  mobDelim += mobDelim;
  var mobArray = levelData.substr(numMobsOffset, levelData.length).split(mobDelim);
  for (var i = 0; i < numMobs; i++) {
    var mobHolder = document.createElement('div');
    var mobTitle = document.createElement('span');
    var mobData = document.createElement('textarea');
    mobHolder.className = "mobholder";
    mobTitle.innerText = "A mob";
    console.log(parseMob(mobArray[i], i === 0));
    for (var j = 0; j < mobArray[i].length; j++) {
      var temp = mobArray[i].charCodeAt(j).toString(16);
      if (temp.length === 1) {
        temp = "0" + temp;
      }
      mobData.value += temp;
    }
    mobData.style.width = "100%";
    mobData.style.height = "50px";
    mobData.style.resize = "vertical";
    mobHolder.appendChild(mobTitle);
    mobHolder.appendChild(mobData);
    mobInfo.appendChild(mobHolder);
  }
}

function newFile() {
  levelData = "";
  var bg = document.getElementById('workspace');
  var fg = document.getElementById('workspacefg');
  for (var i = 0; i < 20 * 15; i++) {
    placeAtIndex(0, i, 0);
    placeAtIndex(1, i, 0);
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
    var bgTile = getAtIndex(0, i);
	var fgTile = getAtIndex(1, i);
    bgData += String.fromCharCode(bgTile & 255);
    bgData += String.fromCharCode(bgTile >> 8);
    fgData += String.fromCharCode(fgTile & 255);
	fgData += String.fromCharCode(fgTile >> 8);
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

function parseMob(mobstr, isFirstMob) {
  function readFourBytes(theString, thePos) {
    var result = theString.charCodeAt(thePos);
    result *= 256;
    result += theString.charCodeAt(thePos + 1);
    result *= 256;
    result += theString.charCodeAt(thePos + 2);
    result *= 256;
    result += theString.charCodeAt(thePos + 3);
    return result;
  }
  
  // parse mob code
  
  var pointer = 0;
  var extraDataFlag;
  if (isFirstMob) {
    extraDataFlag = 0;
  } else {
    extraDataFlag = mobstr.charCodeAt(pointer);
  }
  var extraData;
  pointer += 4;
  if (extraDataFlag == 0x11) {
    extraData = mobstr.substr(pointer, 8);
    pointer += 8;
  } else if (extraDataFlag == 0x10) {
    extraData = mobstr.substr(pointer, 4);
    pointer += 4;
  } else if (extraDataFlag == 0x01) {
    extraData = mobstr.substr(pointer, 4);
    pointer += 4;
  }
  var coordinates = [];
  coordinates.push([readFourBytes(mobstr, pointer),readFourBytes(mobstr, pointer + 4)]);
  pointer += 8;
  var isFlipped = readFourBytes(mobstr, pointer);
  pointer += 4;
  var name = "";
  var curChar = "";
  while (curChar != String.fromCharCode(0)) {
    name += curChar;
    curChar = mobstr.charAt(pointer);
    pointer ++;
  }
  var numCoords = mobstr.charCodeAt(pointer);
  pointer += 4;
  for (var i = 0; i < numCoords; i++) {
    coordinates.push([readFourBytes(mobstr, pointer),readFourBytes(mobstr, pointer + 4)]);
    pointer += 8;
  }
  
  var mobData = {};
  mobData.extraDataFlag = extraDataFlag;
  mobData.extraData = extraData;
  mobData.isFlipped = isFlipped;
  mobData.numCoords = numCoords;
  mobData.coordinates = coordinates;
  mobData.name = name;
  return mobData;
}

function mobToString(mobData) {
  
}