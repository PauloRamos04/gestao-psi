/**
 * Tema Central do Sistema Gestão PSI
 * Exporta todas as configurações de tema
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';
import { breakpoints, mediaQueries } from './breakpoints';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  mediaQueries,
} as const;

export type Theme = typeof theme;

// Exportações individuais para facilitar imports
export { colors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius } from './spacing';
export { shadows } from './shadows';
export { breakpoints, mediaQueries } from './breakpoints';

export default theme;

