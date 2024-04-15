let allPokemonData;
let pokemonData;

function init() {
  fetchAllPokemon();
}

function fetchAllPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=150";
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
      console.log(pokeData);
      renderPokemon(pokeData);
    });
}

function renderPokemon(pokeData) {
  let pokeDexes = document.getElementById("pokeDexes");
  pokeDexes.innerHTML += /*html*/ `
  <div id="pokeDex">
    <div>
      <div id="pokeId"> ${pokeData["id"]}</div>
      <div id="pokeName"> ${pokeData["name"]}</div>
    </div>
    <img id="pokeImg" src="${getPokeImage(pokeData)}" alt="">
  </div>`;
}

function getPokeImage(pokeData) {
  let pokeDataImg = pokeData["sprites"]["other"]["dream_world"]["front_default"];
  return pokeDataImg;
}
