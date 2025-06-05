import { Box, VStack, HStack, Text, useColorModeValue, Button, Spinner, List, ListItem, Stat, StatLabel, StatNumber, StatHelpText, Tooltip, Badge, Divider } from '@chakra-ui/react';
import { SearchIcon, InfoIcon } from '@chakra-ui/icons';
import type { DailyEnergyData, AIInsight } from '../types/energy';
import { useState, useEffect, useRef } from 'react';
import { getAIInsights } from '../services/energyService';
import { formatNumber, formatCurrency } from '../utils/formatters';

const iconMap: Record<string, string> = {
  trending_up: '📈',
  warning: '⚠️',
  lightbulb: '💡',
  calendar_today: '📅',
  savings: '💰',
  schedule: '⏰',
  eco: '🌱'
};

interface InsightsPanelProps {
  data: DailyEnergyData[];
  showCost: boolean;
}

export default function InsightsPanel({ data, showCost }: InsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insightsCache = useRef<Record<string, AIInsight[]>>({});

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const highlightColor = useColorModeValue('brand.primary', 'brand.secondary');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const iconBg = useColorModeValue('blue.50', 'blue.900');
  const iconColor = useColorModeValue('blue.600', 'blue.200');

  const fetchInsights = async () => {
    if (data.length > 0) {
      try {
        setError(null);
        setIsLoading(true);
        const newInsights = await getAIInsights({ 
          energyData: data, 
          showCost
        });
        const validInsights = Array.isArray(newInsights) ? newInsights : [];
        if (validInsights.length === 0) {
          setError('No insights available for the selected period.');
        }
        const cacheKey = showCost ? 'cost' : 'kwh';
        insightsCache.current[cacheKey] = validInsights;
        if (cacheKey === (showCost ? 'cost' : 'kwh')) {
          setInsights(validInsights);
        }
      } catch (error) {
        console.error('Error generating AI insights:', error);
        setError('Failed to generate insights. Please try again.');
        setInsights([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const cacheKey = showCost ? 'cost' : 'kwh';
    if (!insightsCache.current[cacheKey]) {
      fetchInsights();
    }
  }, [data, showCost]);

  if (!data.length) return null;

  // Calculate insights
  const totalUsage = data.reduce((sum, day) => sum + (showCost ? day.cost : day.consumption), 0);
  const averageUsage = totalUsage / data.length;
  const maxUsage = Math.max(...data.map(day => showCost ? day.cost : day.consumption));
  const maxUsageDay = data.find(day => (showCost ? day.cost : day.consumption) === maxUsage)?.date;

  return (
    <Box 
      w="100%" 
      bg={bgColor} 
      p={6} 
      borderRadius="xl" 
      boxShadow="sm" 
      borderWidth="1px" 
      borderColor={borderColor}
    >
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="600" color={highlightColor}>
            Energy Usage Insights
          </Text>
          <Button
            size="sm"
            variant="outline"
            colorScheme="brand"
            onClick={() => {
              const cacheKey = showCost ? 'cost' : 'kwh';
              insightsCache.current[cacheKey] = [];
              fetchInsights();
            }}
            leftIcon={<SearchIcon />}
          >
            Refresh Insights
          </Button>
        </HStack>

        <HStack spacing={8} wrap="wrap" justify="space-between">
          <Stat>
            <StatLabel>Total {showCost ? 'Cost' : 'Consumption'}</StatLabel>
            <StatNumber color={highlightColor}>
              {showCost ? formatCurrency(totalUsage) : formatNumber(totalUsage) + ' kWh'}
            </StatNumber>
            <StatHelpText>
              <Tooltip label="Total energy consumption over the selected period">
                <InfoIcon mr={1} />
              </Tooltip>
              {showCost ? 'Total cost' : 'Total energy used'}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Average Daily {showCost ? 'Cost' : 'Usage'}</StatLabel>
            <StatNumber color={highlightColor}>
              {showCost ? formatCurrency(averageUsage) : formatNumber(averageUsage) + ' kWh'}
            </StatNumber>
            <StatHelpText>
              <Tooltip label="Average daily energy consumption">
                <InfoIcon mr={1} />
              </Tooltip>
              Per day
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Highest {showCost ? 'Cost' : 'Usage'}</StatLabel>
            <StatNumber color={highlightColor}>
              {showCost ? formatCurrency(maxUsage) : formatNumber(maxUsage) + ' kWh'}
            </StatNumber>
            <StatHelpText>
              <Tooltip label={`Highest daily ${showCost ? 'cost' : 'consumption'} recorded`}>
                <InfoIcon mr={1} />
              </Tooltip>
              {maxUsageDay ? `on ${new Date(maxUsageDay).toLocaleDateString()}` : ''}
            </StatHelpText>
          </Stat>
        </HStack>

        <Divider />

        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <Text fontSize="lg" fontWeight="600" color={highlightColor}>
              AI-Powered Insights
            </Text>
            <Badge colorScheme="purple" variant="subtle" fontSize="sm">
              Powered by GPT
            </Badge>
          </HStack>
        </HStack>

        {isLoading ? (
          <VStack spacing={4} py={8}>
            <Spinner size="lg" color="brand.primary" thickness="3px" />
            <Text color={textColor} fontSize="sm">
              Analyzing your energy data with AI...
            </Text>
          </VStack>
        ) : error ? (
          <Text color="red.500" textAlign="center" py={4}>
            {error}
          </Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {insights.map((insight, index) => (
              <Box
                key={index}
                p={5}
                bg={cardBg}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                _hover={{ bg: hoverBg, transform: 'translateY(-1px)' }}
                transition="all 0.2s"
              >
                <VStack align="stretch" spacing={4}>
                  <HStack spacing={3}>
                    <Box
                      p={2}
                      bg={iconBg}
                      borderRadius="md"
                      color={iconColor}
                    >
                      <Text fontSize="xl">{iconMap[insight.icon]}</Text>
                    </Box>
                    <Text fontWeight="600" fontSize="lg" color={textColor}>
                      {insight.title}
                    </Text>
                  </HStack>
                  
                  <Text color={textColor} fontSize="md" lineHeight="1.6">
                    {insight.description}
                  </Text>
                  
                  {insight.historicalContext && (
                    <Text color={textColor} fontSize="sm" fontStyle="italic">
                      {insight.historicalContext}
                    </Text>
                  )}
                  
                  {insight.actionItems && insight.actionItems.length > 0 && (
                    <VStack align="stretch" spacing={2}>
                      <Text fontWeight="500" color={textColor} fontSize="sm">
                        Recommended Actions:
                      </Text>
                      <List spacing={2}>
                        {insight.actionItems.map((action: string, actionIndex: number) => (
                          <ListItem 
                            key={actionIndex} 
                            color={textColor}
                            fontSize="sm"
                            pl={2}
                            borderLeft="2px solid"
                            borderColor={highlightColor}
                          >
                            {action}
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  )}
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
} 