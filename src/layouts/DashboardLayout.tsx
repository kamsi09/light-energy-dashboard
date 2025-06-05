import { Box, Container, VStack, Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Box 
      minH="100vh" 
      w="100%" 
      bg="brand.white" 
      position="relative"
      overflow="auto"
      _before={{
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(180deg, brand.primary 0%, brand.white 100%)',
        opacity: 0.1,
        zIndex: 0,
      }}
    >
      <Container 
        maxW="1400px" 
        px={{ base: 4, md: 8, lg: 12 }} 
        position="relative" 
        zIndex={1}
        minH="100vh"
        py={{ base: 8, md: 12, lg: 16 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Flex
          minH="100%"
          align="center"
          justify="center"
          direction="column"
          w="full"
        >
          <VStack 
            spacing={{ base: 8, md: 10, lg: 12 }} 
            align="center" 
            w="full"
            maxW="1200px"
          >
            {children}
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
}; 