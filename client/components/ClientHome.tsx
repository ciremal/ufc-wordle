"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import GuessTable from "./GuessTable";
import InfoSection from "./InfoSection";
import Autocomplete, { createFilterOptions } from "@mui/joy/Autocomplete";
import { compareStats } from "@/helpers/compare";
import { capitalize, formatCountry } from "@/helpers/format";
import { Fighter, FormattedFighter, Guess } from "@/types/fighter";
import { GameState } from "@/types/game";
import { getDailyFighter } from "@/helpers/dailyFighter";
import GameStateResult from "./GameStateResult";

const ClientHome = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [fighters, setFighters] = useState<FormattedFighter[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [selectedFighter, setSelectedFighter] = useState<FormattedFighter>();
  const [gameState, setGameState] = useState<GameState>(GameState.Playing);

  const maxGuesses = 10;
  const today = new Date().toISOString().slice(0, 10);

  const handleInfoSection = (section: string) => {
    switch (section) {
      case "help":
        setShowHelp(!showHelp);
        setShowAbout(false);
        break;
      case "about":
        setShowAbout(!showAbout);
        setShowHelp(false);
        break;
    }
  };

  const handleGuess = (
    e: SyntheticEvent<Element, Event>,
    value: string | unknown
  ) => {
    const exists = guesses.find((f) => f.name.value === value);
    if (value && !exists) {
      const fighter = fighters.find((f) => f.name === value);
      if (!fighter || !selectedFighter) {
        return;
      }

      if (fighter.name === selectedFighter.name) {
        setGameState(GameState.Won);
      } else {
        if (guesses.length === maxGuesses - 1) {
          setGameState(GameState.Lost);
        }
      }

      const keys = Object.keys(fighter);
      const resultEntries = keys.map((key) => [
        key,
        compareStats(key, fighter, selectedFighter),
      ]);
      const result = Object.fromEntries(resultEntries);

      setGuesses([
        ...guesses,
        {
          name: result.name,
          division: result.division,
          age: result.age,
          wins: result.wins,
          losses: result.losses,
          height: result.height,
          country: result.country,
          rank: result.rank,
        } as Guess,
      ]);
    }
  };

  useEffect(() => {
    const checkGameState = localStorage.getItem(today);
    if (checkGameState) {
      const gameStateInfo = JSON.parse(checkGameState);
      switch (gameStateInfo.result) {
        case "won":
          setGameState(GameState.Won);
          break;
        case "lost":
          setGameState(GameState.Lost);
        default:
          break;
      }
      setGuesses(gameStateInfo.guesses);
    }

    fetch("/ufc.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((fighter: Fighter) => {
          return fighter.rank !== "";
        });

        const filteredInfo = filtered.map((f: Fighter) => {
          const [wins, losses] = f.record;
          return {
            name: capitalize(f.name),
            division: f.division,
            age: f.age,
            wins: wins,
            losses: losses,
            height: f.height,
            country: formatCountry(f.hometown),
            rank: f.rank,
          };
        });
        setFighters(filteredInfo);
        setSelectedFighter(getDailyFighter(filteredInfo));
      });
  }, []);

  useEffect(() => {
    const checkLocalStorage = localStorage.getItem(today);
    if (checkLocalStorage) {
      return;
    }

    if (gameState !== GameState.Playing) {
      const todayInfo = {
        result: gameState,
        guesses: guesses,
      };
      localStorage.setItem(today, JSON.stringify(todayInfo));
    }
  }, [gameState]);

  const filterOptions = createFilterOptions({
    limit: 25,
  });

  const fighterNames = fighters.map((f) => f.name);

  const helpDesc = (
    <ol className="list-decimal text-lg pl-10">
      <li>Try to guess the UFC fighter in {maxGuesses} guesses.</li>
      <li>Green is an exact match.</li>
      <li>
        Yellow is a close match, where Age, Wins, Losses, or Height are off by
        at most 2.
      </li>
      <li>
        For numbers, there will be an arrow indicating which way the actual
        match is towards.
      </li>
    </ol>
  );

  const aboutDesc = (
    <div className="text-center text-lg">
      Heavily inspired by the web-game Wordle, this version tests your knowledge
      on UFC fighters. Because there are so many UFC fighters, with many of them
      who still unknown even to frequent watchers, this list contains only
      <span className="font-bold"> ranked fighters</span> across all divisions.
      This may be changed in coming updates. Happy guessing!
    </div>
  );

  return (
    <div className="flex flex-col items-center pt-8">
      <InfoSection title="How to Play" expand={showHelp}>
        {helpDesc}
      </InfoSection>
      <InfoSection title="Welcome to UFClue!" expand={showAbout}>
        {aboutDesc}
      </InfoSection>

      <div className="w-[90%] flex justify-between mt-10">
        <Autocomplete
          placeholder="Guess the fighter..."
          options={fighterNames}
          sx={{
            width: "50%",
            maxWidth: 800,
            fontSize: "1.5rem",
            borderColor: "var(--borderColor)",
            borderWidth: 2,
            borderRadius: 0,
          }}
          filterOptions={filterOptions}
          onChange={(event, value) => handleGuess(event, value)}
          selectOnFocus
          clearOnBlur
          disabled={gameState !== GameState.Playing}
        />
        <div className="flex gap-4">
          <button
            className="border py-3 px-10 text-xl bg-[#F17171] hover:brightness-90"
            onClick={() => handleInfoSection("help")}
          >
            Help
          </button>
          <button
            className="border py-3 px-10 text-xl bg-[#69B3AE] hover:brightness-90"
            onClick={() => handleInfoSection("about")}
          >
            About
          </button>
        </div>
      </div>
      <div className="text-2xl mt-20">{`Guess ${guesses.length}/${maxGuesses}`}</div>
      <GameStateResult
        gameState={gameState}
        selectedFighter={selectedFighter}
      />
      <div className="my-15 w-[90%]">
        <GuessTable fighters={guesses} gameState={gameState} />
      </div>
    </div>
  );
};

export default ClientHome;
