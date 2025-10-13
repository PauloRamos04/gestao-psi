import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, Alert, Row, Col } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string }) => {
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/password-reset/request`, values);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao solicitar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

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
                  <MailOutlined style={{ fontSize: '40px', color: 'white' }} />
                </div>
                <Title level={2} style={{ margin: 0 }}>
                  Recuperar Senha
                </Title>
                <Text type="secondary">
                  Digite seu email para receber as instruções de recuperação de senha
                </Text>
              </div>

              {success ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="Email Enviado!"
                    description="Se o email informado estiver cadastrado, você receberá um link de recuperação de senha. Verifique sua caixa de entrada e spam."
                    type="success"
                    showIcon
                  />
                  <Button
                    block
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/login')}
                  >
                    Voltar para o Login
                  </Button>
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
                    name="forgot_password"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                  >
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Por favor, insira seu email!' },
                        { type: 'email', message: 'Email inválido!' }
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="seu@email.com"
                        autoComplete="email"
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
                        Enviar Link de Recuperação
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

export default ForgotPassword;

