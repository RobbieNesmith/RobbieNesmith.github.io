//UP = 0;
//DOWN = 1;
//LEFT = 2;
//RIGHT = 3;
//L = 4;
//R = 5;
//SELECT = 6;
//START = 7;

var ccList = [
[[-1],"-Change lightsaber/blaster color-",""],
[[4,4,5,7],"Black lightsaber/blaster",""],
[[4,5,4,7],"Purple lightsaber/blaster",""],
[[4,5,5,7],"Red lightsaber/blaster",""],
[[5,4,5,7],"Green lightsaber/blaster",""],
[[5,5,4,7],"Yellow lightsaber/blaster",""],
[[5,5,5,7],"Blue lightsaber/blaster",""],
[[-1],"-Change the music-",""],
[[1,1,1,1,4,5,0,0,0,0],"Plays invasion theme",""],
[[0,0,0,0,4,5,1,1,1,1],"Plays main Star Wars theme",""],
[[0,0,0,0,5,4,1,1,1,1],"Plays different music",""],
[[1,1,1,1,5,4,0,0,0,0],"Plays more different music",""],
[[-1],"-Free gifts-",""],
[[3,1,3,0,3,4],"Enable hyper thrusters for a limited time",""],
[[0,3,1,2,0,3,1,2,6],"Gives 10 studs",""],
[[0,0,1,1,2,3,2,3,4,5,7],"Infinite stamina",""],
[[1,1,1,1,4,3,1,3,4],"Gives repair robot",""],
[[3,3,1,0,3,4],"Gives extra speed for a limited time",""],
[[1,1,2,3,1,4],"Gives extra damage for a limited time",""],
[[4,4,4,3,2,5,5,5],"Random studs dropped near you",""],
[[-1],"-Play as characters-",""],
[[7,7,2,1,1,1,1,3],"Play as Super Battle Droid",""],
[[7,7,0,1,0,1,0,1],"Play as black and silver R2-D2",""],
[[7,7,1,3,2,1,3,2],"Play as Battle Droid",""],
[[7,7,0,0,0,1,1,1],"Play as Pit Droid",""],
[[7,7,0,0,0,0,0,0],"Play as red and gold R2-D2",""],
[[7,7,1,1,1,1,1,1],"Play as General Grievous","Makes silver studs appear lime green.<br />Lightsaber color codes only change the color of the blue lightsaber and the highlight of the green one (which only changes with the black lightsaber color code)"],
[[7,7,1,2,3,1,2,3],"Play as blue Gungan","Enter this code followed by the code for Battle Droid, Super Battle Droid, or General Grievous without unpausing for odd pink and blue character palette."],
[[7,7,2,1,3,0,3,3],"Play as C-3PO",""],
[[7,7,2,0,3,1,3,0],"Play as a Droideka",""],
[[7,7,1,0,1,0,1,0],"Play as a Battle Droid on a hoversled",""],
[[7,7,3,1,3,1,2,0],"Play as a Geonosian",""],
[[7,7,0,0,0,0,0,0],"Play as R2-D2",""],
[[7,7,0,1,0,1,0,1],"Play as R4-P17",""],
[[-1],"-Others-",""],
[[1,0,5,4,5,5,5,1,1,0,1,1,6],"See all the cutscenes",""],
[[1,4,5,6],"Show a random Yoda quote",""],
[[4,5,4,1,0,5,5,3,2,1,3,3,6],"Sheep Mode",""],
[[4,4,4,2,2,5,5,3,3,1,1,1,6],"Strange colors",""]
];

function populateOptions()
{
    var sel = document.getElementById("ccChooser");
    for(i = 0; i < ccList.length; i++)
    {
        if(ccList[i][0][0] != -1)
        {
            opt = document.createElement("option");
            opt.value = i;
            opt.innerHTML = ccList[i][1];
            sel.appendChild(opt);
        }
        else
        {
            opt = document.createElement("optgroup");
            opt.label = ccList[i][1];
            sel.appendChild(opt);
        }
    }
}

function populateCheat(n)
{
    ccEl = document.getElementById("cc");
    factsEl = document.getElementById("facts");
    factsEl.innerHTML = ccList[n][2];
    while(ccEl.hasChildNodes())
    {
        ccEl.removeChild(ccEl.lastChild);
    }
    for(i = 0; i < ccList[n][0].length; i++)
    {
        cPart = document.createElement("div");
        switch(ccList[n][0][i])
        {
            case 0:
                cPart.className = "cheatpart chup";
                break;
            case 1:
                cPart.className = "cheatpart chdown";
                break;
            case 2:
                cPart.className = "cheatpart chleft";
                break;
            case 3:
                cPart.className = "cheatpart chright";
                break;
            case 4:
                cPart.className = "cheatpart chl";
                break;
            case 5:
                cPart.className = "cheatpart chr";
                break;
            case 6:
                cPart.className = "cheatpart chselect";
                break;
            case 7:
                cPart.className = "cheatpart chstart";
                break;
        }
        ccEl.appendChild(cPart);
    }
}