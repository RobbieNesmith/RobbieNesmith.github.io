var origMouseX;
var origMouseY;
var origWindowX;
var origWindowY;
var origWidth;
var origHeight;

var grabbedElement;
var mouseDown = 0;

function setOrigin(e)
{
    origMouseX = event.pageX;
    origMouseY = event.pageY;
    origWindowX = e.parentNode.offsetLeft;
    origWindowY = e.parentNode.offsetTop;
    mouseDown = 1;
    grabbedElement = e;
    document.getElementById("bod").onmousemove = function(){moveWindow()};
}

function moveWindow()
{
    if(mouseDown)
    {
        grabbedElement.parentNode.style.left = origWindowX + (event.pageX - origMouseX) + "px";
        grabbedElement.parentNode.style.top = origWindowY + (event.pageY - origMouseY) + "px";
    }
}

function unGrab()
{
    document.getElementById("bod").onmousemove = 'none';
    mouseDown = 0;
}

function recolorIcon(e,color)
{
    var grandchildren = e.childNodes[0].childNodes;
    var i;
    for(i = 0; i < grandchildren.length; i++)
    {
        var gc = grandchildren[i];
        gc.style.backgroundColor=color;
    }
}

function closeWindow(e)
{
    e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);
}

function maxiWindow(e)
{
    var win = e.parentNode.parentNode;
    origWidth = win.offsetWidth;
    origHeight = win.offsetHeight;
    win.style.left = 0;
    win.style.top = 0;
    win.style.width = window.innerWidth;
    win.style.height = window.innerHeight;
}

function createWindow() {
    var win = document.createElement('div');
    var hb = document.createElement('div');
    var mn = document.createElement('button');
    var mx = document.createElement('button');
    var cl = document.createElement('button');
    var cbc = document.createElement('div');
    var cbi = document.createElement('div');
    var cbo = document.createElement('div');
    var mxi = document.createElement('div');
    var mni = document.createElement('div');
    win.className = 'window';
    win.onmousedown = function(){focusWindow(this)};
    hb.className = 'titlebar';
    hb.onmousedown = function(){setOrigin(this)};
    mn.className = 'tbbutt minibutt';
    mx.className = 'tbbutt maxibutt';
    mx.onclick = function(){maxiWindow(this)};
    cl.className = 'tbbutt closebutt';
    cl.onmouseover = function(){recolorIcon(this,'white')};
    cl.onmouseout = function(){recolorIcon(this,'black')};
    cl.onclick = function(){closeWindow(this)};
    cbc.className = 'cbicontainer';
    cbi.className = 'closebutticon';
    cbo.className = 'closebutticonother';
    mxi.className = 'maxibutticon';
    mni.className = 'minibutticon';
    cbc.appendChild(cbi);
    cbc.appendChild(cbo);
    cl.appendChild(cbc);
    hb.appendChild(cl);
    mx.appendChild(mxi);
    mn.appendChild(mni);
    hb.appendChild(mx);
    hb.appendChild(mn);
    win.appendChild(hb);
    return win;
}

function addNewWin()
{
    f = document.getElementById("bod");
    win = createWindow();
    f.appendChild(win);
    focusWindow(win);
}

function addBrowserWindow() {
    f = document.getElementById("bod");
    win = createWindow();
    content = document.createElement('iframe');
    sbholder = document.createElement('div');
    sbinput = document.createElement('input');
    sbsearch = document.createElement('button');
    sbholder.className = 'sbholder';
    sbinput.className = 'sbinput';
    sbsearch.className = 'sbsearch';
    sbsearch.innerHTML = 'GO';
    sbsearch.onclick = function(){loadPage(this)};
    content.src = "http://www.wikipedia.org";
    content.className = "browser";
    win.appendChild(sbholder);
    sbholder.appendChild(sbinput);
    sbholder.appendChild(sbsearch);
    win.appendChild(content);
    content.width = "100%";
    content.height = "100%";
    win.style.height = '240px';
    f.appendChild(win);
    focusWindow(win);
}

function loadPage(e) {
  e.parentElement.parentElement.getElementsByTagName('iframe')[0].src = e.parentElement.children[0].value;
}

function focusWindow(e)
{
    var wins = document.getElementById("bod").getElementsByClassName("window");
    var i;
    for(i = 0; i < wins.length; i++)
    {
        unfocusWindow(wins[i]);
    }
    e.className += " winactive";
    f = e.getElementsByClassName("titlebar")[0];
    f.className += " tbactive";
    e.style.zIndex = 1;
}

function unfocusWindow(e)
{
    e.className = e.className.replace( /(?:^|\s)winactive(?!\S)/g , '' );
    f = e.getElementsByClassName("titlebar")[0];
    f.className = f.className.replace( /(?:^|\s)tbactive(?!\S)/g , '' );
    e.style.zIndex = 0;
}