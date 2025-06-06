"use client";

import { Table } from "@mui/joy";
import { useEffect, useState } from "react";
import { getAllFighters } from "@/api/fetchFighterInfo";

const GuessTable = () => {
  function createData(
    name: string,
    division: string,
    age: number,
    wins: number,
    losses: number,
    height: number,
    country: string
  ) {
    return { name, division, age, wins, losses, height, country };
  }

  const [fighters, setFighters] = useState();

  useEffect(() => {
    const fetchFighters = async () => {
      try {
        const fighters = await getAllFighters();
        const processedFighters = fighters.filter((fighter: any) => {
          const fighterRecord = fighter.record;
          return fighterRecord[0] + fighterRecord[1] + fighterRecord[2] >= 15;
        });
        setFighters(processedFighters);
      } catch (error) {
        console.error("Error fetching fighters:", error);
      }
    };
    fetchFighters();
  }, []);

  console.log(fighters);
  const rows: any[] = [
    // createData("Conor McGregor", "Lightweight", 35, 24, 6, 65, "Ireland"),
  ];

  return (
    <Table
      sx={{
        "& tr > *:not(:first-child)": { textAlign: "right" },
      }}
    >
      <thead>
        <tr className="text-lg">
          <th style={{ width: "40%" }}>Fighter Name</th>
          <th>Division</th>
          <th>Age</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Height&nbsp;(In)</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody className="text-lg">
        {rows.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.division}</td>
            <td>{row.age}</td>
            <td>{row.wins}</td>
            <td>{row.losses}</td>
            <td>{row.height}</td>
            <td>{row.country}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default GuessTable;
