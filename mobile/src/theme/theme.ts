export const colors = {
  forest: '#173F35',
  primaryLight: '#2F6655',
  leaf: '#6E9F72',
  background: '#F6F7F2',
  surface: '#FFFFFF',
  surfaceSecondary: '#EEF2EC',
  textPrimary: '#17221E',
  textSecondary: '#66736D',
  border: '#DCE4DE',
  success: '#2F7D4A',
  warning: '#C58A24',
  error: '#B9473F',
  info: '#3F6F8F',
};

export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '600' as const },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: '600' as const },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '500' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  metric: { fontSize: 28, lineHeight: 32, fontWeight: '700' as const },
};

export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
};

export const radius = {
  input: 10,
  button: 12,
  card: 16,
  modal: 20,
};

export const theme = {
  colors,
  typography,
  spacing,
  radius,
};
