import { fetchTk } from '@/lib/helper';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await fetchTk(`/api/usuarios/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        username: data.username,
        senha: data.password,
      }),
    });
    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (err) {
    console.error('Erro ao processar cadastro:', err);
    return new NextResponse('Erro interno', { status: 500 });
  }
}
