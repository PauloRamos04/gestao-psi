import React, { useState } from 'react';
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
  message,
  Progress
} from 'antd';
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';

const { Title, Text, Paragraph } = Typography;

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

const PasswordChange: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: '#ff4d4f'
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { user } = useAuth();

  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    // Critérios de força da senha
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Mínimo de 8 caracteres');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Pelo menos uma letra minúscula');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Pelo menos uma letra maiúscula');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Pelo menos um número');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Pelo menos um caractere especial');
    }

    let color = '#ff4d4f'; // Vermelho
    if (score >= 4) {
      color = '#52c41a'; // Verde
    } else if (score >= 3) {
      color = '#fa8c16'; // Laranja
    } else if (score >= 2) {
      color = '#faad14'; // Amarelo
    }

    return {
      score: (score / 5) * 100,
      feedback,
      color
    };
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    if (password) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        score: 0,
        feedback: [],
        color: '#ff4d4f'
      });
    }
  };

  const onFinish = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    
    try {
      await apiService.trocarSenha({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      
      message.success('Senha alterada com sucesso!');
      form.resetFields();
      setPasswordStrength({
        score: 0,
        feedback: [],
        color: '#ff4d4f'
      });
    } catch (error) {
      message.error('Erro ao alterar senha. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthText = (score: number): string => {
    if (score >= 80) return 'Muito Forte';
    if (score >= 60) return 'Forte';
    if (score >= 40) return 'Média';
    if (score >= 20) return 'Fraca';
    return 'Muito Fraca';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <LockOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Alterar Senha
            </Title>
            <Text type="secondary">
              Mantenha sua conta segura com uma senha forte
            </Text>
          </div>

          <Divider />

          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={20} md={16} lg={12}>
              <Card title="Informações da Conta" size="small" style={{ marginBottom: '24px' }}>
                <Space direction="vertical" size="small">
                  <div>
                    <Text strong>Usuário:</Text> {user?.tituloSite || 'Usuário'}
                  </div>
                  <div>
                    <Text strong>Clínica:</Text> {user?.clinicaNome || 'Clínica'}
                  </div>
                  <div>
                    <Text strong>Psicólogo:</Text> {user?.psicologoNome || 'Psicólogo'}
                  </div>
                </Space>
              </Card>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                size="large"
              >
                <Form.Item
                  label="Senha Atual"
                  name="currentPassword"
                  rules={[
                    { required: true, message: 'Por favor, insira sua senha atual!' }
                  ]}
                >
                  <Input.Password
                    placeholder="Digite sua senha atual"
                    prefix={<LockOutlined />}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    visibilityToggle={{
                      visible: showCurrentPassword,
                      onVisibleChange: setShowCurrentPassword
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Nova Senha"
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Por favor, insira a nova senha!' },
                    { min: 8, message: 'A senha deve ter pelo menos 8 caracteres!' }
                  ]}
                >
                  <Input.Password
                    placeholder="Digite sua nova senha"
                    prefix={<LockOutlined />}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    visibilityToggle={{
                      visible: showNewPassword,
                      onVisibleChange: setShowNewPassword
                    }}
                    onChange={onPasswordChange}
                  />
                </Form.Item>

                {/* Indicador de Força da Senha */}
                {form.getFieldValue('newPassword') && (
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>Força da Senha:</Text>
                    <Progress
                      percent={passwordStrength.score}
                      strokeColor={passwordStrength.color}
                      format={() => getPasswordStrengthText(passwordStrength.score)}
                      style={{ marginTop: '8px' }}
                    />
                    {passwordStrength.feedback.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Para uma senha mais forte:
                        </Text>
                        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                          {passwordStrength.feedback.map((item, index) => (
                            <li key={index} style={{ fontSize: '12px', color: '#666' }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <Form.Item
                  label="Confirmar Nova Senha"
                  name="confirmPassword"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Por favor, confirme a nova senha!' },
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
                    placeholder="Confirme sua nova senha"
                    prefix={<LockOutlined />}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    visibilityToggle={{
                      visible: showConfirmPassword,
                      onVisibleChange: setShowConfirmPassword
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SecurityScanOutlined />}
                    size="large"
                    style={{ width: '100%' }}
                  >
                    Alterar Senha
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>

          {/* Dicas de Segurança */}
          <Card title="Dicas de Segurança" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={5}>Senha Segura</Title>
                <Space direction="vertical" size="small">
                  <div>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    <Text>Use pelo menos 8 caracteres</Text>
                  </div>
                  <div>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    <Text>Combine letras maiúsculas e minúsculas</Text>
                  </div>
                  <div>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    <Text>Inclua números e símbolos especiais</Text>
                  </div>
                  <div>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    <Text>Evite informações pessoais óbvias</Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Title level={5}>Boas Práticas</Title>
                <Space direction="vertical" size="small">
                  <div>
                    <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                    <Text>Não compartilhe sua senha</Text>
                  </div>
                  <div>
                    <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                    <Text>Não use a mesma senha em outros sites</Text>
                  </div>
                  <div>
                    <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                    <Text>Altere sua senha regularmente</Text>
                  </div>
                  <div>
                    <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                    <Text>Não salve senhas em computadores públicos</Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Alert de Segurança */}
          <Alert
            message="Importante"
            description={
              <div>
                <Text>
                  Após alterar sua senha, você será desconectado do sistema e precisará 
                  fazer login novamente com a nova senha. Certifique-se de lembrar da 
                  nova senha antes de confirmar a alteração.
                </Text>
              </div>
            }
            type="warning"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default PasswordChange;

