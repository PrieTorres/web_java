"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PageProps } from "next";
import { PageContext } from "@/context/PageContext";
import { fetchTk } from "@/lib/helper";
import EditPetForm from "@/components/EditPetForm/EditPetForm";
import type { Pet } from "@/types/pet";

export default function EditPetPage({ params }: PageProps<{ id: string }>) {
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
