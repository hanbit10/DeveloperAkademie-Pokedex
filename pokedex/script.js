async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

let allPokemonData;
let pokemonData;
const colorMap = {
  fire: "#f7786b",
  fighting: "#f7786b",
  water: "#58abf6",
  grass: "#49d0b0",
  bug: "#49d0b0",
  psychic: "#9f5bba",
  poison: "#9f5bba",
  electric: "#ffce4b",
  normal: "#808080",
  ghost: "#808080",
  fairy: "#808080",
  steel: "#808080",
  rock: "#ca8179",
  ground: "#ca8179",
};

const chartColor = [
  "rgba(255, 99, 132, 0.7)",
  "rgba(255, 159, 64, 0.7)",
  "rgba(255, 205, 86, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(54, 162, 235, 0.7)",
  "rgba(153, 102, 255, 0.7)",
];

let configuration = {
  type: "bar",
  data: {
    labels: ["HP", "Attack", "Defense", "S. Attack", "S. Defense", "Speed"],
    datasets: [
      {
        label: "Stats",
        data: [],
        backgroundColor: chartColor,
        borderWidth: 1,
        barThickness: 15,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        max: 200,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};

let allPokemon = [];
let myChart;

function init() {
  fetchAllPokemon();
}

async function fetchAllPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=40";
  try {
    let response = await fetch(url);
    let allpokemon = await response.json();
    allpokemon.results.forEach(function (pokemon) {
      fetchPokemonData(pokemon);
    });
  } catch (e) {
    console.log("Fehler");
  }
}

async function fetchPokemonData(pokemon) {
  let url = pokemon.url;
  try {
    let response = await fetch(url);
    let allpokemon = await response.json();
    allPokemon.push(allpokemon);
    renderPokemon(allpokemon);
  } catch (e) {
    console.log("again Fehler");
  }
}

function renderPokemon(pokeData) {
  getDexPokemon(pokeData);
  getDexColor(pokeData);
}

function getDexPokemon(pokeData) {
  getDexCard(pokeData);
  getDexTypes(pokeData);
}

function getDexCard(pokeData) {
  let pokeDexes = document.getElementById("poke-dexes");
  pokeDexes.innerHTML += /*html*/ `
  <div onclick='openFullDex(${pokeData["id"]})' id="pokeDex${pokeData["id"]}" class="pokeDex">
    <div>
      <div id="pokeId"> #${pokeData["id"]}</div>
      <div id="pokeName"> ${pokeData["name"]}</div>
      <div id="pokeType${pokeData["id"]}"></div>
    </div>
    <img id="pokeImg" src="${getPokeImage(pokeData)}" alt="">
  </div>`;
}

function getDexTypes(pokeData) {
  let pokeType = document.getElementById(`pokeType${pokeData["id"]}`);
  let types = pokeData["types"];
  for (let i = 0; i < types.length; i++) {
    pokeType.innerHTML += /*html*/ `
    <div class="dex-types">${types[i]["type"]["name"]}</div>
    `;
  }
}

function getDexColor(pokeData) {
  let bg = document.getElementById(`pokeDex${pokeData["id"]}`);
  let type = pokeData["types"][0]["type"]["name"];
  bg.style.backgroundColor = colorMap[type] || "#ffffff"; // Default to white if type not found
}

function getPokeImage(pokeData) {
  let pokeDataImg = pokeData["sprites"]["other"]["dream_world"]["front_default"];
  return pokeDataImg;
}

function getDexCardInfo(pokeId) {
  let fullDexContainer = document.getElementById("full-dex-container");
  let fullDexImg = document.getElementById("full-dex-img");
  for (let i = 0; i < allPokemon.length; i++) {
    if (allPokemon[i]["id"] == pokeId) {
      let img = allPokemon[i]["sprites"]["other"]["dream_world"]["front_default"];
      fullDexContainer.classList.remove("d-none");
      fullDexImg.src = img;
      getFullDexColor(allPokemon[i]);
      getFullDexName(allPokemon[i]);
      getFullDexType(allPokemon[i]);
      getFullDexAbilities(allPokemon[i]);
      getFullDexAbout(allPokemon[i]);
      getChart(allPokemon[i]);
    }
  }
}

function getFullDexName(pokeData) {
  let name = document.getElementById("full-dex-name");
  let pokeName = pokeData["name"];
  name.innerHTML = "";
  name.innerHTML = /*html*/ `${pokeName}`;
}

function getFullDexColor(pokeData) {
  let bg = document.getElementById("full-dex");
  let type = pokeData["types"][0]["type"]["name"];
  bg.style.backgroundColor = colorMap[type] || "#ffffff";
}

function getFullDexType(pokeData) {
  let fullDexType = document.getElementById("full-dex-type");
  fullDexType.innerHTML = "";
  let pokeTypes = pokeData["types"];
  pokeTypes.forEach(function (index) {
    let type = index["type"]["name"];
    fullDexType.innerHTML += /*html*/ `
    <div class="full-dex-types">${type}</div>
    `;
  });
}

function getFullDexStatus(pokeData) {
  let fullDexStatus = document.getElementById("full-dex-status");
  let pokeStatus = pokeData["stats"];
  pokeStatus.forEach(function (index) {
    let statusName = index["stat"]["name"];
    let status = index["base_stat"];
    fullDexStatus.innerHTML += /*html*/ `
    <div>${statusName}</div>
    <div>${status}</div>
    `;
  });
}

function getFullDexAbilities(pokeData) {
  let fullDexAbilities = document.getElementById("full-dex-abilities");
  let pokeAbilities = pokeData["abilities"];
  fullDexAbilities.innerHTML = "Abilities: ";
  pokeAbilities.forEach(function (index) {
    let ability = index["ability"]["name"];
    fullDexAbilities.innerHTML += /*html*/ `
    <div>${ability}</div>
    `;
  });
}

function getFullDexAbout(pokeData) {
  let fullDexAbout = document.getElementById("full-dex-about");
  let pokeWeight = pokeData["weight"];
  let pokeHeight = pokeData["height"];
  fullDexAbout.innerHTML = /*html*/ `
  <div class="about-text">Weight: ${pokeWeight}</div>
  <div class="about-text">Height: ${pokeHeight}</div>
  `;
}

function openFullDex(pokeId) {
  if (1 > pokeId) {
    pokeId = 1;
  } else if (pokeId > allPokemon.length) {
    pokeId = allPokemon.length;
  }

  let leftArrow = document.getElementById("leftArrow");
  let rightArrow = document.getElementById("rightArrow");
  leftArrow.innerHTML = showLeftFoto(pokeId);
  rightArrow.innerHTML = showRightFoto(pokeId);
  getDexCardInfo(pokeId);
}

function showLeftFoto(index) {
  return /*html*/ `
  <div class="left-arrow-interface no-select" onclick='openFullDex(${index - 1})' >
    <img
      class="left-arrow no-select"
      src="/pokedex/data/icons/leftArrow.svg"
      alt=""
    />
  </div>
`;
}

function showRightFoto(index) {
  return /*html*/ `
  <div class="right-arrow-interface no-select" onclick="openFullDex(${index + 1})" >
    <img
        class="right-arrow no-select"
        src="/pokedex/data/icons/rightArrow.svg"
        alt=""
    />
  </div>
`;
}

function closeFullScreen() {
  document.getElementById("full-dex-container").classList.add("d-none");
}

function getChart(pokeData) {
  const ctx = document.getElementById("myChart");
  const stats = getChartStats(pokeData);
  configuration["data"]["datasets"][0]["data"] = stats;
  if (myChart) {
    myChart.destroy();
    myChart = new Chart(ctx, configuration);
  } else {
    myChart = new Chart(ctx, configuration);
  }
}

function getChartStats(pokeData) {
  let stats = [];
  for (let i = 0; i < pokeData["stats"].length; i++) {
    stats.push(pokeData["stats"][i]["base_stat"]);
  }
  return stats;
}

function filterNames() {
  let search = document.getElementById("search").value;
  let pokeDexes = document.getElementById("poke-dexes");
  pokeDexes.innerHTML = "";
  search = search.toLowerCase();
  if (search.length >= 3) {
    allPokemon.length;
    for (let i = 0; i < allPokemon.length; i++) {
      let name = allPokemon[i]["name"];
      if (name.toLowerCase().includes(search)) {
        renderPokemon(allPokemon[i]);
      }
    }
  } else {
    allPokemon.forEach((pokemon) => renderPokemon(pokemon));
  }
}
