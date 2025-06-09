# Light Energy Dashboard

A modern web application for visualizing and analyzing energy consumption data. Built with React, TypeScript, and Chakra UI, this dashboard provides interactive visualizations and AI-powered insights for energy usage patterns.

![Preview](https://github.com/user-attachments/assets/1956f352-2e58-4433-b67c-9a68229e98fe)

## Features

- 📊 Interactive energy consumption visualization
- 📈 Cost and consumption tracking
- 🤖 AI-powered insights and recommendations
- 📁 CSV file upload with validation
- 💰 Cost analysis and savings suggestions
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **UI Library**: Chakra UI 2
- **Data Visualization**: Recharts 2
- **AI Integration**: OpenAI GPT-3.5 Turbo
- **File Handling**: react-dropzone
- **Date Handling**: date-fns
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/light-energy-dashboard.git
   cd light-energy-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── EnergyChart.tsx  # Main visualization component
│   ├── FileUpload.tsx   # CSV file upload handling
│   ├── InsightsPanel.tsx # AI insights display
│   ├── UnitToggle.tsx   # Cost/Consumption toggle
│   └── WelcomeMessage.tsx # Landing page component
├── services/           # Business logic and API calls
│   └── energyService.ts # Energy data processing and AI insights
├── types/             # TypeScript type definitions
│   └── energy.ts      # Energy data interfaces
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
└── layouts/           # Page layouts
```

## Data Format

The application expects CSV files with the following format:
```
datetime,duration,consumption,generation,unit
2024-03-20T12:00:00+00:00,3600,1000,500,wh
```

- `datetime`: ISO 8601 formatted date and time
- `duration`: Duration in seconds
- `consumption`: Energy consumption in watt-hours
- `generation`: Energy generation in watt-hours
- `unit`: Unit of measurement (wh)

## Features in Detail

### Energy Visualization
- Interactive line chart showing daily energy consumption/generation
- Toggle between cost and consumption views
- Date range selection for focused analysis
- Responsive design that works on all screen sizes

### AI Insights
- Monthly consumption analysis
- Cost optimization suggestions
- Actionable recommendations
- Historical context and comparisons

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

The project uses ESLint for code quality and consistency. Key rules include:
- TypeScript strict mode
- React hooks rules
- Modern JavaScript features
- Consistent formatting

## Deployment

The application is configured for deployment on Vercel. Key deployment considerations:

1. Environment Variables:
   - Set `VITE_OPENAI_API_KEY` in Vercel dashboard
   - Configure any additional environment variables

2. Build Settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Future Improvements

1. Backend Integration
   - Move AI processing to server
   - Implement proper API key security
   - Add data persistence

2. Enhanced Features
   - User authentication
   - Data export functionality
   - More visualization options
   - Weather data integration (future enhancement)

3. Performance Optimization
   - Implement data pagination
   - Add data caching
   - Optimize bundle size

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- Chakra UI for the component library
- Recharts for the visualization components
- The open-source community for various tools and libraries
