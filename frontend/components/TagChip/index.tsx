"use client";
import { ReactElement } from "react";
import * as Styled from "./styles";

export interface TagChipProps {
  label: string;
  onRemove: () => void;
}

export const TagChip = ({ label, onRemove }: TagChipProps): ReactElement => {
  return (
    <Styled.Container>
      <span>{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remover ${label}`}>×</button>
    </Styled.Container>
  );
};
