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
  totalConsumption: number;
  cost: number;
}

export interface WeeklyEnergyData {
  weekStart: string;
  totalConsumption: number;
  totalGeneration: number;
  cost: number;
  weekdayAverage: number;
  weekendAverage: number;
}

export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface AIInsight {
  title: string;
  description: string;
  icon: string;
  locationImpact?: string;
  potentialSavings?: string;
  actionItems?: string[];
  historicalContext?: string;
}

export interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
} 