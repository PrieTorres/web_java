"use client";
import { ChangeEvent } from "react";
import Image from "next/image";

export interface ImageInputProps {
  previews: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageInput({ previews, onChange }: ImageInputProps) {
  return (
    <>
      <input type="file" name="imagens" onChange={onChange} multiple className="input" />
      {previews.length > 0 && (
        <div className="image-wrapper">
          {previews.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="Pré-visualização"
              className="preview"
              width={100}
              height={100}
            />
          ))}
        </div>
      )}
    </>
  );
}
