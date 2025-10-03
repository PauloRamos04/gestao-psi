// Tipos baseados nas entidades do backend
export interface Usuario {
  id: number;
  clinicaId: number;
  psicologId: number;
  tipoId: number;
  senha: string;
  status: boolean;
  titulo: string;
  clinica?: Clinica;
  psicologo?: Psicologo;
  tipo?: TipoUser;
}

export interface Clinica {
  id: number;
  clinicaLogin: string;
  nome: string;
  status: boolean;
  titulo: string;
}

export interface Psicologo {
  id: number;
  psicologLogin: string;
  nome: string;
  dtAtivacao: string;
  categoriaId: number;
  categoria?: Categoria;
}

export interface Paciente {
  id: number;
  clinicaId: number;
  psicologId: number;
  nome: string;
  status: boolean;
  clinica?: Clinica;
  psicologo?: Psicologo;
}

export interface Sala {
  id: number;
  clinicaId: number;
  nome: string;
  clinica?: Clinica;
}

export interface Sessao {
  id: number;
  clinicaId: number;
  psicologId: number;
  pacienteId: number;
  salaId: number;
  data: string;
  hora: string;
  status: string;
  clinica?: Clinica;
  psicologo?: Psicologo;
  paciente?: Paciente;
  sala?: Sala;
}

export interface Pagamento {
  id: number;
  clinicaId: number;
  psicologId: number;
  pacienteId: number;
  valor: number;
  data: string;
  tipoPagamentoId: number;
  clinica?: Clinica;
  psicologo?: Psicologo;
  paciente?: Paciente;
  tipoPagamento?: TipoPagamento;
}

export interface Mensagem {
  id: number;
  titulo: string;
  conteudo: string;
  dataCriacao: string;
  status: boolean;
}

export interface TipoUser {
  id: number;
  nome: string;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface TipoPagamento {
  id: number;
  nome: string;
}

export interface Genero {
  id: number;
  nome: string;
}

export interface Cor {
  id: number;
  nome: string;
}

// DTOs para autenticação
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}

// Tipos para filtros e consultas
export interface FiltroPeriodo {
  clinicaId: number;
  psicologId: number;
  inicio: string;
  fim: string;
}

export interface FiltroDia {
  clinicaId: number;
  psicologId: number;
  data: string;
}

// Tipos para formulários
export interface FormularioSessao {
  clinicaId: number;
  psicologId: number;
  pacienteId: number;
  salaId: number;
  data: string;
  hora: string;
}

export interface FormularioPagamento {
  clinicaId: number;
  psicologId: number;
  pacienteId: number;
  valor: number;
  data: string;
  tipoPagamentoId: number;
}

export interface FormularioPaciente {
  clinicaId: number;
  psicologId: number;
  nome: string;
}
