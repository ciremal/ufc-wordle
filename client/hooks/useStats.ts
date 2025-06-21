import { GameStats } from "@/types/game";
import { useEffect, useState } from "react";

const initialStats: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  streak: 0,
  longestStreak: 0,
};

export const useStats = () => {
  const [stats, setStats] = useState<GameStats>(initialStats);

  useEffect(() => {
    const stats = { ...initialStats };
    for (const key in stats) {
      stats[key as keyof GameStats] = parseInt(
        localStorage.getItem(key) || "0"
      );
    }
    setStats(stats);
  }, []);

  const updateStat = (key: keyof GameStats, value: number) => {
    localStorage.setItem(key, value.toString());
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  return { stats, updateStat };
};
