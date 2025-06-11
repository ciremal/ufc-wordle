"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import GuessTable from "./GuessTable";
import InfoSection from "./InfoSection";
import Autocomplete, { createFilterOptions } from "@mui/joy/Autocomplete";
import { getAllFighters } from "@/api/fetchFighterInfo";
import { compareStats } from "@/helpers/compare";
import { capitalize, formatCountry } from "@/helpers/format";

const ClientHome = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [fighters, setFighters] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [selectedFighter, setSelectedFighter] = useState<any>();

  // 0 - game on, 1 - won game, 2 - lost game
  const [gameState, setGameState] = useState(0);

  //   const selectedFighter = {
  //     name: "beneil dariush",
  //     division: "lightweight division",
  //     age: 36,
  //     wins: 22,
  //     losses: 6,
  //     height: 70,
  //     country: "iran",
  //   };

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

  const handleGuess = (e: SyntheticEvent<Element, Event>, value: any) => {
    e.preventDefault();
    if (value) {
      const fighter = fighters.find((f) => f.name === value);

      if (fighter.name === selectedFighter.name) {
        setGameState(1);
      } else {
        if (guesses.length === 7) {
          setGameState(2);
        }
      }

      const keys = Object.keys(fighter);
      const result = Object.fromEntries(
        keys.map((key) => [key, compareStats(key, fighter, selectedFighter)])
      );

      setGuesses([...guesses, result]);
    }
  };

  useEffect(() => {
    const fetchFighters = async () => {
      try {
        const data = await getAllFighters();
        const filtered = data.filter((fighter: any) => {
          const [wins, losses, draws] = fighter.record;
          return wins + losses + draws >= 15;
        });

        const filteredInfo = filtered.map((f: any) => {
          const [wins, losses] = f.record;
          return {
            name: f.name,
            division: f.division,
            age: f.age,
            wins: wins,
            losses: losses,
            height: f.height,
            country: formatCountry(f.hometown),
          };
        });
        const index = Math.floor(Math.random() * filteredInfo.length);
        setFighters(filteredInfo);
        setSelectedFighter(filteredInfo[index]);
      } catch (error) {
        console.error("Failed to fetch fighters:", error);
      }
    };

    fetchFighters();
  }, []);

  const filterOptions = createFilterOptions({
    limit: 25,
  });

  const fighterNames = fighters.map((f) => f.name);

  const helpDesc = (
    <ol className="list-decimal text-lg pl-10">
      <li>Try to guess the UFC fighter in 7 guesses.</li>
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
      on UFC fighters. Because the range of UFC is so vast, the game is limited
      to currently active fighters with more than 15 fights recorded on their
      MMA record. Happy guessing!
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 pt-8">
      <InfoSection children={helpDesc} title="How to Play" expand={showHelp} />
      <InfoSection
        children={aboutDesc}
        title="Welcome to UFClue!"
        expand={showAbout}
      />

      <div className="w-[90%] flex justify-between">
        <Autocomplete
          placeholder="Guess the fighter"
          options={fighterNames}
          sx={{ width: "50%", maxWidth: 800 }}
          filterOptions={filterOptions}
          onChange={(event, value) => handleGuess(event, value)}
          selectOnFocus
          clearOnBlur
          disabled={gameState !== 0}
        />
        <div className="flex gap-4">
          <button
            className="border py-3 px-10 text-xl"
            onClick={() => handleInfoSection("help")}
          >
            Help
          </button>
          <button
            className="border py-3 px-10 text-xl"
            onClick={() => handleInfoSection("about")}
          >
            About
          </button>
        </div>
      </div>
      <div className="text-xl mt-10">{`Guess ${guesses.length}/8`}</div>
      {gameState === 1 && (
        <div>
          Congrats! You guessed the fighter, {capitalize(selectedFighter.name)}
        </div>
      )}
      {gameState === 2 && (
        <div>
          {" "}
          Sorry! You did not guess the fighter,{" "}
          {capitalize(selectedFighter.name)}
        </div>
      )}
      <div className="my-15 w-[90%]">
        <GuessTable fighters={guesses} />
      </div>
    </div>
  );
};

export default ClientHome;
