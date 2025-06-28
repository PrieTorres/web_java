"use client";
import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { LoadingSection } from "@/components/LoadingSection";
import { PetCard } from "@/components/PetCard";
import { fetchTk } from "@/lib/helper";

interface Pet {
  id: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  tags?: string[];
  imagem?: string;
}

export default function AllPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTk("/api/pets")
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("fetch pets", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Section type="flex-list">
      {loading ? (
        <LoadingSection />
      ) : (
        pets.map((pet) => <PetCard key={pet.id} pet={pet} />)
      )}
    </Section>
  );
}
