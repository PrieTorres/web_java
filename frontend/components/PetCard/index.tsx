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
  };
}

export const PetCard = ({ pet }: PetCardProps) => {
  return (
    <Styled.Container>
      <Styled.ImageWrapper>
        <SafeImage src={pet.imagem ?? "https://via.placeholder.com/300x200"} text={pet.nome} height={200} />
      </Styled.ImageWrapper>
      <Styled.Content>
        <h3>{pet.nome}</h3>
        {pet.tipo && <span className="tipo">{pet.tipo}</span>}
        {pet.descricao && <p className="descricao">{pet.descricao}</p>}
        {pet.tags && pet.tags.length > 0 && (
          <Styled.Tags>
            {pet.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </Styled.Tags>
        )}
      </Styled.Content>
    </Styled.Container>
  );
};
