'use client';

import { FormEvent, useState, useContext } from 'react';
import Image from 'next/image';
import googleImage from '@/assets/google.svg';
import { useRouter } from 'next/navigation';
import { loginUserWithGoogle } from '@/lib/api';
import { PageContext } from '@/context/PageContext';
import { Container } from './styles';

export const LoginForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useContext(PageContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return alert('Preencha email e senha.');
    }

    setLoading(true);
    try {
      await handleLogin(form.email, form.password);
      router.push('/');
    } catch (err) {
      console.error("handleSubmit", err);
      alert('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginUserWithGoogle();
      if (user?.id) {
        router.push('/');
      }
    } catch (err) {
      console.error("handleGoogleLogin", err);
      alert('Erro ao fazer login com Google');
    }
  };

  return (
    <Container>
      <main className="w-[475px] p-12 bg-white shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            className="input"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-4">Ou entre com</p>

        <div className="flex justify-center mt-4">
          <button onClick={handleGoogleLogin}>
            <Image src={googleImage} alt="Google login" width={48} height={48} />
          </button>
        </div>

        <p className="text-center mt-6 text-sm">
          Ainda não tem uma conta? <a href="/signIn" className="text-blue-600 underline">Cadastre-se</a>
        </p>
      </main>
    </Container>
  );
};
