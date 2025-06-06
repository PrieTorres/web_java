export async function loginUserWithCredentials({
  email,
  username,
  password,
}: {
  email?: string;
  username?: string;
  password: string;
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });

  if (!response.ok) throw new Error('Login failed');

  return response.json();
}

// Exemplo futuro para login com Google
export async function loginUserWithGoogle() {
  // você pode chamar uma rota que aceite o Firebase ID Token e autentique no backend Java
  return { id: 'fake-google-user-id' };
}
