import React, { useEffect, useRef, useState } from 'react';
import styles from './Login.module.css';
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
  const [scale, setScale] = useState(1);
  const frameRef = useRef<HTMLDivElement | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Calcula escala para manter modal sempre encaixado
  useEffect(() => {
    const compute = () => {
      if (!frameRef.current) return;
      
      const vvp = window.visualViewport;
      const availableW = vvp?.width || window.innerWidth;
      const availableH = vvp?.height || window.innerHeight;
      
      // Escala baseada no menor limitante (largura ou altura)
      const scaleW = availableW / 600;
      const scaleH = availableH / 760;
      const finalScale = Math.min(scaleW, scaleH);
      
      setScale(finalScale);
    };
    
    compute();
    window.addEventListener('resize', compute);
    window.visualViewport && window.visualViewport.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('resize', compute);
      window.visualViewport && window.visualViewport.removeEventListener('resize', compute);
    };
  }, []);

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
    <div className={styles.container}>
      {/* Elementos decorativos de fundo */}
      <div className={styles.bgGrid} />
      
      {/* Elementos decorativos adicionais */}
      <div className={styles.bgBlob1} />
      
      <div className={styles.bgBlob2} />
      
      {/* Área esquerda com frase criativa */}
      <div className={styles.leftPanel}>
        <div className={styles.leftInner}>
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

      <div ref={frameRef} className={styles.frame} style={{ transform: `scale(${scale})` }}>
        <Card
          className={`login-card ${styles.card}`}
          bodyStyle={{ 
            padding: '20px 25px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            margin: 0,
            overflowY: 'auto',
            height: '100%',
            flex: 1,
            paddingTop: '40px',
            paddingBottom: '40px'
          }}
        >
          <div className={styles.contentRoot}>
              {/* Logo e Título (sem escala própria; Card já compensa o zoom) */}
              <div className={styles.contentWrapper}>
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
                style={{ width: '100%', maxWidth: '600px', margin: 0 }}
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
            </div>
          </Card>
      </div>

    </div>
  );
};

export default Login;
