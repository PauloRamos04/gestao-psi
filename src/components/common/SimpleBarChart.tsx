import React from 'react';
import { Card } from 'antd';

interface DataPoint {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: DataPoint[];
  title?: string;
  valueFormatter?: (value: number) => string;
  color?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  title, 
  valueFormatter = (v) => v.toString(),
  color = '#1890ff'
}) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Sem dados</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div style={{ padding: '20px' }}>
      {title && <h4 style={{ marginBottom: '20px' }}>{title}</h4>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ minWidth: '120px', fontSize: '13px', color: '#666' }}>
                {item.label}
              </div>
              <div style={{ flex: 1, position: 'relative', height: '32px' }}>
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '8px',
                    minWidth: '60px'
                  }}
                >
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 500 }}>
                    {valueFormatter(item.value)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleBarChart;

