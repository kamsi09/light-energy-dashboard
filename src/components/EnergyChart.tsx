import { Box, Text, useColorModeValue, useTheme, HStack, Input, Button } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyEnergyData } from '../types/energy';
import type { TooltipProps } from 'recharts';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isWithinInterval } from 'date-fns';

interface EnergyChartProps {
  data: DailyEnergyData[];
  showCost: boolean;
  onDataFilter?: (filteredData: DailyEnergyData[]) => void;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DailyEnergyData;
  }>;
  label?: string;
}

const MotionBox = motion(Box);

export const EnergyChart = ({ data, showCost, onDataFilter }: EnergyChartProps) => {
  const theme = useTheme();
  const accentGreen = theme.colors?.brand?.primary || '#b0d4dc';
  const gridColor = useColorModeValue('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.08)');
  const axisColor = useColorModeValue('rgba(0,0,0,0.18)', 'rgba(255,255,255,0.18)');
  const textColor = useColorModeValue('#1d1d1f', '#f5f5f7');
  const tooltipBg = useColorModeValue('white', '#222');
  const tooltipText = useColorModeValue('#1d1d1f', '#f5f5f7');

  // Get the date range from the data
  const dateRange = useMemo(() => {
    if (!data.length) return { start: new Date(), end: new Date() };
    const dates = data.map(d => parseISO(d.date));
    return {
      start: new Date(Math.min(...dates.map(d => d.getTime()))),
      end: new Date(Math.max(...dates.map(d => d.getTime())))
    };
  }, [data]);

  // State for the selected date range
  const [selectedRange, setSelectedRange] = useState({
    start: dateRange.start,
    end: dateRange.end
  });

  // Filter data based on selected range
  const filteredData = useMemo(() => {
    return data.filter(day => {
      const date = parseISO(day.date);
      return isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end });
    });
  }, [data, selectedRange]);

  const yAxisDomain = useMemo(() => {
    if (!filteredData.length) return [0, 100];
    const maxValue = showCost
      ? Math.max(...filteredData.map(d => d.cost))
      : Math.max(...filteredData.map(d => d.consumption));
    return [0, Math.ceil(maxValue * 1.1)];
  }, [filteredData, showCost]);

  const formatValue = (value: number) => {
    if (showCost) {
      return `$${value.toFixed(2)}`;
    }
    return `${value.toFixed(1)} kWh`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  // Enhanced tooltip content
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          bg={tooltipBg}
          p={4}
          borderRadius="lg"
          boxShadow="0 4px 24px 0 rgba(0,0,0,0.10)"
          border="1px solid"
          borderColor={gridColor}
        >
          <Text color={tooltipText} fontWeight="600" mb={2}>
            {formatDate(label || '')}
          </Text>
          <Text color={accentGreen} fontSize="lg" fontWeight="600">
            {formatValue(payload[0].value)}
          </Text>
          {data.generation > 0 && (
            <Text color={tooltipText} mt={1}>
              Generation: {formatValue(data.generation)}
            </Text>
          )}
        </Box>
      );
    }
    return null;
  };

  // Handle date range changes
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    if (type === 'start') {
      setSelectedRange(prev => ({
        ...prev,
        start: newDate > prev.end ? prev.end : newDate
      }));
    } else {
      setSelectedRange(prev => ({
        ...prev,
        end: newDate < prev.start ? prev.start : newDate
      }));
    }
  };

  // Reset to full date range
  const resetDateRange = () => {
    setSelectedRange({
      start: dateRange.start,
      end: dateRange.end
    });
  };

  // Update parent when filtered data changes
  useMemo(() => {
    onDataFilter?.(filteredData);
  }, [filteredData, onDataFilter]);

  return (
    <MotionBox
      w="full"
      h="400px"
      p={{ base: 2, md: 6 }}
      bg="white"
      borderRadius="2xl"
      boxShadow="0 2px 16px 0 rgba(0,0,0,0.04)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <HStack justify="space-between" mb={6}>
        <Text 
          fontSize="xl" 
          color={textColor} 
          fontWeight={600} 
          letterSpacing="-0.5px"
        >
          Daily Energy {showCost ? 'Cost' : 'Consumption'}
        </Text>
        <HStack spacing={2}>
          <Input
            type="date"
            size="sm"
            value={format(selectedRange.start, 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange('start', e.target.value)}
            min={format(dateRange.start, 'yyyy-MM-dd')}
            max={format(selectedRange.end, 'yyyy-MM-dd')}
            w="150px"
          />
          <Text color={textColor}>to</Text>
          <Input
            type="date"
            size="sm"
            value={format(selectedRange.end, 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange('end', e.target.value)}
            min={format(selectedRange.start, 'yyyy-MM-dd')}
            max={format(dateRange.end, 'yyyy-MM-dd')}
            w="150px"
          />
          <Button
            size="sm"
            variant="outline"
            colorScheme="brand"
            onClick={resetDateRange}
          >
            Reset
          </Button>
        </HStack>
      </HStack>
      <AnimatePresence mode="wait">
        <motion.div
          key={showCost ? 'cost' : 'consumption'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ResponsiveContainer width="100%" height="85%">
            <LineChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke={axisColor}
                tick={{ fill: axisColor, fontSize: 13, fontWeight: 500, letterSpacing: '-0.2px' }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={yAxisDomain}
                tickFormatter={formatValue}
                stroke={axisColor}
                tick={{ fill: axisColor, fontSize: 13, fontWeight: 500, letterSpacing: '-0.2px' }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={showCost ? 'cost' : 'consumption'}
                stroke={accentGreen}
                strokeWidth={3}
                dot={false}
                activeDot={{ 
                  r: 5, 
                  fill: accentGreen, 
                  stroke: 'white', 
                  strokeWidth: 3, 
                  style: { filter: `drop-shadow(0 2px 8px ${accentGreen}40)` } 
                }}
                isAnimationActive={true}
                animationDuration={400}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </MotionBox>
  );
}; 