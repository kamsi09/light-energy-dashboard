import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Text, HStack, Icon, Tooltip } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import type { DailyEnergyData } from '../types/energy';
import { format, parseISO, differenceInDays } from 'date-fns';

interface InsightsPanelProps {
  data: DailyEnergyData[];
  showCost: boolean;
}

const InsightsPanel = ({ data, showCost }: InsightsPanelProps) => {
  if (!data.length) return null;

  // Calculate basic metrics
  const totalUsage = data.reduce((sum, day) => sum + (showCost ? day.cost : day.consumption), 0);
  const averageUsage = totalUsage / data.length;
  const maxUsage = Math.max(...data.map(day => showCost ? day.cost : day.consumption));
  const maxUsageDate = data.find(day => (showCost ? day.cost : day.consumption) === maxUsage)?.date;
  
  // Calculate date range
  const startDate = parseISO(data[0].date);
  const endDate = parseISO(data[data.length - 1].date);
  const daysInRange = differenceInDays(endDate, startDate) + 1;

  // Calculate trend (comparing first and last week)
  const firstWeek = data.slice(0, 7);
  const lastWeek = data.slice(-7);
  const firstWeekAvg = firstWeek.reduce((sum, day) => sum + (showCost ? day.cost : day.consumption), 0) / firstWeek.length;
  const lastWeekAvg = lastWeek.reduce((sum, day) => sum + (showCost ? day.cost : day.consumption), 0) / lastWeek.length;
  const trend = ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100;

  // Calculate savings potential (assuming 20% reduction is possible)
  const potentialSavings = totalUsage * 0.2;

  const formatValue = (value: number) => {
    if (showCost) {
      return `$${value.toFixed(2)}`;
    }
    return `${value.toFixed(1)} kWh`;
  };

  const formatDate = (date: string) => {
    return format(parseISO(date), 'MMM d, yyyy');
  };

  return (
    <Box
      w="100%"
      bg="brand.white"
      p={6}
      borderRadius="xl"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <HStack justify="space-between" align="center" mb={6}>
        <Heading 
          size="lg" 
          color="brand.primary"
          fontWeight="600"
        >
          Energy Insights
        </Heading>
        <Text color="brand.gray" fontSize="sm">
          {formatDate(data[0].date)} - {formatDate(data[data.length - 1].date)}
        </Text>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
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
          <StatLabel color="brand.gray" fontSize="md">
            Total {showCost ? 'Cost' : 'Consumption'}
            <Tooltip label="Total energy consumption or cost over the selected period">
              <Icon as={InfoIcon} ml={2} color="brand.gray" />
            </Tooltip>
          </StatLabel>
          <StatNumber color="brand.primary" fontSize="2xl" fontWeight="600">
            {formatValue(totalUsage)}
          </StatNumber>
          <StatHelpText color="brand.gray">
            Over {daysInRange} days
          </StatHelpText>
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
          <StatLabel color="brand.gray" fontSize="md">
            Average Daily {showCost ? 'Cost' : 'Consumption'}
            <Tooltip label="Average daily energy consumption or cost">
              <Icon as={InfoIcon} ml={2} color="brand.gray" />
            </Tooltip>
          </StatLabel>
          <StatNumber color="brand.primary" fontSize="2xl" fontWeight="600">
            {formatValue(averageUsage)}
          </StatNumber>
          <StatHelpText color="brand.gray">
            Per day
          </StatHelpText>
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
          <StatLabel color="brand.gray" fontSize="md">
            Highest {showCost ? 'Cost' : 'Consumption'}
            <Tooltip label="Highest daily energy consumption or cost">
              <Icon as={InfoIcon} ml={2} color="brand.gray" />
            </Tooltip>
          </StatLabel>
          <StatNumber color="brand.primary" fontSize="2xl" fontWeight="600">
            {formatValue(maxUsage)}
          </StatNumber>
          <StatHelpText color="brand.gray">
            On {maxUsageDate ? formatDate(maxUsageDate) : 'N/A'}
          </StatHelpText>
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
          <StatLabel color="brand.gray" fontSize="md">
            Usage Trend
            <Tooltip label="Comparison between first and last week of the period">
              <Icon as={InfoIcon} ml={2} color="brand.gray" />
            </Tooltip>
          </StatLabel>
          <StatNumber 
            color={trend > 0 ? 'red.500' : 'green.500'} 
            fontSize="2xl" 
            fontWeight="600"
          >
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </StatNumber>
          <StatHelpText color="brand.gray">
            {trend > 0 ? 'Increase' : 'Decrease'} in usage
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box mt={6} p={4} bg="blue.50" borderRadius="lg">
        <Text color="blue.700" fontSize="sm">
          💡 Potential Savings: You could save up to {formatValue(potentialSavings)} by reducing your energy consumption by 20%.
        </Text>
      </Box>
    </Box>
  );
};

export default InsightsPanel; 