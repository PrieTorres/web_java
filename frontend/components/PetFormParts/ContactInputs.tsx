"use client";
import { ChangeEvent } from "react";

export interface ContactInputsProps {
  email: string;
  telefone: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactInputs({ email, telefone, onChange }: ContactInputsProps) {
  return (
    <>
      <input
        name="email"
        placeholder="Email"
        type="email"
        value={email}
        onChange={onChange}
        required
        className="input"
      />
      <input
        name="telefone"
        placeholder="Telefone"
        value={telefone}
        onChange={onChange}
        required
        className="input"
      />
    </>
  );
}
