export const compareStats = (
  key: string,
  guessedFighter: any,
  selectedFighter: any
) => {
  const guessStat = guessedFighter[key];
  const selectedFighterStat = selectedFighter[key];
  if (key === "wins" || key === "losses" || key === "height" || key === "age") {
    if (guessStat === selectedFighterStat) {
      return { value: guessStat, color: "green", hint: null };
    } else {
      const greater = guessStat > selectedFighterStat;
      const close = Math.abs(guessStat - selectedFighterStat) <= 2;
      if (greater && close) {
        return { value: guessStat, color: "yellow", hint: "down" };
      } else if (greater && !close) {
        return { value: guessStat, color: null, hint: "down" };
      } else if (!greater && close) {
        return { value: guessStat, color: "yellow", hint: "up" };
      } else {
        return { value: guessStat, color: null, hint: "up" };
      }
    }
  } else {
    if (guessStat === selectedFighterStat) {
      return { value: guessStat, color: "green", hint: null };
    } else {
      return { value: guessStat, color: null, hint: null };
    }
  }
};
