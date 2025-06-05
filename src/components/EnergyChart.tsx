import { Box, Text, useColorModeValue, useTheme } from '@chakra-ui/react';
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
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnergyChartProps {
  data: DailyEnergyData[];
  showCost: boolean;
}

const MotionBox = motion(Box);

export const EnergyChart = ({ data, showCost }: EnergyChartProps) => {
  const theme = useTheme();
  // Use the green from the theme
  const accentGreen = theme.colors?.brand?.primary || '#b0d4dc';
  const gridColor = useColorModeValue('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.08)');
  const axisColor = useColorModeValue('rgba(0,0,0,0.18)', 'rgba(255,255,255,0.18)');
  const textColor = useColorModeValue('#1d1d1f', '#f5f5f7');
  const tooltipBg = useColorModeValue('white', '#222');
  const tooltipText = useColorModeValue('#1d1d1f', '#f5f5f7');

  const yAxisDomain = useMemo(() => {
    if (!data.length) return [0, 100];
    const maxValue = showCost
      ? Math.max(...data.map(d => d.cost))
      : Math.max(...data.map(d => d.consumption));
    return [0, Math.ceil(maxValue * 1.1)];
  }, [data, showCost]);

  const formatValue = (value: number) => {
    if (showCost) {
      return `$${value.toFixed(2)}`;
    }
    return `${value.toFixed(1)} kWh`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

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
      <Text 
        fontSize="xl" 
        mb={6} 
        color={textColor} 
        fontWeight={600} 
        letterSpacing="-0.5px" 
        textAlign="left"
      >
        Daily Energy {showCost ? 'Cost' : 'Consumption'}
      </Text>
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
              data={data}
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
              <Tooltip
                formatter={(value: number) => [formatValue(value), showCost ? 'Cost' : 'kWh']}
                labelFormatter={formatDate}
                contentStyle={{
                  background: tooltipBg,
                  color: tooltipText,
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                  fontSize: 15,
                  fontWeight: 500,
                  padding: 16,
                }}
                itemStyle={{ color: accentGreen, fontWeight: 600 }}
                labelStyle={{ color: axisColor, fontWeight: 500 }}
              />
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