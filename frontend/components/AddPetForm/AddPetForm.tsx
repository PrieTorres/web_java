"use client";

import { ChangeEvent, FormEvent, useContext, useState, useEffect } from "react";
import { PageContext } from "@/context/PageContext";
import { fetchTk } from "@/lib/helper";
import { Container } from "./styles";

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

type FormState = {
  nome: string;
  descricao: string;
  tipo: string;
  tags: string;
  pais: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  cep: string;
  latitude: string;
  longitude: string;
  imagem: File | null;
};

export default function AddPetForm() {
  const { token } = useContext(PageContext);
  const [form, setForm] = useState<FormState>({
    nome: "",
    descricao: "",
    tipo: "",
    tags: "",
    pais: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    cep: "",
    latitude: "",
    longitude: "",
    imagem: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imagem: file }));
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleCepChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    setForm((prev) => ({ ...prev, cep }));
    if (cep.replace(/\D/g, "").length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (res.ok) {
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            pais: "Brasil",
            estado: data.uf ?? prev.estado,
            cidade: data.localidade ?? prev.cidade,
            bairro: data.bairro ?? prev.bairro,
            rua: data.logradouro ?? prev.rua,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
    }
  };

  const updateCoordinates = async () => {
    const address = `${form.rua} ${form.numero}, ${form.bairro}, ${form.cidade}, ${form.estado}, ${form.pais}`;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      if (res.ok) {
        const [info] = await res.json();
        if (info) {
          setForm((prev) => ({
            ...prev,
            latitude: info.lat,
            longitude: info.lon,
          }));
        }
      }
    } catch (err) {
      console.error("Erro ao obter coordenadas", err);
    }
  };

  useEffect(() => {
    if (form.rua && form.numero && form.cidade && form.estado && form.pais) {
      updateCoordinates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.rua, form.numero, form.bairro, form.cidade, form.estado, form.pais]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateCoordinates();
    let imagemBase64: string | undefined = undefined;
    if (form.imagem) {
      imagemBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(form.imagem as Blob);
      });
    }
    const petData = {
      nome: form.nome,
      descricao: form.descricao,
      tipo: form.tipo,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      localizacao: {
        pais: form.pais,
        estado: form.estado,
        cidade: form.cidade,
        bairro: form.bairro,
        rua: form.rua,
        numero: form.numero,
        cep: form.cep,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      },
      imagem: imagemBase64,
    };
    try {
      const res = await fetchTk("/api/pets/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify(petData),
      });
      if (!res.ok) {
        const text = await res.text();
        alert("Erro ao cadastrar pet: " + text);
      } else {
        alert("Pet cadastrado com sucesso!");
        setForm({
          nome: "",
          descricao: "",
          tipo: "",
          tags: "",
          pais: "",
          estado: "",
          cidade: "",
          bairro: "",
          rua: "",
          numero: "",
          cep: "",
          latitude: "",
          longitude: "",
          imagem: null,
        });
      }
    } catch (err) {
      console.error("handleSubmit", err);
      alert("Erro ao cadastrar pet");
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
          className="input"
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          className="input"
        />
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="input"
        >
          <option value="">Selecione o tipo</option>
          {tiposDeAnimais.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input type="file" name="imagem" onChange={handleImageChange} className="input" />
        {imagePreview && (
          <img src={imagePreview} alt="Pré-visualização" style={{ maxWidth: "100%", maxHeight: 200 }} />
        )}
        <input
          name="tags"
          placeholder="Tags (separadas por vírgula)"
          value={form.tags}
          onChange={handleChange}
          className="input"
        />
        <input
          name="cep"
          placeholder="CEP"
          value={form.cep}
          onChange={handleCepChange}
          required
          className="input"
        />
        <input
          name="pais"
          placeholder="País"
          value={form.pais}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="estado"
          placeholder="Estado"
          value={form.estado}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="cidade"
          placeholder="Cidade"
          value={form.cidade}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="bairro"
          placeholder="Bairro"
          value={form.bairro}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="rua"
          placeholder="Rua"
          value={form.rua}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="numero"
          placeholder="Número"
          value={form.numero}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          readOnly
          className="input"
        />
        <input
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          readOnly
          className="input"
        />
        <button type="submit" className="submit">
          Cadastrar
        </button>
      </form>
    </Container>
  );
}
