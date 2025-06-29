import { useState, useEffect, ChangeEvent } from "react";
import * as Styled from "./styles";

export interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export interface LocationSearchInputProps {
  value: string;
  onSelect: (s: Suggestion) => void;
}

export default function LocationSearchInput({ value, onSelect }: LocationSearchInputProps) {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (input.length < 3) {
        setSuggestions([]);
        return;
      }
      fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(input)}`)
        .then(res => res.json())
        .then(data => setSuggestions(data))
        .catch(() => setSuggestions([]));
    }, 500);
    return () => clearTimeout(t);
  }, [input]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowList(true);
  };

  const handleSelect = (s: Suggestion) => {
    setInput(s.display_name);
    setShowList(false);
    onSelect(s);
  };

  return (
    <Styled.Wrapper>
      <Styled.Input
        placeholder="Região"
        value={input}
        onChange={handleChange}
        onFocus={() => input && setShowList(true)}
      />
      {showList && suggestions.length > 0 && (
        <Styled.List>
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handleSelect(s)}>
              {s.display_name}
            </li>
          ))}
        </Styled.List>
      )}
    </Styled.Wrapper>
  );
}
