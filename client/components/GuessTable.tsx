"use client";

import { Table } from "@mui/joy";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { capitalize, formatDivision } from "@/helpers/format";
import { Guess } from "@/types/fighter";
import { GameState } from "@/types/game";

type GuessTableProps = {
  fighters: Guess[];
  gameState: GameState;
};

const getHint = (hint: string) => {
  return hint === "down" ? (
    <ArrowDownwardIcon fontSize="inherit" />
  ) : (
    <ArrowUpwardIcon fontSize="inherit" />
  );
};

const GuessTable = ({ fighters, gameState }: GuessTableProps) => {
  return (
    <Table>
      <thead>
        <tr className="text-sm md:text-lg">
          <th>
            <span className="hidden md:inline">Fighter Name</span>
            <span className="inline md:hidden">Name</span>
          </th>
          <th>
            <span className="hidden md:inline">Division</span>
            <span className="inline md:hidden">Div.</span>
          </th>
          <th>Age</th>
          <th>Win</th>
          <th>Loss</th>
          <th>
            <span className="hidden md:inline">Height (In)</span>
            <span className="inline md:hidden">Ht</span>
          </th>
          <th>
            <span className="hidden md:inline">Country</span>
            <span className="inline md:hidden">Ctry</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {fighters.map((fighter) => (
          <tr
            key={fighter.name.value}
            className={`text-xs md:text-lg ${
              gameState === GameState.Won
                ? `last:bg-green-400 last:font-bold`
                : ""
            }`}
          >
            <td>
              <div
                className={`w-full flex items-center md:px-4 py-1 ${fighter.name.color}`}
              >
                {capitalize(fighter.name.value as string)}
              </div>
            </td>
            <td>
              <div className={`table-item ${fighter.division.color}`}>
                <span className="hidden md:inline">
                  {capitalize(fighter.division.value as string)}
                </span>
                <span className="inline md:hidden">
                  {formatDivision(capitalize(fighter.division.value as string))}
                </span>
              </div>
            </td>
            <td>
              <div className={`table-item ${fighter.age.color}`}>
                {fighter.age.value}
                {fighter.age.hint && getHint(fighter.age.hint)}
              </div>
            </td>
            <td>
              <div className={`table-item ${fighter.wins.color}`}>
                {fighter.wins.value}
                {fighter.wins.hint && getHint(fighter.wins.hint)}
              </div>
            </td>
            <td>
              <div className={`table-item ${fighter.losses.color}`}>
                {fighter.losses.value}
                {fighter.losses.hint && getHint(fighter.losses.hint)}
              </div>
            </td>
            <td>
              <div className={`table-item ${fighter.height.color}`}>
                {fighter.height.value}
                {fighter.height.hint && getHint(fighter.height.hint)}
              </div>
            </td>
            <td>
              <div className={`table-item ${fighter.country.color}`}>
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
