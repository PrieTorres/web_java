"use client";
import { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContext } from "@/context/PageContext";
import { fetchTk } from "@/lib/helper";
import EditPetForm from "@/components/EditPetForm/EditPetForm";
import type { Pet } from "@/types/pet";

export default function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
  const { token } = useContext(PageContext);
  const [pet, setPet] = useState<Pet | null>(null);
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (!token) return;
    fetchTk(`/api/pets/${id}`, { headers: { Authorization: token } })
      .then((res) => res.json())
      .then((data) => setPet(data))
      .catch((err) => console.error("fetch pet", err));
  }, [token, id]);

  if (!pet) return <p>Carregando...</p>;

  return (
    <EditPetForm pet={pet} token={token!} onSuccess={() => router.push("/myPets")} />
  );
}
