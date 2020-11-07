var settingHeaderHeight = 32;
var settingTransitionWidth = 32;
var settingSideWidth = 4;
var settingFooterHeight = 4;

var origMouseX;
var origMouseY;
var origWindowX;
var origWindowY;
var origWidth;
var origHeight;

var windowsList = [
    {
        id: 0,
        title: "Initial Window",
        x: 600,
        y: 100,
        w: 320,
        h: 192,
        z: 1
    },
    {
        id: 1,
        title: "Hello, World!",
        x: 500,
        y: 200,
        w: 400,
        h: 500,
        z: 2
    }
];

var newWindow;
var grabbedElement;
var grabbedId;
var mouseDown = false;
var moveWin = false;
var resizeB = false;
var resizeL = false;
var resizeR = false;

function createElementWithData(tagName, attrs, style) {
    el = document.createElement(tagName);
    var attrKeys = Object.keys(attrs);
    var styleKeys = Object.keys(style);
    for (var i = 0; i < attrKeys.length; i++) {
        el[attrKeys[i]] = attrs[attrKeys[i]];
    }
    for (var i = 0; i < styleKeys.length; i++) {
        el.style[styleKeys[i]] = style[styleKeys[i]];
    }
    return el;
}

function setup() {
    initSettings();
    createWindowsFromSource(windowsList);
    updateGridSettings();
    loadGridImagesPreset("fancy");
    updateGridImages();
}

function initSettings() {
    document.getElementById("headerHeight").value = settingHeaderHeight;
    document.getElementById("transitionWidth").value = settingTransitionWidth;
    document.getElementById("sideWidth").value = settingSideWidth;
    document.getElementById("footerHeight").value = settingFooterHeight;
}

function updateGridSettingsFromForm() {
    settingHeaderHeight = document.getElementById("headerHeight").value;
    settingTransitionWidth = document.getElementById("transitionWidth").value;
    settingSideWidth = document.getElementById("sideWidth").value;
    settingFooterHeight = document.getElementById("footerHeight").value;
    updateGridSettings();
}

function updateGridSettings() {
    document.getElementById("gridSettings").innerText = ".windowContainer{grid-template-columns: " + 
        settingSideWidth + "px " +
        settingTransitionWidth  + "px " +
        "1fr " +
        settingTransitionWidth + "px " +
        "auto " +
        settingTransitionWidth + "px " +
        "1fr " +
        settingTransitionWidth + "px " +
        settingSideWidth + "px;" +
        "grid-template-rows: " +
        settingHeaderHeight + "px " +
        "1fr " +
        settingFooterHeight + "px;}";
}

function loadSettingsPreset(presetName) {
	fetch("windowDesignerSettings.json")
		.then(response => response.json())
		.then(json => {
			console.log(json);
			settingHeaderHeight = json[presetName]["headerHeight"];
			settingTransitionWidth = json[presetName]["transitionWidth"];
			settingSideWidth = json[presetName]["sideWidth"];
			settingFooterHeight = json[presetName]["footerHeight"];
			initSettings();
			updateGridSettings();
		});
}

function loadGridImagesPreset(presetName) {
    document.getElementById("headerLeftImage").style.backgroundImage = "url('img/" + presetName + "/htl.png')";
    document.getElementById("headerLeftTransitionImage").style.backgroundImage = "url('img/" + presetName +  "/htlt.png')";
    document.getElementById("headerExpanderImage").style.backgroundImage = "url('img/" + presetName + "/he.png')";
    document.getElementById("headerTitleTransitionLeftImage").style.backgroundImage = "url('img/" + presetName + "/httl.png')";
    document.getElementById("headerTitleImage").style.backgroundImage = "url('img/" + presetName + "/ht.png')";
    document.getElementById("headerTitleTransitionRightImage").style.backgroundImage = "url('img/" + presetName + "/httr.png')";
    document.getElementById("headerRightTransitionImage").style.backgroundImage = "url('img/" + presetName + "/htrt.png')";
    document.getElementById("headerRightImage").style.backgroundImage = "url('img/" + presetName + "/htr.png')";
    document.getElementById("leftSideImage").style.backgroundImage = "url('img/" + presetName + "/ls.png')";
    document.getElementById("rightSideImage").style.backgroundImage = "url('img/" + presetName + "/rs.png')";
    document.getElementById("footerLeftImage").style.backgroundImage = "url('img/" + presetName + "/fl.png')";
    document.getElementById("footerExpanderImage").style.backgroundImage = "url('img/" + presetName + "/fe.png')";
    document.getElementById("footerRightImage").style.backgroundImage = "url('img/" + presetName + "/fr.png')";
		updateGridImages();
}

