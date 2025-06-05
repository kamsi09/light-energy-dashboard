import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { UI_CONFIG } from '../constants/ui';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const WelcomeMessage = () => {
  return (
    <VStack
      spacing={8}
      textAlign="center"
      maxW="600px"
      mx="auto"
      animation={`${fadeIn} 0.8s ease-out`}
      justify="center"
      minH="60vh"
    >
      <Heading
        size="2xl"
        color="brand.primary"
        fontWeight="700"
        letterSpacing="-1px"
        animation={`${fadeInUp} 0.8s ease-out`}
      >
        Welcome to Light Energy Dashboard
      </Heading>
      
      <Text
        fontSize="xl"
        color="brand.gray.600"
        lineHeight="1.6"
        animation={`${fadeInUp} 0.8s ease-out 0.2s backwards`}
      >
        Your personal energy consumption tracker. Upload your energy data to visualize your usage patterns and gain valuable insights.
      </Text>

      <Box
        p={8}
        bg="rgba(176, 212, 220, 0.05)"
        borderRadius={UI_CONFIG.borderRadius.default}
        animation={`${fadeInUp} 0.8s ease-out 0.4s backwards`}
        border="1px solid"
        borderColor="rgba(176, 212, 220, 0.1)"
        w="full"
      >
        <VStack spacing={6}>
          <Heading size="md" color="brand.gray.700">
            How to get started:
          </Heading>
          <Text color="brand.gray.600" fontSize="lg">
            1. Prepare your energy data in CSV format<br />
            2. Click the upload button below<br />
            3. View your energy insights and trends
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default WelcomeMessage; 