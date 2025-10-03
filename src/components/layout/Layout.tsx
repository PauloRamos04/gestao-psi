import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layout as AntLayout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
  Popover,
  List
} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  MessageOutlined,
  BankOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  CalculatorOutlined,
  ClockCircleOutlined,
  BgColorsOutlined,
  LockOutlined,
  HistoryOutlined,
  DownloadOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import logoGestaoPsi from '../../assets/newlogo-gestaopsi.png';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [notificacoes, setNotificacoes] = useState<{ id: number; titulo: string; conteudo: string; }[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Detectar mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Fechar sidebar mobile quando redimensionar para desktop
      if (!mobile && mobileVisible) {
        setMobileVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileVisible]);

  // Carrega mensagens ativas para notificações
  useEffect(() => {
    const carregar = async () => {
      try {
        setNotifLoading(true);
        const msgs = await api.getMensagensAtivas();
        // pega só as últimas 10
        setNotificacoes(msgs.slice(0, 10));
      } finally {
        setNotifLoading(false);
      }
    };
    carregar();
  }, []);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/usuarios',
      icon: <TeamOutlined />,
      label: <Link to="/usuarios">Usuários</Link>,
    },
    {
      key: '/pacientes',
      icon: <UserOutlined />,
      label: <Link to="/pacientes">Pacientes</Link>,
    },
    {
      key: '/sessoes',
      icon: <CalendarOutlined />,
      label: <Link to="/sessoes">Sessões</Link>,
    },
    {
      key: '/pagamentos',
      icon: <CreditCardOutlined />,
      label: <Link to="/pagamentos">Pagamentos</Link>,
    },
    {
      key: '/faturamento',
      icon: <DollarOutlined />,
      label: <Link to="/faturamento">Faturamento</Link>,
    },
    {
      key: '/mensagens',
      icon: <MessageOutlined />,
      label: <Link to="/mensagens">Mensagens</Link>,
    },
    {
      key: '/clinicas',
      icon: <BankOutlined />,
      label: <Link to="/clinicas">Clínicas</Link>,
    },
    {
      key: '/salas',
      icon: <EnvironmentOutlined />,
      label: <Link to="/salas">Salas</Link>,
    },
    {
      key: '/relatorios',
      icon: <FileTextOutlined />,
      label: <Link to="/relatorios">Relatórios</Link>,
    },
    {
      key: '/historicos',
      icon: <HistoryOutlined />,
      label: <Link to="/historicos">Históricos</Link>,
    },
    {
      key: '/sublocacoes',
      icon: <EnvironmentOutlined />,
      label: <Link to="/sublocacoes">Sublocações</Link>,
    },
    {
      key: '/interacoes',
      icon: <BulbOutlined />,
      label: <Link to="/interacoes">Interações</Link>,
    },
    {
      key: '/downloads',
      icon: <DownloadOutlined />,
      label: <Link to="/downloads">Downloads</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Perfil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configurações',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'imc',
      icon: <CalculatorOutlined />,
      label: <Link to="/imc">Calculadora de IMC</Link>,
    },
    {
      key: 'tempo-vida',
      icon: <ClockCircleOutlined />,
      label: <Link to="/tempo-vida">Tempo de Vida</Link>,
    },
    {
      key: 'temporizador',
      icon: <ClockCircleOutlined />,
      label: <Link to="/temporizador">Temporizador</Link>,
    },
    {
      key: 'cores',
      icon: <BgColorsOutlined />,
      label: <Link to="/cores">Cores</Link>,
    },
    {
      key: 'trocar-senha',
      icon: <LockOutlined />,
      label: <Link to="/trocar-senha">Trocar Senha</Link>,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: logout,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
    }
  };

  const handleMenuClick = () => {
    // Fechar sidebar mobile quando clicar em um item do menu
    if (isMobile && mobileVisible) {
      setMobileVisible(false);
    }
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* Mobile Overlay */}
      {isMobile && mobileVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={() => setMobileVisible(false)}
        />
      )}
      
      {/* Desktop Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          transform: isMobile && !mobileVisible ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.2s',
          zIndex: 1000
        }}
        width={250}
        collapsedWidth={80}
      >
        {/* Container principal da sidebar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh'
        }}>
          {/* Logo */}
          <div style={{
            height: 64,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#1890ff',
            flexShrink: 0
          }}>
            <img
              src={logoGestaoPsi}
              alt="Logo Gestão PSI"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.indexOf('logo-gestaopsi.jpg') === -1) {
                  target.src = '/logo-gestaopsi.jpg';
                }
              }}
              style={{
                height: 32,
                width: 'auto',
                borderRadius: 4,
                objectFit: 'contain',
                backgroundColor: '#fff',
                padding: 2
              }}
            />
            {!collapsed && (
              <Text
                style={{
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginLeft: '12px',
                  whiteSpace: 'nowrap'
                }}
              >
                Gestão PSI
              </Text>
            )}
          </div>

          {/* Navigation Menu */}
          <div style={{ 
            flex: 1,
            overflow: 'auto',
            backgroundColor: '#fff'
          }}>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ 
                borderRight: 0,
                height: '100%'
              }}
            />
          </div>

          {/* User Info */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fafafa',
            flexShrink: 0
          }}>
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="topRight"
              arrow
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                transition: 'background-color 0.2s'
              }}>
                <Avatar
                  size={collapsed ? 24 : 32}
                  style={{ backgroundColor: '#1890ff' }}
                  icon={<UserOutlined />}
                />
                {!collapsed && (
                  <div style={{ marginLeft: '12px', flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#262626' }}>
                      {user?.titulo || 'Usuário'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {user?.clinica?.nome || 'Clínica'}
                    </div>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </div>
      </Sider>


      <AntLayout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 250), 
        transition: 'margin-left 0.2s'
      }} className="main-layout">
        {/* Header */}
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => {
                if (isMobile) {
                  setMobileVisible(!mobileVisible);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64
              }}
            />
          </div>

          <Space size="middle">
            <Popover
              trigger="click"
              placement="bottomRight"
              overlayInnerStyle={{ padding: 0 }}
              content={
                <div style={{ width: 320 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>
                    Notificações
                  </div>
                  <List
                    loading={notifLoading}
                    locale={{ emptyText: 'Sem notificações' }}
                    dataSource={notificacoes}
                    renderItem={(item) => (
                      <List.Item style={{ padding: '12px 16px' }}>
                        <List.Item.Meta
                          title={<span style={{ fontWeight: 600 }}>{item.titulo}</span>}
                          description={<span style={{ color: '#595959' }}>{item.conteudo}</span>}
                        />
                      </List.Item>
                    )}
                    style={{ maxHeight: 300, overflow: 'auto' }}
                  />
                  <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0', textAlign: 'right' }}>
                    <Link to="/mensagens">Ver todas</Link>
                  </div>
                </div>
              }
            >
              <Badge count={notificacoes.length} size="small">
                <Button type="text" icon={<BellOutlined />} style={{ fontSize: '16px' }} />
              </Badge>
            </Popover>
          </Space>
        </Header>

        {/* Main Content */}
        <Content style={{
          margin: '24px 24px',
          padding: '32px',
          background: '#fff',
          borderRadius: '12px',
          minHeight: 'calc(100vh - 112px)',
          overflow: 'auto'
        }}>
          {children}
        </Content>
      </AntLayout>

    </AntLayout>
  );
};

export default Layout;
