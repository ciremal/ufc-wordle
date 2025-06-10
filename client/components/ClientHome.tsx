"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import GuessTable from "./GuessTable";
import InfoSection from "./InfoSection";
import Autocomplete, { createFilterOptions } from "@mui/joy/Autocomplete";
import { getAllFighters } from "@/api/fetchFighterInfo";

const ClientHome = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [fighters, setFighters] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<any[]>([]);

  const selectedFighter = {
    _id: "68409a6788fa8b217084081c",
    name: "drew dober",
    division: "lightweight division",
    record: [27, 15, 0],
    status: "active",
    hometown: "omaha, united states",
    fighting_style: "freestyle",
    age: 36,
    height: 68,
    weight: 155,
    debut: "dec. 1, 2013",
    reach: 70,
    leg_reach: 35,
    ko_tko: 15,
    dec: 7,
    sub: 5,
    standing: 692,
    clinch: 105,
    ground: 92,
    str_acc: "40%",
    tkd_acc: "17%",
    sig_str_landed: 4.36,
    sig_str_absorbed: 4.33,
    tkd_avg: 0.66,
    sub_avg: 0.07,
    sig_str_def: "51%",
    tkd_def: "56%",
    kd_avg: 0.66,
    avg_fight_time: "07:51",
  };

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
      setGuesses([...guesses, fighter]);
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
        setFighters(filtered);
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
          clearOnEscape
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

      <div className="mt-20 w-[90%]">
        <GuessTable fighters={guesses} />
      </div>
    </div>
  );
};

export default ClientHome;
