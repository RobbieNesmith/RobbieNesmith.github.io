function setup() {
  var map = L.map("map", { crs: L.CRS.Simple }).setView([0, 0], 1);
  L.tileLayer("https://raw.githubusercontent.com/RobbieNesmith/TrashmoreGigapixel/main/{z}/{y}/{x}.jpg", { maxZoom: 10 }).addTo(map);
}