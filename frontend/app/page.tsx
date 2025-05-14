'use client'

import { useEffect, useState } from 'react';

export default function Home() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then(res => res.text())
      .then(setMsg)
      .catch(console.error);
  }, []);

  return (
    <main>
      <h1>{msg || 'Carregando...'}</h1>
    </main>
  );
}
