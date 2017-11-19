var tileNum = 1;
var rcTile = 0;
var isDraggingWs = false;
var isDraggingRc = false;

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
    getAtCoords(el, x, y);
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