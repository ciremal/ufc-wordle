export enum GameState {
  Playing = "playing",
  Won = "won",
  Lost = "lost",
}

export type GameStats = {
  gamesPlayed: number;
  wins: number;
  streak: number;
  longestStreak: number;
};
