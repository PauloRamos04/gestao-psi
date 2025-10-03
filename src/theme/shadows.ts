/**
 * Sistema de Sombras do Gestão PSI
 * Define sombras consistentes para elevação de componentes
 */

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Sombras coloridas
  primary: '0 8px 25px rgba(102, 126, 234, 0.3)',
  primaryHover: '0 12px 35px rgba(102, 126, 234, 0.4)',
  secondary: '0 8px 25px rgba(118, 75, 162, 0.3)',
  success: '0 4px 12px rgba(82, 196, 26, 0.3)',
  error: '0 4px 12px rgba(255, 77, 79, 0.3)',
  warning: '0 4px 12px rgba(250, 173, 20, 0.3)',
  info: '0 4px 12px rgba(24, 144, 255, 0.3)',
} as const;

export type Shadows = typeof shadows;

