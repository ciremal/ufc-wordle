"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import GuessTable from "./GuessTable";
import InfoSection from "./InfoSection";
import { compareStats } from "@/helpers/compare";
import { Guess } from "@/types/fighter";
import { GameState } from "@/types/game";
import GameStateResult from "./GameStateResult";
import { useStats } from "@/hooks/useStats";
import { useFighters } from "@/hooks/useFighters";
import SearchBar from "./SearchBar";
import InfoButton from "./InfoButton";

const ClientHome = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.Playing);
  const { stats, updateStat } = useStats();
  const { fighters, dailyFighter } = useFighters();

  const maxGuesses = 10;
  const today = new Date().toISOString().slice(0, 10);

  const handleInfoSection = (section: string) => {
    switch (section) {
      case "help":
        setShowHelp(!showHelp);
        setShowAbout(false);
        setShowStats(false);
        break;
      case "about":
        setShowAbout(!showAbout);
        setShowHelp(false);
        setShowStats(false);
        break;
      case "stats":
        setShowStats(!showStats);
        setShowAbout(false);
        setShowHelp(false);
    }
  };

  const handleGuess = (
    e: SyntheticEvent<Element, Event>,
    value: string | unknown
  ) => {
    const exists = guesses.find((f) => f.name.value === value);
    if (value && !exists) {
      const fighter = fighters.find((f) => f.name === value);
      if (!fighter || !dailyFighter) {
        return;
      }

      if (fighter.name === dailyFighter.name) {
        setGameState(GameState.Won);
      } else {
        if (guesses.length === maxGuesses - 1) {
          setGameState(GameState.Lost);
        }
      }

      const keys = Object.keys(fighter);
      const resultEntries = keys.map((key) => [
        key,
        compareStats(key, fighter, dailyFighter),
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
  }, []);

  useEffect(() => {
    const checkLocalStorage = localStorage.getItem(today);
    // Already exists
    if (checkLocalStorage) {
      return;
    }

    if (gameState !== GameState.Playing) {
      const todayInfo = {
        result: gameState,
        guesses: guesses,
      };
      localStorage.setItem(today, JSON.stringify(todayInfo));
      switch (gameState) {
        case GameState.Won:
          updateStat("gamesPlayed", stats.gamesPlayed + 1);
          updateStat("wins", stats.wins + 1);
          updateStat("streak", stats.streak + 1);
          if (stats.streak + 1 > stats.longestStreak) {
            updateStat("longestStreak", stats.longestStreak + 1);
          }
          break;
        case GameState.Lost:
          updateStat("gamesPlayed", stats.gamesPlayed + 1);
          updateStat("streak", 0);
          break;
        default:
          break;
      }
    }
  }, [gameState]);

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
      on UFC fighters. Everyday, a new fighter will be picked. Because there are
      so many UFC fighters, with many of them who are still unknown even to
      frequent watchers, this list contains only
      <span className="font-bold"> currently ranked fighters</span> across all
      divisions. This may be changed in coming updates. Happy guessing!
    </div>
  );

  const statsDesc = (
    <div className="grid grid-cols-2 gap-4 text-lg">
      <div>
        <div>Games Played</div>
        <div className="stat-metric">{stats.gamesPlayed}</div>
      </div>
      <div>
        <div>Wins</div>
        <div className="stat-metric">{stats.wins}</div>
      </div>
      <div>
        <div>Current Streak</div>
        <div className="stat-metric">{stats.streak}</div>
      </div>
      <div>
        <div>Longest Streak</div>
        <div className="stat-metric">{stats.longestStreak}</div>
      </div>
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
      <InfoSection title="Your Stats" expand={showStats}>
        {statsDesc}
      </InfoSection>

      <div className="w-[90%] flex flex-col-reverse items-center gap-3 mt-10 md:justify-between md:flex-row md:items-stretch">
        <SearchBar
          options={fighterNames}
          onGuess={handleGuess}
          disabled={gameState !== GameState.Playing}
        />
        <div className="flex gap-4">
          <InfoButton
            onClick={() => handleInfoSection("help")}
            label="Help"
            color="#F17171"
          />
          <InfoButton
            onClick={() => handleInfoSection("about")}
            label="About"
            color="#69B3AE"
          />
          <InfoButton
            onClick={() => handleInfoSection("stats")}
            label="Stats"
            color="#C9A2EA"
          />
        </div>
      </div>

      <div className="text-2xl mt-20">{`Guess ${guesses.length}/${maxGuesses}`}</div>
      <GameStateResult gameState={gameState} dailyFighter={dailyFighter} />
      <div className="my-15 md:w-[90%]">
        <GuessTable fighters={guesses} gameState={gameState} />
      </div>
    </div>
  );
};

export default ClientHome;
