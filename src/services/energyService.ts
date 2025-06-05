import OpenAI from 'openai';
import type { DailyEnergyData } from '../types/energy';

interface Location {
  city: string;
  state: string;
  country: string;
}

interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  weatherCondition: string;
}

interface AIInsight {
  title: string;
  description: string;
  icon: string;
  locationImpact?: string;
  potentialSavings?: string;
  actionItems?: string[];
  historicalContext?: string;
}

interface AIInsightRequest {
  energyData: DailyEnergyData[];
  showCost: boolean;
  location?: Location;
  weatherData?: WeatherData[];
}

interface MonthlyStats {
  total: number;
  days: number;
  max: number;
  maxDate: string;
  min: number;
  minDate: string;
}

interface WeatherStats {
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  conditions: Record<string, number>;
  count: number;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Aggregates daily data into monthly summaries for better analysis
function summarizeData(data: DailyEnergyData[], showCost: boolean) {
  const monthlyData = data.reduce((acc, day) => {
    const month = day.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = {
        total: 0,
        days: 0,
        max: 0,
        maxDate: '',
        min: Infinity,
        minDate: ''
      };
    }
    const value = showCost ? day.cost : day.consumption;
    acc[month].total += value;
    acc[month].days++;
    if (value > acc[month].max) {
      acc[month].max = value;
      acc[month].maxDate = day.date;
    }
    if (value < acc[month].min) {
      acc[month].min = value;
      acc[month].minDate = day.date;
    }
    return acc;
  }, {} as Record<string, MonthlyStats>);

  return Object.entries(monthlyData).map(([month, stats]) => ({
    month,
    average: stats.total / stats.days,
    max: stats.max,
    maxDate: stats.maxDate,
    min: stats.min,
    minDate: stats.minDate,
    total: stats.total
  }));
}

// Aggregates weather data by month for trend analysis
function summarizeWeatherData(weatherData: WeatherData[]) {
  return weatherData.reduce((acc, day) => {
    const month = day.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = {
        avgTemp: 0,
        maxTemp: -Infinity,
        minTemp: Infinity,
        conditions: {} as Record<string, number>,
        count: 0
      };
    }
    acc[month].avgTemp += day.temperature;
    acc[month].maxTemp = Math.max(acc[month].maxTemp, day.temperature);
    acc[month].minTemp = Math.min(acc[month].minTemp, day.temperature);
    acc[month].conditions[day.weatherCondition] = (acc[month].conditions[day.weatherCondition] || 0) + 1;
    acc[month].count++;
    return acc;
  }, {} as Record<string, WeatherStats>);
}

export async function getAIInsights(request: AIInsightRequest): Promise<AIInsight[]> {
  try {
    // Pre-process data to reduce API payload size
    const monthlyData = summarizeData(request.energyData, request.showCost);
    const weatherSummary = request.weatherData ? summarizeWeatherData(request.weatherData) : null;

    const systemPrompt = `You are an AI energy analyst. Your task is to analyze the provided monthly energy data and generate exactly 3 insights.
    The data includes monthly consumption, generation, and weather information.
    
    Required Analysis Steps:
    1. Compare each month's usage to the previous year's same month
    2. Identify the highest and lowest consumption months
    3. Calculate percentage changes between months
    4. Look for patterns in weather impact (if weather data provided)
    
    Each insight MUST:
    - Reference specific numbers from the provided data
    - Include exact dates with years
    - Compare to historical data
    - Suggest concrete actions
    
    Format your response as a JSON array with exactly 3 insights:
    [
      {
        "title": "Month-to-Month Comparison",
        "description": "Your energy usage in [Month] 2023 was [X]% [higher/lower] than [Month] 2022",
        "icon": "trending_up",
        "locationImpact": "[Specific weather impact if available]",
        "potentialSavings": "$[X]-$[Y]/month by [specific action]",
        "actionItems": [
          "[Action 1 with specific numbers]",
          "[Action 2 with specific numbers]"
        ],
        "historicalContext": "Compared to [previous period]"
      },
      {
        "title": "Peak Usage Analysis",
        "description": "Highest consumption of [X] kWh occurred in [Month] 2023",
        "icon": "warning",
        "potentialSavings": "$[X]-$[Y]/month by [specific action]",
        "actionItems": [
          "[Action 1 with specific numbers]",
          "[Action 2 with specific numbers]"
        ],
        "historicalContext": "[Comparison to previous peak]"
      },
      {
        "title": "Efficiency Opportunity",
        "description": "[Specific efficiency finding with numbers]",
        "icon": "lightbulb",
        "potentialSavings": "$[X]-$[Y]/month by [specific action]",
        "actionItems": [
          "[Action 1 with specific numbers]",
          "[Action 2 with specific numbers]"
        ],
        "historicalContext": "[Historical comparison]"
      }
    ]`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: JSON.stringify({
            monthlyData,
            weatherSummary,
            location: request.location,
            showCost: request.showCost
          })
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI service');
    }

    // First try parsing as direct JSON
    try {
      const parsed = JSON.parse(content);
      // Handle both direct array and insights wrapper object
      const insights = Array.isArray(parsed) ? parsed : parsed.insights || [parsed];
      if (!Array.isArray(insights) || insights.length === 0) {
        throw new Error('No valid insights found in response');
      }
      return insights;
    } catch {
      // If that fails, try extracting JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        const insights = Array.isArray(parsed) ? parsed : parsed.insights || [parsed];
        if (!Array.isArray(insights) || insights.length === 0) {
          throw new Error('No valid insights found in response');
        }
        return insights;
      }
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw error;
  }
}