// Tipos baseados nas entidades do backend
export interface Usuario {
  id: number;
  username: string;
  clinicaId: number;
  psicologId: number;
  tipoId: number;
  status: boolean;
  titulo: string;
  clinicaNome?: string;
  psicologoNome?: string;
  tipoNome?: string;
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
  categoriaId?: number;
  categoriaNome?: string;
}

export interface Paciente {
  id: number;
  clinicaId: number;
  psicologId: number;
  nome: string;
  status: boolean;
  clinicaNome?: string;
  psicologoNome?: string;
}

export interface Sala {
  id: number;
  clinicaId: number;
  nome: string;
  clinicaNome?: string;
}

export interface Sessao {
  id: number;
  clinicaId: number;
  psicologId: number;
  pacienteId: number;
  salaId?: number;
  data: string;
  hora: string;
  status: boolean;
  observacoes?: string;
  clinicaNome?: string;
  psicologoNome?: string;
  pacienteNome?: string;
  salaNome?: string;
}

export interface Pagamento {
  id: number;
  clinicaId: number;
  psicologId: number;
  pacienteId: number;
  sessaoId?: number;
  valor: number;
  data: string;
  tipoPagamentoId: number;
  observacoes?: string;
  clinicaNome?: string;
  psicologoNome?: string;
  pacienteNome?: string;
  tipoPagamentoNome?: string;
}

export interface Mensagem {
  id: number;
  titulo: string;
  conteudo: string;
  dataCriacao: string;
  status: boolean;
}

export interface Notificacao {
  id: number;
  usuarioId: number;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  dataCriacao: string;
  usuario?: Usuario;
}

export interface Prontuario {
  id: number;
  pacienteId: number;
  data: string;
  descricao: string;
  diagnostico?: string;
  prescricao?: string;
  observacoes?: string;
  paciente?: Paciente;
}

export interface FormularioProntuario {
  pacienteId: number;
  data: string;
  descricao: string;
  diagnostico?: string;
  prescricao?: string;
  observacoes?: string;
}

export interface TipoUser {
  id: number;
  nome: string;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface TipoUsuario {
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
  userId: number;
  username: string;
  clinicaId: number;
  psicologId: number;
  tipoUser: string;
  clinicaNome: string;
  psicologoNome: string;
  tituloSite: string;
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
  salaId?: number;
  data: string;
  hora: string;
  observacoes?: string;
}

export interface FormularioPagamento {
  clinicaId: number;
  psicologId: number;
  pacienteId: number;
  sessaoId?: number;
  valor: number;
  data: string;
  tipoPagamentoId: number;
  observacoes?: string;
}

export interface FormularioPaciente {
  clinicaId: number;
  psicologId: number;
  nome: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  endereco?: string;
  generoId?: number;
}

export interface FormularioSala {
  clinicaId: number;
  nome: string;
  descricao?: string;
  capacidade?: number;
}

export interface FormularioMensagem {
  titulo: string;
  conteudo: string;
  status?: boolean;
}

export interface FormularioUsuario {
  username: string;
  clinicaId: number;
  psicologId: number;
  tipoId: number;
  senha: string;
  titulo: string;
  status?: boolean;
  roleId?: number;
}

export interface FormularioClinica {
  clinicaLogin: string;
  nome: string;
  titulo?: string;
  status?: boolean;
}

export interface FormularioPsicologo {
  psicologLogin: string;
  nome: string;
  dtAtivacao?: string;
  categoriaId: number;
}

export interface RelatorioSessoes {
  totalSessoes: number;
  sessoesConfirmadas: number;
  sessoesPendentes: number;
  taxaConfirmacao: number;
}

export interface RelatorioPacientes {
  totalPacientes: number;
  pacientesAtivos: number;
  pacientesInativos: number;
  percentualAtivos: number;
}

export interface RelatorioFinanceiro {
  totalRecebido: number;
  quantidadePagamentos: number;
  ticketMedio: number;
  porTipoPagamento: { [key: string]: number };
  porMes: { [key: string]: number };
}
