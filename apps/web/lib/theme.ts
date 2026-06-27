const darkColors = {
  primary: '#7C3AED',
  primaryLight: 'rgba(124,58,237,0.18)',
  background: '#111827',
  surface: '#1F2937',
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.45)',
  border: 'rgba(255,255,255,0.1)',
  keep: '#22C55E',
  keepLight: 'rgba(34,197,94,0.15)',
  delete: '#EF4444',
  deleteLight: 'rgba(239,68,68,0.15)',
  overlay: 'rgba(0,0,0,0.7)',
  textSecondary: 'rgba(255,255,255,0.7)',
  textTertiary: 'rgba(255,255,255,0.38)',
  sectionLabel: 'rgba(255,255,255,0.3)',
  divider: 'rgba(255,255,255,0.08)',
  inputBackground: 'rgba(255,255,255,0.07)',
  inputBorder: 'rgba(255,255,255,0.12)',
  toggleOff: 'rgba(255,255,255,0.15)',
  surfaceOverlay: 'rgba(255,255,255,0.1)',
  chevron: 'rgba(255,255,255,0.25)',
};

const lightColors = {
  primary: '#7C3AED',
  primaryLight: 'rgba(124,58,237,0.12)',
  background: '#F3F4F6',
  surface: '#FFFFFF',
  text: '#111827',
  muted: 'rgba(0,0,0,0.45)',
  border: 'rgba(0,0,0,0.1)',
  keep: '#16A34A',
  keepLight: 'rgba(22,163,74,0.12)',
  delete: '#DC2626',
  deleteLight: 'rgba(220,38,38,0.1)',
  overlay: 'rgba(0,0,0,0.5)',
  textSecondary: 'rgba(0,0,0,0.65)',
  textTertiary: 'rgba(0,0,0,0.42)',
  sectionLabel: 'rgba(0,0,0,0.4)',
  divider: 'rgba(0,0,0,0.08)',
  inputBackground: 'rgba(0,0,0,0.05)',
  inputBorder: 'rgba(0,0,0,0.1)',
  toggleOff: 'rgba(0,0,0,0.12)',
  surfaceOverlay: 'rgba(0,0,0,0.06)',
  chevron: 'rgba(0,0,0,0.25)',
};

const baseTheme = {
  radius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
};

export function buildTheme(mode: 'light' | 'dark') {
  return { ...baseTheme, colors: mode === 'dark' ? darkColors : lightColors };
}

export type Theme = ReturnType<typeof buildTheme>;

export const theme = buildTheme('dark');
