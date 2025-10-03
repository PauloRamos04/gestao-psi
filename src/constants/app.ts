/**
 * Constantes da Aplicação
 * Centraliza valores constantes usados em toda a aplicação
 */

export const APP_NAME = 'Gestão PSI';
export const APP_DESCRIPTION = 'Sistema de Gestão para Clínicas de Psicologia';
export const APP_VERSION = '1.0.0';

// Configurações de API
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
export const API_TIMEOUT = 30000; // 30 segundos

// Configurações de autenticação
export const TOKEN_KEY = 'gestaopsi_token';
export const USER_KEY = 'gestaopsi_user';
export const SESSION_TIMEOUT = 3600000; // 1 hora em milissegundos

// Formatos de data
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';
export const DATE_API_FORMAT = 'yyyy-MM-dd';

// Paginação
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Status de sessões
export const SESSION_STATUS = {
  ATIVA: 'ATIVA',
  PENDENTE: 'PENDENTE',
  CONCLUIDA: 'CONCLUIDA',
  CANCELADA: 'CANCELADA',
} as const;

// Status de pagamentos
export const PAYMENT_STATUS = {
  PAGO: 'PAGO',
  PENDENTE: 'PENDENTE',
  ATRASADO: 'ATRASADO',
  CANCELADO: 'CANCELADO',
} as const;

// Tipos de usuário
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  PSICOLOGO: 'PSICOLOGO',
  SECRETARIA: 'SECRETARIA',
} as const;

// Rotas da aplicação
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USUARIOS: '/usuarios',
  PACIENTES: '/pacientes',
  SESSOES: '/sessoes',
  PAGAMENTOS: '/pagamentos',
  FATURAMENTO: '/faturamento',
  MENSAGENS: '/mensagens',
  CLINICAS: '/clinicas',
  SALAS: '/salas',
  IMC: '/imc',
  TEMPO_VIDA: '/tempo-vida',
  TEMPORIZADOR: '/temporizador',
  CORES: '/cores',
  TROCAR_SENHA: '/trocar-senha',
  RELATORIOS: '/relatorios',
  HISTORICOS: '/historicos',
  SUBLOCACOES: '/sublocacoes',
  INTERACOES: '/interacoes',
  DOWNLOADS: '/downloads',
} as const;

// Mensagens padrão
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Registro criado com sucesso!',
    UPDATE: 'Registro atualizado com sucesso!',
    DELETE: 'Registro excluído com sucesso!',
    LOGIN: 'Login realizado com sucesso!',
    LOGOUT: 'Logout realizado com sucesso!',
  },
  ERROR: {
    GENERIC: 'Ocorreu um erro. Por favor, tente novamente.',
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    UNAUTHORIZED: 'Você não tem permissão para esta ação.',
    NOT_FOUND: 'Registro não encontrado.',
    VALIDATION: 'Por favor, verifique os dados informados.',
  },
  WARNING: {
    UNSAVED_CHANGES: 'Você tem alterações não salvas. Deseja continuar?',
    DELETE_CONFIRM: 'Tem certeza que deseja excluir este registro?',
  },
} as const;

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type Route = typeof ROUTES[keyof typeof ROUTES];

