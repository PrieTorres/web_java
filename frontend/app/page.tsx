"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { LoadingSection } from "@/components/LoadingSection";
import { PetCard } from "@/components/PetCard";
import { fetchTk, distanceKm, Coordinates } from "@/lib/helper";

interface Pet {
  id: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  tags?: string[];
  imagem?: string;
  imagens?: string[];
  localizacao?: Coordinates;
}

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let position: Coordinates | null = null;

    const loadPets = async () => {
      try {
        const res = await fetchTk("/api/pets");
        const data: Pet[] = await res.json();
        let list = data;
        if (position) {
          list = data
            .filter(p => p.localizacao &&
              typeof p.localizacao.latitude === "number" &&
              typeof p.localizacao.longitude === "number")
            .map(p => ({
              ...p,
              distance: distanceKm(position as Coordinates, p.localizacao as Coordinates),
            }))
            .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        }
        setPets(list.slice(0, 5));
      } catch (err) {
        console.error("fetch pets", err);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          position = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          loadPets();
        },
        () => loadPets(),
      );
    } else {
      loadPets();
    }
  }, []);

  return (
    <main>
      <Section type="centered">
        <div>
          <h2>Adote seu novo amigo</h2>
          <p>Encontre pets disponíveis para adoção perto de você.</p>
        </div>
      </Section>
      <Section type="flex-list">
        {loading ? (
          <LoadingSection />
        ) : (
          pets.map((pet) => (
            <div key={pet.id}>
              <PetCard pet={pet} />
            </div>
          ))
        )}
      </Section>
    </main>
  );
}
