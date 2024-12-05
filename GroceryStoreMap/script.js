async function setup() {
  let map = L.map('map').setView([41.9761455, -91.670335], 14);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const data = await (await fetch("grocerystores.geojson")).json();

  L.geoJSON(data, {
    onEachFeature: function (feature, layer) {
      const popupContainer = document.createElement("div");
      const popupTitle = document.createElement("h3");
      const popupType = document.createElement("p");
      const popupAddress = document.createElement("p");
      popupTitle.innerText = feature.properties.Name;
      popupType.innerText = feature.properties.Type;
      popupAddress.innerText = feature.properties.Address;
      popupContainer.appendChild(popupTitle);
      popupContainer.appendChild(popupType);
      popupContainer.appendChild(popupAddress);
      layer.bindPopup(popupContainer);
    }
  }).addTo(map);
}