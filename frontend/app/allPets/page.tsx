"use client";
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { LoadingSection } from "@/components/LoadingSection";
import { PetCard } from "@/components/PetCard";
import { fetchTk } from "@/lib/helper";
import LocationSearchInput, { Suggestion } from "@/components/LocationSearchInput";
import { TagChip } from "@/components/TagChip";
import * as Styled from "@/components/PetFilter/styles";

interface Pet {
  id: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  tags?: string[];
  imagem?: string;
  matchTags?: string[];
  missingTags?: string[];
}

export default function AllPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    regiao: "",
    lat: "",
    lon: "",
    raio: "10",
    tipo: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

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

  const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.endsWith(',')) {
      const tag = value.slice(0, -1).trim();
      if (tag && !tags.includes(tag)) {
        setTags((prev) => [...prev, tag]);
      }
      setTagInput('');
    } else {
      setTagInput(value);
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        setTags((prev) => [...prev, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
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
    const url = "/api/pets" + (params.toString() ? `?${params.toString()}` : "");
    fetchTk(url)
      .then((res) => res.json())
      .then((data: Pet[]) => {
        const withScore = data.map((p) => {
          const petTags = p.tags ?? [];
          const matchTags = tags.filter((t) =>
            petTags.some((pt) => pt.toLowerCase() === t.toLowerCase())
          );
          const missingTags = tags.filter(
            (t) => !matchTags.some((m) => m.toLowerCase() === t.toLowerCase())
          );
          return { ...p, matchTags, missingTags, score: matchTags.length } as Pet & { score: number };
        });
        withScore.sort((a, b) => b.score - a.score);
        setPets(withScore);
      })
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
        <Styled.RangeWrapper>
          <label>
            Raio: {filtros.raio} km
            <input
              type="range"
              name="raio"
              min="1"
              max="5000"
              value={filtros.raio}
              onChange={handleChange}
            />
          </label>
        </Styled.RangeWrapper>
        <Styled.Select name="tipo" value={filtros.tipo} onChange={handleChange}>
          <option value="">Todos os tipos</option>
          {tiposDeAnimais.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Styled.Select>
        <Styled.TagInputWrapper>
          <input
            name="tags"
            placeholder="Digite a tag e pressione , ou Enter"
            value={tagInput}
            onChange={handleTagInput}
            onKeyDown={handleTagKeyDown}
          />
          {tags.length > 0 && (
            <div className="tags">
              {tags.map((t) => (
                <TagChip key={t} label={t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
        </Styled.TagInputWrapper>
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
