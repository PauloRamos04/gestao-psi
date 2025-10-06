import React, { useState, useEffect } from 'react';
import { Tag, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import apiService from '../../services/api';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Verificar a cada 10s
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      setStatus('checking');
      // Tentar fazer uma requisição simples
      await apiService.getMensagensAtivas();
      setStatus('online');
    } catch (error) {
      setStatus('offline');
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'success',
          icon: <CheckCircleOutlined />,
          text: 'Backend Online',
          description: 'Servidor respondendo normalmente'
        };
      case 'offline':
        return {
          color: 'error',
          icon: <CloseCircleOutlined />,
          text: 'Backend Offline',
          description: 'Verifique se o servidor está rodando na porta 8081'
        };
      case 'checking':
        return {
          color: 'processing',
          icon: <SyncOutlined spin />,
          text: 'Verificando...',
          description: 'Checando conexão com o servidor'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Tooltip title={config.description}>
      <Tag icon={config.icon} color={config.color} style={{ cursor: 'pointer' }} onClick={checkStatus}>
        {config.text}
      </Tag>
    </Tooltip>
  );
};

export default BackendStatus;
