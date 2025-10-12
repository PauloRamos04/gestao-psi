import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Space,
  Avatar,
  Upload,
  message,
  Divider,
  Row,
  Col,
  Switch,
  Select,
  Spin,
  Typography,
  Alert,
  Progress,
  Modal,
  InputNumber
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SettingOutlined,
  CameraOutlined,
  SaveOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  IdcardOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import type { Usuario } from '../types';
import { maskPhone, unmask } from '../utils/masks';
import { isValidEmail, isValidPhone, isStrongPassword } from '../utils/validators';
import './SettingsPage.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [preferencesForm] = Form.useForm();
  
  // Estados para funcionalidades avançadas
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: '#ff4d4f'
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para verificar força da senha
  const checkPasswordStrength = useCallback((password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

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

    let color = '#ff4d4f';
    if (score >= 4) {
      color = '#52c41a';
    } else if (score >= 3) {
      color = '#fa8c16';
    } else if (score >= 2) {
      color = '#faad14';
    }

    return {
      score: (score / 5) * 100,
      feedback,
      color
    };
  }, []);

  // Função para obter texto da força da senha
  const getPasswordStrengthText = useCallback((score: number): string => {
    if (score >= 80) return 'Muito Forte';
    if (score >= 60) return 'Forte';
    if (score >= 40) return 'Média';
    if (score >= 20) return 'Fraca';
    return 'Muito Fraca';
  }, []);

  // Função para aplicar máscara de telefone
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const maskedValue = maskPhone(e.target.value);
    profileForm.setFieldValue(fieldName, maskedValue);
  }, [profileForm]);

  // Função para validação customizada de email
  const validateEmail = useCallback((_: any, value: string) => {
    if (value && !isValidEmail(value)) {
      return Promise.reject(new Error('E-mail inválido'));
    }
    return Promise.resolve();
  }, []);

  // Função para validação customizada de telefone
  const validatePhone = useCallback((_: any, value: string) => {
    if (value && !isValidPhone(value)) {
      return Promise.reject(new Error('Telefone inválido'));
    }
    return Promise.resolve();
  }, []);

  const loadUserData = async () => {
    try {
      setLoadingData(true);
      if (user?.userId) {
        const data = await apiService.getUsuario(user.userId);
        setUserData(data);
        profileForm.setFieldsValue(data);
        preferencesForm.setFieldsValue({
          temaPreferido: data.temaPreferido || 'light',
          idioma: data.idioma || 'pt-BR',
          timezone: (data as any).timezone || 'America/Sao_Paulo',
          density: (data as any).density || 'default',
          receberNotificacoesEmail: data.receberNotificacoesEmail ?? true,
          receberNotificacoesSistema: data.receberNotificacoesSistema ?? true,
          lembretesSessao: (data as any).lembretesSessao ?? true,
          notificacoesPagamento: (data as any).notificacoesPagamento ?? true,
          notificacoesSeguranca: (data as any).notificacoesSeguranca ?? true,
          resumosSemanais: (data as any).resumosSemanais ?? true,
        });
      }
    } catch (error: any) {
      message.error('Erro ao carregar dados do usuário');
    } finally {
      setLoadingData(false);
    }
  };

  const handleProfileUpdate = async (values: any) => {
    try {
      setLoading(true);
      await apiService.atualizarMeuPerfil(values);
      message.success('Perfil atualizado com sucesso!');
      loadUserData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    try {
      setLoading(true);
      await apiService.trocarSenha({
        username: user?.username || '',
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      message.success('Senha alterada com sucesso!');
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || error.response?.data || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async (values: any) => {
    try {
      setLoading(true);
      await apiService.atualizarMinhasPreferencias(values);
      message.success('Preferências atualizadas com sucesso!');
      loadUserData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao atualizar preferências');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      const fotoUrl = info.file.response?.url;
      if (fotoUrl) {
        try {
          await apiService.atualizarMeuPerfil({ fotoUrl });
          message.success('Foto atualizada com sucesso!');
          setPreviewImage(null);
          loadUserData();
        } catch (error) {
          message.error('Erro ao atualizar foto');
        }
      }
      setUploading(false);
    } else if (info.file.status === 'error') {
      message.error('Erro no upload da foto');
      setUploading(false);
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const showConfirmPasswordModal = () => {
    setConfirmModalVisible(true);
  };

  const handleConfirmPasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      await handlePasswordChange(values);
      setConfirmModalVisible(false);
    } catch (error) {
      // Erro de validação
    }
  };

  if (loadingData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#8c8c8c' }}>Carregando configurações...</p>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <UserOutlined style={{ marginRight: 8 }} />
          Dados Pessoais
        </span>
      ),
      children: (
        <Card bordered={false}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Space direction="vertical" size="large" align="center">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={previewImage || userData?.fotoUrl}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                {uploading && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Spin size="small" />
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#1890ff',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid white',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <CameraOutlined style={{ color: 'white', fontSize: 16 }} />
                </div>
              </div>
              
              <Upload
                id="photo-upload"
                name="file"
                showUploadList={false}
                action={`${process.env.REACT_APP_API_URL || 'http://localhost:8081/api'}/uploads/foto`}
                headers={{
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }}
                onChange={handleUploadChange}
                onPreview={handlePreview}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Apenas imagens são permitidas!');
                    return false;
                  }
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error('A imagem deve ter menos de 5MB!');
                    return false;
                  }
                  return true;
                }}
                style={{ display: 'none' }}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Alterar Foto
                </Button>
              </Upload>
              
              {userData?.fotoUrl && (
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: 'Remover foto de perfil?',
                      content: 'Esta ação não pode ser desfeita.',
                      okText: 'Remover',
                      okType: 'danger',
                      cancelText: 'Cancelar',
                      onOk: async () => {
                        try {
                          await apiService.atualizarMeuPerfil({ fotoUrl: null });
                          message.success('Foto removida com sucesso!');
                          loadUserData();
                        } catch (error) {
                          message.error('Erro ao remover foto');
                        }
                      }
                    });
                  }}
                >
                  Remover Foto
                </Button>
              )}
            </Space>
            <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
              {userData?.titulo || user?.tituloSite || 'Usuário'}
            </Title>
            <Text type="secondary">{userData?.cargo || 'Cargo não definido'}</Text>
          </div>

          <Divider />

          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileUpdate}
            initialValues={userData || {}}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="titulo"
                  label="Nome de Exibição"
                  rules={[{ required: true, message: 'Nome é obrigatório' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Como deseja ser chamado" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="nomeCompleto" label="Nome Completo">
                  <Input prefix={<IdcardOutlined />} placeholder="Nome completo" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    { required: false },
                    { validator: validateEmail }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="email@exemplo.com"
                    type="email"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="celular" 
                  label="Celular"
                  rules={[
                    { required: false },
                    { validator: validatePhone }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="(00) 00000-0000"
                    onChange={(e) => handlePhoneChange(e, 'celular')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="telefone" 
                  label="Telefone"
                  rules={[
                    { required: false },
                    { validator: validatePhone }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="(00) 0000-0000"
                    onChange={(e) => handlePhoneChange(e, 'telefone')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="cargo" label="Cargo">
                  <Input prefix={<BankOutlined />} placeholder="Ex: Psicólogo, Recepcionista" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="departamento" label="Departamento">
              <Input prefix={<BankOutlined />} placeholder="Ex: Clínica, Administrativo" />
            </Form.Item>

            <Form.Item name="observacoes" label="Sobre mim">
              <TextArea rows={4} placeholder="Conte um pouco sobre você..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block>
                Salvar Alterações
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'security',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <LockOutlined style={{ marginRight: 8 }} />
          Segurança
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Alert
            message="Alterar Senha"
            description="Por segurança, sua senha deve ter no mínimo 6 caracteres e incluir letras e números."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
          >
            <Form.Item
              name="currentPassword"
              label="Senha Atual"
              rules={[{ required: true, message: 'Digite sua senha atual' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Digite sua senha atual"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                visibilityToggle={{
                  visible: showCurrentPassword,
                  onVisibleChange: setShowCurrentPassword
                }}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Nova Senha"
              rules={[
                { required: true, message: 'Digite a nova senha' },
                { min: 8, message: 'A senha deve ter no mínimo 8 caracteres' },
                {
                  validator: (_, value) => {
                    if (value && !isStrongPassword(value)) {
                      return Promise.reject(new Error('A senha deve conter pelo menos: 8 caracteres, 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Digite a nova senha"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                visibilityToggle={{
                  visible: showNewPassword,
                  onVisibleChange: setShowNewPassword
                }}
                onChange={handlePasswordInputChange}
              />
            </Form.Item>

            {/* Indicador de Força da Senha */}
            {passwordForm.getFieldValue('newPassword') && (
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
              name="confirmPassword"
              label="Confirmar Nova Senha"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Confirme a nova senha' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('As senhas não coincidem'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirme a nova senha"
                size="large"
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
                icon={<LockOutlined />} 
                loading={loading} 
                block 
                size="large"
                onClick={(e) => {
                  e.preventDefault();
                  showConfirmPasswordModal();
                }}
              >
                Alterar Senha
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          {/* Dicas de Segurança */}
          <Card title="Dicas de Segurança" size="small" style={{ marginBottom: 24 }}>
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

          <div>
            <Title level={5}>Informações da Conta</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Usuário: </Text>
                <Text strong>{userData?.username}</Text>
              </div>
              <div>
                <Text type="secondary">Clínica: </Text>
                <Text strong>{user?.clinicaNome}</Text>
              </div>
              <div>
                <Text type="secondary">Psicólogo: </Text>
                <Text strong>{user?.psicologoNome}</Text>
              </div>
              <div>
                <Text type="secondary">Tipo de Usuário: </Text>
                <Text strong>{userData?.tipoNome || user?.tipoUser}</Text>
              </div>
              <div>
                <Text type="secondary">Último Acesso: </Text>
                <Text>{userData?.ultimoAccesso ? new Date(userData.ultimoAccesso).toLocaleString('pt-BR') : 'Não disponível'}</Text>
              </div>
            </Space>
          </div>
        </Card>
      ),
    },
    {
      key: 'preferences',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          Preferências
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Form
            form={preferencesForm}
            layout="vertical"
            onFinish={handlePreferencesUpdate}
          >
            <Title level={5}>Aparência</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="temaPreferido" label="Tema">
                  <Select size="large">
                    <Option value="light">Claro</Option>
                    <Option value="dark">Escuro</Option>
                    <Option value="auto">Automático</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="idioma" label="Idioma">
                  <Select size="large">
                    <Option value="pt-BR">Português (Brasil)</Option>
                    <Option value="en-US">English (US)</Option>
                    <Option value="es-ES">Español (ES)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="timezone" label="Fuso Horário">
                  <Select placeholder="Selecione o fuso horário" size="large">
                    <Option value="America/Sao_Paulo">São Paulo (GMT-3)</Option>
                    <Option value="America/New_York">Nova York (GMT-5)</Option>
                    <Option value="Europe/London">Londres (GMT+0)</Option>
                    <Option value="Europe/Paris">Paris (GMT+1)</Option>
                    <Option value="Asia/Tokyo">Tóquio (GMT+9)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="density" label="Densidade da Interface">
                  <Select placeholder="Selecione a densidade" size="large">
                    <Option value="compact">Compacta</Option>
                    <Option value="default">Padrão</Option>
                    <Option value="comfortable">Confortável</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Title level={5}>Notificações</Title>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações por E-mail</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Receba notificações importantes no seu e-mail
                  </Text>
                </div>
                <Form.Item name="receberNotificacoesEmail" valuePropName="checked" noStyle>
                  <Switch className="notification-switch" />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações no Sistema</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Receba notificações enquanto estiver usando o sistema
                  </Text>
                </div>
                <Form.Item name="receberNotificacoesSistema" valuePropName="checked" noStyle>
                  <Switch className="notification-switch" />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Lembretes de Sessão</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Receba lembretes sobre sessões agendadas
                  </Text>
                </div>
                <Form.Item name="lembretesSessao" valuePropName="checked" noStyle>
                  <Switch className="notification-switch" />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações de Pagamento</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Receba notificações sobre pagamentos pendentes
                  </Text>
                </div>
                <Form.Item name="notificacoesPagamento" valuePropName="checked" noStyle>
                  <Switch className="notification-switch" />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações de Segurança</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Receba alertas sobre atividades suspeitas na sua conta
                  </Text>
                </div>
                <Form.Item name="notificacoesSeguranca" valuePropName="checked" noStyle>
                  <Switch className="notification-switch" />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Resumos Semanais</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Receba um resumo semanal das suas atividades
                  </Text>
                </div>
                <Form.Item name="resumosSemanais" valuePropName="checked" noStyle>
                  <Switch className="notification-switch" />
                </Form.Item>
              </div>
            </Space>

            <Divider />

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={loading} 
                block 
                size="large"
                className="save-preferences-btn"
              >
                Salvar Preferências
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Configurações</Title>
        <Paragraph type="secondary">
          Gerencie suas informações pessoais, segurança e preferências do sistema
        </Paragraph>
      </div>

      <Tabs
        className="settings-tabs"
        defaultActiveKey="profile"
        items={tabItems}
        tabPosition="top"
        size="large"
      />

      {/* Modal de Confirmação para Alteração de Senha */}
      <Modal
        title="Confirmar Alteração de Senha"
        open={confirmModalVisible}
        onOk={handleConfirmPasswordChange}
        onCancel={() => setConfirmModalVisible(false)}
        okText="Confirmar Alteração"
        cancelText="Cancelar"
        okType="danger"
      >
        <Alert
          message="Atenção"
          description={
            <div>
              <Text>Você está prestes a alterar sua senha. Esta ação:</Text>
              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                <li>Invalidará todas as sessões ativas</li>
                <li>Requererá que você faça login novamente</li>
                <li>Não pode ser desfeita</li>
              </ul>
              <Text strong style={{ display: 'block', marginTop: 8 }}>
                Tem certeza que deseja continuar?
              </Text>
            </div>
          }
          type="warning"
          showIcon
        />
      </Modal>

      {/* Modal de Preview da Imagem */}
      <Modal
        open={!!previewImage}
        title="Preview da Foto"
        footer={null}
        onCancel={() => setPreviewImage(null)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage || ''} />
      </Modal>
    </div>
  );
};

export default SettingsPage;

