import { useState, useEffect } from 'react';
import './style.css';

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [gameState, setGameState] = useState(true);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
  const [canShuffle, setCanShuffle] = useState(false);

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

  function isPokemonClicked(species) {
    return pokemon.find((mon) => mon.species === species).clicked;
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
        setCanShuffle(true);
      }
    }
  }

  function checkScore() {
    return pokemon.reduce((acc, curr) => {
      if (curr.clicked) return acc + 1;
      return acc;
    }, 0);
  }

  function shufflePokemon() {
    setPokemon([...pokemon.sort(() => Math.random() - 0.5)]);
  }

  useEffect(() => {
    setRandomPokemon(9);
  }, []);

  useEffect(() => {
    if (pokemon.length > 0 && checkScore() === pokemon.length) {
      setGameState(false);
      setWin(true);
    } else if (canShuffle) {
      shufflePokemon();
      setCanShuffle(false);
    }
  }, [pokemon]);

  return (
    <main>
      <p>
        <b>Pokemon Memory Card:</b>
        {' '}
        Try to click on all of the Pokemon, but don&apos;t click the same Pokemon more than once!
      </p>
      <div className={`pokemon grid-${pokemon.length}`}>
        {pokemon.map((mon) => (
          <button
            type="button"
            key={mon.species}
            title={mon.species}
            onClick={() => clickPokemon(mon.species)}
            disabled={!gameState}
          >
            <img
              src={mon.img}
              alt={mon.species}
            />
            <span>{mon.species}</span>
          </button>
        ))}
      </div>
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
      <div className="buttons">
        {[9, 16, 25].map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => {
              setRandomPokemon(amount);
              setGameState(true);
              setWin(false);
              setLose(false);
            }}
          >
            New Board (
            {amount}
            x
            {amount}
            )
          </button>
        ))}

      </div>
    </main>
  );
}
