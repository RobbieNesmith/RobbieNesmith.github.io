lin = "https://www.youtube.com/results?search_query="

function showbox()
{
  document.getElementById("box").style.top="25vh";
}

function hidebox()
{
  document.getElementById("box").style.top="150vh";
  document.getElementById("box2").style.top="25vh";
}

function changelink()
{
  inp = document.getElementById("in");
  l = document.getElementById("l")
  go = document.getElementById("go");
  if(inp.value == "")
  {
    l.href = "javascript:void(0)";
    go.style.backgroundColor = "grey";
    go.style.cursor="default";
  }
  else
  {
    l.href = lin + inp.value;
    go.style.backgroundColor = "green";
    go.style.cursor="pointer";
  }
}