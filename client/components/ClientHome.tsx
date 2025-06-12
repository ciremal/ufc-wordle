"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import GuessTable from "./GuessTable";
import InfoSection from "./InfoSection";
import Autocomplete, { createFilterOptions } from "@mui/joy/Autocomplete";
import { getAllFighters } from "@/api/fetchFighterInfo";
import { compareStats } from "@/helpers/compare";
import { capitalize, formatCountry } from "@/helpers/format";
import { Option, Select } from "@mui/joy";

const ClientHome = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [fighters, setFighters] = useState<any[]>([]);
  const [rankedFighters, setRankedFighters] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [selectedFighter, setSelectedFighter] = useState<any>();
  const [difficulty, setDifficulty] = useState(1);

  // 0 - game on, 1 - won game, 2 - lost game
  const [gameState, setGameState] = useState(0);

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

    const exists = guesses.find((f) => f.name.value === value);
    if (value && !exists) {
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

  const handleDifficulty = (
    event: React.SyntheticEvent | null,
    value: number | null
  ) => {
    event?.preventDefault();
    if (value) {
      setDifficulty(value);
    }
  };

  // useEffect(() => {
  //   const fetchFighters = async () => {
  //     try {
  //       const data = await getAllFighters();
  //       const filtered = data.filter((fighter: any) => {
  //         const [wins, losses, draws] = fighter.record;
  //         return wins + losses + draws >= 15 || fighter.rank !== "";
  //       });

  //       const filteredInfo = filtered.map((f: any) => {
  //         const [wins, losses] = f.record;
  //         return {
  //           name: f.name,
  //           division: f.division,
  //           age: f.age,
  //           wins: wins,
  //           losses: losses,
  //           height: f.height,
  //           country: formatCountry(f.hometown),
  //           rank: f.rank,
  //         };
  //       });
  //       setFighters(filteredInfo);

  //       const rankedFighters = filteredInfo.filter((f: any) => f.rank !== "");
  //       setRankedFighters(rankedFighters);

  //       const index = Math.floor(Math.random() * rankedFighters.length);
  //       setSelectedFighter(rankedFighters[index]);
  //     } catch (error) {
  //       console.error("Failed to fetch fighters:", error);
  //     }
  //   };

  //   fetchFighters();
  // }, []);

  useEffect(() => {
    fetch("/ufc.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((fighter: any) => {
          const [wins, losses, draws] = fighter.record;
          return wins + losses + draws >= 15 || fighter.rank !== "";
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
            rank: f.rank,
          };
        });
        setFighters(filteredInfo);

        const rankedFighters = filteredInfo.filter((f: any) => f.rank !== "");
        setRankedFighters(rankedFighters);

        const index = Math.floor(Math.random() * rankedFighters.length);
        setSelectedFighter(rankedFighters[index]);
      });
  }, []);

  useEffect(() => {
    if (difficulty === 1) {
      const index = Math.floor(Math.random() * rankedFighters.length);
      setSelectedFighter(rankedFighters[index]);
    } else {
      const index = Math.floor(Math.random() * fighters.length);
      setSelectedFighter(fighters[index]);
    }
    setGuesses([]);
  }, [difficulty]);

  const filterOptions = createFilterOptions({
    limit: 25,
  });

  const fighterNames =
    difficulty === 1
      ? rankedFighters.map((f) => f.name)
      : fighters.map((f) => f.name);

  const helpDesc = (
    <ol className="list-decimal text-lg pl-10">
      <li>Try to guess the UFC fighter in 8 guesses.</li>
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
      on UFC fighters. There are two modes.{" "}
      <span className="font-bold">Normal</span> mode contains only{" "}
      <span className="font-bold">ranked </span>
      fighters. <span className="font-bold">Hard</span> mode contains all
      <span className="font-bold"> currently active</span> fighters with either{" "}
      <span className="font-bold">more than 15</span> fights recorded on their
      MMA record, or ranked. Happy guessing!
    </div>
  );

  return (
    <div className="flex flex-col items-center pt-8">
      <InfoSection children={helpDesc} title="How to Play" expand={showHelp} />
      <InfoSection
        children={aboutDesc}
        title="Welcome to UFClue!"
        expand={showAbout}
      />

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
          disabled={gameState !== 0}
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
          <Select
            defaultValue={1}
            sx={{
              minWidth: 125,
              background: "#CCA2EB",
              borderColor: "black",
              fontSize: "1.25rem",
              color: "black",
              borderRadius: 0,
              "&:hover": {
                background: "#B689DA",
              },
            }}
            onChange={handleDifficulty}
          >
            <Option value={1}>Normal</Option>
            <Option value={2}>Hard</Option>
          </Select>
        </div>
      </div>
      <div className="text-2xl mt-20">{`Guess ${guesses.length}/8`}</div>
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
