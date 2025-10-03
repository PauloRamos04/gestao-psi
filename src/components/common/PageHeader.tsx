/**
 * Componente de Cabeçalho de Página
 * Header reutilizável com título, descrição e ações
 */

import React from 'react';
import { Space, Typography, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: React.ReactNode;
  showBreadcrumbs?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  extra,
  showBreadcrumbs = true,
}) => {
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <HomeOutlined /> },
  ];

  const allBreadcrumbs = breadcrumbs 
    ? [...defaultBreadcrumbs, ...breadcrumbs]
    : defaultBreadcrumbs;

  return (
    <div style={{ marginBottom: '24px' }}>
      {showBreadcrumbs && (
        <Breadcrumb style={{ marginBottom: '16px' }}>
          {allBreadcrumbs.map((item, index) => (
            <Breadcrumb.Item key={index}>
              {item.path ? (
                <Link to={item.path}>
                  {item.icon && <span style={{ marginRight: '4px' }}>{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <>
                  {item.icon && <span style={{ marginRight: '4px' }}>{item.icon}</span>}
                  {item.label}
                </>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <Space direction="vertical" size="small">
          <Title level={2} style={{ margin: 0 }}>
            {title}
          </Title>
          {description && (
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {description}
            </Text>
          )}
        </Space>
        
        {extra && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {extra}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

