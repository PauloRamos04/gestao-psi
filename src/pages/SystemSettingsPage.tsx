import React, { useState, useEffect } from 'react';
import {
  Card, Tabs, Form, Input, Button, Space, message, Divider, Row, Col, Switch, Select, Spin, Typography, Alert, Modal, Table, Tag, Tooltip, Badge
} from 'antd';
import {
  SettingOutlined, UserOutlined, LockOutlined, MailOutlined, BellOutlined, DatabaseOutlined, SecurityScanOutlined, SendOutlined, TeamOutlined, KeyOutlined, CloudOutlined, MonitorOutlined, SaveOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import type { Usuario } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface SystemConfig {
  // Configurações de Sistema
  systemName: string;
  systemVersion: string;
  maintenanceMode: boolean;
  debugMode: boolean;
  
  // Configurações de Email
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpFromEmail: string;
  
  // Configurações de Backup
  autoBackup: boolean;
  backupFrequency: string;
  backupRetention: number;
  
  // Configurações de Segurança
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  
  // Configurações de Notificações
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Configurações de Logs
  logLevel: string;
  logRetention: number;
  auditLogs: boolean;
}

const SystemSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [systemForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  useEffect(() => {
    loadSystemConfig();
  }, []);

  const loadSystemConfig = async () => {
    try {
      setLoadingData(true);
      const config = await apiService.getSystemConfig();
      
      setSystemConfig(config);
      systemForm.setFieldsValue(config);
      emailForm.setFieldsValue(config);
      securityForm.setFieldsValue({
        sessionTimeout: config.sessionTimeout,
        maxLoginAttempts: config.maxLoginAttempts,
        ...config.passwordPolicy
      });
      notificationForm.setFieldsValue({
        emailNotifications: config.emailNotifications,
        smsNotifications: config.smsNotifications,
        pushNotifications: config.pushNotifications,
        logLevel: config.logLevel,
        logRetention: config.logRetention,
        auditLogs: config.auditLogs
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Erro ao carregar configurações do sistema';
      message.error(errorMessage);
      console.error('Erro ao carregar configurações do sistema:', error);
      
      // Se for erro 403 (sem permissão), redirecionar
      if (error.response?.status === 403) {
        message.warning('Você não tem permissão para acessar as configurações do sistema');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleSystemUpdate = async (values: any) => {
    try {
      setLoading(true);
      await apiService.updateSystemConfig({
        category: 'SYSTEM',
        configs: values
      });
      message.success('Configurações do sistema atualizadas com sucesso!');
      await loadSystemConfig();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Erro ao atualizar configurações do sistema';
      message.error(errorMessage);
      console.error('Erro ao atualizar configurações do sistema:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (values: any) => {
    try {
      setLoading(true);
      await apiService.updateEmailConfig({
        category: 'EMAIL',
        configs: values
      });
      message.success('Configurações de email atualizadas com sucesso!');
      await loadSystemConfig();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Erro ao atualizar configurações de email';
      message.error(errorMessage);
      console.error('Erro ao atualizar configurações de email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityUpdate = async (values: any) => {
    try {
      setLoading(true);
      await apiService.updateSecurityConfig({
        category: 'SECURITY',
        configs: values
      });
      message.success('Configurações de segurança atualizadas com sucesso!');
      await loadSystemConfig();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Erro ao atualizar configurações de segurança';
      message.error(errorMessage);
      console.error('Erro ao atualizar configurações de segurança:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (values: any) => {
    try {
      setLoading(true);
      await apiService.updateNotificationConfig({
        category: 'NOTIFICATIONS',
        configs: values
      });
      message.success('Configurações de notificações atualizadas com sucesso!');
      await loadSystemConfig();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Erro ao atualizar configurações de notificações';
      message.error(errorMessage);
      console.error('Erro ao atualizar configurações de notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      setLoading(true);
      const result = await apiService.testEmailConnection();
      message.success(result.message || 'Conexão de email testada com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Erro ao testar conexão de email';
      message.error(errorMessage);
      console.error('Erro ao testar conexão de email:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#8c8c8c' }}>Carregando configurações do sistema...</p>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'system',
      label: (
        <span>
          <MonitorOutlined style={{ marginRight: 8 }} />
          Sistema
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Form
            form={systemForm}
            layout="vertical"
            onFinish={handleSystemUpdate}
          >
            <Title level={5}>Configurações Gerais do Sistema</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="systemName"
                  label="Nome do Sistema"
                  rules={[{ required: true, message: 'Nome do sistema é obrigatório' }]}
                >
                  <Input prefix={<SettingOutlined />} placeholder="Nome do sistema" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="systemVersion" label="Versão do Sistema">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="maintenanceMode" label="Modo de Manutenção" valuePropName="checked">
                  <Switch />
                </Form.Item>
                {systemConfig?.maintenanceMode && (
                  <Alert 
                    message="⚠️ Sistema em Modo Manutenção" 
                    description="Apenas administradores podem acessar o sistema"
                    type="warning" 
                    showIcon 
                    style={{ marginTop: 8 }}
                  />
                )}
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="debugMode" label="Modo Debug" valuePropName="checked">
                  <Switch />
                </Form.Item>
                {systemConfig?.debugMode && (
                  <Alert 
                    message="🐛 Modo Debug Ativo" 
                    description="Logs detalhados estão sendo gerados"
                    type="info" 
                    showIcon 
                    style={{ marginTop: 8 }}
                  />
                )}
              </Col>
            </Row>

            <Divider />

            <Title level={5}>Configurações de Backup</Title>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name="autoBackup" label="Backup Automático" valuePropName="checked">
                  <Switch />
                </Form.Item>
                {systemConfig?.autoBackup && (
                  <Alert 
                    message="✅ Backup Automático Ativo" 
                    description={`Frequência: ${systemConfig.backupFrequency === 'daily' ? 'Diário às 3h' : systemConfig.backupFrequency}`}
                    type="success" 
                    showIcon 
                    style={{ marginTop: 8 }}
                  />
                )}
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="backupFrequency" label="Frequência do Backup">
                  <Select>
                    <Option value="hourly">A cada hora</Option>
                    <Option value="daily">Diário (3h da manhã)</Option>
                    <Option value="weekly">Semanal</Option>
                    <Option value="monthly">Mensal</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="backupRetention" label="Retenção (dias)">
                  <Input type="number" min={1} max={365} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block size="large">
                Salvar Configurações do Sistema
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'email',
      label: (
        <span>
          <MailOutlined style={{ marginRight: 8 }} />
          Email
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Form
            form={emailForm}
            layout="vertical"
            onFinish={handleEmailUpdate}
          >
            <Title level={5}>Configurações de Email</Title>
            <Alert
              message="🚧 Funcionalidade em Desenvolvimento"
              description="As configurações de email podem ser salvas, mas o envio real de emails está em desenvolvimento."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Alert
              message="Configurações SMTP"
              description="Configure os parâmetros do servidor de email para envio de notificações."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="smtpHost"
                  label="Servidor SMTP"
                  rules={[{ required: true, message: 'Servidor SMTP é obrigatório' }]}
                >
                  <Input placeholder="smtp.gmail.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="smtpPort"
                  label="Porta SMTP"
                  rules={[{ required: true, message: 'Porta SMTP é obrigatória' }]}
                >
                  <Input type="number" placeholder="587" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="smtpUsername"
                  label="Usuário SMTP"
                  rules={[{ required: true, message: 'Usuário SMTP é obrigatório' }]}
                >
                  <Input placeholder="seu@email.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="smtpPassword"
                  label="Senha SMTP"
                  rules={[{ required: true, message: 'Senha SMTP é obrigatória' }]}
                >
                  <Input.Password placeholder="Sua senha" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="smtpFromEmail"
              label="Email Remetente"
              rules={[{ required: true, message: 'Email remetente é obrigatório' }]}
            >
              <Input placeholder="noreply@seusite.com" />
            </Form.Item>

            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                Salvar Configurações
              </Button>
              <Button icon={<SendOutlined />} onClick={testEmailConnection} loading={loading}>
                Testar Conexão
              </Button>
            </Space>
          </Form>
        </Card>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <SecurityScanOutlined style={{ marginRight: 8 }} />
          Segurança
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Form
            form={securityForm}
            layout="vertical"
            onFinish={handleSecurityUpdate}
          >
            <Title level={5}>Configurações de Segurança</Title>
            
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="sessionTimeout"
                  label="Timeout da Sessão (minutos)"
                  rules={[{ required: true, message: 'Timeout é obrigatório' }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="maxLoginAttempts"
                  label="Máximo de Tentativas de Login"
                  rules={[{ required: true, message: 'Máximo de tentativas é obrigatório' }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Title level={5}>Política de Senhas</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="minLength"
                  label="Tamanho Mínimo da Senha"
                  rules={[{ required: true, message: 'Tamanho mínimo é obrigatório' }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="requireUppercase" label="Exigir Maiúsculas" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="requireNumbers" label="Exigir Números" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="requireSpecialChars" label="Exigir Caracteres Especiais" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block size="large">
                Salvar Configurações de Segurança
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined style={{ marginRight: 8 }} />
          Notificações
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Form
            form={notificationForm}
            layout="vertical"
            onFinish={handleNotificationUpdate}
          >
            <Title level={5}>Configurações de Notificações</Title>
            
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações por Email</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Habilitar envio de notificações por email
                  </Text>
                </div>
                <Form.Item name="emailNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações por SMS</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Habilitar envio de notificações por SMS
                  </Text>
                </div>
                <Form.Item name="smsNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações Push</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Habilitar notificações push no navegador
                  </Text>
                </div>
                <Form.Item name="pushNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
            </Space>

            <Divider />

            <Title level={5}>Configurações de Logs</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="logLevel" label="Nível de Log">
                  <Select>
                    <Option value="DEBUG">DEBUG</Option>
                    <Option value="INFO">INFO</Option>
                    <Option value="WARN">WARN</Option>
                    <Option value="ERROR">ERROR</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="logRetention" label="Retenção de Logs (dias)">
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="auditLogs" label="Logs de Auditoria" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block size="large">
                Salvar Configurações de Notificações
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'permissions',
      label: (
        <span>
          <TeamOutlined style={{ marginRight: 8 }} />
          Permissões
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Title level={5}>Gestão de Permissões</Title>
          <Alert
            message="Configurações de Permissões"
            description="Gerencie os níveis de acesso e permissões dos usuários no sistema."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <DatabaseOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={4}>Módulo em Desenvolvimento</Title>
            <Paragraph type="secondary">
              A gestão avançada de permissões será implementada em breve.
            </Paragraph>
          </div>
        </Card>
      ),
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Configurações do Sistema</Title>
        <Paragraph type="secondary">
          Gerencie as configurações gerais do sistema, segurança, email e permissões
        </Paragraph>
      </div>

      <Tabs
        defaultActiveKey="system"
        items={tabItems}
        tabPosition="top"
        size="large"
      />
    </div>
  );
};

export default SystemSettingsPage;