function updateGridImages() {
    document.getElementById("gridImages").innerText = ".headerTopLeft { background-image: " + document.getElementById("headerLeftImage").style.backgroundImage + ";}" +
        ".headerTopLeftTransition { background-image: " + document.getElementById("headerLeftTransitionImage").style.backgroundImage + ";}" +
        ".headerExpander { background-image: " + document.getElementById("headerExpanderImage").style.backgroundImage + ";}" +
        ".headerTitleTransitionLeft { background-image: " + document.getElementById("headerTitleTransitionLeftImage").style.backgroundImage + ";}" +
        ".headerTitle { background-image: " + document.getElementById("headerTitleImage").style.backgroundImage + ";}" +
        ".headerTitleTransitionRight { background-image: " + document.getElementById("headerTitleTransitionRightImage").style.backgroundImage + ";}" +
        ".headerTopRightTransition { background-image: " + document.getElementById("headerRightTransitionImage").style.backgroundImage + ";}" +
        ".headerTopRight { background-image: " + document.getElementById("headerRightImage").style.backgroundImage + ";}" +
        ".leftSide { background-image: " + document.getElementById("leftSideImage").style.backgroundImage + ";}" +
        ".rightSide { background-image: " + document.getElementById("rightSideImage").style.backgroundImage + ";}" +
        ".footerLeft { background-image: " + document.getElementById("footerLeftImage").style.backgroundImage + ";}" +
        ".footerExpander { background-image: " + document.getElementById("footerExpanderImage").style.backgroundImage + ";}" +
        ".footerRight { background-image: " + document.getElementById("footerRightImage").style.backgroundImage + ";}";
}

function createWindowsFromSource(s) {
    for (var i = 0; i < s.length; i++) {
        var wContainer = createElementWithData(
            "div",
            {
                "className": "windowContainer",
            },
            {
                "left": windowsList[i].x + "px",
                "top": windowsList[i].y + "px",
                "width": windowsList[i].w + "px",
                "height": windowsList[i].h + "px",
                "zIndex": windowsList[i].z,
            }
        );
        
        var wHeaderLeft = createElementWithData("div", {"className": "headerTopLeft"}, {});
        var wHeaderTransitionLeft = createElementWithData("div", {"className": "headerTopLeftTransition"}, {});
        var wHeaderExpanderLeft = createElementWithData("div", {"className": "headerExpander"}, {});
        var wHeaderTitleTransitionLeft = createElementWithData("div", {"className": "headerTitleTransitionLeft"}, {});
        var wHeaderTitle = createElementWithData("div", {"className": "headerTitle"}, {});
        wHeaderTitle.innerText = windowsList[i].title;
        var wHeaderTitleTransitionRight = createElementWithData("div", {"className": "headerTitleTransitionRight"}, {});
        var wHeaderExpanderRight = createElementWithData("div", {"className": "headerExpander"}, {});
        var wHeaderTransitionRight = createElementWithData("div", {"className": "headerTopRightTransition"}, {});
        var wHeaderRight = createElementWithData("div", {"className": "headerTopRight"}, {});
        
        var wLeftSide = createElementWithData("div", {"className": "leftSide"}, {});
        var wContent = createElementWithData("div", {"className": "content"}, {});
        var wRightSide = createElementWithData("div", {"className": "rightSide"}, {});
        
        var wFooterLeft = createElementWithData("div", {"className": "footerLeft"}, {});
        var wFooterExpander = createElementWithData("div", {"className": "footerExpander"}, {});
        var wFooterRight = createElementWithData("div", {"className": "footerRight"}, {});
        
        wContainer.addEventListener("mousedown", function() { clickWindow(event.target) });
        wContainer.appendChild(wHeaderLeft);
        wContainer.appendChild(wHeaderTransitionLeft);
        wContainer.appendChild(wHeaderExpanderLeft);
        wContainer.appendChild(wHeaderTitleTransitionLeft);
        wContainer.appendChild(wHeaderTitle);
        wContainer.appendChild(wHeaderTitleTransitionRight);
        wContainer.appendChild(wHeaderExpanderRight);
        wContainer.appendChild(wHeaderTransitionRight);
        wContainer.appendChild(wHeaderRight);
        wContainer.appendChild(wLeftSide);
        wContainer.appendChild(wContent);
        wContainer.appendChild(wRightSide);
        wContainer.appendChild(wFooterLeft);
        wContainer.appendChild(wFooterExpander);
        wContainer.appendChild(wFooterRight);
        document.body.appendChild(wContainer);
    }
}

