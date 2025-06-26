import { fetchTk } from '@/lib/helper';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await fetchTk(`/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        senha: data.password,
      }),
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error('Erro ao processar login:', err);
    return new NextResponse('Erro interno', { status: 500 });
  }
}
