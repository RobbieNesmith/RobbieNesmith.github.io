let layer;
let map;
let activePano;

const panoList = [
  "https://raw.githubusercontent.com/RobbieNesmith/TrashmoreGigapixel/main/{z}/{y}/{x}.jpg",
  "https://raw.githubusercontent.com/RobbieNesmith/TrashmoreSunnyGigapixel/main/{z}/{y}/{x}.jpg",
];

function setup() {
  map = L.map("map", { crs: L.CRS.Simple }).setView([0, 0], 1);
  layer = L.tileLayer(panoList[activePano || 0], { maxZoom: 10 }).addTo(map);
  map.on("moveend", setUrlPosition);
  map.on("zoomend", setUrlPosition);
  goToUrlPosition();
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebarContainer");
  const visible = sidebar.style.right === "0px";
  sidebar.style.right = visible ? "-256px" : "0px";
  sidebar.style.boxShadow = visible ? "" : "0 0 50px rgba(0,0,0,0.5)";
}

function changeSource(e) {
  activePano = e.target.value;
  layer.setUrl(panoList[e.target.value]);
  setUrlPosition();
}

function goToUrlPosition() {
  const params = new URLSearchParams(location.search);
  const x = params.get("x");
  const y = params.get("y");
  const zoom = params.get("z");
  const pano = params.get("pano");
  if (pano) {
    activePano = pano;
    layer.setUrl(panoList[pano]);
  }
  if (x !== null && y !== null && zoom !== null) {
    map.setView([y, x], zoom);
  }
}

function setUrlPosition() {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const url = new URL(location.href);
  let newUrl = `${url.pathname}?x=${center.lng}&y=${center.lat}&z=${zoom}`;
  if (activePano) {
    newUrl += `&pano=${activePano}`;
  }
  history.replaceState("whut", "title", newUrl);
  if (typeof (Storage) !== "undefined") {
    map.on("moveend", () => localStorage.setItem("center", JSON.stringify(map.getCenter())));
    map.on("zoomend", () => localStorage.setItem("zoom", map.getZoom()));
  }
}