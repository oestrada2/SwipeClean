const darkColors = {
  primary: '#8B5CF6',
  primaryLight: 'rgba(139,92,246,0.18)',
  background: '#050505',
  surface: 'rgba(255,255,255,0.07)',
  modal: '#16161E',
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.42)',
  border: 'rgba(255,255,255,0.1)',
  keep: '#30D158',
  keepLight: 'rgba(48,209,88,0.16)',
  delete: '#FF3B30',
  deleteLight: 'rgba(255,59,48,0.16)',
  overlay: 'rgba(0,0,0,0.8)',
  textSecondary: 'rgba(255,255,255,0.65)',
  textTertiary: 'rgba(255,255,255,0.36)',
  sectionLabel: 'rgba(255,255,255,0.28)',
  divider: 'rgba(255,255,255,0.07)',
  inputBackground: 'rgba(255,255,255,0.06)',
  inputBorder: 'rgba(255,255,255,0.1)',
  toggleOff: 'rgba(255,255,255,0.12)',
  surfaceOverlay: 'rgba(255,255,255,0.08)',
  chevron: 'rgba(255,255,255,0.22)',
};

const lightColors = {
  primary: '#7C3AED',
  primaryLight: 'rgba(124,58,237,0.12)',
  background: '#F5F5F7',
  surface: 'rgba(255,255,255,0.85)',
  modal: '#FFFFFF',
  text: '#1C1C1E',
  muted: 'rgba(0,0,0,0.4)',
  border: 'rgba(0,0,0,0.08)',
  keep: '#34C759',
  keepLight: 'rgba(52,199,89,0.12)',
  delete: '#FF3B30',
  deleteLight: 'rgba(255,59,48,0.1)',
  overlay: 'rgba(0,0,0,0.5)',
  textSecondary: 'rgba(0,0,0,0.6)',
  textTertiary: 'rgba(0,0,0,0.38)',
  sectionLabel: 'rgba(0,0,0,0.35)',
  divider: 'rgba(0,0,0,0.07)',
  inputBackground: 'rgba(0,0,0,0.04)',
  inputBorder: 'rgba(0,0,0,0.1)',
  toggleOff: 'rgba(0,0,0,0.1)',
  surfaceOverlay: 'rgba(0,0,0,0.05)',
  chevron: 'rgba(0,0,0,0.22)',
};

const baseTheme = {
  radius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  blur: 'blur(20px)',
};

export function buildTheme(mode: 'light' | 'dark') {
  return { ...baseTheme, colors: mode === 'dark' ? darkColors : lightColors };
}

export type Theme = ReturnType<typeof buildTheme>;

export const theme = buildTheme('dark');
