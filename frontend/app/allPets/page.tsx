"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { LoadingSection } from "@/components/LoadingSection";
import { PetCard } from "@/components/PetCard";
import { fetchTk } from "@/lib/helper";
import LocationSearchInput, { Suggestion } from "@/components/LocationSearchInput";
import * as Styled from "@/components/PetFilter/styles";

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
  const [filtros, setFiltros] = useState({
    regiao: "",
    lat: "",
    lon: "",
    raio: "",
    tipo: "",
    categorias: "",
  });

  const tiposDeAnimais = [
    "Cachorro",
    "Gato",
    "Coelho",
    "Cavalo",
    "Aranha",
    "Hamster",
    "Peixe",
    "Pássaro",
    "Porco",
    "Tartaruga",
    "Lagarto",
    "Cobra",
    "Papagaio",
    "Furão",
    "Iguana",
    "Camaleão",
    "Rato",
    "Galinha",
    "Pato",
    "Ovelha",
    "Vaca",
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionSelect = (s: Suggestion) => {
    setFiltros((prev) => ({
      ...prev,
      regiao: s.display_name,
      lat: s.lat,
      lon: s.lon,
    }));
  };

  const fetchPets = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtros.lat && filtros.lon && filtros.raio) {
      params.append("lat", filtros.lat);
      params.append("lng", filtros.lon);
      params.append("raio", filtros.raio);
    }
    if (filtros.tipo) params.append("tipo", filtros.tipo);
    if (filtros.categorias) params.append("categorias", filtros.categorias);
    const url = "/api/pets" + (params.toString() ? `?${params.toString()}` : "");
    fetchTk(url)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("fetch pets", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchPets();
  };

  return (
    <Section type="flex-list">
      <Styled.Form onSubmit={handleSubmit}>
        <LocationSearchInput value={filtros.regiao} onSelect={handleRegionSelect} />
        <Styled.Input
          name="raio"
          placeholder="Raio em km"
          value={filtros.raio}
          onChange={handleChange}
        />
        <Styled.Select name="tipo" value={filtros.tipo} onChange={handleChange}>
          <option value="">Todos os tipos</option>
          {tiposDeAnimais.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Styled.Select>
        <Styled.Input
          name="categorias"
          placeholder="Categorias separadas por vírgula"
          value={filtros.categorias}
          onChange={handleChange}
        />
        <button type="submit">Filtrar</button>
      </Styled.Form>
      {loading ? (
        <LoadingSection />
      ) : (
        pets.map((pet, i) => (
          <div key={pet.id ?? i}>
            <PetCard pet={pet} />
          </div>
        ))
      )}
    </Section>
  );
}
