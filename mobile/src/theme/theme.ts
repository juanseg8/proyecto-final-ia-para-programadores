// UX01 Design Tokens
export const theme = {
  colors: {
    primary: {
      50: '#F1F8F4',
      100: '#DDEFE4',
      200: '#BCE0C9',
      300: '#91C9A8',
      400: '#64AE84',
      500: '#3D9165',
      600: '#2F7551',
      700: '#285E44',
      800: '#234B39',
      900: '#1E3E31',
    },
    secondary: {
      50: '#F1F7FA',
      100: '#DFEDF3',
      200: '#C3DEE8',
      300: '#98C6D6',
      400: '#66A8BD',
      500: '#478CA4',
      600: '#397187',
      700: '#325C6E',
      800: '#2D4D5B',
      900: '#293F4A',
    },
    accent: {
      50: '#FFF8EB',
      100: '#FCEBCB',
      200: '#F8D58F',
      300: '#F3BC52',
      400: '#EDA52E',
      500: '#DE8918',
    },
    neutral: {
      0: '#FFFFFF',
      50: '#F8FAF9',
      100: '#F1F4F2',
      200: '#E3E8E5',
      300: '#CCD4CF',
      400: '#9BA8A1',
      500: '#6E7C75',
      600: '#53615A',
      700: '#3E4943',
      800: '#29332E',
      900: '#17201B',
    },
    semantic: {
      success: '#2F855A',
      warning: '#D69E2E',
      error: '#C53030',
      info: '#3182A0',
    },
    // Backwards compatibility for existing components, will be refactored
    background: '#F8FAF9', // neutral.50
    surface: '#FFFFFF', // neutral.0
    textPrimary: '#17201B', // neutral.900
    textSecondary: '#53615A', // neutral.600
    border: '#E3E8E5', // neutral.200
  },
  spacing: {
    0: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    // Backwards compatibility
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
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    // Backwards compatibility mappings for existing text
    display: { fontSize: 30, lineHeight: 36, fontWeight: 'bold' as const }, // '3xl' to '4xl' range
    h1: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const }, // Screen Title
    h2: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const }, // Section Title
    h3: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const }, // Card Title
    body: { fontSize: 16, lineHeight: 24, fontWeight: 'normal' as const }, // Body
    bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: 'normal' as const }, // Secondary Body
    label: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: 'normal' as const }, // Caption
    metric: { fontSize: 24, lineHeight: 32, fontWeight: 'bold' as const },
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
    // Backwards compatibility
    input: 12,
    button: 12,
    card: 16,
    modal: 20,
  },
};

export default theme;
