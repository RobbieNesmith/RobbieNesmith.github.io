var numImages = 9;
var curImage = 0;

function foobar(e)
{
  slide = document.getElementById("slide");
  switch (e.keyCode)
  {
    case 37:
      curImage--;
      break;
    case 39:
      curImage++;
      break;
  }
  if(curImage <= -1)
  {
    curImage += numImages;
  }
  if(curImage >= numImages)
  {
    curImage -= numImages;
  }
  slide.src = "img/" + curImage + ".jpg";
}

window.addEventListener("keydown", foobar, false);