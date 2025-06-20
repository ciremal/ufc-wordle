"use client";

import { Table } from "@mui/joy";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { capitalize } from "@/helpers/format";
import { Guess } from "@/types/fighter";
import { GameState } from "@/types/game";

type GuessTableProps = {
  fighters: Guess[];
  gameState: GameState;
};

const getHint = (hint: string) => {
  return hint === "down" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />;
};

const getColor = (color: string | null | undefined) => {
  return color === "green"
    ? "bg-green-400"
    : color === "yellow"
    ? "bg-yellow-300"
    : "";
};

const tableItemClass = `w-full flex items-center gap-2 px-4 py-1`;

const GuessTable = ({ fighters, gameState }: GuessTableProps) => {
  return (
    <Table>
      <thead>
        <tr className="text-lg">
          <th>Fighter Name</th>
          <th>Division</th>
          <th>Age</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Height (In)</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        {fighters.map((fighter) => (
          <tr
            key={fighter.name.value}
            className={`text-lg ${
              gameState === GameState.Won
                ? `last:${getColor("green")} last:font-bold`
                : ""
            }`}
          >
            <td>
              <div
                className={`w-full flex items-center px-4 py-1 ${getColor(
                  fighter.name.color
                )}`}
              >
                {capitalize(fighter.name.value as string)}
              </div>
            </td>
            <td>
              <div
                className={`${tableItemClass} ${getColor(
                  fighter.division.color
                )}`}
              >
                {capitalize(fighter.division.value as string)}
              </div>
            </td>
            <td>
              <div
                className={`${tableItemClass} ${getColor(fighter.age.color)}`}
              >
                {fighter.age.value}
                {fighter.age.hint && getHint(fighter.age.hint)}
              </div>
            </td>
            <td>
              <div
                className={`${tableItemClass} ${getColor(fighter.wins.color)}`}
              >
                {fighter.wins.value}
                {fighter.wins.hint && getHint(fighter.wins.hint)}
              </div>
            </td>
            <td>
              <div
                className={`${tableItemClass} ${getColor(
                  fighter.losses.color
                )}`}
              >
                {fighter.losses.value}
                {fighter.losses.hint && getHint(fighter.losses.hint)}
              </div>
            </td>
            <td>
              <div
                className={`${tableItemClass} ${getColor(
                  fighter.height.color
                )}`}
              >
                {fighter.height.value}
                {fighter.height.hint && getHint(fighter.height.hint)}
              </div>
            </td>
            <td>
              <div
                className={`${tableItemClass} ${getColor(
                  fighter.country.color
                )}`}
              >
                {capitalize(fighter.country.value as string)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default GuessTable;
