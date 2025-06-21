import { Autocomplete, createFilterOptions } from "@mui/joy";
import { SyntheticEvent } from "react";

type SearchBarProps = {
  options: string[];
  onGuess: (e: SyntheticEvent<Element, Event>, value: string | unknown) => void;
  disabled: boolean;
};

const SearchBar = ({ options, onGuess, disabled }: SearchBarProps) => {
  const filterOptions = createFilterOptions({
    limit: 25,
  });

  return (
    <Autocomplete
      placeholder="Guess the fighter..."
      options={options}
      sx={{
        width: {
          xs: "100%",
          sm: "75%",
          lg: "50%",
        },
        maxWidth: 800,
        fontSize: "1.5rem",
        borderColor: "var(--borderColor)",
        borderWidth: 2,
        borderRadius: 0,
        paddingY: {
          xs: 1,
          lg: 0,
        },
      }}
      filterOptions={filterOptions}
      onChange={onGuess}
      selectOnFocus
      clearOnBlur
      disabled={disabled}
    />
  );
};

export default SearchBar;
