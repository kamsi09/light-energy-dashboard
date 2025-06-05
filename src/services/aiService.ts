import OpenAI from 'openai';
import type { DailyEnergyData } from '../types/energy';

interface Location {
  city: string;
  state: string;
  country: string;
}

interface InsightRequest {
  energyData: DailyEnergyData[];
  showCost: boolean;
  location?: Location;
  weatherData?: WeatherData[];
}

interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  weatherCondition: string;
}

interface WeatherStats {
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  conditions: Record<string, number>;
  count: number;
}

interface EnergyInsight {
  title: string;
  description: string;
  icon: string;
  locationImpact?: string;
  potentialSavings?: string;
  actionItems?: string[];
  historicalContext?: string;
}

interface MonthlyStats {
  total: number;
  days: number;
  max: number;
  maxDate: string;
  min: number;
  minDate: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function summarizeData(data: DailyEnergyData[], showCost: boolean) {
  // Group data by month
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

  // Calculate averages and format
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

function summarizeWeatherData(weatherData: WeatherData[]) {
  // Group weather data by month
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

const systemPrompt = `You are an energy efficiency expert AI assistant. Analyze the provided energy consumption data and generate clear, actionable insights. 
Focus on practical, easy-to-understand recommendations that users can implement in their daily lives.

When location and weather data are provided, analyze how weather patterns affect energy usage and provide location-specific recommendations.
For example:
- Compare current usage to historical averages for the same location
- Compare current weather to historical weather patterns
- Reference specific weather events or anomalies
- Compare to similar cities in the region
- Include local utility rate changes or programs

Format your response as a JSON array of insights, where each insight has:
- title: A short, clear title (max 50 chars)
- description: A friendly, actionable description (max 150 chars)
- icon: One of: trending_up, calendar_today, warning, lightbulb, savings, schedule, eco
- locationImpact: A detailed explanation of local context (max 150 chars) including:
  * Comparison to historical data
  * Local weather anomalies
  * Regional comparisons
  * Utility rate context
- potentialSavings: A range of potential savings with calculation basis (max 150 chars)
- actionItems: A list of 1-2 specific actions the user can take
- historicalContext: Additional historical data that provides context (max 100 chars)

Guidelines for insights:
1. Always include specific numbers from their data (e.g., "30% higher" instead of "higher")
2. For potential savings:
   - Always provide a range (e.g., "$20-30/month" not just "$25/month")
   - Include the calculation basis (e.g., "based on current rate of $0.12/kWh")
   - Show both kWh and cost savings when possible
   - Consider local utility rates and time-of-use pricing
3. Give exact time periods (e.g., "between 6-9 PM" instead of "in the evening")
4. Include specific temperature ranges that affect usage
5. ALWAYS include the year when referencing dates (e.g., "July 2023" not just "July")
6. Compare to previous periods when possible
7. Suggest specific actions with measurable outcomes
8. For location context, always include:
   - Comparison to historical averages
   - Current weather anomalies
   - Regional utility rate context
   - Local energy program opportunities

Example format:
{
  "insights": [
    {
      "title": "Unusual Summer Heat Impact",
      "description": "Your energy use is 40% higher in July 2023 compared to July 2022. This matches LA's record-breaking heat wave.",
      "icon": "schedule",
      "locationImpact": "LA experienced 12 days above 100°F in July 2023, compared to 3 days in July 2022. This is 20% hotter than the 10-year average for July.",
      "potentialSavings": "$35-45/month (300-400 kWh) based on current rate of $0.12/kWh and typical summer usage patterns",
      "actionItems": ["Set thermostat to 78°F during heat waves", "Use smart plugs to schedule other appliances"],
      "historicalContext": "July 2023 was LA's hottest month since 2013"
    }
  ]
}`;

export async function getEnergyInsights(request: InsightRequest): Promise<EnergyInsight[]> {
  try {
    // Summarize the data to reduce token count
    const summarizedEnergyData = summarizeData(request.energyData, request.showCost);
    const summarizedWeatherData = request.weatherData ? summarizeWeatherData(request.weatherData) : undefined;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: JSON.stringify({
            energyData: summarizedEnergyData,
            showCost: request.showCost,
            location: request.location,
            weatherData: summarizedWeatherData
          })
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) return [];

    try {
      // First try parsing as direct JSON
      const parsed = JSON.parse(response);
      const insights = parsed.insights || parsed;
      return Array.isArray(insights) ? insights : [];
    } catch {
      // If direct parsing fails, try extracting JSON from markdown
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                       response.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1];
        const parsed = JSON.parse(jsonStr);
        const insights = parsed.insights || parsed;
        return Array.isArray(insights) ? insights : [];
      }
      return [];
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return [];
  }
}