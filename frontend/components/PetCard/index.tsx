"use client";
import { SafeImage } from "../SafeImage";
import * as Styled from "./styles";

export interface PetCardProps {
  pet: {
    id: string;
    nome: string;
    descricao?: string;
    tipo?: string;
    tags?: string[];
    imagem?: string;
    imagens?: string[];
    matchTags?: string[];
    missingTags?: string[];
  };
}

export const PetCard = ({ pet }: PetCardProps) => {
  const imgSrc = pet.imagens?.[0] ?? pet.imagem ?? "https://via.placeholder.com/300x200";
  return (
    <Styled.Container>
      <Styled.ImageWrapper>
        <SafeImage
          src={imgSrc}
          text={pet.nome}
          width={300}
          height={200}
        />
      </Styled.ImageWrapper>
      <Styled.Content>
        <h3>{pet.nome}</h3>
        {pet.tipo && <span className="tipo">{pet.tipo}</span>}
        {pet.descricao && <p className="descricao">{pet.descricao}</p>}
        {pet.tags && pet.tags.length > 0 && (
          <Styled.Tags>
            {pet.tags.map((tag) => (
              <span
                key={tag}
                className={
                  pet.matchTags && pet.matchTags.includes(tag)
                    ? "tag found"
                    : "tag"
                }
              >
                {tag}
              </span>
            ))}
          </Styled.Tags>
        )}
        {pet.missingTags && pet.missingTags.length > 0 && (
          <p className="missing">
            Não encontrado: {pet.missingTags.join(", ")}
          </p>
        )}
      </Styled.Content>
    </Styled.Container>
  );
};

