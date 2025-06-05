import { ChakraProvider, Heading, VStack, Button, HStack, Box, Divider } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { EnergyChart } from './components/EnergyChart';
import InsightsPanel from './components/InsightsPanel';
import UnitToggle from './components/UnitToggle';
import FileUpload from './components/FileUpload';
import WelcomeMessage from './components/WelcomeMessage';
import { useEnergyData } from './hooks/useEnergyData';
import { theme } from './styles/theme';
import { UI_CONFIG } from './constants/ui';
import { useState, useEffect } from 'react';
import type { DailyEnergyData } from './types/energy';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

function App() {
  const { processedData, showCost, handleDataLoaded, toggleUnit, resetData } = useEnergyData();
  const [filteredData, setFilteredData] = useState<DailyEnergyData[]>(processedData);

  useEffect(() => {
    setFilteredData(processedData);
  }, [processedData]);

  return (
    <Box w="100vw" minH="100vh" overflow="hidden">
      <ChakraProvider theme={theme}>
        <DashboardLayout>
          {processedData.length === 0 ? (
            <VStack spacing={{ base: 8, md: 12 }} w="full">
              <WelcomeMessage />
              <FileUpload onDataLoaded={handleDataLoaded} />
            </VStack>
          ) : (
            <VStack spacing={{ base: 8, md: 12 }} w="full">
              <Box 
                w="full" 
                animation={`${fadeIn} 0.6s ease-out`}
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow={UI_CONFIG.shadows.default}
              >
                <VStack spacing={6} align="stretch">
                  <HStack 
                    w="full" 
                    justify="space-between" 
                    align="center"
                    flexDir={{ base: 'column', md: 'row' }}
                    spacing={{ base: 4, md: 0 }}
                  >
                    <Heading 
                      as="h1" 
                      size={{ base: 'xl', md: '2xl' }}
                      fontWeight="600"
                      letterSpacing="-1px"
                      color="brand.primary"
                      textAlign={{ base: 'center', md: 'left' }}
                    >
                      Light Energy Dashboard
                    </Heading>
                    
                    <HStack 
                      spacing={6} 
                      divider={<Divider orientation="vertical" h="24px" />}
                      bg="gray.50"
                      p={2}
                      borderRadius="lg"
                    >
                      <UnitToggle showCost={showCost} onToggle={toggleUnit} />
                      <Button
                        variant="outline"
                        color="brand.primary"
                        borderColor="brand.primary"
                        size={{ base: 'md', md: 'lg' }}
                        _hover={{
                          bg: 'brand.primary',
                          color: 'white',
                          transform: 'translateY(-1px)',
                          boxShadow: UI_CONFIG.shadows.hover,
                        }}
                        onClick={resetData}
                        transition={UI_CONFIG.transitions.hover}
                      >
                        Upload New Data
                      </Button>
                    </HStack>
                  </HStack>
                </VStack>
              </Box>
              
              <EnergyChart 
                data={processedData} 
                showCost={showCost} 
                onDataFilter={setFilteredData}
              />
              <InsightsPanel data={filteredData} showCost={showCost} />
            </VStack>
          )}
        </DashboardLayout>
      </ChakraProvider>
    </Box>
  );
}

export default App;
