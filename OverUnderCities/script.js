const CLOSE_THRESHOLD = 5;

let city1 = null;
let city2 = null;
let city1Map = null;
let city2Map = null;

let worldCities = null;

let direction = null;
let directions = ["North", "South", "East", "West"];

function closeLat(cityA, cityB) {
  return Math.abs(cityA.geometry.coordinates[1] - cityB.geometry.coordinates[1]) < CLOSE_THRESHOLD;
}

function closeLon(cityA, cityB) {
  return Math.abs(cityA.geometry.coordinates[0] - cityB.geometry.coordinates[0]) < CLOSE_THRESHOLD;
}

function further(direction, cityA, cityB) {
  console.log(cityA);
  console.log(cityB);
  console.log(direction);
  const cityACoords = [cityA.geometry.coordinates[1], cityA.geometry.coordinates[0]];
  const cityBCoords = [cityB.geometry.coordinates[1], cityB.geometry.coordinates[0]];

  if (direction === "North") {
    if (cityACoords[0] > cityBCoords[0]) {
      return cityA;
    }
    return cityB;
  } else if (direction === "South") {
    if (cityACoords[0] < cityBCoords[0]) {
      return cityA;
    }
    return cityB;
  } else if (direction === "East") {
    if (cityACoords[1] > cityBCoords[1]) {
      return cityA;
    }
    return cityB;
  } else if (direction === "West") {
    if (cityACoords[1] < cityBCoords[1]) {
      return cityA;
    }
    return cityB;
  }
  throw "Bad direction provided";
}

async function setup() {
  direction = directions[Math.floor(Math.random() * directions.length)];
  const directionText = document.getElementById("direction");
  directionText.innerText = direction;
  const worldCitiesResp = await fetch("World_Cities.geojson");
  worldCities = await worldCitiesResp.json();

  const featuresList = worldCities.features;

  city1 = featuresList[Math.floor(Math.random() * featuresList.length)];

  const filteredCities = featuresList.filter(city => {
    if (direction === "North" || direction === "South") {
      return closeLat(city, city1);
    } else {
      return closeLon(city, city1);
    }
  });

  city2 = filteredCities[Math.floor(Math.random() * filteredCities.length)];

  const city1Coords = [city1.geometry.coordinates[1], city1.geometry.coordinates[0]];
  const city2Coords = [city2.geometry.coordinates[1], city2.geometry.coordinates[0]];

  const city1NameText = document.getElementById("city1-name");
  const city2NameText = document.getElementById("city2-name");

  city1NameText.innerText = `${city1.properties.CITY_NAME}, ${city1.properties.ADMIN_NAME}, ${city1.properties.CNTRY_NAME}`;
  city2NameText.innerText = `${city2.properties.CITY_NAME}, ${city2.properties.ADMIN_NAME}, ${city2.properties.CNTRY_NAME}`;

  city1Map = L.map("city1")
    .setMaxBounds(L.latLngBounds(L.latLng(city1Coords[0], city1Coords[1]), L.latLng(city1Coords[0], city1Coords[1])))
    .setView(city1Coords, 10);
  city2Map = L.map("city2")
    .setMaxBounds(L.latLngBounds(L.latLng(city2Coords[0], city2Coords[1]), L.latLng(city2Coords[0], city2Coords[1])))
    .setView(city2Coords, 10);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 10,
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(city1Map);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 10,
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(city2Map);
}

function reveal() {
  const rightCity = further(direction, city1, city2);
  const answerHolder = document.getElementById("answer");
  const rightCityText = document.getElementById("right-city");

  answerHolder.style.display = "block";
  rightCityText.innerText = rightCity.properties.CITY_NAME;
}