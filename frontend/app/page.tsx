'use client';

import { useEffect, useState, useContext } from 'react';
import { Section } from "@/components/Section";
import { PageContext } from "@/context/pageContext";
import { LoadingSection } from "@/components/LoadingSection";
import { fetchTk } from '@/lib/helper';

export default function Home() {
  const { } = useContext(PageContext);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchTk('/api/hello')
      .then(res => res.text())
      .then(setMsg)
      .catch(console.error);
  }, []);

  return (
    <main>
      <Section>
        {!msg ?
          <LoadingSection />
          :
          <h1>{msg}</h1>
        }
      </Section>
    </main>
  );
}
