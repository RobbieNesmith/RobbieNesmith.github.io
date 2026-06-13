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
let city1AnswerPopup = null;
let city2AnswerPopup = null;

let worldCities = null;

let direction = null;
let directions = ["North", "South", "East", "West"];

let correctGuessCount = 0;
let totalGuessCount = 0;

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

function getCloseThreshold(difficulty, dataset) {
  if (dataset.startsWith("world")) {
    if (difficulty === "easy") {
      return 10;
    } else if (difficulty === "normal") {
      return 5;
    } else {
      return 2;
    }
  } else if (dataset.startsWith("us")) {
    if (difficulty === "easy") {
      return 5;
    } else if (difficulty === "normal") {
      return 2;
    } else {
      return 1;
    }
  } else {
    if (difficulty === "easy") {
      return 3;
    } else if (difficulty === "normal") {
      return 1;
    } else {
      return 0.5;
    }
  }
}

async function setup() {
  const usp = new URLSearchParams(location.search);
  const difficulty = usp.get("difficulty");
  dataset = usp.get("dataset");

  closeThreshold = getCloseThreshold(difficulty, dataset);

  const answerHolder = document.getElementById("answer");
  answerHolder.style.display = "none";
  direction = directions[Math.floor(Math.random() * directions.length)];
  const directionImageSrc = `assets/img/${direction}Arrow.png`;
  const directionText = document.getElementById("direction");
  const directionImage = document.getElementById("direction-arrow");
  directionText.innerText = direction;
  directionImage.src = directionImageSrc;
  directionImage.style.display = "inline";
  const worldCitiesResp = await fetch(`${dataset}.geojson`);
  worldCities = await worldCitiesResp.json();

  const featuresList = worldCities.features;

  city1 = undefined;
  city2 = undefined;
  while (!city1 || !city2) {
    city1 = featuresList[Math.floor(Math.random() * featuresList.length)];

    const filteredCities = featuresList.filter(city => {
      if (direction === "North" || direction === "South") {
        return closeLat(city, city1) && !closeLon(city, city1) ;
      } else {
        return closeLon(city, city1) && !closeLat(city, city1);
      }
    });

    city2 = filteredCities[Math.floor(Math.random() * filteredCities.length)];
  }
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

function ddToDms(dd) {
  const sign = Math.sign(dd);
  const absDegrees = Math.abs(dd);
  const d = Math.floor(absDegrees);
  const m = Math.floor((absDegrees - d) * 60);
  const s = Math.floor(((absDegrees * 3600) % 60));

  return `${sign > 0 ? "" : "-"}${d}° ${m}' ${s}"`;
}

function generateContent(cityName, thisCityCoords, otherCityCoords, direction) {
  if (direction === "North" || direction === "South") {
    if (thisCityCoords[0] > otherCityCoords[0]) {
      return `${cityName} is ${ddToDms(thisCityCoords[0] - otherCityCoords[0])} North`;
    } else {
      return `${cityName} is ${ddToDms(otherCityCoords[0] - thisCityCoords[0])} South`;
    }
  } else {
    if (thisCityCoords[1] > otherCityCoords[1]) {
      return `${cityName} is ${ddToDms(thisCityCoords[1] - otherCityCoords[1])} East`;
    } else {
      return `${cityName} is ${ddToDms(otherCityCoords[1] - thisCityCoords[1])} West`;
    }
  }
}

function reveal(guessedCity) {
  const rightCity = further(direction, city1, city2);
  const answerHolder = document.getElementById("answer");
  const headerText = document.getElementById("answer-header");
  const rightCityText = document.getElementById("right-city");
  const guessRatioText = document.getElementById("guess-ratio");

  answerHolder.style.display = "flex";

  totalGuessCount += 1;

  if (guessedCity.properties.OBJECTID === rightCity.properties.OBJECTID) {
    headerText.innerText = "You were right!";
    correctGuessCount += 1;
  } else {
    headerText.innerText = "You were wrong!";
  }

  guessRatioText.innerText = `(${correctGuessCount}/${totalGuessCount} correct)`;

  rightCityText.innerText = `${rightCity.properties.CITY_NAME}, ${rightCity.properties.ADMIN_NAME}, ${rightCity.properties.CNTRY_NAME}`;

  if (answerMap === null) {
    answerMap = L.map("answer-map")
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(answerMap);
  }
  answerMap
    .fitBounds([city1Coords, city2Coords], {padding: [50, 50]});

  let city1Name = city1.properties.CITY_NAME;
  if (guessedCity.properties.OBJECTID === city1.properties.OBJECTID) {
    if (rightCity.properties.OBJECTID === city1.properties.OBJECTID) {
      city1Name = "✔ " + city1.properties.CITY_NAME;
    } else {
      city1Name = "✘ " + city1.properties.CITY_NAME;
    }
  }

  let city2Name = city2.properties.CITY_NAME;
  if (guessedCity.properties.OBJECTID === city2.properties.OBJECTID) {
    if (rightCity.properties.OBJECTID === city2.properties.OBJECTID) {
      city2Name = "✔ " + city2.properties.CITY_NAME;
    } else {
      city2Name = "✘ " + city2.properties.CITY_NAME;
    }
  }

  if (city1AnswerPopup === null) {
    city1AnswerPopup = L.popup()
      .setLatLng(city1Coords)
      .setContent(generateContent(city1Name, city1Coords, city2Coords, direction))
      .addTo(answerMap);
  } else {
    city1AnswerPopup
      .setLatLng(city1Coords)
      .setContent(generateContent(city1Name, city1Coords, city2Coords, direction));
  }

  if (city2AnswerPopup === null) {
    city2AnswerPopup = L.popup()
      .setLatLng(city2Coords)
      .setContent(generateContent(city2Name, city2Coords, city1Coords, direction))
      .addTo(answerMap);
  } else {
    city2AnswerPopup
      .setLatLng(city2Coords)
      .setContent(generateContent(city2Name, city2Coords, city1Coords, direction));
  }
}