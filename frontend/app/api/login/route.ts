import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        senha: data.password,
      }),
    });
    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (err) {
    console.error('Erro ao processar login:', err);
    return new NextResponse('Erro interno', { status: 500 });
  }
}
