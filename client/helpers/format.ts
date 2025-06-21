export const formatCountry = (hometown: string) => {
  const res = hometown.split(",");
  return res[res.length - 1].trim();
};

export const capitalize = (word: string): string => {
  if (!word) {
    return "";
  }
  const splitWord = word.split(" ");
  const capitalizedWords = splitWord.map((w) => {
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
  return capitalizedWords.join(" ");
};

export const formatDivision = (division: string) => {
  const formattedDivision = division
    .replace("Division", "")
    .replace("Women's", "W.")
    .replace("weight", "")
    .trim();
  return formattedDivision;
};
