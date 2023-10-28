const trackDirectory = "assets/gpx";
const tracksToAdd = [
  "JordanPond",
  "JordanStream",
  "Beehive",
  "HadlockPond",
  "BarIsland",
  "Precipice",
  "AnemoneCave",
  "GreatHead"
];

// heh cheeky
// https://stackoverflow.com/a/58531661
function millisecondsToHMS(val) {
  return new Date(val).toISOString().slice(11, 19);
}

async function setup() {
  let map = L.map('map').setView([44.3378473, -68.3101896], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);


  for (gpx of tracksToAdd) {
    const textResp = await fetch(`${trackDirectory}/${gpx}.txt`);
    const text = await textResp.text();
    const [title, content] = text.split("\n");

    const trail = new L.GPX(`${trackDirectory}/${gpx}.gpx`, {
      async: true,
      marker_options: {
        startIconUrl: "assets/img/Marker.png",
        endIconUrl: null,
        shadowUrl: null
      }
    }).addTo(map);
    trail.on("loaded", function (e) {
      trail.bindPopup(`<h3>${title}</h3><p>${content}</p>
      <p>Start Time: ${e.target.get_start_time().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
      <p>Distance: ${e.target.get_distance_imp().toFixed(2)} miles</p>
      <p>Duration: ${millisecondsToHMS(e.target.get_total_time())}</p>`);
    });
  }
}