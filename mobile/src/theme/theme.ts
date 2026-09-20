// entire file content ...
export const theme = {
  colors: {
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
    disabled: '#E0E0E0',
  },
  spacing: {
    4: 4,
    8: 8,
    12: 12,
    16: 16,
    20: 20,
    24: 24,
    32: 32,
    40: 40,
    48: 48,
  },
  typography: {
    display: {
      fontSize: 32,
      lineHeight: 36,
      fontWeight: 'bold' as const,
    },
    h1: {
      fontSize: 24,
      lineHeight: 28,
      fontWeight: 'bold' as const,
    },
    h2: {
      fontSize: 20,
      lineHeight: 24,
      fontWeight: 'bold' as const,
    },
    h3: {
      fontSize: 18,
      lineHeight: 22,
      fontWeight: 'bold' as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: 'normal' as const,
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: 'normal' as const,
    },
    label: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: 'medium' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: 'normal' as const,
    },
    metric: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: 'bold' as const,
    },
  },
  radius: {
    input: 4,
    button: 4,
    card: 8,
    modal: 12,
  },
};

export default theme;
