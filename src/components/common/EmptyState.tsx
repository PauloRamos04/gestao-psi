/**
 * Componente de Estado Vazio
 * Exibe uma mensagem quando não há dados
 */

import React from 'react';
import { Empty, Button, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface EmptyStateProps {
  title?: string;
  description?: string;
  image?: React.ReactNode;
  action?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description,
  image,
  action 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '300px',
      padding: '40px 20px'
    }}>
      <Space direction="vertical" align="center" size="large">
        <Empty
          image={image || Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{ height: 80 }}
          description={false}
        />
        <Space direction="vertical" align="center" size="small">
          {title && (
            <Title level={4} style={{ margin: 0, color: '#262626' }}>
              {title}
            </Title>
          )}
          {description && (
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {description}
            </Text>
          )}
        </Space>
        {action && (
          <Button 
            type="primary" 
            icon={action.icon || <PlusOutlined />}
            onClick={action.onClick}
            size="large"
          >
            {action.text}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default EmptyState;

