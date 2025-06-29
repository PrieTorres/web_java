"use client";
import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { LoadingSection } from "@/components/LoadingSection";
import { SafeImage } from "@/components/SafeImage";
import { fetchTk } from "@/lib/helper";
import Link from "next/link";

type Pet = {
  id: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  tags?: string[];
  imagem?: string;
  localizacao?: Record<string, any>;
  email?: string;
  telefone?: string;
};

export default function PetPage({ params }: { params: { id: string } }) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTk(`/api/pets/${params.id}`)
      .then((res) => res.json())
      .then((data) => setPet(data))
      .catch((err) => console.error("fetch pet", err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <LoadingSection />;
  if (!pet) return <Section>Pet não encontrado</Section>;

  return (
    <Section>
      <h1>{pet.nome}</h1>
      <div style={{ maxWidth: 400 }}>
        <SafeImage
          src={pet.imagem ?? "https://via.placeholder.com/300x200"}
          text={pet.nome}
          width={400}
          height={300}
        />
      </div>
      {pet.tipo && <p>Tipo: {pet.tipo}</p>}
      {pet.descricao && <p>{pet.descricao}</p>}
      {pet.tags && pet.tags.length > 0 && (
        <div>
          {pet.tags.map((t) => (
            <span key={t} style={{ marginRight: 4 }} className="tag">{t}</span>
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
      <Link href="/allPets">Voltar</Link>
    </Section>
  );
}
