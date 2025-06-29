"use client";
import { ChangeEvent, KeyboardEvent } from "react";
import { TagChip } from "../TagChip";

export interface TagInputListProps {
  tags: string[];
  tagInput: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onRemove: (tag: string) => void;
}

export default function TagInputList({
  tags,
  tagInput,
  onInputChange,
  onInputKeyDown,
  onRemove,
}: TagInputListProps) {
  return (
    <div className="tag-input-wrapper">
      <input
        name="tags"
        placeholder="Digite e pressione , ou Enter"
        value={tagInput}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
        className="input"
      />
      {tags.length > 0 && (
        <div className="tags">
          {tags.map((t) => (
            <TagChip key={t} label={t} onRemove={() => onRemove(t)} />
          ))}
        </div>
      )}
    </div>
  );
}
