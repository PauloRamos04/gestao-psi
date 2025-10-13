import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Space, Alert, Row, Col, Spin } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/password-reset/validate`, {
          params: { token }
        });
        setTokenValid(response.data.valid);
        if (!response.data.valid) {
          setError('Token inválido ou expirado');
        }
      } catch (err) {
        setError('Erro ao validar token');
        setTokenValid(false);
      } finally {
        setValidating(false);
      }
    };

    if (!token) {
      setError('Token inválido');
      setValidating(false);
      return;
    }

    validateToken();
  }, [token]);

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/password-reset/reset`, {
        token,
        newPassword: values.newPassword
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" tip="Validando token..." />
      </div>
    );
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Row justify="center" style={{ width: '100%' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <LockOutlined style={{ fontSize: '40px', color: 'white' }} />
                </div>
                <Title level={2} style={{ margin: 0 }}>
                  Redefinir Senha
                </Title>
                <Text type="secondary">
                  {tokenValid ? 'Digite sua nova senha' : 'Token inválido'}
                </Text>
              </div>

              {!tokenValid ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="Token Inválido"
                    description={error || 'O token de recuperação é inválido ou expirou. Por favor, solicite um novo link de recuperação.'}
                    type="error"
                    showIcon
                  />
                  <Button
                    block
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/forgot-password')}
                  >
                    Solicitar Novo Link
                  </Button>
                </Space>
              ) : success ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="Sucesso!"
                    description="Senha redefinida com sucesso! Você será redirecionado para o login em instantes..."
                    type="success"
                    showIcon
                  />
                </Space>
              ) : (
                <>
                  {error && (
                    <Alert
                      message="Erro"
                      description={error}
                      type="error"
                      showIcon
                      closable
                      onClose={() => setError('')}
                    />
                  )}

                  <Form
                    form={form}
                    name="reset_password"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                  >
                    <Form.Item
                      name="newPassword"
                      label="Nova Senha"
                      rules={[
                        { required: true, message: 'Por favor, insira sua nova senha!' },
                        { min: 6, message: 'A senha deve ter no mínimo 6 caracteres!' }
                      ]}
                      hasFeedback
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Digite sua nova senha"
                        autoComplete="new-password"
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="Confirmar Senha"
                      dependencies={['newPassword']}
                      hasFeedback
                      rules={[
                        { required: true, message: 'Por favor, confirme sua senha!' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('As senhas não coincidem!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirme sua nova senha"
                        autoComplete="new-password"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        style={{ marginBottom: '12px' }}
                      >
                        Redefinir Senha
                      </Button>
                      <Button
                        block
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/login')}
                      >
                        Voltar para o Login
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;

