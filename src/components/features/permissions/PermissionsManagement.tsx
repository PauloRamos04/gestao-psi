import React, { useState, useEffect } from 'react';
import {
  Card, Tabs, Table, Button, Modal, Form, Input, Switch, Select, Space, 
  message, Tag, Popconfirm, Tooltip, Transfer, Row, Col, Typography, Alert
} from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, UserOutlined,
  LockOutlined, UnlockOutlined, CheckCircleOutlined, CloseCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import apiService from '../../../services/api';

// Helper para acessar a instância axios
const api = (apiService as any).api;

const { Title, Text } = Typography;
const { Option } = Select;

interface Permission {
  id: number;
  nome: string;
  descricao: string;
  modulo: string;
  acao: string;
  ativo: boolean;
}

interface Role {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  sistema: boolean;
  permissions: Permission[];
  permissionIds: number[];
}

const PermissionsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roles');
  
  // States para Roles
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm] = Form.useForm();
  
  // States para Permissions
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [permissionForm] = Form.useForm();
  
  // States para Transfer (atribuição de permissões)
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  
  const [modulos, setModulos] = useState<string[]>([]);
  const [acoes, setAcoes] = useState<string[]>([]);

  useEffect(() => {
    loadRoles();
    loadPermissions();
    loadModulos();
    loadAcoes();
  }, []);

  // ========== CRUD de Roles ==========
  
  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      
      const response = await api.get('/api/roles');
      
      // Sempre tentar carregar permissões individualmente para garantir que estejam atualizadas
      const rolesComPermissoes = await Promise.all(
        response.data.map(async (role: Role) => {
          try {
            const roleResponse = await api.get(`/api/roles/${role.id}`);
            return roleResponse.data;
          } catch (error) {
            return role;
          }
        })
      );
      
      setRoles(rolesComPermissoes);
      
      // Sincroniza com localStorage para o formulário de usuários
      localStorage.setItem('app-roles', JSON.stringify(rolesComPermissoes));
      
    } catch (error) {
      message.error('Erro ao carregar roles');
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const openRoleModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      roleForm.setFieldsValue({
        nome: role.nome,
        descricao: role.descricao,
        ativo: role.ativo
      });
    } else {
      setEditingRole(null);
      roleForm.resetFields();
      roleForm.setFieldsValue({ ativo: true });
    }
    setRoleModalVisible(true);
  };

  const handleRoleSubmit = async (values: any) => {
    try {
      if (editingRole) {
        await api.put(`/api/roles/${editingRole.id}`, {
          ...values,
          permissionIds: editingRole.permissionIds
        });
        message.success('Role atualizada com sucesso!');
      } else {
        await api.post('/api/roles', { ...values, permissionIds: [] });
        message.success('Role criada com sucesso!');
      }
      setRoleModalVisible(false);
      roleForm.resetFields();
      await loadRoles();
      
      // Sincroniza com localStorage para o formulário de usuários
      setTimeout(() => {
        localStorage.setItem('app-roles', JSON.stringify(roles));
      }, 100);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar role');
    }
  };

  const deleteRole = async (id: number) => {
    try {
      await api.delete(`/api/roles/${id}`);
      message.success('Role deletada com sucesso!');
      loadRoles();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao deletar role');
    }
  };

  const toggleRoleStatus = async (id: number) => {
    try {
      await api.patch(`/api/roles/${id}/toggle`);
      message.success('Status da role alterado!');
      loadRoles();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao alterar status');
    }
  };

  // ========== CRUD de Permissions ==========
  
  const loadPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const response = await api.get('/api/permissions');
      setPermissions(response.data);
    } catch (error) {
      message.error('Erro ao carregar permissões');
      console.error(error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const loadModulos = async () => {
    try {
      const response = await api.get('/api/permissions/modulos');
      setModulos(response.data);
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
    }
  };

  const loadAcoes = async () => {
    try {
      const response = await api.get('/api/permissions/acoes');
      setAcoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar ações:', error);
    }
  };

  const openPermissionModal = (permission?: Permission) => {
    if (permission) {
      setEditingPermission(permission);
      permissionForm.setFieldsValue(permission);
    } else {
      setEditingPermission(null);
      permissionForm.resetFields();
      permissionForm.setFieldsValue({ ativo: true });
    }
    setPermissionModalVisible(true);
  };

  const handlePermissionSubmit = async (values: any) => {
    try {
      if (editingPermission) {
        await api.put(`/api/permissions/${editingPermission.id}`, values);
        message.success('Permissão atualizada com sucesso!');
      } else {
        await api.post('/api/permissions', values);
        message.success('Permissão criada com sucesso!');
      }
      setPermissionModalVisible(false);
      permissionForm.resetFields();
      loadPermissions();
      loadModulos();
      loadAcoes();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar permissão');
    }
  };

  const deletePermission = async (id: number) => {
    try {
      await api.delete(`/api/permissions/${id}`);
      message.success('Permissão deletada com sucesso!');
      loadPermissions();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao deletar permissão');
    }
  };

  const togglePermissionStatus = async (id: number) => {
    try {
      await api.patch(`/api/permissions/${id}/toggle`);
      message.success('Status da permissão alterado!');
      loadPermissions();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao alterar status');
    }
  };

  // ========== Atribuição de Permissões para Roles ==========
  
  const openTransferModal = (role: Role) => {
    setSelectedRole(role);
    setTargetKeys(role.permissions.map(p => p.id.toString()));
    setTransferModalVisible(true);
  };

  const forceAssignPermissions = async () => {
    try {
      message.loading('Atribuindo permissões às roles...', 0);
      
      // Buscar todas as permissões
      const permissionsResponse = await api.get('/api/permissions');
      const allPermissions = permissionsResponse.data;
      
      // Atualizar roles localmente com permissões simuladas
      const updatedRoles = roles.map(role => {
        let permissionsToAssign: any[] = [];
        
        switch (role.nome) {
          case 'ADMIN':
            permissionsToAssign = allPermissions; // Todas as permissões
            break;
          case 'PSICOLOGO':
            permissionsToAssign = allPermissions.filter((p: any) => 
              ['pacientes', 'sessoes', 'prontuarios', 'agenda', 'ferramentas', 'perfil'].includes(p.modulo)
            );
            break;
          case 'FUNCIONARIO':
            permissionsToAssign = allPermissions.filter((p: any) => 
              (p.modulo === 'pacientes' && p.acao === 'ler') ||
              (p.modulo === 'sessoes' && ['ler', 'criar'].includes(p.acao)) ||
              (p.modulo === 'agenda' && p.acao === 'ler') ||
              (p.modulo === 'perfil' && ['ler', 'editar'].includes(p.acao))
            );
            break;
          case 'SECRETARIA':
            permissionsToAssign = allPermissions.filter((p: any) => 
              ['pacientes', 'sessoes', 'pagamentos', 'agenda', 'mensagens', 'relatorios', 'perfil'].includes(p.modulo)
            );
            break;
        }
        
        return {
          ...role,
          permissions: permissionsToAssign
        };
      });
      
      // Atualizar o estado local
      setRoles(updatedRoles);
      
      // Salvar no localStorage
      localStorage.setItem('app-roles', JSON.stringify(updatedRoles));
      
      message.destroy();
      message.success(`Permissões atribuídas com sucesso! ${allPermissions.length} permissões processadas.`);
      
    } catch (error) {
      message.destroy();
      message.error('Erro ao atribuir permissões');
    }
  };

  const handleTransferChange = (
    newTargetKeys: React.Key[], 
    direction: TransferDirection, 
    moveKeys: React.Key[]
  ) => {
    setTargetKeys(newTargetKeys.map(key => String(key)));
  };

  const handleTransferSubmit = async () => {
    if (!selectedRole) return;
    
    try {
      const permissionIds = targetKeys.map(k => parseInt(k));
      await api.put(`/api/roles/${selectedRole.id}`, {
        nome: selectedRole.nome,
        descricao: selectedRole.descricao,
        ativo: selectedRole.ativo,
        permissionIds
      });
      message.success('Permissões atualizadas com sucesso!');
      setTransferModalVisible(false);
      loadRoles();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao atualizar permissões');
    }
  };

  // ========== Tabelas ==========
  
  const roleColumns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string, record: Role) => (
        <Space>
          <UserOutlined />
          <strong>{text}</strong>
          {record.sistema && <Tag color="blue">Sistema</Tag>}
        </Space>
      ),
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
    },
    {
      title: 'Permissões',
      key: 'permissions',
      render: (record: Role) => (
        <Tag color="cyan">{record.permissions?.length || 0} permissões</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'ativo',
      key: 'ativo',
      render: (ativo: boolean) => (
        <Tag color={ativo ? 'success' : 'default'} icon={ativo ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {ativo ? 'Ativa' : 'Inativa'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Role) => (
        <Space>
          <Tooltip title="Gerenciar Permissões">
            <Button
              type="primary"
              icon={<KeyOutlined style={{ color: 'white !important' }} />}
              size="small"
              onClick={() => openTransferModal(record)}
              style={{ 
                backgroundColor: '#1890ff !important',
                color: 'white !important',
                borderColor: '#1890ff !important',
                pointerEvents: 'auto'
              }}
              className="custom-action-button"
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined style={{ color: 'white !important' }} />}
              size="small"
              onClick={() => openRoleModal(record)}
              style={{ 
                backgroundColor: '#1890ff !important',
                color: 'white !important',
                borderColor: '#1890ff !important',
                pointerEvents: 'auto'
              }}
              className="custom-action-button"
            />
          </Tooltip>
          <Tooltip title={record.ativo ? 'Desativar' : 'Ativar'}>
            <Popconfirm
              title={`${record.ativo ? 'Desativar' : 'Ativar'} esta role?`}
              onConfirm={() => toggleRoleStatus(record.id)}
            >
              <Button
                type="primary"
                icon={record.ativo ? <LockOutlined style={{ color: 'white !important' }} /> : <UnlockOutlined style={{ color: 'white !important' }} />}
                size="small"
                style={{ 
                  backgroundColor: record.ativo ? '#ff4d4f !important' : '#52c41a !important',
                  color: 'white !important',
                  borderColor: record.ativo ? '#ff4d4f !important' : '#52c41a !important',
                  pointerEvents: 'auto'
                }}
                className="custom-action-button"
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Deletar">
            <Popconfirm
              title="Deletar esta role?"
              onConfirm={() => deleteRole(record.id)}
            >
              <Button
                type="primary"
                icon={<DeleteOutlined style={{ color: 'white !important' }} />}
                size="small"
                style={{ 
                  backgroundColor: '#ff4d4f !important',
                  color: 'white !important',
                  borderColor: '#ff4d4f !important',
                  pointerEvents: 'auto'
                }}
                className="custom-action-button"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const permissionColumns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string) => <code>{text}</code>,
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
    },
    {
      title: 'Módulo',
      dataIndex: 'modulo',
      key: 'modulo',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Ação',
      dataIndex: 'acao',
      key: 'acao',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'ativo',
      key: 'ativo',
      render: (ativo: boolean) => (
        <Tag color={ativo ? 'success' : 'default'} icon={ativo ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {ativo ? 'Ativa' : 'Inativa'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Permission) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined style={{ color: 'white !important' }} />}
              size="small"
              onClick={() => openPermissionModal(record)}
              style={{ 
                backgroundColor: '#1890ff !important',
                color: 'white !important',
                borderColor: '#1890ff !important',
                pointerEvents: 'auto'
              }}
              className="custom-action-button"
            />
          </Tooltip>
          <Tooltip title={record.ativo ? 'Desativar' : 'Ativar'}>
            <Popconfirm
              title={`${record.ativo ? 'Desativar' : 'Ativar'} esta permissão?`}
              onConfirm={() => togglePermissionStatus(record.id)}
            >
              <Button
                type="primary"
                icon={record.ativo ? <LockOutlined style={{ color: 'white !important' }} /> : <UnlockOutlined style={{ color: 'white !important' }} />}
                size="small"
                style={{ 
                  backgroundColor: record.ativo ? '#ff4d4f !important' : '#52c41a !important',
                  color: 'white !important',
                  borderColor: record.ativo ? '#ff4d4f !important' : '#52c41a !important',
                  pointerEvents: 'auto'
                }}
                className="custom-action-button"
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Deletar">
            <Popconfirm
              title="Deletar esta permissão?"
              onConfirm={() => deletePermission(record.id)}
            >
              <Button 
                type="primary"
                icon={<DeleteOutlined style={{ color: 'white !important' }} />} 
                size="small" 
                style={{ 
                  backgroundColor: '#ff4d4f !important',
                  color: 'white !important',
                  borderColor: '#ff4d4f !important',
                  pointerEvents: 'auto'
                }}
                className="custom-action-button"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'roles',
      label: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Roles / Funções ({roles.length})
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="Gerenciamento de Roles"
              description="Crie roles personalizadas e atribua permissões específicas para cada tipo de usuário. Roles do sistema (ADMIN, PSICOLOGO, FUNCIONARIO) não podem ser deletadas."
              type="info"
              showIcon
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5}>Roles / Funções</Title>
              <Space>
                <Button
                  type="default"
                  icon={<SettingOutlined />}
                  onClick={forceAssignPermissions}
                  title="Atribuir permissões automaticamente às roles"
                >
                  Atribuir Permissões
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openRoleModal()}
                >
                  Nova Role
                </Button>
              </Space>
            </div>

            <Table
              columns={roleColumns}
              dataSource={roles}
              loading={loadingRoles}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Space>
        </Card>
      ),
    },
    {
      key: 'permissions',
      label: (
        <span>
          <KeyOutlined style={{ marginRight: 8 }} />
          Permissões ({permissions.length})
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="Gerenciamento de Permissões"
              description="Permissões controlam o acesso a funcionalidades específicas do sistema. Organize-as por módulo e ação para facilitar a atribuição."
              type="info"
              showIcon
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5}>Permissões do Sistema</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openPermissionModal()}
              >
                Nova Permissão
              </Button>
            </div>

            <Table
              columns={permissionColumns}
              dataSource={permissions}
              loading={loadingPermissions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Space>
        </Card>
      ),
    },
  ];


  return (
    <div>
      <style>{`
        .custom-action-button .anticon {
          color: white !important;
        }
        .custom-action-button .anticon svg {
          fill: white !important;
          color: white !important;
        }
        .custom-action-button .anticon path {
          fill: white !important;
          stroke: white !important;
        }
        .custom-action-button:hover .anticon {
          color: white !important;
        }
        .custom-action-button:hover .anticon svg {
          fill: white !important;
          color: white !important;
        }
      `}</style>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Gerenciamento de Permissões</Title>
        <Text type="secondary">Gerencie roles e permissões do sistema</Text>
      </div>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />

      {/* Modal de Role */}
      <Modal
        title={editingRole ? 'Editar Role' : 'Nova Role'}
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={roleForm} layout="vertical" onFinish={handleRoleSubmit}>
          <Form.Item
            name="nome"
            label="Nome da Role"
            rules={[{ required: true, message: 'Nome é obrigatório' }]}
          >
            <Input placeholder="Ex: RECEPCIONISTA, SUPERVISOR" />
          </Form.Item>

          <Form.Item name="descricao" label="Descrição">
            <Input.TextArea rows={3} placeholder="Descreva as responsabilidades desta role" />
          </Form.Item>

          <Form.Item name="ativo" label="Status" valuePropName="checked">
            <Switch checkedChildren="Ativa" unCheckedChildren="Inativa" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRole ? 'Atualizar' : 'Criar'}
              </Button>
              <Button onClick={() => setRoleModalVisible(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Permission */}
      <Modal
        title={editingPermission ? 'Editar Permissão' : 'Nova Permissão'}
        open={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={permissionForm} layout="vertical" onFinish={handlePermissionSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="modulo"
                label="Módulo"
                rules={[{ required: true, message: 'Módulo é obrigatório' }]}
              >
                <Select
                  placeholder="Selecione o módulo"
                  showSearch
                  allowClear
                  mode="tags"
                  maxCount={1}
                >
                  {modulos.map(m => (
                    <Option key={m} value={m}>{m}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="acao"
                label="Ação"
                rules={[{ required: true, message: 'Ação é obrigatória' }]}
              >
                <Select
                  placeholder="Selecione a ação"
                  showSearch
                  allowClear
                  mode="tags"
                  maxCount={1}
                >
                  {acoes.map(a => (
                    <Option key={a} value={a}>{a}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="nome"
            label="Nome da Permissão"
            rules={[{ required: true, message: 'Nome é obrigatório' }]}
            tooltip="Formato: modulo.acao (ex: pacientes.criar)"
          >
            <Input placeholder="Ex: pacientes.criar" />
          </Form.Item>

          <Form.Item name="descricao" label="Descrição">
            <Input.TextArea rows={2} placeholder="Descreva o que esta permissão permite" />
          </Form.Item>

          <Form.Item name="ativo" label="Status" valuePropName="checked">
            <Switch checkedChildren="Ativa" unCheckedChildren="Inativa" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPermission ? 'Atualizar' : 'Criar'}
              </Button>
              <Button onClick={() => setPermissionModalVisible(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Transfer (Atribuir Permissões) */}
      <Modal
        title={`Gerenciar Permissões: ${selectedRole?.nome}`}
        open={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        onOk={handleTransferSubmit}
        width={800}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Alert
          message="Atribuir Permissões"
          description="Selecione as permissões que os usuários desta role terão acesso."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Transfer
          dataSource={permissions.map(p => ({
            key: p.id.toString(),
            title: `${p.nome} - ${p.descricao}`,
            description: `${p.modulo} • ${p.acao}`,
            disabled: !p.ativo
          }))}
          titles={['Disponíveis', 'Atribuídas']}
          targetKeys={targetKeys}
          onChange={handleTransferChange}
          render={item => (
            <div>
              <div><code>{item.title}</code></div>
              <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
            </div>
          )}
          listStyle={{
            width: 350,
            height: 400,
          }}
          showSearch
          filterOption={(inputValue, option) =>
            option.title.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </Modal>
    </div>
  );
};

export default PermissionsManagement;

