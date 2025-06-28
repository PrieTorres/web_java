"use client";
import { useState } from "react";
import { Container } from "./styles";
import Image, { StaticImageData } from "next/image";
import { TranslatedSpan } from "../TranslatedSpan";
import { useThemeContext } from "../Provider/Provider";

export interface SafeImageProps {
  src: string | StaticImageData;
  text: string;
  /**
   * Width of the rendered image in pixels.
   * Defaults to 40.
   */
  width?: number;
  /**
   * Height of the rendered image in pixels.
   * Defaults to width when omitted.
   */
  height?: number;
}

export const SafeImage = ({ src, text, width = 40, height }: SafeImageProps) => {
  const [imageError, setImageError] = useState(false);
  const theme = useThemeContext();
  const finalHeight = height ?? width;

  return (
    <Container width={width} height={finalHeight}>
      {!imageError ? (
        <div className={theme.isLight ? "invert" : ""}>
          <Image
            className="grayscale"
            unoptimized
            src={src}
            alt={text}
            width={width}
            height={finalHeight}
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <TranslatedSpan>{text}</TranslatedSpan>
      )}
    </Container>
  );
};


