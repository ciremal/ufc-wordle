export const formatCountry = (hometown: string) => {
  const res = hometown.split(",");
  return res[res.length - 1].trim();
};

export const capitalize = (word: string) => {
  const splitWord = word.split(" ");
  const capitalizedWords = splitWord.map((w) => {
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
  return capitalizedWords.join(" ");
};
