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
  normal: "#e8e8e8",
  ghost: "#e8e8e8",
  fairy: "#e8e8e8",
  steel: "#e8e8e8",
  rock: "#ca8179",
  ground: "#ca8179",
};

let allPokemon = [];

function init() {
  fetchAllPokemon();
}

function fetchAllPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=100";
  fetch(url)
    .then((response) => response.json())
    .then(function (allpokemon) {
      allpokemon.results.forEach(function (pokemon) {
        fetchPokemonData(pokemon);
      });
    });
}

function fetchPokemonData(pokemon) {
  let url = pokemon.url;
  fetch(url)
    .then((response) => response.json())
    .then(function (pokeData) {
      renderPokemon(pokeData);
      allPokemon.push(pokeData);
    });
}

function renderPokemon(pokeData) {
  getDexPokemon(pokeData);
  getDexColor(pokeData);
}

function getDexPokemon(pokeData) {
  let pokeDexes = document.getElementById("poke-dexes");
  pokeDexes.innerHTML += /*html*/ `
  <div onclick='getFullDex(${pokeData["id"]})' id="pokeDex${pokeData["id"]}" class="pokeDex">
    <div>
      <div id="pokeId"> #${pokeData["id"]}</div>
      <div id="pokeName"> ${pokeData["name"]}</div>
      <div id="pokeType">${getPokeTypes(pokeData)}</div>
    </div>
    <img id="pokeImg" src="${getPokeImage(pokeData)}" alt="">
  </div>`;
}

function getPokeTypes(pokeData) {
  let pokeTypes = pokeData["types"];
  for (let i = 0; i < pokeTypes.length; i++) {
    let types = pokeTypes[i]["type"]["name"];
    return types;
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
      getFullDexType(allPokemon[i]);
      console.log(allPokemon[i]);
      getFullDexStatus(allPokemon[i]);
      getFullDexAbilities(allPokemon[i]);
      getFullDexAbout(allPokemon[i]);
    }
  }
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
    <div>${type}</div>
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
