"use client";
import { useState } from "react";
import { Container } from "./styles";
import Image, { StaticImageData } from "next/image";
import { TranslatedSpan } from "../TranslatedSpan";

export interface SafeImageProps {
  src: string | StaticImageData;
  text?: string;
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
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export const SafeImage = ({ src, text, width = 40, height, className, alt, onClick }: SafeImageProps) => {
  const [imageError, setImageError] = useState(false);
  const finalHeight = height ?? width;

  return (
    <Container style={{ width, height: finalHeight }}>
      {!imageError ? (
        <div className={className ?? ""}>
          <Image
            unoptimized
            src={src}
            alt={alt ?? text ?? "no description"}
            width={width}
            height={finalHeight}
            onError={() => setImageError(true)}
            onClick={onClick}
          />
        </div>
      ) : (
        <TranslatedSpan>{text ?? ""}</TranslatedSpan>
      )}
    </Container>
  );
};


