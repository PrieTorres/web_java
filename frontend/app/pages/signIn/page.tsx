"use client";

import { Section } from "@/components/Section";
import { SignUpForm } from "@/components/SignUpForm";
import { Container } from "./styles";

export default function SignInPage() {

  return (
    <Container>
      <Section>
        <SignUpForm />
      </Section>
    </Container>
  );
}
