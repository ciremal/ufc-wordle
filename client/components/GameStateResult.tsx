import { capitalize } from "@/helpers/format";
import { FormattedFighter } from "@/types/fighter";
import { GameState } from "@/types/game";
import { Timer } from "./Timer";

type GameStateResultProps = {
  gameState: GameState;
  dailyFighter: FormattedFighter | undefined;
};

const GameStateResult = ({ gameState, dailyFighter }: GameStateResultProps) => {
  return (
    <div className="text-center">
      {gameState === GameState.Won && (
        <div className="flex flex-col items-center gap-4 text-lg">
          <div>
            Congrats! You guessed the fighter,{" "}
            {capitalize(dailyFighter?.name ?? "")}.
          </div>
          <div>
            <Timer />
          </div>
        </div>
      )}
      {gameState === GameState.Lost && (
        <div>
          Sorry! You did not guess the fighter,{" "}
          {capitalize(dailyFighter?.name ?? "")}
        </div>
      )}
    </div>
  );
};

export default GameStateResult;
