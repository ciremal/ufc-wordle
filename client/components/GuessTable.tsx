"use client";

import { Table } from "@mui/joy";

type GuessTableProps = {
  fighters: any[];
};

const GuessTable = ({ fighters }: GuessTableProps) => {
  console.log(fighters);
  return (
    <Table>
      <thead>
        <tr>
          <th>Fighter Name</th>
          <th>Division</th>
          <th>Age</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Height</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        {fighters.map((fighter) => {
          const [wins, losses] = fighter.record;
          return (
            <tr key={fighter.name} className="text-lg">
              <td>{fighter.name}</td>
              <td>{fighter.division}</td>
              <td>
                <div className="bg-green-400 w-fit px-4 py-1">
                  {fighter.age}
                </div>
              </td>
              <td>{wins}</td>
              <td>{losses}</td>
              <td>{fighter.height}</td>
              <td>{fighter.hometown}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default GuessTable;
