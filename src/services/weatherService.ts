import type { WeatherData, DailyEnergyData } from '../types/energy';

export async function fetchWeatherData(
  energyData: DailyEnergyData[]
): Promise<WeatherData[]> {
  // TODO: Implement actual weather API integration
  // For now, return mock data
  return energyData.map(data => ({
    date: data.date,
    temperature: 20 + Math.random() * 10, // Random temperature between 20-30°C
    humidity: 40 + Math.random() * 30, // Random humidity between 40-70%
    precipitation: Math.random() * 10, // Random precipitation between 0-10mm
    windSpeed: Math.random() * 20, // Random wind speed between 0-20 km/h
    condition: ['Sunny', 'Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 4)]
  }));
} 