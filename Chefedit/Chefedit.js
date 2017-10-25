var tileNum = 0;

function draw() {
  ellipse(50,50,80,80);
}

function setup() {
  tp = document.getElementById('tilepalette');
  ws = document.getElementById('workspace');
  for (i = 0; i < 256; i++) {
    e = document.createElement('div');
    im = document.createElement('div');
    e.className = "tileholder";
    e.setAttribute('onclick', 'setSelected(this);');
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
  
  for (i = 0; i < 20 * 15; i++) {
    tl = document.createElement('div');
    tl.className = "tileimage";
    tl.setAttribute('onclick', 'setBG(this,tileNum);');
    ws.appendChild(tl);
  }
  tp.children[0].className = "tileholder selected";
}

function setSelected(el) {
  tp = document.getElementById('tilepalette');
  ch = tp.children;
  for (i = 0; i < ch.length; i++) {
    ch[i].className = "tileholder";
  }
  el.className = "tileholder selected";
  tileNum = 0;
  while (null != el.previousElementSibling) {
    tileNum++;
    el = el.previousElementSibling;
  }
}

function setBG(el,idx) {
  x = idx % 16;
  y = Math.floor(idx / 16);
  el.style.backgroundPosition = x * -32 + 'px ' + y * -32 + 'px';
  console.log(idx);
}