import { getDailyFighter } from "@/helpers/dailyFighter";
import { formatCountry } from "@/helpers/format";
import { Fighter, FormattedFighter } from "@/types/fighter";
import { capitalize } from "@mui/material";
import { useEffect, useState } from "react";

export const useFighters = () => {
  const [fighters, setFighters] = useState<FormattedFighter[]>([]);
  const [dailyFighter, setDailyFighter] = useState<FormattedFighter>();

  useEffect(() => {
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
        setDailyFighter(getDailyFighter(filteredInfo));
      });
  }, []);

  return { fighters, dailyFighter };
};
