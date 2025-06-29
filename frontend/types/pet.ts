export interface Location {
  pais?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  rua?: string;
  numero?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
}

export interface Pet {
  id: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  tags?: string[];
  imagem?: string;
  imagens?: string[];
  email?: string;
  telefone?: string;
  localizacao?: Location;
  matchTags?: string[];
  missingTags?: string[];
}
