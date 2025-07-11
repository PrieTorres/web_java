"use client";
import PetForm from "../PetFormParts/PetForm";
import { Pet } from "../../types/pet";

export interface EditPetFormProps {
  pet: Pet;
  token: string;
  onSuccess?: () => void;
}

export default function EditPetForm({ pet, token, onSuccess }: EditPetFormProps) {
  const initial = {
    nome: pet.nome ?? "",
    descricao: pet.descricao ?? "",
    tipo: pet.tipo ?? "",
    tags: pet.tags ?? [],
    email: pet.email ?? "",
    telefone: pet.telefone ?? "",
    pais: pet.localizacao?.pais ?? "",
    estado: pet.localizacao?.estado ?? "",
    cidade: pet.localizacao?.cidade ?? "",
    bairro: pet.localizacao?.bairro ?? "",
    rua: pet.localizacao?.rua ?? "",
    numero: pet.localizacao?.numero ?? "",
    cep: pet.localizacao?.cep ?? "",
    latitude: String(pet.localizacao?.latitude ?? ""),
    longitude: String(pet.localizacao?.longitude ?? ""),
    imagens: [],
  };
  return (
    <PetForm
      apiPath={`/api/pets/${pet.id}`}
      method="PUT"
      token={token}
      buttonLabel="Salvar"
      initialData={initial}
      imageUrl={pet.imagens?.[0] ?? pet.imagem ?? null}
      onSuccess={onSuccess}
    />
  );
}
