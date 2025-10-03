/**
 * Componente de Loading Spinner
 * Exibe um spinner de carregamento centralizado
 */

import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  tip,
  fullScreen = false 
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : size === 'default' ? 32 : 24 }} spin />;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: fullScreen ? '100vh' : '400px',
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <Spin indicator={antIcon} size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;

