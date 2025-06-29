"use client";
import { useContext, useEffect, useState } from "react";
import { PageContext } from "@/context/PageContext";
import { fetchTk } from "@/lib/helper";
import { Section } from "@/components/Section";
import { LoadingSection } from "@/components/LoadingSection";
import { PetCard } from "@/components/PetCard";
import Link from "next/link";

interface Pet {
  id: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  tags?: string[];
  imagem?: string;
}

export default function MyPetsPage() {
  const { token } = useContext(PageContext);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchTk("/api/pets/me", { headers: { Authorization: token } })
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("fetch my pets", err))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Section type="flex-list">
      {loading ? (
        <LoadingSection />
      ) : (
        pets.map((pet) => (
          <div key={pet.id}>
            <PetCard pet={pet} />
            <Link href={`/editPet/${pet.id}`}>Editar</Link>
          </div>
        ))
      )}
    </Section>
  );
}
