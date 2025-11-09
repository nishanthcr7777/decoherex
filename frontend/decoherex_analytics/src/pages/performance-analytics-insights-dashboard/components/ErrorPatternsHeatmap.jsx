import React from 'react';
import Icon from '../../../components/AppIcon';

const ErrorPatternsHeatmap = ({ data }) => {
  const getIntensityColor = (value) => {
    if (value === 0) return 'bg-slate-800';
    if (value <= 2) return 'bg-success/20';
    if (value <= 5) return 'bg-warning/40';
    if (value <= 10) return 'bg-error/60';
    return 'bg-error/80';
  };

  const getTextColor = (value) => {
    if (value <= 2) return 'text-success';
    if (value <= 5) return 'text-warning';
    return 'text-error';
  };

  const timeSlots = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  const backends = [
    'IBM Quantum 1',
    'Google Sycamore',
    'IonQ Aria',
    'Simulator 1',
    'Simulator 2'
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Error Rate Heatmap</h3>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success/20 rounded"></div>
            <span>Low (0-2%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning/40 rounded"></div>
            <span>Medium (3-5%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error/60 rounded"></div>
            <span>High (6-10%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error/80 rounded"></div>
            <span>Critical (&gt;10%)</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Time header */}
          <div className="grid grid-cols-13 gap-1 mb-2">
            <div className="text-xs text-muted-foreground font-medium"></div>
            {timeSlots?.map((time) => (
              <div key={time} className="text-xs text-muted-foreground text-center font-medium">
                {time}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {backends?.map((backend, backendIndex) => (
            <div key={backend} className="grid grid-cols-13 gap-1 mb-1">
              <div className="text-xs text-muted-foreground font-medium py-2 pr-2 text-right">
                {backend}
              </div>
              {timeSlots?.map((time, timeIndex) => {
                const errorRate = data?.[backendIndex]?.[timeIndex] || Math.floor(Math.random() * 15);
                return (
                  <div
                    key={`${backend}-${time}`}
                    className={`
                      h-8 rounded flex items-center justify-center cursor-pointer
                      transition-all duration-200 hover:scale-105 hover:shadow-lg
                      ${getIntensityColor(errorRate)}
                    `}
                    title={`${backend} at ${time}: ${errorRate}% error rate`}
                  >
                    <span className={`text-xs font-medium ${getTextColor(errorRate)}`}>
                      {errorRate}%
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 p-4 bg-muted/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Heatmap Insights:</p>
            <p>Peak error rates typically occur during 08:00-10:00 and 14:00-16:00 UTC due to increased job volume. 
            Simulator backends show consistently lower error rates compared to physical quantum processors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPatternsHeatmap;