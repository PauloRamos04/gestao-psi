// Tipos baseados nas entidades do backend
export interface Usuario {
  id: number;
  username: string;
  clinicaId: number;
  psicologId: number;
  tipoId: number;
  status: boolean;
  titulo: string;
  
  // Contato
  email?: string;
  telefone?: string;
  celular?: string;
  
  // Informações Pessoais
  nomeCompleto?: string;
  fotoUrl?: string;
  cargo?: string;
  departamento?: string;
  
  // Controle
  ultimoAccesso?: string;
  dataCriacao?: string;
  dataInativacao?: string;
  
  // Preferências
  temaPreferido?: string;
  idioma?: string;
  receberNotificacoesEmail?: boolean;
  receberNotificacoesSistema?: boolean;
  
  observacoes?: string;
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
  psicologLogin?: string;
  nome: string;
  
  // Documentos
  cpf?: string;
  rg?: string;
  crp?: string;
  
  // Contato
  email?: string;
  telefone?: string;
  celular?: string;
  telefoneEmergencia?: string;
  contatoEmergenciaNome?: string;
  
  // Dados Pessoais
  dataNascimento?: string;
  genero?: string;
  estadoCivil?: string;
  nacionalidade?: string;
  
  // Endereço
  cep?: string;
  logradouro?: string;
  numeroEndereco?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  
  // Formação
  formacaoAcademica?: string;
  especializacoes?: string;
  abordagemTerapeutica?: string;
  areasAtuacao?: string;
  anosExperiencia?: number;
  universidadeFormacao?: string;
  anoFormacao?: number;
  
  // Profissional
  dtAtivacao?: string;
  valorConsulta?: number;
  duracaoSessaoMinutos?: number;
  aceitaConvenio?: boolean;
  conveniosAceitos?: string;
  bio?: string;
  fotoUrl?: string;
  ativo?: boolean;
  
  observacoes?: string;
  categoriaId?: number;
  categoriaNome?: string;
}

export interface Paciente {
  id: number;
  clinicaId: number;
  psicologId: number;
  nome: string;
  status: boolean;
  
  // Documentos
  cpf?: string;
  rg?: string;
  orgaoEmissorRg?: string;
  
  // Dados Pessoais
  dataNascimento?: string;
  idade?: number;
  genero?: string;
  estadoCivil?: string;
  profissao?: string;
  escolaridade?: string;
  nacionalidade?: string;
  naturalDe?: string;
  
  // Contato
  email?: string;
  telefone?: string;
  celular?: string;
  telefoneRecado?: string;
  contatoRecadoNome?: string;
  
  // Endereço
  cep?: string;
  logradouro?: string;
  numeroEndereco?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  
  // Responsável (menor de idade)
  responsavelNome?: string;
  responsavelCpf?: string;
  responsavelParentesco?: string;
  responsavelTelefone?: string;
  
  // Informações Clínicas
  motivoConsulta?: string;
  queixaPrincipal?: string;
  historicoFamiliar?: string;
  medicamentosUso?: string;
  alergias?: string;
  condicoesMedicas?: string;
  emTratamentoPsiquiatrico?: boolean;
  psiquiatraNome?: string;
  usoMedicacaoPsiquiatrica?: boolean;
  
  // Informações Adicionais
  comoConheceu?: string;
  convenioSaude?: string;
  numeroCarteirinha?: string;
  plano?: string;
  dataPrimeiraConsulta?: string;
  dataUltimaConsulta?: string;
  numeroSessoesRealizadas?: number;
  fotoUrl?: string;
  
  observacoes?: string;
  clinicaNome?: string;
  psicologoNome?: string;
}

export interface Sala {
  id: number;
  clinicaId: number;
  psicologoResponsavelId?: number;
  nome: string;
  numero?: string;
  descricao?: string;
  capacidade?: number;
  ativa?: boolean;
  cor?: string;
  andar?: number;
  bloco?: string;
  observacoes?: string;
  exclusiva?: boolean;
  permiteCompartilhamento?: boolean;
  
  // Informações extras
  clinicaNome?: string;
  psicologoResponsavelNome?: string;
  descricaoCompleta?: string;
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
  // Campos de Convênio
  ehConvenio?: boolean;
  convenio?: string;
  numeroGuia?: string;
  valorConvenio?: number;
  valorCoparticipacao?: number;
  // Nomes relacionados
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
  sessaoId?: number;
  psicologoId: number;
  dataRegistro: string;
  tipo: 'ANAMNESE' | 'EVOLUCAO' | 'OBSERVACAO';
  titulo?: string;
  conteudo: string;
  queixaPrincipal?: string;
  objetivoTerapeutico?: string;
  historico?: string;
  evolucao?: string;
  planoTerapeutico?: string;
  privado: boolean;
  status: boolean;
  paciente?: Paciente;
  psicologo?: any;
  sessao?: any;
}

export interface FormularioProntuario {
  pacienteId: number;
  sessaoId?: number;
  psicologId: number;
  tipo: 'ANAMNESE' | 'EVOLUCAO' | 'OBSERVACAO';
  titulo?: string;
  conteudo: string;
  queixaPrincipal?: string;
  objetivoTerapeutico?: string;
  historico?: string;
  evolucao?: string;
  planoTerapeutico?: string;
  privado?: boolean;
}

export interface TipoUser {
  id: number;
  nome: string;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface LogAuditoria {
  id: number;
  dataHora: string;
  usuarioId?: number;
  username?: string;
  acao: string;
  entidade?: string;
  entidadeId?: number;
  descricao?: string;
  dadosAnteriores?: string;
  dadosNovos?: string;
  ipAddress?: string;
  userAgent?: string;
  metodoHttp?: string;
  endpoint?: string;
  statusCode?: number;
  tempoExecucaoMs?: number;
  sucesso: boolean;
  mensagemErro?: string;
  clinicaId?: number;
  psicologoId?: number;
  modulo?: string;
  nivel: string;
  tags?: string;
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
  // Campos de Convênio
  ehConvenio?: boolean;
  convenio?: string;
  numeroGuia?: string;
  valorConvenio?: number;
  valorCoparticipacao?: number;
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
