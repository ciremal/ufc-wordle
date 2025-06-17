export type Fighter = {
  name: string;
  division: string;
  record: number[];
  status: string;
  hometown: string;
  age: number;
  weight: number;
  debut: string;
  ko_tko: number;
  dec: number;
  sub: number;
  standing: number;
  clinch: number;
  ground: number;
  str_acc: string;
  tkd_acc: string;
  sig_str_landed: number;
  sig_str_absorbed: number;
  tkd_avg: number;
  sub_avg: number;
  sig_str_def: string;
  tkd_def: string;
  kd_avg: number;
  avg_fight_time: string;
  fighting_style: string;
  height: number;
  leg_reach: number;
  rank: string;
  reach: number;
};

export type FormattedFighter = {
  name: string;
  division: string;
  age: number;
  wins: number;
  losses: number;
  height: number;
  country: string;
  rank: string;
};

type FighterHint = "up" | "down" | null;
type FighterColor = "green" | "yellow" | null;

type FighterGuess = {
  value: number | string;
  color?: FighterColor;
  hint?: FighterHint;
};

export type Guess = {
  name: FighterGuess;
  division: FighterGuess;
  age: FighterGuess;
  wins: FighterGuess;
  losses: FighterGuess;
  height: FighterGuess;
  country: FighterGuess;
  rank: FighterGuess;
};
