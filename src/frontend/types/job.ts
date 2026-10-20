export interface ApiJob {
  id: number;
  empresa: string;
  nome: string;
  stack: string;
  localizacao_cidade: string;
  localizacao_estado: string;
  nivel: "junior" | "pleno" | "senior";
  modalidade: "remoto" | "hibrido" | "presencial";
  salario: number;
}

export interface ApiResponse {
  vagas: ApiJob[];
  total: number;
}