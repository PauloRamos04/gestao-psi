import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  Divider,
  Image
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest } from '../types';
import newLogo from '../assets/newlogo-gestaopsi.png';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);
      setError('');
      await login(values);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="login-container"
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      {/* Elementos decorativos de fundo */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0
      }} />
      
      {/* Elementos decorativos adicionais */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
        animation: 'float 15s ease-in-out infinite reverse',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
        animation: 'float 25s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <Row justify="end" style={{ width: '100%', maxWidth: '550px', zIndex: 1, height: '100vh' }}>
        <Col span={24} style={{ height: '100%' }}>
          <Card
            className="login-card"
            style={{
              borderRadius: '0',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              height: '100vh',
              width: '100%',
              margin: 0
            }}
            bodyStyle={{ 
              padding: '50px 40px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: 0
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }} align="center">
              {/* Logo e Título */}
              <Space direction="vertical" size="middle" align="center">
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)',
                  }}>
                    <Image
                      src={newLogo}
                      alt="Logo Gestão PSI"
                      preview={false}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                      fallback="/logo-gestaopsi.jpg"
                    />
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <Title level={1} style={{ 
                    margin: 0, 
                    color: '#667eea',
                    fontWeight: '700',
                  }}>
                    Gestão PSI
                  </Title>
                  <Text style={{ 
                    fontSize: '14px',
                    color: '#64748b',
                    fontWeight: '400'
                  }}>
                    Sistema de Gestão para Clínicas de Psicologia
                  </Text>
                </div>
              </Space>

              <Divider style={{ 
                margin: '30px 0',
                borderColor: '#e2e8f0',
                borderWidth: '1px'
              }} />

              {/* Formulário */}
              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                style={{ width: '100%' }}
              >
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ 
                      marginBottom: '24px',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(255, 77, 79, 0.15)'
                    }}
                  />
                )}

                <Form.Item
                  name="username"
                  label={<Text strong style={{ color: '#374151' }}>Username</Text>}
                  rules={[{ required: true, message: 'Por favor, insira seu username!' }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="Digite seu username"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<Text strong style={{ color: '#374151' }}>Senha</Text>}
                  rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="Digite sua senha"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: '40px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<LoginOutlined />}
                    style={{
                      width: '100%',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    {loading ? 'Entrando...' : 'Entrar no Sistema'}
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* CSS para animação */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @media (max-width: 768px) {
            .login-container {
              justify-content: center !important;
              padding: 20px !important;
            }
            
            .login-card {
              max-width: 100% !important;
              margin: 0 !important;
              border-radius: 20px !important;
              height: fit-content !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
