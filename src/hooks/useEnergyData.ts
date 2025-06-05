import { useState, useMemo } from 'react';
import type { EnergyData } from '../types/energy';
import { processEnergyData } from '../utils/energyUtils';

export const useEnergyData = () => {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [showCost, setShowCost] = useState(false);

  const processedData = useMemo(() => {
    if (!energyData.length) return [];
    const result = processEnergyData(energyData);
    console.log('Processed data:', {
      days: result.length,
      firstDay: result[0],
      lastDay: result[result.length - 1],
      sampleValues: result.slice(0, 3).map(day => ({
        date: day.date,
        consumption: day.consumption,
        generation: day.generation,
        cost: day.cost
      }))
    });
    return result;
  }, [energyData]);

  const handleDataLoaded = (data: EnergyData[]) => {
    console.log('Raw data loaded:', { 
      records: data.length,
      firstRecord: data[0],
      lastRecord: data[data.length - 1]
    });
    setEnergyData(data);
  };

  const toggleUnit = () => {
    setShowCost(!showCost);
  };

  const resetData = () => {
    setEnergyData([]);
    setShowCost(false);
  };

  return {
    energyData,
    processedData,
    showCost,
    handleDataLoaded,
    toggleUnit,
    resetData,
  };
}; 