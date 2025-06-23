import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/usuarios/add`, {
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
  } catch {
    return new NextResponse('Erro interno', { status: 500 });
  }
}
