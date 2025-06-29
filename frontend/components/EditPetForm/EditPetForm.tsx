"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { fetchTk } from "@/lib/helper";
import { Container } from "./styles";
import { TagChip } from "../TagChip";
import { useAlert } from "@/context/AlertContext";

export interface EditPetFormProps {
  pet: any;
  token: string;
  onSuccess?: () => void;
}

export default function EditPetForm({ pet, token, onSuccess }: EditPetFormProps) {
  const { showAlert } = useAlert();
  const [form, setForm] = useState<any>({
    nome: pet.nome || "",
    descricao: pet.descricao || "",
    tipo: pet.tipo || "",
    tags: pet.tags || [],
    localizacao: {
      pais: pet.localizacao?.pais || "",
      estado: pet.localizacao?.estado || "",
      cidade: pet.localizacao?.cidade || "",
      bairro: pet.localizacao?.bairro || "",
      rua: pet.localizacao?.rua || "",
      numero: pet.localizacao?.numero || "",
      cep: pet.localizacao?.cep || "",
      latitude: pet.localizacao?.latitude || 0,
      longitude: pet.localizacao?.longitude || 0,
    },
  });
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("localizacao.")) {
      const key = name.split(".")[1];
      setForm((prev: any) => ({
        ...prev,
        localizacao: { ...prev.localizacao, [key]: value },
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.endsWith(",")) {
      const tag = value.slice(0, -1).trim();
      if (tag && !form.tags.includes(tag)) {
        setForm((prev: any) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev: any) => ({ ...prev, tags: prev.tags.filter((t: string) => t !== tag) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetchTk(`/api/pets/${pet.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      showAlert("Pet atualizado com sucesso!", "success");
      if (onSuccess) onSuccess();
    } else {
      const text = await res.text();
      showAlert("Erro ao atualizar pet: " + text, "error");
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h1>Editar Pet</h1>
        <input name="nome" className="input" value={form.nome} onChange={handleChange} />
        <textarea name="descricao" className="input" value={form.descricao} onChange={handleChange} />
        <input name="tipo" className="input" value={form.tipo} onChange={handleChange} />
        <div className="tag-input-wrapper">
          <input
            name="tags"
            placeholder="Digite e pressione ,"
            value={tagInput}
            onChange={handleTagInput}
            className="input"
          />
          {form.tags.length > 0 && (
            <div className="tags">
              {form.tags.map((t: string) => (
                <TagChip key={t} label={t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
        </div>
        <input name="localizacao.pais" className="input" placeholder="País" value={form.localizacao.pais} onChange={handleChange} />
        <input name="localizacao.estado" className="input" placeholder="Estado" value={form.localizacao.estado} onChange={handleChange} />
        <input name="localizacao.cidade" className="input" placeholder="Cidade" value={form.localizacao.cidade} onChange={handleChange} />
        <input name="localizacao.bairro" className="input" placeholder="Bairro" value={form.localizacao.bairro} onChange={handleChange} />
        <input name="localizacao.rua" className="input" placeholder="Rua" value={form.localizacao.rua} onChange={handleChange} />
        <input name="localizacao.numero" className="input" placeholder="Número" value={form.localizacao.numero} onChange={handleChange} />
        <input name="localizacao.cep" className="input" placeholder="CEP" value={form.localizacao.cep} onChange={handleChange} />
        <button type="submit" className="submit">Salvar</button>
      </form>
    </Container>
  );
}

