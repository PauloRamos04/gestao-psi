import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface SimplePieChartProps {
  data: DataPoint[];
  title?: string;
  valueFormatter?: (value: number) => string;
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({ 
  data, 
  title,
  valueFormatter = (v) => v.toString()
}) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Sem dados</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];

  return (
    <div style={{ padding: '20px' }}>
      {title && <h4 style={{ marginBottom: '20px', textAlign: 'center' }}>{title}</h4>}
      
      {/* Legend com barras */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.map((item, index) => {
          const percentage = total > 0 ? ((item.value / total) * 100) : 0;
          const color = colors[index % colors.length];
          
          return (
            <div key={index}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: color,
                      borderRadius: '2px'
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#666' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>
                  {valueFormatter(item.value)} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div style={{ 
                height: '8px', 
                width: '100%', 
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: color,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Total</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
          {valueFormatter(total)}
        </div>
      </div>
    </div>
  );
};

export default SimplePieChart;

