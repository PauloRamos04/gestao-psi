/**
 * Funções de formatação de dados
 */

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '../constants/app';

/**
 * Formata um valor em moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data no formato brasileiro
 */
export const formatDate = (date: Date | string, pattern: string = DATE_FORMAT): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, pattern, { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

/**
 * Formata data e hora
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, DATE_TIME_FORMAT);
};

/**
 * Formata apenas a hora
 */
export const formatTime = (date: Date | string): string => {
  return formatDate(date, TIME_FORMAT);
};

/**
 * Formata um CPF
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
};

/**
 * Formata um telefone
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return phone;
};

/**
 * Formata um CEP
 */
export const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

/**
 * Trunca um texto com ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza a primeira letra de cada palavra
 */
export const capitalize = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

