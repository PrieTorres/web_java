"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/Section";
import { LoadingSection } from "@/components/LoadingSection";
import { SafeImage } from "@/components/SafeImage";
import { Carousel } from "@/components/Carousel";
import { TagChip } from "@/components/TagChip";
import { fetchTk } from "@/lib/helper";
import * as Styled from "./styles";

type Pet = {
  id: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  tags?: string[];
  imagem?: string;
  imagens?: string[];
  localizacao?: Record<string, any>;
  email?: string;
  telefone?: string;
};

export default function PetPage({ params }: { params: { id: string } }) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTk(`/api/pets/${params.id}`)
      .then((res) => res.json())
      .then((data) => setPet(data))
      .catch((err) => console.error("fetch pet", err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <LoadingSection />;
  if (!pet) return <Section>Pet não encontrado</Section>;
  const imagens = pet.imagens && pet.imagens.length > 0
    ? pet.imagens
    : pet.imagem
    ? [pet.imagem]
    : [];

  return (
    <Section>
      <Styled.Container>
        <h1>{pet.nome}</h1>
        {imagens.length > 0 && (
          <div className="image-wrapper">
            <Carousel
              items={imagens.map((src) => (
                <SafeImage
                  key={src}
                  src={src}
                  text={pet.nome}
                  width={400}
                  height={300}
                />
              ))}
            />
          </div>
        )}
        {pet.tipo && <p>Tipo: {pet.tipo}</p>}
        {pet.descricao && <p>{pet.descricao}</p>}
        {pet.tags && pet.tags.length > 0 && (
          <div className="tags">
            {pet.tags.map((t) => (
              <TagChip key={t} label={t} onRemove={() => {}} />
            ))}
          </div>
        )}
        {pet.localizacao && (
          <p>
            Localização: {pet.localizacao.cidade}, {pet.localizacao.estado}
          </p>
        )}
        {(pet.email || pet.telefone) && (
          <div>
            <h3>Contato</h3>
            {pet.email && (
              <p>Email: <a href={`mailto:${pet.email}`}>{pet.email}</a></p>
            )}
            {pet.telefone && (
              <p>Telefone: <a href={`tel:${pet.telefone}`}>{pet.telefone}</a></p>
            )}
          </div>
        )}
        <button type="button" className="back-button" onClick={() => router.back()}>
          Voltar
        </button>
      </Styled.Container>
    </Section>
  );
}
