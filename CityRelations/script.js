let closeThreshold = 5;
let dataset = "world_10k";

let city1 = null;
let city2 = null;
let city1Map = null;
let city2Map = null;
let city1Coords = null;
let city2Coords = null;
let answerMap = null;

let city1Marker = null;
let city2Marker = null;
let city1AnswerMarker = null;
let city2AnswerMarker = null;

let worldCities = null;

let direction = null;
let directions = ["North", "South", "East", "West"];

function closeLat(cityA, cityB) {
  return Math.abs(cityA.geometry.coordinates[1] - cityB.geometry.coordinates[1]) < closeThreshold;
}

function closeLon(cityA, cityB) {
  return Math.abs(cityA.geometry.coordinates[0] - cityB.geometry.coordinates[0]) < closeThreshold;
}

function further(direction, cityA, cityB) {
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
  const usp = new URLSearchParams(location.search);
  closeThreshold = usp.get("closeThreshold");
  dataset = usp.get("dataset");
  const answerHolder = document.getElementById("answer");
  answerHolder.style.display = "none";
  direction = directions[Math.floor(Math.random() * directions.length)];
  const directionText = document.getElementById("direction");
  directionText.innerText = direction;
  const worldCitiesResp = await fetch(`${dataset}.geojson`);
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

  city1Coords = [city1.geometry.coordinates[1], city1.geometry.coordinates[0]];
  city2Coords = [city2.geometry.coordinates[1], city2.geometry.coordinates[0]];

  const city1NameText = document.getElementById("city1-name");
  const city2NameText = document.getElementById("city2-name");

  city1NameText.innerText = `${city1.properties.CITY_NAME}, ${city1.properties.ADMIN_NAME}, ${city1.properties.CNTRY_NAME}`;
  city2NameText.innerText = `${city2.properties.CITY_NAME}, ${city2.properties.ADMIN_NAME}, ${city2.properties.CNTRY_NAME}`;

  if (city1Map === null) {
    city1Map = L.map("city1");
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 10,
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(city1Map);
  }
  city1Map
    .setMaxBounds(L.latLngBounds(L.latLng(city1Coords[0], city1Coords[1]), L.latLng(city1Coords[0], city1Coords[1])))
    .setView(city1Coords, 10);

  if (city2Map === null) {
     city2Map = L.map("city2");
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 10,
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(city2Map);
  }
  city2Map
    .setMaxBounds(L.latLngBounds(L.latLng(city2Coords[0], city2Coords[1]), L.latLng(city2Coords[0], city2Coords[1])))
    .setView(city2Coords, 10);

  if (city1Marker === null) {
    city1Marker = L.marker(city1Coords)
      .addTo(city1Map);
  } else {
    city1Marker.setLatLng(city1Coords);
  }

  if (city2Marker === null) {
    city2Marker = L.marker(city2Coords)
      .addTo(city2Map);
  } else {
    city2Marker.setLatLng(city2Coords);
  }
}

function reveal(guessedCity) {
  const rightCity = further(direction, city1, city2);
  const answerHolder = document.getElementById("answer");
  const headerText = document.getElementById("answer-header");
  const rightCityText = document.getElementById("right-city");

  answerHolder.style.display = "flex";

  headerText.innerText = guessedCity.properties.OBJECTID === rightCity.properties.OBJECTID ? "You were right!" : "You were wrong!";
  rightCityText.innerText = `${rightCity.properties.CITY_NAME}, ${rightCity.properties.ADMIN_NAME}, ${rightCity.properties.CNTRY_NAME}`;

  if (answerMap === null) {
    answerMap = L.map("answer-map")
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(answerMap);
  }
  answerMap
    .fitBounds([city1Coords, city2Coords]);

  if (city1AnswerMarker === null) {
    city1AnswerMarker = L.marker(city1Coords)
      .addTo(answerMap);
  } else {
    city1AnswerMarker.setLatLng(city1Coords);
  }

  if (city2AnswerMarker === null) {
    city2AnswerMarker = L.marker(city2Coords)
      .addTo(answerMap);
  } else {
    city2AnswerMarker.setLatLng(city2Coords);
  }
}