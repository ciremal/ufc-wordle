import { FormattedFighter } from "@/types/fighter";
import { createHash } from "crypto";

export const getDailyFighter = (fighters: FormattedFighter[]) => {
  const today = new Date().toISOString().split("T")[0];
  const hash = createHash("sha256").update(today).digest("hex");
  const hashInt = parseInt(hash.slice(0, 8), 16);
  const index = hashInt % fighters.length;
  return fighters[index];
};
