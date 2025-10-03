/**
 * Paleta de Cores do Sistema Gestão PSI
 * Centraliza todas as cores utilizadas na aplicação
 */

export const colors = {
  // Cores Primárias
  primary: {
    50: '#f5f7ff',
    100: '#ebf0ff',
    200: '#d6e0ff',
    300: '#b3c7ff',
    400: '#8ca3ff',
    500: '#667eea', // Cor principal
    600: '#5568d3',
    700: '#4353b8',
    800: '#333f94',
    900: '#242d6b',
  },

  // Cores Secundárias
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#764ba2', // Cor secundária
    600: '#6b3d94',
    700: '#5b2f7f',
    800: '#4a2466',
    900: '#3a1a50',
  },

  // Cores de Sucesso
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Cores de Erro
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Cores de Aviso
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Cores de Informação
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Tons de Cinza
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Cores Base
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Cores de Fundo
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    dark: '#1f2937',
  },

  // Cores de Texto
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
    link: '#667eea',
  },

  // Cores de Borda
  border: {
    light: '#e5e7eb',
    default: '#d1d5db',
    dark: '#9ca3af',
  },

  // Gradientes
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primarySoft: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    success: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
    error: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
    warning: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
    info: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
  },
} as const;

export type ColorPalette = typeof colors;

