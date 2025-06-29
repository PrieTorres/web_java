"use client";
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";
import { fetchTk } from "@/lib/helper";
import ImageInput from "./ImageInput";
import TagInputList from "./TagInputList";
import ContactInputs from "./ContactInputs";
import { storage, auth } from "@/lib/firebase";
import { LoadingSpin } from "../LoadingSpin";
import { Container } from "../AddPetForm/styles";
import { useAlert } from "@/context/AlertContext";

export interface FormState {
  nome: string;
  descricao: string;
  tipo: string;
  tags: string[];
  email: string;
  telefone: string;
  pais: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  cep: string;
  latitude: string;
  longitude: string;
  imagens: File[];
}

export interface PetFormProps {
  apiPath: string;
  method: "POST" | "PUT";
  token?: string;
  initialData?: Partial<FormState>;
  imageUrl?: string | null;
  buttonLabel: string;
  onSuccess?: () => void;
  resetOnSuccess?: boolean;
}

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

const defaultForm: FormState = {
  nome: "",
  descricao: "",
  tipo: "",
  tags: [],
  email: "",
  telefone: "",
  pais: "",
  estado: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
  cep: "",
  latitude: "",
  longitude: "",
  imagens: [],
};

export default function PetForm({
  apiPath,
  method,
  token,
  initialData,
  imageUrl,
  buttonLabel,
  onSuccess,
  resetOnSuccess = false,
}: PetFormProps) {
  const [form, setForm] = useState<FormState>({ ...defaultForm, ...initialData });
  const [imagePreviews, setImagePreviews] = useState<string[]>(imageUrl ? [imageUrl] : []);
  const [tagInput, setTagInput] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 10);
    setForm((prev) => ({ ...prev, imagens: files }));
    if (files.length > 0) {
      setImagePreviews(files.map((f) => URL.createObjectURL(f)));
    } else {
      setImagePreviews(imageUrl ? [imageUrl] : []);
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
    await updateCoordinates();
    let imageUrls: string[] = imageUrl ? [imageUrl] : [];
    if (form.imagens.length > 0) {
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error("Firebase anonymous sign-in failed", err);
        }
      }
      for (const file of form.imagens) {
        if (file.size > MAX_FILE_SIZE) {
          showAlert("Imagem excede o limite de 100MB.", "error");
          setLoading(false);
          return;
        }
        const storageRef = ref(storage, `pets/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
    }
    const petData = {
      nome: form.nome,
      descricao: form.descricao,
      tipo: form.tipo,
      tags: form.tags,
      email: form.email,
      telefone: form.telefone,
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
      imagem: imageUrls[0],
      imagens: imageUrls,
    };
    try {
      const res = await fetchTk(apiPath, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify(petData),
      });
      if (!res.ok) {
        const text = await res.text();
        setError(`Erro ao ${method === "POST" ? "cadastrar" : "atualizar"} pet: ` + text);
      } else {
        showAlert(`Pet ${method === "POST" ? "cadastrado" : "atualizado"} com sucesso!`, "success");
        if (resetOnSuccess) {
          setForm(defaultForm);
          setTagInput("");
          setStep(1);
          setImagePreviews([]);
        }
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("handleSubmit", err);
      setError("Erro ao enviar dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h1>{method === "POST" ? "Adicionar Pet" : "Editar Pet"}</h1>
        {error && <p className="danger-text">{error}</p>}
        {step === 1 && (
          <>
            <input
              name="nome"
              placeholder="Nome"
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
            <select name="tipo" value={form.tipo} onChange={handleChange} className="input">
              <option value="">Selecione o tipo</option>
              {tiposDeAnimais.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ImageInput previews={imagePreviews} onChange={handleImageChange} />
            <TagInputList
              tags={form.tags}
              tagInput={tagInput}
              onInputChange={handleTagInput}
              onInputKeyDown={handleTagKeyDown}
              onRemove={removeTag}
            />
            <button type="button" onClick={() => setStep(2)} className="nav">
              Próximo
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              name="cep"
              placeholder="CEP"
              value={form.cep}
              onChange={handleCepChange}
              required
              className="input"
            />
            <input
              name="pais"
              placeholder="País"
              value={form.pais}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="estado"
              placeholder="Estado"
              value={form.estado}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="cidade"
              placeholder="Cidade"
              value={form.cidade}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="bairro"
              placeholder="Bairro"
              value={form.bairro}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="rua"
              placeholder="Rua"
              value={form.rua}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="numero"
              placeholder="Número"
              value={form.numero}
              onChange={handleChange}
              required
              className="input"
            />
            <ContactInputs email={form.email} telefone={form.telefone} onChange={handleChange} />
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
                {loading ? <LoadingSpin /> : buttonLabel}
              </button>
            </div>
          </>
        )}
      </form>
    </Container>
  );
}
