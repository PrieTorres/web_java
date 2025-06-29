"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";
import { fetchTk } from "@/lib/helper";
import { Container } from "./styles";
import ImageInput from "../PetFormParts/ImageInput";
import TagInputList from "../PetFormParts/TagInputList";
import ContactInputs from "../PetFormParts/ContactInputs";
import { storage, auth } from "@/lib/firebase";

export interface EditPetFormProps {
  pet: any;
  token: string;
  onSuccess?: () => void;
}

export default function EditPetForm({ pet, token, onSuccess }: EditPetFormProps) {
  const [form, setForm] = useState<any>({
    nome: pet.nome || "",
    descricao: pet.descricao || "",
    tipo: pet.tipo || "",
    tags: pet.tags || [],
    email: pet.email || "",
    telefone: pet.telefone || "",
    imagem: null,
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
  const [imagePreview, setImagePreview] = useState<string | null>(pet.imagem ?? null);
  const MAX_FILE_SIZE = 100 * 1024 * 1024;

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

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !form.tags.includes(tag)) {
        setForm((prev: any) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev: any) => ({ ...prev, tags: prev.tags.filter((t: string) => t !== tag) }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev: any) => ({ ...prev, imagem: file }));
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(pet.imagem ?? null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let imagemUrl: string | undefined = pet.imagem;
    if (form.imagem) {
      if (form.imagem.size > MAX_FILE_SIZE) {
        alert("Imagem excede o limite de 100MB.");
        return;
      }
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error("Firebase anonymous sign-in failed", err);
        }
      }
      const storageRef = ref(storage, `pets/${Date.now()}_${form.imagem.name}`);
      await uploadBytes(storageRef, form.imagem);
      imagemUrl = await getDownloadURL(storageRef);
    }
    const body = {
      nome: form.nome,
      descricao: form.descricao,
      tipo: form.tipo,
      tags: form.tags,
      email: form.email,
      telefone: form.telefone,
      localizacao: form.localizacao,
      imagem: imagemUrl,
    };
    const res = await fetchTk(`/api/pets/${pet.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      alert("Pet atualizado com sucesso!");
      if (onSuccess) onSuccess();
    } else {
      const text = await res.text();
      alert("Erro ao atualizar pet: " + text);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h1>Editar Pet</h1>
        <input name="nome" className="input" value={form.nome} onChange={handleChange} />
        <textarea name="descricao" className="input" value={form.descricao} onChange={handleChange} />
        <input name="tipo" className="input" value={form.tipo} onChange={handleChange} />
        <ImageInput preview={imagePreview} onChange={handleImageChange} />
        <TagInputList
          tags={form.tags}
          tagInput={tagInput}
          onInputChange={handleTagInput}
          onInputKeyDown={handleTagKeyDown}
          onRemove={removeTag}
        />
        <input name="localizacao.pais" className="input" placeholder="País" value={form.localizacao.pais} onChange={handleChange} />
        <input name="localizacao.estado" className="input" placeholder="Estado" value={form.localizacao.estado} onChange={handleChange} />
        <input name="localizacao.cidade" className="input" placeholder="Cidade" value={form.localizacao.cidade} onChange={handleChange} />
        <input name="localizacao.bairro" className="input" placeholder="Bairro" value={form.localizacao.bairro} onChange={handleChange} />
        <input name="localizacao.rua" className="input" placeholder="Rua" value={form.localizacao.rua} onChange={handleChange} />
        <input name="localizacao.numero" className="input" placeholder="Número" value={form.localizacao.numero} onChange={handleChange} />
        <ContactInputs email={form.email} telefone={form.telefone} onChange={handleChange} />
        <input name="localizacao.cep" className="input" placeholder="CEP" value={form.localizacao.cep} onChange={handleChange} />
        <button type="submit" className="submit">Salvar</button>
      </form>
    </Container>
  );
}

