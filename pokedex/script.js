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
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
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
let allNames = [];
let myChart;
let index1 = 0;
let index2 = 40;

function reload() {
  let search = document.getElementById("search");
  search.value;
  console.log(search.value);
  search.value = "";
  let pokeDexes = document.getElementById("poke-dexes");
  let loadBtn = document.getElementById("load-btn");

  pokeDexes.innerHTML = "";
  loadBtn.classList.remove("d-none");
  index1 = 0;
  index2 = 40;
  init();
}

async function init() {
  fetchAllPokemon();
  await fetchPokemon();
}

async function fetchPokemon() {
  for (let i = index1 + 1; i <= index2; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    let pokemon = await response.json();
    renderPokemon(pokemon);
  }
}

async function fetchAllPokemon() {
  if (allPokemon.length >= 1025) {
  } else {
    for (let i = 1; i <= 1025; i++) {
      let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
      let response = await fetch(url);
      let allpokemon = await response.json();
      allPokemon.push(allpokemon);
    }
  }
}

async function fetchLoadPokemon() {
  index1 = index2;
  index2 = index2 + 40;
  await init();
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
  <div onclick='openFullDex(${pokeData["id"]})' id="pokeDex${pokeData["id"]}" class="poke-dex">
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
  let pokeDataImg = pokeData["sprites"]["other"]["official-artwork"]["front_default"];
  return pokeDataImg;
}

function getDexCardInfo(pokeId) {
  let fullDexContainer = document.getElementById("full-dex-container");
  let fullDexImg = document.getElementById("full-dex-img");
  for (let i = 0; i < allPokemon.length; i++) {
    if (allPokemon[i]["id"] == pokeId) {
      let img = allPokemon[i]["sprites"]["other"]["official-artwork"]["front_default"];
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
  let id = document.getElementById("full-dex-id");

  name.innerHTML = "";
  name.innerHTML = /*html*/ `${pokeData["name"]}`;
  id.innerHTML = "";
  id.innerHTML = `#${pokeData["id"]}`;
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
    <div class="text-value" >${ability}</div>
    `;
  });
}

function getFullDexAbout(pokeData) {
  let fullDexAbout = document.getElementById("full-dex-about");
  let pokeWeight = pokeData["weight"];
  let pokeHeight = pokeData["height"];
  fullDexAbout.innerHTML = /*html*/ `
  <div class="about-text">Weight:<div class="text-value">&nbsp ${pokeWeight}</div></div>
  <div class="about-text">Height:<div class="text-value">&nbsp ${pokeHeight}</div></div>
  `;
}

function openFullDex(pokeId) {
  let bg = document.getElementById("body");
  bg.classList.add("of-hidden");
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
  let bg = document.getElementById("body");
  bg.classList.remove("of-hidden");
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

async function searchNames() {
  let search = document.getElementById("search").value;
  let pokeDexes = document.getElementById("poke-dexes");
  pokeDexes.innerHTML = "";
  let loadBtn = document.getElementById("load-btn");
  loadBtn.classList.add("d-none");
  search = search.toLowerCase();
  if (search.length > 2) {
    for (let i = 0; i < 1025; i++) {
      let name = allPokemon[i]["name"];
      if (name.toLowerCase().includes(search)) {
        fetchSearchPokemon(i);
      }
    }
  }
}

async function fetchSearchPokemon(index) {
  let url = `https://pokeapi.co/api/v2/pokemon/${index + 1}`;
  let response = await fetch(url);
  let allpokemon = await response.json();
  renderPokemon(allpokemon);
}
