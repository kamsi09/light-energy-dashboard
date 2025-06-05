import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      primary: '#b0d4dc',
      white: '#FFFFFF',
      black: '#000000',
      gray: {
        50: '#f7f7f7',
        100: '#e3e3e3',
        200: '#c8c8c8',
        300: '#a4a4a4',
        400: '#818181',
        500: '#666666',
        600: '#515151',
        700: '#3d3d3d',
        800: '#2a2a2a',
        900: '#1a1a1a',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'brand.white',
        color: 'brand.gray.800',
        margin: 0,
        padding: 0,
        width: '100%',
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '600',
        letterSpacing: '-0.5px',
        color: 'brand.gray.900',
      },
    },
    Button: {
      baseStyle: {
        _hover: {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
}); 