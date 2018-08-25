var curImage = 0;
images = [];

var testImg = document.createElement("img");
testImg.src = "img/2.jpg";
images.push(testImg);

function handleKeys(e) {
  slide = document.getElementById("slide");
  document.getElementById("cons").innerText += e.keyCode + ", ";
  switch (e.keyCode) {
    //left
    case 37:  
      switchImage(-1);
      e.preventDefault();
      break;
    //up
    case 38:
      document.getElementById("filebutton").click();
      e.preventDefault();
      break;
    //right
    case 39:
      switchImage(1);
      e.preventDefault();
      break;
    //down
    case 40:
      removeCurrentImage();
      e.preventDefault();
      break;
  }
  if(curImage <= -1) {
    curImage += images.length;
  }
  if(curImage >= images.length) {
    curImage = 0;
  }
}

window.addEventListener("keydown", handleKeys, false);

function loadImage(input) {
  for (fnum = 0; fnum < input.files.length; fnum++) {
    file = input.files[fnum];
    fileReader = new FileReader();
    fileReader.onload = function() { addImageToList(this) };
    fileReader.readAsDataURL(file);
  }
}

function addImageToList(filereader) {
  image = document.createElement("img");
  image.src = filereader.result;
  images.push(image);
}

function switchImage(direction) {
  if (direction == 1) {
    slideHolder = document.getElementById("slideholder");
    images.push(slideHolder.children[0]);
    slideHolder.removeChild(slideHolder.children[0]);
    newImg = images.shift();
    slideHolder.appendChild(newImg);
  } else {
    slideHolder = document.getElementById("slideholder");
    images.unshift(slideHolder.children[0]);
    slideHolder.removeChild(slideHolder.children[0]);
    newImg = images.pop();
    slideHolder.appendChild(newImg);
  }
}

function removeCurrentImage() {
  if (images.length > 0) {
    slideHolder = document.getElementById("slideholder");
    slideHolder.removeChild(slideHolder.children[0]);
    newImg = images.pop();
    slideHolder.appendChild(newImg);
  }
}