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
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        padding: 0,
        margin: 0,
        overflow: 'auto',
        position: 'relative',
        boxSizing: 'border-box'
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
      
      {/* Área esquerda com frase criativa */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 'calc(100% - 550px)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        padding: '40px'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          maxWidth: '600px'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            marginBottom: '20px',
            fontStyle: 'italic',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            color: '#ffffff',
            opacity: 1
          }}>
            "Veni, vidi, vici"
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            fontStyle: 'italic',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            color: '#ffffff',
            opacity: 1
          }}>
            "Vim, vi e venci"
          </div>
        </div>
      </div>

      <Row justify="end" style={{ width: '100%', maxWidth: '600px', zIndex: 1, minHeight: '100vh', flexShrink: 0 }}>
        <Col span={24} style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
          <Card
            className="login-card"
            style={{
              borderRadius: '0',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minHeight: '100vh',
              width: '100%',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'visible'
            }}
            bodyStyle={{ 
              padding: '20px 25px',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: 0,
              overflow: 'visible',
              flex: 1,
              paddingTop: '40px'
            }}
          >
            <div style={{ width: '100%', minHeight: '100%', overflow: 'visible', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Logo e Título */}
              <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)',
                    flexShrink: 0,
                    marginTop: '10px'
                  }}>
                    <Image
                      src={newLogo}
                      alt="Logo Gestão PSI"
                      preview={false}
                      style={{
                        width: '65px',
                        height: '65px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                      fallback="/logo-gestaopsi.jpg"
                    />
                  </div>
                </div>
                
                <Title level={1} style={{ 
                  margin: 0, 
                  color: '#667eea',
                  fontWeight: '700',
                  fontSize: '1.5rem',
                  lineHeight: '1.2',
                  marginBottom: '8px'
                }}>
                  Gestão PSI
                </Title>
                <Text style={{ 
                  fontSize: '10px',
                  color: '#64748b',
                  fontWeight: '400',
                  lineHeight: '1.4'
                }}>
                  Sistema de Gestão para Clínicas de Psicologia
                </Text>
              </div>

              <Divider style={{ 
                margin: '10px 0',
                borderColor: '#e2e8f0',
                borderWidth: '1px'
              }} />

              {/* Formulário */}
              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="middle"
                style={{ width: '100%', maxWidth: '100%' }}
              >
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ 
                      marginBottom: '15px',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(255, 77, 79, 0.15)',
                      fontSize: '12px'
                    }}
                  />
                )}

                <Form.Item
                  name="clinicaLogin"
                  label={<Text strong style={{ color: '#374151', fontSize: '12px' }}>Clínica</Text>}
                  rules={[{ required: true, message: 'Por favor, insira o login da clínica!' }]}
                  style={{ marginBottom: '12px', width: '100%' }}
                >
                  <Input
                    prefix={<SafetyOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="Login da clínica"
                    autoComplete="organization"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="username"
                  label={<Text strong style={{ color: '#374151', fontSize: '12px' }}>Username</Text>}
                  rules={[{ required: true, message: 'Por favor, insira seu username!' }]}
                  style={{ marginBottom: '12px', width: '100%' }}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="Digite seu username"
                    autoComplete="username"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<Text strong style={{ color: '#374151', fontSize: '12px' }}>Senha</Text>}
                  rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                  style={{ marginBottom: '12px', width: '100%' }}
                >
                  <Input
                    prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="Digite sua senha"
                    type="password"
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: '12px' }}>
                  <a 
                    href="/forgot-password" 
                    style={{ 
                      color: '#667eea',
                      fontSize: '12px',
                      textDecoration: 'none'
                    }}
                  >
                    Esqueci minha senha
                  </a>
                </Form.Item>

                <Form.Item style={{ marginTop: '15px', marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<LoginOutlined />}
                    style={{
                      width: '100%',
                      height: '40px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {loading ? 'Entrando...' : 'Entrar no Sistema'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>

      {/* CSS para animação e responsividade */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          /* Melhorias para zoom e responsividade */
          .login-container {
            min-height: 100vh !important;
            overflow: auto !important;
          }
          
          .login-card {
            min-height: 100vh !important;
            overflow: visible !important;
          }
          
          .login-card .ant-card-body {
            min-height: 100vh !important;
            overflow: visible !important;
            padding: 20px 25px !important;
          }
          
          /* Garantir que todos os elementos sejam visíveis */
          .login-card .ant-form-item {
            margin-bottom: 12px !important;
            display: block !important;
          }
          
          .login-card .ant-input-affix-wrapper {
            width: 100% !important;
          }
          
          .login-card .ant-input-affix-wrapper .ant-input {
            width: 100% !important;
            padding: 4px 11px !important;
          }
          
          /* Input.Password - remove todas as bordas duplicadas para parecer um único input */
          .login-card .ant-input-password-wrapper {
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .login-card .ant-input-password-wrapper .ant-input-affix-wrapper {
            width: 100% !important;
            height: 40px !important;
            padding: 0 !important;
            margin: 0 !important;
            border: 1px solid #d9d9d9 !important;
            border-radius: 6px !important;
          }
          
          .login-card .ant-input-password-wrapper .ant-input-affix-wrapper .ant-input {
            width: 100% !important;
            height: 40px !important;
            padding: 4px 35px 4px 11px !important;
            font-size: 12px !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            outline: none !important;
          }
          
          .login-card .ant-input-password-wrapper .ant-input-affix-wrapper .ant-input:focus {
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
          }
          
          .login-card .ant-input-password-wrapper .ant-input-affix-wrapper-focused {
            border-color: #667eea !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
          }
          
          .login-card .ant-input-password-wrapper .ant-input-affix-wrapper .ant-input-suffix {
            right: 8px !important;
            padding: 0 !important;
            width: auto !important;
            height: auto !important;
          }
          
          .login-card .ant-form-item {
            width: 100% !important;
          }
          
          .login-card .ant-form-item-control-input {
            width: 100% !important;
          }
          
          .login-card .ant-form-item-control-input-content {
            width: 100% !important;
          }
          
          .login-card .ant-input,
          .login-card .ant-input-password {
            height: 40px !important;
            font-size: 12px !important;
          }
          
          .login-card .ant-btn {
            height: 40px !important;
            font-size: 12px !important;
            display: block !important;
            width: 100% !important;
          }
          
          /* Responsividade para telas menores */
          @media (max-width: 1200px) {
            .login-container {
              justify-content: center !important;
              padding: 20px !important;
            }
            
            .login-card {
              max-width: 100% !important;
              margin: 0 !important;
              border-radius: 20px !important;
              min-height: fit-content !important;
            }
            
            .login-container > div:first-child {
              display: none !important;
            }
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
              min-height: fit-content !important;
            }
            
            .login-container > div:first-child {
              display: none !important;
            }
          }
          
          @media (max-width: 480px) {
            .login-card .ant-card-body {
              padding: 30px 20px !important;
            }
            
            .login-card .ant-form-item {
              margin-bottom: 16px !important;
            }
            
            .login-card .ant-btn {
              height: 44px !important;
              font-size: 14px !important;
            }
            
            .login-card .ant-input {
              font-size: 16px !important;
            }
          }
          
          /* Melhorias específicas para zoom */
          @media (min-resolution: 1.5dppx) {
            .login-container {
              overflow: auto !important;
            }
            
            .login-card {
              min-width: 300px !important;
              overflow: visible !important;
            }
            
            .login-card .ant-card-body {
              overflow: visible !important;
              min-height: 100vh !important;
            }
          }
          
          /* Força layout responsivo */
          .login-container * {
            box-sizing: border-box !important;
          }
          
          /* Garantir visibilidade em todos os níveis de zoom */
          @media (min-zoom: 0.5) and (max-zoom: 2) {
            .login-card .ant-form-item {
              display: block !important;
              visibility: visible !important;
            }
            
            .login-card .ant-input,
            .login-card .ant-input-password,
            .login-card .ant-btn {
              display: block !important;
              visibility: visible !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
