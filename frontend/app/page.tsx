'use client';

import { useEffect, useState, useContext } from 'react';
import { Section } from "@/components/Section";
import { PageContext } from "@/context/pageContext";
import { LoadingSection } from "@/components/LoadingSection";

export default function Home() {
  const { } = useContext(PageContext);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
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
