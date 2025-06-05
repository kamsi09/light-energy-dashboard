import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import type { DailyEnergyData } from '../types/energy';

interface InsightsPanelProps {
  data: DailyEnergyData[];
  showCost: boolean;
}

const InsightsPanel = ({ data, showCost }: InsightsPanelProps) => {
  const totalUsage = data.reduce((sum, day) => sum + (showCost ? day.cost : day.consumption), 0);
  const averageUsage = totalUsage / (data.length || 1);
  const maxUsage = Math.max(...data.map(day => showCost ? day.cost : day.consumption));
  const maxUsageDate = data.find(day => (showCost ? day.cost : day.consumption) === maxUsage)?.date;

  return (
    <Box
      bg="brand.white"
      p={6}
      borderRadius="xl"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Heading 
        size="lg" 
        mb={6} 
        color="brand.primary"
        fontWeight="600"
      >
        Energy Insights
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat
          p={4}
          borderRadius="lg"
          bg="brand.white"
          transition="all 0.2s"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <StatLabel color="brand.gray" fontSize="md">Total {showCost ? 'Cost' : 'Consumption'}</StatLabel>
          <StatNumber color="brand.primary" fontSize="2xl" fontWeight="600">
            {showCost ? `$${totalUsage.toFixed(2)}` : `${totalUsage.toFixed(1)} kWh`}
          </StatNumber>
          <StatHelpText color="brand.gray">Over the entire period</StatHelpText>
        </Stat>

        <Stat
          p={4}
          borderRadius="lg"
          bg="brand.white"
          transition="all 0.2s"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <StatLabel color="brand.gray" fontSize="md">Average Daily {showCost ? 'Cost' : 'Consumption'}</StatLabel>
          <StatNumber color="brand.primary" fontSize="2xl" fontWeight="600">
            {showCost ? `$${averageUsage.toFixed(2)}` : `${averageUsage.toFixed(1)} kWh`}
          </StatNumber>
          <StatHelpText color="brand.gray">Per day</StatHelpText>
        </Stat>

        <Stat
          p={4}
          borderRadius="lg"
          bg="brand.white"
          transition="all 0.2s"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <StatLabel color="brand.gray" fontSize="md">Highest {showCost ? 'Cost' : 'Consumption'}</StatLabel>
          <StatNumber color="brand.primary" fontSize="2xl" fontWeight="600">
            {showCost ? `$${maxUsage.toFixed(2)}` : `${maxUsage.toFixed(1)} kWh`}
          </StatNumber>
          <StatHelpText color="brand.gray">
            On {maxUsageDate ? new Date(maxUsageDate).toLocaleDateString() : 'N/A'}
          </StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default InsightsPanel; 