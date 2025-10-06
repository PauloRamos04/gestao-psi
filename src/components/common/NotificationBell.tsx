import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, Button, List, Typography, Empty, Spin, message } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { Notificacao } from '../../types';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

const { Text } = Typography;

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      loadNotifications();
      // Atualizar a cada 30 segundos
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.userId]);

  const loadNotifications = async () => {
    if (!user?.userId) return;
    
    try {
      const [naoLidas, contador] = await Promise.all([
        apiService.getNotificacoesNaoLidas(user.userId),
        apiService.contarNotificacoesNaoLidas(user.userId)
      ]);
      setNotificacoes(naoLidas);
      setCount(contador);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiService.marcarNotificacaoComoLida(id);
      loadNotifications();
      message.success('Notificação marcada como lida');
    } catch (error) {
      message.error('Erro ao marcar notificação');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      await apiService.marcarTodasNotificacoesComoLidas(user.userId);
      loadNotifications();
      message.success('Todas notificações marcadas como lidas');
      setOpen(false);
    } catch (error) {
      message.error('Erro ao marcar notificações');
    } finally {
      setLoading(false);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo.toUpperCase()) {
      case 'SUCCESS': return '#52c41a';
      case 'INFO': return '#1890ff';
      case 'WARNING': return '#faad14';
      case 'ERROR': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  const menuContent = (
    <div style={{ width: 360, maxHeight: 480, overflow: 'auto', backgroundColor: 'white', borderRadius: 8, boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong>Notificações</Text>
        {count > 0 && (
          <Button 
            type="link" 
            size="small"
            onClick={handleMarkAllAsRead}
            loading={loading}
          >
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {loading && (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Spin />
        </div>
      )}

      {!loading && notificacoes.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Nenhuma notificação"
          style={{ padding: 24 }}
        />
      )}

      {!loading && notificacoes.length > 0 && (
        <List
          dataSource={notificacoes}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              style={{ 
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'background 0.3s',
                borderBottom: '1px solid #f0f0f0'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              onClick={() => handleMarkAsRead(item.id)}
            >
              <List.Item.Meta
                avatar={
                  <div 
                    style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: getTipoColor(item.tipo),
                      marginTop: 8
                    }} 
                  />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: 14 }}>{item.titulo}</Text>
                    <CheckOutlined style={{ fontSize: 12, color: '#999' }} />
                  </div>
                }
                description={
                  <>
                    <Text style={{ fontSize: 13, color: '#666' }}>{item.mensagem}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {format(new Date(item.dataCriacao), 'dd/MM/yyyy HH:mm')}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => menuContent}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
    >
      <Badge count={count} offset={[-5, 5]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 20 }} />}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
