function showAbout() {
  const usp = new URLSearchParams(window.location.search);
  cspace = "rgb";
  if (usp.has("cspace")) {
    cspace = usp.get("cspace");
  }

  if (!cspace in spaces) {
    cspace = "rgb";
  }

  const cspaceObj = spaces[cspace];

  const colorSpaceTitle = document.getElementById("cstitle");
  const channelHolder = document.getElementById("channelHolder");

  colorSpaceTitle.innerText = cspaceObj.name;

  for(let channel of cspaceObj.channels) {
    const channelDiv = document.createElement("div");
    channelDiv.innerText = `${channel.name}: ${channel.min} - ${channel.max}`;
    channelHolder.appendChild(channelDiv);
  }

  const returnLink = document.getElementById("returnLink");
  returnLink.href = `${returnLink.href}?cspace=${cspace}`;
}