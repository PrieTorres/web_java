"use client";

import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { PageContext } from "@/context/PageContext";
import { fetchTk } from "@/lib/helper";
import { Container } from "./styles";

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
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
          className="input"
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          className="input"
        />
        <input
          name="tipo"
          placeholder="Tipo"
          value={form.tipo}
          onChange={handleChange}
          className="input"
        />
        <input
          name="tags"
          placeholder="Tags (separadas por vírgula)"
          value={form.tags}
          onChange={handleChange}
          className="input"
        />
        <input
          name="pais"
          placeholder="País"
          value={form.pais}
          onChange={handleChange}
          className="input"
        />
        <input
          name="estado"
          placeholder="Estado"
          value={form.estado}
          onChange={handleChange}
          className="input"
        />
        <input
          name="cidade"
          placeholder="Cidade"
          value={form.cidade}
          onChange={handleChange}
          className="input"
        />
        <input
          name="bairro"
          placeholder="Bairro"
          value={form.bairro}
          onChange={handleChange}
          className="input"
        />
        <input
          name="rua"
          placeholder="Rua"
          value={form.rua}
          onChange={handleChange}
          className="input"
        />
        <input
          name="numero"
          placeholder="Número"
          value={form.numero}
          onChange={handleChange}
          className="input"
        />
        <input
          name="cep"
          placeholder="CEP"
          value={form.cep}
          onChange={handleChange}
          className="input"
        />
        <input
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          onChange={handleChange}
          className="input"
        />
        <input
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          onChange={handleChange}
          className="input"
        />
        <button type="submit" className="submit">
          Cadastrar
        </button>
      </form>
    </Container>
  );
}
