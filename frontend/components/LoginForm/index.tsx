'use client';

import { FormEvent, useState, useContext, useEffect } from 'react';
import googleImage from '@/public/assets/google.svg';
import { useRouter } from 'next/navigation';
import { loginUserWithGoogle } from '@/lib/api';
import { getRedirectedUser } from '@/lib/firebase';
import { getUserByFirebaseUserId } from '@/lib/helper';
import { PageContext } from '@/context/PageContext';
import { Container } from './styles';
import { SafeImage } from '../SafeImage';
import { useAlert } from '@/context/AlertContext';

export const LoginForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { handleLogin, updateSessionId, updateToken, updateUser } = useContext(PageContext);
  const { showAlert } = useAlert();

  useEffect(() => {
    const checkRedirect = async () => {
      const googleUser = await getRedirectedUser();
      if (googleUser) {
        const response = await getUserByFirebaseUserId({
          firebaseUserId: googleUser.uid,
          createUser: true,
          userData: googleUser,
        });
        updateSessionId?.(response._id ?? response.id);
        updateToken?.(response.token ?? '');
        updateUser?.(response);
        router.push('/');
      }
    };
    checkRedirect();
  }, [router, updateSessionId, updateToken, updateUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      showAlert('Preencha email e senha.', 'error');
      return;
    }

    setLoading(true);
    try {
      await handleLogin(form.email, form.password);
      router.push('/');
    } catch (err) {
      console.error("handleSubmit", err);
      showAlert('Erro ao fazer login', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await loginUserWithGoogle();
      if (response?.id) {
        updateSessionId?.(response._id ?? response.id);
        updateToken?.(response.token ?? '');
        updateUser?.(response);
        router.push('/');
      }
    } catch (err) {
      console.error("handleGoogleLogin", err);
      showAlert('Erro ao fazer login com Google', 'error');
    }
  };

  return (
    <Container>
      <main className="w-[475px] p-12 rounded-xl">
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
            className="w-full py-2 rounded-md"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-4">Ou entre com</p>

        <div className="flex justify-center mt-4">
          <button onClick={handleGoogleLogin}>
            <SafeImage src={googleImage} alt="Google login" width={48} height={48} />
          </button>
        </div>

        <p className="text-center mt-6 text-sm">
          Ainda não tem uma conta? <a href="/signIn" className="underline">Cadastre-se</a>
        </p>
      </main>
    </Container>
  );
};
