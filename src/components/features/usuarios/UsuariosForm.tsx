import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Select, Button, Space, message, Spin, Tabs, Switch, Row, Col 
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { Usuario, Clinica, Psicologo } from '../../../types';
import apiService from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

interface Role {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  sistema: boolean;
}

const { Option } = Select;
const { TextArea } = Input;

interface UsuariosFormProps {
  usuario?: Usuario | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const UsuariosForm: React.FC<UsuariosFormProps> = ({ usuario, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
    if (usuario) {
      form.setFieldsValue(usuario);
    }
  }, [usuario]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [clinicasData, psicologosData, rolesData] = await Promise.all([
        apiService.getClinicas(),
        apiService.getPsicologos(),
        loadRoles()
      ]);

      setClinicas(clinicasData);
      setPsicologos(psicologosData);
      setRoles(rolesData);
    } catch (error: any) {
      message.error('Erro ao carregar dados');
    } finally {
      setLoadingData(false);
    }
  };

  const loadRoles = async (): Promise<Role[]> => {
    try {
      // Carrega roles do backend
      const backendRoles = await apiService.getRoles();
      console.log('Roles carregadas do backend:', backendRoles);
      return backendRoles;
    } catch (error) {
      console.warn('Erro ao carregar roles do backend:', error);
      // Fallback: tenta carregar do localStorage
      try {
        const savedRoles = localStorage.getItem('app-roles');
        if (savedRoles) {
          const parsedRoles = JSON.parse(savedRoles);
          console.log('Roles carregadas do localStorage (fallback):', parsedRoles);
          return parsedRoles;
        }
      } catch (localError) {
        console.warn('Erro ao carregar roles do localStorage:', localError);
      }
      return [];
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        psicologId: values.psicologId || psicologos[0]?.id || 1,
      };

      if (usuario) {
        await apiService.atualizarUsuario(usuario.id, data);
        message.success('Usuário atualizado!');
      } else {
        await apiService.criarUsuario(data);
        message.success('Usuário criado!');
      }

      onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Carregando dados...</p>
      </div>
    );
  }

  if (clinicas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>⚠️ Nenhuma clínica cadastrada</p>
        <Button onClick={onCancel}>Fechar</Button>
      </div>
    );
  }

  const tabsItems = [
    {
      key: '1',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <LockOutlined style={{ marginRight: 8 }} />
          Dados de Acesso
        </span>
      ),
      children: (
        <>
          <Form.Item
            name="username"
            label="Username (Login)"
            rules={[
              { required: true, message: 'Username é obrigatório' },
              { min: 3, message: 'Mínimo 3 caracteres' },
              { pattern: /^[a-z0-9_.]+$/, message: 'Apenas letras minúsculas, números, ponto e underline' }
            ]}
          >
            <Input placeholder="Ex: joao.silva" disabled={!!usuario} />
          </Form.Item>

          {!usuario && (
            <>
              <Form.Item
                name="senha"
                label="Senha"
                rules={[{ required: true, min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }]}
              >
                <Input.Password placeholder="Mínimo 6 caracteres" />
              </Form.Item>

              <Form.Item
                name="confirmarSenha"
                label="Confirmar Senha"
                dependencies={['senha']}
                rules={[
                  { required: true, message: 'Confirme a senha' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('senha') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('As senhas não coincidem'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirme a senha" />
              </Form.Item>
            </>
          )}

          <Form.Item name="titulo" label="Nome Completo / Título" rules={[{ required: true }]}>
            <Input placeholder="Nome que aparecerá no sistema" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="clinicaId" label="Clínica" rules={[{ required: true }]}>
                <Select placeholder="Selecione" showSearch>
                  {clinicas.map(c => (
                    <Option key={c.id} value={c.id}>{c.nome}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="psicologId" label="Psicólogo">
                <Select placeholder="Selecione (opcional)" showSearch allowClear>
                  {psicologos.map(p => (
                    <Option key={p.id} value={p.id}>{p.nome}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="roleId" label="Role (Sistema de Permissões)" rules={[{ required: true, message: 'Selecione uma role' }]}>
                <Select placeholder="Selecione uma role">
                  {roles.filter(role => role.ativo).map(role => (
                    <Option key={role.id} value={role.id}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{role.nome}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{role.descricao}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '2',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <UserOutlined style={{ marginRight: 8 }} />
          Informações Pessoais
        </span>
      ),
      children: (
        <>
          <Form.Item name="nomeCompleto" label="Nome Completo">
            <Input placeholder="Nome completo do usuário" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="E-mail" rules={[{ type: 'email' }]}>
                <Input placeholder="email@exemplo.com" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="telefone" label="Telefone">
                <Input placeholder="(00) 0000-0000" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="celular" label="Celular">
                <Input placeholder="(00) 00000-0000" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="cargo" label="Cargo">
                <Input placeholder="Ex: Psicólogo, Recepcionista, Gerente" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="departamento" label="Departamento">
                <Input placeholder="Ex: Clínica, Administrativo" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="fotoUrl" label="URL da Foto">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="observacoes" label="Observações">
            <TextArea rows={3} placeholder="Observações sobre o usuário" />
          </Form.Item>
        </>
      ),
    },
    {
      key: '3',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          Preferências
        </span>
      ),
      children: (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="temaPreferido" label="Tema">
                <Select placeholder="Selecione">
                  <Option value="light">Claro</Option>
                  <Option value="dark">Escuro</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="idioma" label="Idioma">
                <Select placeholder="Selecione">
                  <Option value="pt-BR">Português (Brasil)</Option>
                  <Option value="en-US">English (US)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="receberNotificacoesEmail" label="Receber notificações por e-mail?" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="receberNotificacoesSistema" label="Receber notificações no sistema?" valuePropName="checked">
            <Switch />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        clinicaId: user?.clinicaId || clinicas[0]?.id,
        psicologId: psicologos[0]?.id,
        status: true,
        temaPreferido: 'light',
        idioma: 'pt-BR',
        receberNotificacoesEmail: true,
        receberNotificacoesSistema: true,
      }}
    >
      <Tabs 
        items={tabsItems} 
        tabPosition="left"
        style={{ minHeight: 400 }}
        tabBarStyle={{ width: 200 }}
      />

      <Form.Item style={{ marginTop: 24 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {usuario ? 'Atualizar' : 'Criar'} Usuário
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UsuariosForm;
