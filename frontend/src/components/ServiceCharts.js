'use client';

import { useState, useEffect, useRef } from 'react';

const ServiceCharts = ({ serviceId, serviceName }) => {
  const [metrics, setMetrics] = useState({ cpu: [], memory: [] });
  const chartRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real metrics
      const newCpu = Math.random() * 50 + 20;
      const newMemory = Math.random() * 40 + 30;
      
      setMetrics(prev => ({
        cpu: [...prev.cpu.slice(-29), newCpu],
        memory: [...prev.memory.slice(-29), newMemory]
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const drawChart = () => {
    const canvas = chartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw CPU chart
    drawLineChart(ctx, metrics.cpu, '#3b82f6', 0, canvas.height / 2);
    
    // Draw Memory chart
    drawLineChart(ctx, metrics.memory, '#10b981', canvas.height / 2, canvas.height / 2);
  };

  const drawLineChart = (ctx, data, color, yOffset, height) => {
    if (data.length === 0) return;
    
    const width = ctx.canvas.width;
    const maxValue = 100;
    const sliceWidth = width / (data.length - 1);
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    data.forEach((value, index) => {
      const x = index * sliceWidth;
      const y = yOffset + height - (value / maxValue) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  };

  useEffect(() => {
    drawChart();
  }, [metrics]);

  return (
    <div className="service-charts">
      <h4>{serviceName} - Real-time Metrics</h4>
      <canvas 
        ref={chartRef} 
        width={400} 
        height={200}
        style={{ width: '100%', height: '200px', background: '#f8fafc', borderRadius: '8px' }}
      />
      <div className="chart-legends">
        <div className="legend">
          <span className="color-indicator cpu"></span>
          <span>CPU Usage</span>
        </div>
        <div className="legend">
          <span className="color-indicator memory"></span>
          <span>Memory Usage</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCharts;