# Light Energy Dashboard

A modern, interactive dashboard for monitoring and analyzing energy consumption data. Built with React, TypeScript, and Chakra UI.
![Preview](https://github.com/user-attachments/assets/1956f352-2e58-4433-b67c-9a68229e98fe)

## Features

### Real-time Energy Monitoring
- Interactive line charts showing energy consumption over time
- Toggle between kWh and cost views
- Customizable date range selection
- Responsive design for all screen sizes

### Smart Energy Insights
- Advanced analysis of energy consumption patterns
- Location-aware recommendations
- Historical comparisons and trend analysis
- Specific, actionable recommendations with:
  - Detailed savings calculations with ranges
  - Location-specific impact analysis
  - Historical context and comparisons
  - Clear action items

### Location-Based Features
- City selection for location context
- Regional energy usage benchmarks
- Location-aware recommendations
- Weather impact analysis

### Data Visualization
- Interactive charts with hover details
- Multiple view options (daily, weekly, monthly)
- Customizable date ranges
- Export capabilities

### Smart Features
- Automatic anomaly detection
- Usage pattern analysis
- Cost optimization suggestions
- Energy efficiency recommendations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/light-energy-dashboard.git
   ```

2. Install dependencies:
   ```bash
   cd light-energy-dashboard
   npm install
   ```

3. Create a `.env` file in the root directory with your API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
```
src/
├── components/         # React components
├── services/          # API and data services
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

## Key Components

### EnergyChart
- Interactive line chart for energy data visualization
- Customizable date range selection
- Toggle between kWh and cost views
- Responsive design

### InsightsPanel
- Smart energy insights and recommendations
- Location-aware analysis
- Historical comparisons
- Actionable recommendations with savings calculations

### LocationSelector
- City selection for location context
- Regional energy usage context
- Weather impact analysis

## Technologies Used
- React
- TypeScript
- Chakra UI
- Chart.js
- OpenAI API (for advanced energy analysis)

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Chart.js for data visualization
- Chakra UI for the component library
