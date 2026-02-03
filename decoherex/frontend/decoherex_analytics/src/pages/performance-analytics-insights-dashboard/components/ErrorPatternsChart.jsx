import React from 'react';
import Icon from '../../../components/AppIcon';

const ErrorPatternsChart = ({ data }) => {
  // Calculate error pattern insights
  const totalErrors = data?.reduce((sum, item) => sum + item?.errorCount, 0);
  const avgErrorRate = data?.length > 0 ? totalErrors / data?.length : 0;
  
  // Get top error types
  const errorTypeCounts = data?.reduce((acc, item) => {
    item?.errorTypes?.forEach(errorType => {
      acc[errorType] = (acc[errorType] || 0) + 1;
    });
    return acc;
  }, {});
  
  const topErrorTypes = Object.entries(errorTypeCounts || {})
    ?.sort(([,a], [,b]) => b - a)
    ?.slice(0, 5);

  // Get error trends by backend
  const backendErrorCounts = data?.reduce((acc, item) => {
    acc[item?.backend] = (acc[item?.backend] || 0) + item?.errorCount;
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Error Pattern Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Error trends and patterns across quantum backends
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-muted-foreground">Critical Errors</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Warning Errors</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Info Errors</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
        {/* Error Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Errors */}
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-error/20 rounded-lg">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Errors</p>
                <p className="text-2xl font-bold text-foreground">{totalErrors}</p>
              </div>
            </div>
          </div>

          {/* Average Error Rate */}
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Icon name="TrendingUp" size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Error Rate</p>
                <p className="text-2xl font-bold text-foreground">{avgErrorRate?.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Most Problematic Backend */}
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Icon name="Server" size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Most Errors</p>
                <p className="text-lg font-bold text-foreground">
                  {Object.entries(backendErrorCounts || {})
                    ?.sort(([,a], [,b]) => b - a)?.[0]?.[0] || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Pattern Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Error Timeline Chart */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">Error Timeline</h4>
            <div className="h-64 bg-muted/20 rounded-lg p-4">
              <div className="h-full flex items-end space-x-1 overflow-x-auto scrollbar-hide">
                {data?.map((item, index) => {
                  const maxErrors = Math.max(...data?.map(d => d?.errorCount));
                  const height = (item?.errorCount / maxErrors) * 100;
                  const severity = item?.errorCount > 10 ? 'error' : item?.errorCount > 5 ? 'warning' : 'accent';
                  
                  return (
                    <div key={index} className="flex flex-col items-center space-y-1 flex-shrink-0 min-w-[20px]">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-300 hover:opacity-80 ${
                          severity === 'error' ? 'bg-error' : 
                          severity === 'warning' ? 'bg-warning' : 'bg-accent'
                        }`}
                        style={{ height: `${Math.max(height, 2)}%` }}
                        title={`${item?.date}: ${item?.errorCount} errors`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {new Date(item?.date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Error Type Distribution */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">Error Type Distribution</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
              {topErrorTypes?.map(([errorType, count], index) => {
                const percentage = (count / totalErrors) * 100;
                const colors = ['bg-error', 'bg-warning', 'bg-accent', 'bg-secondary', 'bg-success'];
                
                return (
                  <div key={errorType} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground capitalize">
                        {errorType?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({percentage?.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[index % colors?.length]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error Pattern Heatmap */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Error Pattern Heatmap</h4>
          <div className="glass-card p-4 rounded-lg">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="grid grid-cols-7 gap-2 min-w-[400px]">
                {data?.slice(0, 28)?.map((item, index) => {
                  const intensity = Math.min(item?.errorCount / 10, 1);
                  const opacity = 0.3 + (intensity * 0.7);
                  
                  return (
                    <div
                      key={index}
                      className="aspect-square rounded-sm border border-border/30 flex items-center justify-center text-xs font-medium"
                      style={{
                        backgroundColor: `rgba(239, 68, 68, ${opacity})`,
                        color: intensity > 0.5 ? 'white' : 'var(--color-muted-foreground)'
                      }}
                      title={`${item?.date}: ${item?.errorCount} errors`}
                    >
                      {item?.errorCount > 0 ? item?.errorCount : ''}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex space-x-1">
                {[0, 0.25, 0.5, 0.75, 1]?.map((intensity, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-sm border border-border/30"
                    style={{
                      backgroundColor: `rgba(239, 68, 68, ${0.3 + (intensity * 0.7)})`
                    }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Backend Error Comparison */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Backend Error Comparison</h4>
          <div className="glass-card p-4 rounded-lg">
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
              {Object.entries(backendErrorCounts || {})
                ?.sort(([,a], [,b]) => b - a)
                ?.map(([backend, errorCount], index) => {
                  const maxErrors = Math.max(...Object.values(backendErrorCounts || {}));
                  const percentage = (errorCount / maxErrors) * 100;
                  const colors = ['bg-error', 'bg-warning', 'bg-accent', 'bg-secondary', 'bg-success'];
                  
                  return (
                    <div key={backend} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{backend}</span>
                        <span className="text-sm text-muted-foreground">{errorCount} errors</span>
                      </div>
                      <div className="w-full bg-muted/20 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[index % colors?.length]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPatternsChart;
