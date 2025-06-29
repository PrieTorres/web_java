"use client";
import { useContext } from "react";
import { PageContext } from "@/context/PageContext";
import PetForm from "../PetFormParts/PetForm";

export default function AddPetForm() {
  const { token } = useContext(PageContext);
  return (
    <PetForm
      apiPath="/api/pets"
      method="POST"
      token={token ?? ""}
      buttonLabel="Cadastrar"
      resetOnSuccess
    />
  );
}
