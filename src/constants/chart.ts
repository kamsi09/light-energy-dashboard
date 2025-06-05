export const CHART_CONFIG = {
  height: 400,
  lineWidth: 2.5,
  activeDotRadius: 4,
  fontSize: 12,
  gridOpacity: 0.1,
  axisLineOpacity: 0.2,
  tooltipPadding: '8px 12px',
  animationDuration: 1000,
} as const;

export const DATE_FORMATS = {
  axis: { month: 'short', day: 'numeric' },
  tooltip: { weekday: 'long', month: 'long', day: 'numeric' },
} as const; 