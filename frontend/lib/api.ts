export async function loginUserWithCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
  return res.json();
}

// Exemplo futuro para login com Google
import { signInWithGoogle, getRedirectedUser } from './firebase';
import { getUserByFirebaseUserId } from './helper';

export async function loginUserWithGoogle() {
  const redirectUser = await getRedirectedUser();
  const firebaseUser = redirectUser ?? (await signInWithGoogle());
  if (!firebaseUser) return null;
  return getUserByFirebaseUserId({
    firebaseUserId: firebaseUser.uid,
    createUser: true,
    userData: firebaseUser,
  });
}
