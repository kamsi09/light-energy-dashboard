# My Energy Story Dashboard

A React-based dashboard that helps residential customers understand their electricity usage over time. The dashboard visualizes energy consumption data and provides key insights about usage patterns.

## Features

- Interactive daily energy consumption chart
- Toggle between kWh and cost views (using 14¢/kWh rate)
- Key insights including:
  - Highest usage day
  - Weekday vs weekend usage comparison
  - Total consumption/cost for the period
- Responsive design that works on all devices

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd light-energy-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Data Format

The application expects CSV data in the following format:

```csv
datetime,duration,unit,consumption,generation
2023-05-01T00:00:00-05:00,900,Wh,436,0
```

Where:
- `datetime`: ISO 8601 timestamp
- `duration`: Duration in seconds
- `unit`: Unit of measurement (Wh)
- `consumption`: Energy consumption in the specified unit
- `generation`: Energy generation in the specified unit

## Technologies Used

- React
- TypeScript
- Vite
- Chakra UI
- Recharts
- date-fns
- Papa Parse

## License

MIT
