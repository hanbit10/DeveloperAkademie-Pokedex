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

let allPokemon = [];

function init() {
  fetchAllPokemon();
}

async function fetchAllPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=10";
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
  <div onclick='getFullDex(${pokeData["id"]})' id="pokeDex${pokeData["id"]}" class="pokeDex">
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

function getFullDex(pokeId) {
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
      console.log(allPokemon[i]);
      getFullDexAbilities(allPokemon[i]);
      getFullDexAbout(allPokemon[i]);
      getChart(allPokemon[i]);
    }
  }
}

function getFullDexName(pokeData) {
  let name = document.getElementById("full-dex-name");
  let pokeName = pokeData["name"];
  name.innerHTML = /*html*/ `${pokeName}`;
}

function getFullDexColor(pokeData) {
  let bg = document.getElementById("full-dex");
  let type = pokeData["types"][0]["type"]["name"];
  bg.style.backgroundColor = colorMap[type] || "#ffffff";
}

function getFullDexType(pokeData) {
  let fullDexType = document.getElementById("full-dex-type");
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
  <div>${pokeWeight}</div>
  <div>${pokeHeight}</div>
  `;
}

function getChart(pokeData) {
  const ctx = document.getElementById("myChart");
  let stats = [];
  for (let i = 0; i < pokeData["stats"].length; i++) {
    stats.push(pokeData["stats"][i]["base_stat"]);
  }
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["HP", "Attack", "Defense", "S. Attack", "S. Defense", "Speed"],
      datasets: [
        {
          label: "Stats",
          data: stats,
          backgroundColor: chartColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
          max: 150,
        },
      },
      indexAxis: "y",
    },
  });
}
