"use client";

import AddPetForm from "@/components/AddPetForm/AddPetForm";
import { useContext, useEffect } from "react";
import { PageContext } from "@/context/PageContext";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";

export default function PetFormPage() {
  const { userId } = useContext(PageContext);
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      showAlert("Usuário não autenticado", "error");
      router.push("/login");
    }
  }, [userId, router, showAlert]);

  return userId ? <AddPetForm /> : null;
}

