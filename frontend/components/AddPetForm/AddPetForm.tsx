"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useContext, useState, useEffect } from "react";
import { PageContext } from "@/context/PageContext";
import { useAlert } from "@/context/AlertContext";
import { useRouter } from "next/navigation";
import { fetchTk } from "@/lib/helper";
import { Container } from "./styles";
import { TagChip } from "../TagChip";
import { storage, auth } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";
import { LoadingSpin } from "../LoadingSpin";

const tiposDeAnimais = [
  "Cachorro",
  "Gato",
  "Coelho",
  "Cavalo",
  "Aranha",
  "Hamster",
  "Peixe",
  "Pássaro",
  "Porco",
  "Tartaruga",
  "Lagarto",
  "Cobra",
  "Papagaio",
  "Furão",
  "Iguana",
  "Camaleão",
  "Rato",
  "Galinha",
  "Pato",
  "Ovelha",
  "Vaca",
];

type FormState = {
  nome: string;
  descricao: string;
  tipo: string;
  tags: string[];
  pais: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  cep: string;
  latitude: string;
  longitude: string;
  imagem: File | null;
};

export default function AddPetForm() {
  const { token, userId } = useContext(PageContext);
  const { showAlert } = useAlert();
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    nome: "",
    descricao: "",
    tipo: "",
    tags: [],
    pais: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    cep: "",
    latitude: "",
    longitude: "",
    imagem: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  useEffect(() => {
    if (!userId) {
      showAlert("Usuário não autenticado", "error");
      router.push("/login");
    }
  }, [userId, router, showAlert]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    if (value.endsWith(',')) {
      const tag = value.slice(0, -1).trim();
      if (tag && !form.tags.includes(tag)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput('');
    } else {
      setTagInput(value);
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !form.tags.includes(tag)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const validateStep1 = () => {
    if (!form.nome || !form.tipo || !form.imagem) {
      showAlert("Preencha todos os campos obrigatórios do passo 1.");
      return false;
    }
    if (form.imagem) {
      if (!form.imagem.type.startsWith("image/")) {
        showAlert("Formato de imagem inválido.");
        return false;
      }
      if (form.imagem.size > MAX_FILE_SIZE) {
        showAlert("Imagem excede o limite de 100MB.");
        return false;
      }
    }
    return true;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        showAlert("Formato de imagem inválido.");
        e.target.value = "";
        setForm((prev) => ({ ...prev, imagem: null }));
        setImagePreview(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showAlert("Imagem excede o limite de 100MB.");
        e.target.value = "";
        setForm((prev) => ({ ...prev, imagem: null }));
        setImagePreview(null);
        return;
      }
      setForm((prev) => ({ ...prev, imagem: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, imagem: null }));
      setImagePreview(null);
    }
  };

  const handleCepChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    setForm((prev) => ({ ...prev, cep }));
    if (cep.replace(/\D/g, "").length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (res.ok) {
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            pais: "Brasil",
            estado: data.uf ?? prev.estado,
            cidade: data.localidade ?? prev.cidade,
            bairro: data.bairro ?? prev.bairro,
            rua: data.logradouro ?? prev.rua,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
    }
  };

  const updateCoordinates = async () => {
    const address = `${form.rua} ${form.numero}, ${form.bairro}, ${form.cidade}, ${form.estado}, ${form.pais}`;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      if (res.ok) {
        const [info] = await res.json();
        if (info) {
          setForm((prev) => ({
            ...prev,
            latitude: info.lat,
            longitude: info.lon,
          }));
        }
      }
    } catch (err) {
      console.error("Erro ao obter coordenadas", err);
    }
  };

  useEffect(() => {
    if (form.rua && form.numero && form.cidade && form.estado && form.pais) {
      updateCoordinates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.rua, form.numero, form.bairro, form.cidade, form.estado, form.pais]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!userId) {
      showAlert("Usuário não autenticado", "error");
      router.push("/login");
      setLoading(false);
      return;
    }
    if (!validateStep1()) {
      setLoading(false);
      return;
    }
    await updateCoordinates();
    let imagemUrl: string | undefined = undefined;
    if (form.imagem) {
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error("Firebase anonymous sign-in failed", err);
        }
      }
      const storageRef = ref(
        storage,
        `pets/${Date.now()}_${form.imagem.name}`
      );
      await uploadBytes(storageRef, form.imagem);
      imagemUrl = await getDownloadURL(storageRef);
    }
    const petData = {
      nome: form.nome,
      descricao: form.descricao,
      tipo: form.tipo,
      tags: form.tags,
      localizacao: {
        pais: form.pais,
        estado: form.estado,
        cidade: form.cidade,
        bairro: form.bairro,
        rua: form.rua,
        numero: form.numero,
        cep: form.cep,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      },
      imagem: imagemUrl,
    };
    try {
      const res = await fetchTk("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify(petData),
      });
      if (!res.ok) {
        const text = await res.text();
        setError("Erro ao cadastrar pet: " + text);
        showAlert("Erro ao cadastrar pet", "error");
      } else {
        showAlert("Pet cadastrado com sucesso!", "success");
        setForm({
          nome: "",
          descricao: "",
          tipo: "",
          tags: [],
          pais: "",
          estado: "",
          cidade: "",
          bairro: "",
          rua: "",
          numero: "",
          cep: "",
          latitude: "",
          longitude: "",
          imagem: null,
        });
        setTagInput("");
        setStep(1);
        setImagePreview(null);
      }
    } catch (err) {
      console.error("handleSubmit", err);
      setError("Erro ao cadastrar pet");
      showAlert("Erro ao cadastrar pet", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h1>Adicionar Pet</h1>
        {error && <p className="danger-text">{error}</p>}
        {step === 1 && (
          <>
            <input
              name="nome"
              placeholder="Nome *"
              value={form.nome}
              onChange={handleChange}
              required
              className="input"
            />
            <textarea
              name="descricao"
              placeholder="Descrição"
              value={form.descricao}
              onChange={handleChange}
              className="input"
            />
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Selecione o tipo *</option>
              {tiposDeAnimais.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label>
              Imagem *
              <input type="file" name="imagem" onChange={handleImageChange} required className="input" />
            </label>
            {imagePreview && (
              <div className="image-wrapper">
                <img src={imagePreview} alt="Pré-visualização" className="preview" />
              </div>
            )}
            <div className="tag-input-wrapper">
              <input
                name="tags"
                placeholder="Digite e pressione , ou Enter"
                value={tagInput}
                onChange={handleTagInput}
                onKeyDown={handleTagKeyDown}
                className="input"
              />
              {form.tags.length > 0 && (
                <div className="tags">
                  {form.tags.map((t) => (
                    <TagChip key={t} label={t} onRemove={() => removeTag(t)} />
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
              className="nav"
            >
              Próximo
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              name="cep"
              placeholder="CEP *"
              value={form.cep}
              onChange={handleCepChange}
              required
              className="input"
            />
            <input
              name="pais"
              placeholder="País *"
              value={form.pais}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="estado"
              placeholder="Estado *"
              value={form.estado}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="cidade"
              placeholder="Cidade *"
              value={form.cidade}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="bairro"
              placeholder="Bairro *"
              value={form.bairro}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="rua"
              placeholder="Rua *"
              value={form.rua}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="numero"
              placeholder="Número *"
              value={form.numero}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="latitude"
              placeholder="Latitude"
              value={form.latitude}
              readOnly
              className="input"
            />
            <input
              name="longitude"
              placeholder="Longitude"
              value={form.longitude}
              readOnly
              className="input"
            />
            <div className="actions">
              <button type="button" onClick={() => setStep(1)} className="nav">
                Voltar
              </button>
              <button type="submit" className="submit">
                {loading ? <LoadingSpin /> : "Cadastrar"}
              </button>
            </div>
          </>
        )}
      </form>
    </Container>
  );
}
