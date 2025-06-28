"use client";

import { useState, useContext, FormEvent, ChangeEvent } from "react";
import { PageContext } from "@/context/PageContext";
import { getUserByFirebaseUserId } from "@/lib/helper";
import { LoadingSpin } from "@/components/LoadingSpin";
import { signInWithGoogle, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import googleImage from "@/assets/google.svg";
import Image from "next/image";
import Link from "next/link";
import { Container, StrengthWrapper, StrengthBar } from "./styles";

export const SignUpForm = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const { updateSessionId, handleLogin } = useContext(PageContext);
  const [user] = useAuthState(auth);

  const calcStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      setStrength(calcStrength(e.target.value));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;

    setLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const text = await response.text();
      if (!response.ok) throw new Error(text);
      await handleLogin(form.email, form.password);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    if (user) {
      const response = await getUserByFirebaseUserId({ firebaseUserId: user.uid, createUser: true, userData: user });
      updateSessionId?.(response?._id ?? response?.id ?? "");
    }
  };

  return (
    <Container>
      <div className="h-full flex justify-center items-center">
        <main className="w-[475px] p-16 bg-slate-400 shadow-lg rounded-md">
          <h1 className="mb-12 text-center font-bold text-4xl">Cadastro</h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nome</label>
            <input
              name="username"
              type="text"
              placeholder="Insira seu nome"
              value={form.username}
              onChange={handleChange}
              className="w-full h-12 pl-8 border-b-2 input"
            />

            <label className="block mt-6" htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Insira seu email"
              value={form.email}
              onChange={handleChange}
              className="w-full h-12 pl-8 border-b-2 input"
            />

            <label className="block mt-6" htmlFor="password">Senha</label>
            <input
              name="password"
              type="password"
              placeholder="Insira sua senha"
              value={form.password}
              onChange={handleChange}
              className="w-full h-12 pl-8 border-b-2 input"
            />
            <StrengthWrapper>
              <StrengthBar strength={strength} />
            </StrengthWrapper>

            <label className="block mt-6" htmlFor="confirmPassword">Confirme a senha</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full h-12 pl-8 border-b-2 input"
            />

            <button type="submit" className="mt-8 w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              {loading ? <LoadingSpin /> : "Cadastrar"}
            </button>

            <div className="flex items-center justify-center mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200"
              >
                <Image src={googleImage} alt="Google logo" width={20} height={20} />
                Entrar com Google
              </button>
            </div>

            <p className="text-center text-sm mt-4">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-700 hover:underline">
                Faça login
              </Link>
            </p>
          </form>
        </main>
      </div>
    </Container>
  );
};
