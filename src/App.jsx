import { useState, useEffect } from 'react';

export default function App() {
  const [pokemon, setPokemon] = useState([]);

  function getPokemonById(id) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) => response.json()).then((response) => {
      const mon = {};
      mon.species = response.species.name;
      mon.img = response.sprites.front_default;
      return mon;
    });
  }

  function setRandomPokemon(max) {
    const randomIds = [];
    while (randomIds.length < max) {
      const randomId = Math.ceil(Math.random() * 649);
      if (!randomIds.includes(randomId)) randomIds.push(randomId);
    }

    const randomPokemon = [];
    randomIds.forEach((id) => {
      getPokemonById(id).then((response) => {
        randomPokemon.push(response);
        if (randomPokemon.length === max) setPokemon(randomPokemon);
      });
    });
  }

  useEffect(() => {
    setRandomPokemon(9);
  }, []);

  return (
    <div>
      {pokemon.map((mon) => <img key={mon.species} src={mon.img} alt={mon.species} />)}
    </div>
  );
}
