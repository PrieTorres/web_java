"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
  const [filtros, setFiltros] = useState({
    latitude: "",
    longitude: "",
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

  const fetchPets = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtros.latitude && filtros.longitude && filtros.raio) {
      params.append("lat", filtros.latitude);
      params.append("lng", filtros.longitude);
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
      <form onSubmit={handleSubmit} style={{ width: "100%", marginBottom: "16px" }}>
        <input
          className="border rounded px-2 py-1 mb-2 w-full"
          name="latitude"
          placeholder="Latitude"
          value={filtros.latitude}
          onChange={handleChange}
        />
        <input
          className="border rounded px-2 py-1 mb-2 w-full"
          name="longitude"
          placeholder="Longitude"
          value={filtros.longitude}
          onChange={handleChange}
        />
        <input
          className="border rounded px-2 py-1 mb-2 w-full"
          name="raio"
          placeholder="Raio em km"
          value={filtros.raio}
          onChange={handleChange}
        />
        <select name="tipo" className="border rounded px-2 py-1 mb-2 w-full" value={filtros.tipo} onChange={handleChange}>
          <option value="">Todos os tipos</option>
          {tiposDeAnimais.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 mb-2 w-full"
          name="categorias"
          placeholder="Categorias separadas por vírgula"
          value={filtros.categorias}
          onChange={handleChange}
        />
        <button type="submit" className="bg-orange-500 text-white px-2 py-1 rounded">Filtrar</button>
      </form>
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
