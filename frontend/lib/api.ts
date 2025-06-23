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
  return res.text();
}

// Exemplo futuro para login com Google
export async function loginUserWithGoogle() {
  // você pode chamar uma rota que aceite o Firebase ID Token e autentique no backend Java
  return { id: 'fake-google-user-id' };
}