function clickWindow(e) {
		var wc = e.parentNode;
		while(wc.className != "windowContainer") {
			wc = wc.parentNode;
		}
		var oldZ = wc.style.zIndex;
		var z = 0;
		for (var w of document.querySelectorAll(".windowContainer")) {
			z++;
			if (w.style.zIndex > oldZ) {
				w.style.zIndex = w.style.zIndex - 1;
			}
		}
		wc.style.zIndex = z;
    if (e.className.includes("header")) {
        initMove(e);
    } else if (e.className === "leftSide") {
        initResizeL(e);
    } else if (e.className === "rightSide") {
        initResizeR(e);
    } else if (e.className === "footerLeft") {
        initResizeBL(e);
    } else if (e.className === "footerExpander") {
        initResizeB(e);
    } else if (e.className === "footerRight") {
        initResizeBR(e);
    }
}

function initMove(e) {
    setOrigin(e);
    moveWin = true;
}

function initResizeL(e) {
    setOrigin(e);
    resizeL = true;
}

function initResizeR(e) {
    setOrigin(e);
    resizeR = true;
}

function initResizeB(e) {
    setOrigin(e);
    resizeB = true;
}

function initResizeBL(e) {
    setOrigin(e);
    resizeB = true;
    resizeL = true;
}

function initResizeBR(e) {
    setOrigin(e);
    resizeB = true;
    resizeR = true;
}

function setOrigin(e) {
    grabbedElement = e.parentNode;
    //grabbedElement = document.getElementById("windowContainer-" + e.id.split("-")[1]);
    grabbedId = grabbedElement.dataset.id;
    origMouseX = event.pageX;
    origMouseY = event.pageY;
    origWindowX = grabbedElement.offsetLeft;
    origWindowY = grabbedElement.offsetTop;
    origWidth = grabbedElement.style.width;
    origWidth = parseInt(origWidth.substring(0, origWidth.length - 2));
    origHeight = grabbedElement.style.height;
    origHeight = parseInt(origHeight.substring(0, origHeight.length - 2));
    mouseDown = true;
    document.body.onmousemove = function(){moveWindow()};
}

function moveWindow() {
    if(mouseDown) {
            var x = origWindowX;
            var y = origWindowY;
            var w = origWidth;
            var h = origHeight;
        if (moveWin) {
            x += (event.pageX - origMouseX);
            y += (event.pageY - origMouseY);
            grabbedElement.style.left = x + "px";
            grabbedElement.style.top = y + "px";
        } else if (resizeL) {
            if (event.pageX - origWindowX <= origWidth - 320) {
                x += (event.pageX - origMouseX);
                w -= (event.pageX - origMouseX);
                grabbedElement.style.left = x + "px";
                grabbedElement.style.width = w + "px";
            }
        } else if (resizeR && event.pageX - origWindowX >= 320) {
            w += (event.pageX - origMouseX);
            grabbedElement.style.width = w + "px";
        }
        if (resizeB) {
            h += (event.pageY - origMouseY);
            grabbedElement.style.height = h + "px";
        }

        newWindow = {
            id: grabbedId,
            x: x,
            y: y,
            w: w,
            h: h,
            z: 1
        };
    }
}

function unGrab() {
    mouseDown = false;
    moveWin = false;
    resizeL = false;
    resizeR = false;
    resizeB = false;
    
    if (newWindow) {
        for (var i = 0; i < windowsList.length; i++) {
            if (windowsList[i].id == newWindow.id) {
                windowsList[i] = newWindow;
                newWindow = undefined;
            }
        }
        if (newWindow && newWindow.id) {
            windowsList.push(newWindow);
        }
    }
    
    document.body.onmousemove = 'none';
}

function dropHandler(evt, el) {
    evt.preventDefault();
    console.log(evt.dataTransfer.files);
    el.style.backgroundImage = "url(" + URL.createObjectURL(event.dataTransfer.files[0]) + ")";
    updateGridImages();
}

function dragOverHandler(evt) {
    evt.preventDefault();
}

function dragEndHandler(evt) {
    evt.preventDefault();
}