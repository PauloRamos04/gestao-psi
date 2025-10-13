import React, { useState } from 'react';
import {
  Card, Tabs, Form, Input, Button, Space, message, Divider, Row, Col, Switch, Select, Typography, Alert
} from 'antd';
import {
  MonitorOutlined, MailOutlined, SecurityScanOutlined, BellOutlined, TeamOutlined, SaveOutlined
} from '@ant-design/icons';
import { useAppConfig } from '../hooks/useAppConfig';
import { ConfigEffects } from '../utils/configEffects';
import PermissionsManagement from '../components/features/permissions/PermissionsManagement';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SystemSettingsPage: React.FC = () => {
  const { config, saveConfig, isMaintenanceMode, isDebugMode } = useAppConfig();
  const [loading, setLoading] = useState(false);
  const [systemForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  // Inicializar formulários com valores atuais
  React.useEffect(() => {
    systemForm.setFieldsValue({
      systemName: config.systemName,
      version: config.version,
      maintenanceMode: config.maintenanceMode,
      debugMode: config.debugMode,
      backupEnabled: config.backupEnabled,
      backupFrequency: config.backupFrequency,
      backupRetention: config.backupRetention
    });

    emailForm.setFieldsValue({
      emailEnabled: config.emailEnabled,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpUsername: config.smtpUsername,
      smtpPassword: config.smtpPassword,
      smtpFrom: config.smtpFrom,
      smtpAuth: config.smtpAuth,
      smtpTls: config.smtpTls
    });

    securityForm.setFieldsValue({
      maxLoginAttempts: config.maxLoginAttempts,
      minLength: config.passwordPolicy.minLength,
      requireUppercase: config.passwordPolicy.requireUppercase,
      requireNumbers: config.passwordPolicy.requireNumbers,
      requireSpecialChars: config.passwordPolicy.requireSpecialChars
    });

    notificationForm.setFieldsValue({
      emailNotifications: config.emailNotifications,
      smsNotifications: config.smsNotifications,
      pushNotifications: config.pushNotifications,
      logLevel: config.logLevel,
      logRetention: config.logRetention,
      auditLogs: config.auditLogs
    });
  }, [config, systemForm, emailForm, securityForm, notificationForm]);

  const handleSystemUpdate = async (values: any) => {
    try {
      setLoading(true);
      saveConfig('system', values);
      
      // Aplica efeitos imediatos
      ConfigEffects.applySystemName(values.systemName);
      ConfigEffects.applyMaintenanceMode(values.maintenanceMode);
      ConfigEffects.applyDebugMode(values.debugMode);
      ConfigEffects.scheduleBackup(values.backupFrequency, values.backupEnabled);
      
      message.success('Configurações do sistema salvas e aplicadas com sucesso!');
    } catch (error: any) {
      message.error('Erro ao salvar configurações do sistema');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (values: any) => {
    try {
      setLoading(true);
      saveConfig('email', values);
      
      message.success('Configurações de email salvas com sucesso!');
    } catch (error: any) {
      message.error('Erro ao salvar configurações de email');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityUpdate = async (values: any) => {
    try {
      setLoading(true);
      saveConfig('security', values);
      
      message.success('Configurações de segurança salvas com sucesso!');
    } catch (error: any) {
      message.error('Erro ao salvar configurações de segurança');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (values: any) => {
    try {
      setLoading(true);
      saveConfig('notifications', values);
      
      message.success('Configurações de notificações salvas com sucesso!');
    } catch (error: any) {
      message.error('Erro ao salvar configurações de notificações');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };


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
                  <Input placeholder="Nome do sistema" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="version" label="Versão do Sistema">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="maintenanceMode" 
                  label="Modo de Manutenção (Simulação)" 
                  valuePropName="checked"
                  tooltip="Adiciona banner vermelho e overlay escuro na página (apenas visual)"
                >
                  <Switch />
                </Form.Item>
                {isMaintenanceMode() && (
                  <Alert 
                    message="⚠️ Sistema em Modo Manutenção" 
                    description="Banner vermelho e overlay escuro aplicados na página"
                    type="warning" 
                    showIcon 
                    style={{ marginTop: 8 }}
                  />
                )}
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="debugMode" 
                  label="Modo Debug (Simulação)" 
                  valuePropName="checked"
                  tooltip="Adiciona console debug na parte inferior da página (apenas visual)"
                >
                  <Switch />
                </Form.Item>
                {isDebugMode() && (
                  <Alert 
                    message="🐛 Modo Debug Ativo" 
                    description="Console debug visível na parte inferior da página"
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
                <Form.Item 
                  name="backupEnabled" 
                  label="Backup Automático (Simulação)" 
                  valuePropName="checked"
                  tooltip="Simula download automático de backup baseado na frequência (apenas visual)"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="backupFrequency" label="Frequência do Backup (Simulação)">
                  <Select>
                    <Option value="daily">Diário (3h da manhã)</Option>
                    <Option value="weekly">Semanal</Option>
                    <Option value="monthly">Mensal</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="backupRetention" label="Retenção (dias) (Simulação)">
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
            <Title level={5}>Configurações de Email (Simulação)</Title>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="emailEnabled" label="Email Habilitado (Simulação)" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="smtpHost" label="Servidor SMTP (Simulação)">
                  <Input placeholder="smtp.gmail.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="smtpPort" label="Porta SMTP (Simulação)">
                  <Input type="number" placeholder="587" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="smtpUsername" label="Usuário SMTP (Simulação)">
                  <Input placeholder="seu@email.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="smtpFrom" label="Email Remetente (Simulação)">
                  <Input placeholder="noreply@gestaopsi.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="smtpPassword" label="Senha SMTP (Simulação)">
                  <Input.Password placeholder="Sua senha SMTP" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="smtpAuth" label="Autenticação SMTP (Simulação)" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="smtpTls" label="TLS Habilitado (Simulação)" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block size="large">
                Salvar Configurações de Email
              </Button>
            </Form.Item>
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
                  name="maxLoginAttempts"
                  label="Máximo de Tentativas de Login (Simulação)"
                  rules={[{ required: true, message: 'Máximo de tentativas é obrigatório' }]}
                >
                  <Input type="number" min={1} max={10} />
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
                  <Input type="number" min={6} max={20} />
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
            <Title level={5}>Configurações de Notificações (Simulação)</Title>
            
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações por Email (Simulação)</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Habilitar envio de notificações por email (apenas visual)
                  </Text>
                </div>
                <Form.Item name="emailNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações por SMS (Simulação)</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Habilitar envio de notificações por SMS (apenas visual)
                  </Text>
                </div>
                <Form.Item name="smsNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Notificações Push (Simulação)</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Habilitar notificações push no navegador (apenas visual)
                  </Text>
                </div>
                <Form.Item name="pushNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
            </Space>

            <Divider />

            <Title level={5}>Configurações de Logs (Simulação)</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="logLevel" label="Nível de Log (Simulação)">
                  <Select>
                    <Option value="DEBUG">DEBUG</Option>
                    <Option value="INFO">INFO</Option>
                    <Option value="WARN">WARN</Option>
                    <Option value="ERROR">ERROR</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="logRetention" label="Retenção de Logs (dias) (Simulação)">
                  <Input type="number" min={1} max={365} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="auditLogs" label="Logs de Auditoria (Simulação)" valuePropName="checked">
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
        <PermissionsManagement />
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