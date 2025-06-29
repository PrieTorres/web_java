"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContext } from "@/context/PageContext";
import { fetchTk } from "@/lib/helper";
import EditPetForm from "@/components/EditPetForm/EditPetForm";

interface Pet {
  id: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  tags?: string[];
  imagem?: string;
  imagens?: string[];
  localizacao?: Record<string, never>;
}

export default function EditPetPage({ params }: { params: { id: string } }) {
  const { token } = useContext(PageContext);
  const [pet, setPet] = useState<Pet | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    fetchTk(`/api/pets/${params.id}`, { headers: { Authorization: token } })
      .then((res) => res.json())
      .then((data) => setPet(data))
      .catch((err) => console.error("fetch pet", err));
  }, [token, params.id]);

  if (!pet) return <p>Carregando...</p>;

  return (
    <EditPetForm pet={pet} token={token!} onSuccess={() => router.push("/myPets")} />
  );
}
