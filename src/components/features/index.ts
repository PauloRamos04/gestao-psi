/**
 * Exportação centralizada de componentes de features
 * Organizados por domínio
 */

// Usuários
export { default as UsuariosList } from './usuarios/UsuariosList';

// Pacientes
export { default as PacientesList } from './pacientes/PacientesList';

// Sessões
export { default as SessoesList } from './sessoes/SessoesList';

// Pagamentos
export { default as PagamentosList } from './pagamentos/PagamentosList';

// Clínicas
export { default as ClinicasList } from './clinicas/ClinicasList';

// Salas
export { default as SalasList } from './salas/SalasList';

// Mensagens
export { default as MensagensList } from './mensagens/MensagensList';

// Ferramentas
export { default as IMCCalculator } from './tools/IMCCalculator';
export { default as LifeTimeCalculator } from './tools/LifeTimeCalculator';
export { default as SessionTimer } from './tools/SessionTimer';
export { default as ColorChooser } from './tools/ColorChooser';
export { default as PasswordChange } from './tools/PasswordChange';

