import type { EnergyData, DailyEnergyData, WeeklyEnergyData } from '../types/energy';
import { format, startOfWeek, isWeekend } from 'date-fns';

const RATE_PER_KWH = 0.14; // 14 cents per kWh

export const processEnergyData = (data: EnergyData[]): DailyEnergyData[] => {
  const dailyData = new Map<string, DailyEnergyData>();

  data.forEach(record => {
    const date = record.datetime.split('T')[0];
    // Convert Wh to kWh directly (divide by 1000)
    const consumptionKWh = record.consumption / 1000;
    const generationKWh = record.generation / 1000;

    if (!dailyData.has(date)) {
      dailyData.set(date, {
        date,
        consumption: 0,
        generation: 0,
        cost: 0,
        totalConsumption: 0
      });
    }

    const dayData = dailyData.get(date)!;
    dayData.consumption += consumptionKWh;
    dayData.generation += generationKWh;
    dayData.totalConsumption = dayData.consumption;
    dayData.cost = dayData.consumption * RATE_PER_KWH;
  });

  const result = Array.from(dailyData.values())
    .map(day => ({
      ...day,
      consumption: Number(day.consumption.toFixed(2)),
      generation: Number(day.generation.toFixed(2)),
      cost: Number(day.cost.toFixed(2)),
      totalConsumption: Number(day.totalConsumption.toFixed(2))
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  console.log('Processed data sample:', {
    totalDays: result.length,
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
};

export const processWeeklyData = (dailyData: DailyEnergyData[]): WeeklyEnergyData[] => {
  const weeklyData = new Map<string, WeeklyEnergyData>();

  dailyData.forEach(day => {
    const date = new Date(day.date);
    const weekStart = format(startOfWeek(date), 'yyyy-MM-dd');

    if (!weeklyData.has(weekStart)) {
      weeklyData.set(weekStart, {
        weekStart,
        totalConsumption: 0,
        totalGeneration: 0,
        cost: 0,
        weekdayAverage: 0,
        weekendAverage: 0
      });
    }

    const weekData = weeklyData.get(weekStart)!;
    weekData.totalConsumption += day.consumption;
    weekData.totalGeneration += day.generation;
    weekData.cost += day.cost;

    if (isWeekend(date)) {
      weekData.weekendAverage = (weekData.weekendAverage || 0) + day.consumption;
    } else {
      weekData.weekdayAverage = (weekData.weekdayAverage || 0) + day.consumption;
    }
  });

  return Array.from(weeklyData.values()).sort((a, b) => a.weekStart.localeCompare(b.weekStart));
};

export const findBiggestUseDay = (dailyData: DailyEnergyData[]): DailyEnergyData => {
  return dailyData.reduce((max, day) => 
    day.consumption > max.consumption ? day : max
  );
};

export const calculateWeekendWeekdaySplit = (dailyData: DailyEnergyData[]): { weekend: number; weekday: number } => {
  const split = dailyData.reduce((acc, day) => {
    const date = new Date(day.date);
    if (isWeekend(date)) {
      acc.weekend += day.consumption;
    } else {
      acc.weekday += day.consumption;
    }
    return acc;
  }, { weekend: 0, weekday: 0 });

  return split;
}; 