"use client";
import { ChangeEvent } from "react";

export interface ImageInputProps {
  preview: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageInput({ preview, onChange }: ImageInputProps) {
  return (
    <>
      <input type="file" name="imagem" onChange={onChange} className="input" />
      {preview && (
        <div className="image-wrapper">
          <img src={preview} alt="Pré-visualização" className="preview" />
        </div>
      )}
    </>
  );
}
