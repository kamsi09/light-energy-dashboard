export const UI_CONFIG = {
  shadows: {
    default: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  transitions: {
    default: 'all 0.3s ease',
    hover: 'all 0.2s ease',
  },
  borderRadius: {
    default: 'xl',
    button: 'md',
  },
  spacing: {
    container: {
      base: 4,
      md: 8,
      lg: 12,
    },
    stack: 10,
  },
} as const; 