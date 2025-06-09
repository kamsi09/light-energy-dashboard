/**
 * Represents weather data for a specific point in time
 * 
 * @property temperature - Temperature in Celsius
 * @property condition - Weather condition (e.g., 'Sunny', 'Rainy')
 * @property humidity - Humidity percentage
 * @property windSpeed - Wind speed in km/h
 * @property timestamp - ISO 8601 timestamp of the weather reading
 */
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  timestamp: string;
} 