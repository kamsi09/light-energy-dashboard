export interface EnergyData {
  datetime: string;
  duration: number;
  unit: string;
  consumption: number;
  generation: number;
}

export interface DailyEnergyData {
  date: string;
  consumption: number;
  generation: number;
  cost: number;
  totalConsumption: number;
}

export interface WeeklyEnergyData {
  weekStart: string;
  totalConsumption: number;
  totalGeneration: number;
  cost: number;
  weekdayAverage: number;
  weekendAverage: number;
} 