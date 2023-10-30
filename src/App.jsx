import { useState, useEffect } from 'react';
import './style.css';

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [gameState, setGameState] = useState(true);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);

  function getPokemonById(id) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) => response.json()).then((response) => {
      const mon = {};
      mon.species = response.species.name;
      mon.img = response.sprites.front_default;
      mon.clicked = false;
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

  function clickPokemon(species) {
    if (gameState) {
      if (isPokemonClicked(species)) {
        setGameState(false);
        setLose(true);
      } else {
        setPokemon([...pokemon.map((mon) => {
          if (mon.species === species) {
            return { ...mon, clicked: true };
          } return mon;
        })]);
      }
    }
  }

  function isPokemonClicked(species) {
    return pokemon.find((mon) => mon.species === species).clicked;
  }

  function shufflePokemon() {
    setPokemon([...pokemon.sort(() => Math.random() - 0.5)]);
  }

  function checkScore() {
    return pokemon.reduce((acc, curr) => {
      if (curr.clicked) return acc + 1;
      return acc;
    }, 0);
  }

  useEffect(() => {
    setRandomPokemon(9);
  }, []);

  useEffect(() => {
    if (pokemon.length > 0 && checkScore() === pokemon.length) {
      setGameState(false);
      setWin(true);
    }
  }, [pokemon]);

  return (
    <div>
      {pokemon.map((mon) => (
        <button
          type="button"
          key={mon.species}
          title={mon.species}
          onClick={() => {
            // shufflePokemon();
            clickPokemon(mon.species);
          }}
          disabled={!gameState}
        >
          <img
            src={mon.img}
            alt={mon.species}
          />
        </button>
      ))}

      <div>
        {win && <p>You won! You got a perfect score.</p>}
        {lose && (
        <p>
          You lost! You got
          {' '}
          {checkScore()}
          {' '}
          out of
          {' '}
          {pokemon.length}
          .
        </p>
        )}
        <button
          type="button"
          onClick={() => {
            setRandomPokemon(9);
            setGameState(true);
            setWin(false);
            setLose(false);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// todo: fix shuffling
