import * as yup from 'yup';
import { isValidCPF } from './validators';

// Schema de validação para Paciente
export const pacienteSchema = yup.object().shape({
  nome: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  
  cpf: yup
    .string()
    .test('cpf-valido', 'CPF inválido', (value) => !value || isValidCPF(value))
    .nullable(),
  
  email: yup
    .string()
    .email('Email inválido')
    .nullable(),
  
  telefone: yup
    .string()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use: (XX) XXXXX-XXXX')
    .nullable(),
  
  dataNascimento: yup
    .date()
    .max(new Date(), 'Data de nascimento não pode estar no futuro')
    .nullable(),
});

// Schema de validação para Sessão
export const sessaoSchema = yup.object().shape({
  pacienteId: yup
    .number()
    .required('Selecione um paciente')
    .positive('Paciente inválido'),
  
  data: yup
    .date()
    .required('Data é obrigatória')
    .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Data não pode estar no passado'),
  
  hora: yup
    .string()
    .required('Horário é obrigatório')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido'),
  
  salaId: yup
    .number()
    .positive('Sala inválida')
    .nullable(),
  
  observacoes: yup
    .string()
    .max(500, 'Observações deve ter no máximo 500 caracteres')
    .nullable(),
});

// Schema de validação para Pagamento
export const pagamentoSchema = yup.object().shape({
  pacienteId: yup
    .number()
    .required('Selecione um paciente')
    .positive('Paciente inválido'),
  
  valor: yup
    .number()
    .required('Valor é obrigatório')
    .positive('Valor deve ser maior que zero')
    .min(0.01, 'Valor mínimo é R$ 0,01'),
  
  data: yup
    .date()
    .required('Data é obrigatória'),
  
  tipoPagamentoId: yup
    .number()
    .required('Selecione a forma de pagamento')
    .positive('Forma de pagamento inválida'),
  
  observacoes: yup
    .string()
    .max(500, 'Observações deve ter no máximo 500 caracteres')
    .nullable(),
});

// Schema de validação para Sala
export const salaSchema = yup.object().shape({
  nome: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  descricao: yup
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .nullable(),
  
  capacidade: yup
    .number()
    .positive('Capacidade deve ser maior que zero')
    .integer('Capacidade deve ser um número inteiro')
    .nullable(),
});

// Schema de validação para Mensagem
export const mensagemSchema = yup.object().shape({
  titulo: yup
    .string()
    .required('Título é obrigatório')
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  
  conteudo: yup
    .string()
    .required('Conteúdo é obrigatório')
    .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
    .max(1000, 'Conteúdo deve ter no máximo 1000 caracteres'),
  
  status: yup
    .boolean(),
});

// Schema de validação para Login
export const loginSchema = yup.object().shape({
  clinicaLogin: yup
    .string()
    .required('Login da clínica é obrigatório')
    .min(3, 'Login deve ter pelo menos 3 caracteres'),
  
  psicologLogin: yup
    .string()
    .required('Login do psicólogo é obrigatório')
    .min(3, 'Login deve ter pelo menos 3 caracteres'),
  
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Schema de validação para Troca de Senha
export const trocarSenhaSchema = yup.object().shape({
  senhaAtual: yup
    .string()
    .required('Senha atual é obrigatória'),
  
  novaSenha: yup
    .string()
    .required('Nova senha é obrigatória')
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
    ),
  
  confirmarSenha: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('novaSenha')], 'As senhas não conferem'),
});

