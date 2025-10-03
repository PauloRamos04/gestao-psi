import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Input,
  Button,
  Space,
  Tag,
  Avatar,
  Typography,
  Spin,
  Alert,
  Row,
  Col,
  Statistic,
  Switch,
  Tooltip,
  message
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Usuario } from '../../../types';
import apiService from '../../../services/api';

const { Title, Text } = Typography;

const UsuariosList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsuarios();
      setUsuarios(data);
    } catch (err: any) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await apiService.desativarUsuario(id);
        message.success('Usuário desativado com sucesso!');
      } else {
        await apiService.ativarUsuario(id);
        message.success('Usuário ativado com sucesso!');
      }
      await loadUsuarios(); // Recarregar lista
    } catch (err: any) {
      message.error('Erro ao alterar status do usuário');
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.clinica?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.psicologo?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = usuarios.filter(u => u.status).length;
  const inactiveUsers = usuarios.filter(u => !u.status).length;

  const columns = [
    {
      title: 'Usuário',
      dataIndex: 'titulo',
      key: 'titulo',
      render: (text: string, record: Usuario) => (
        <Space>
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Clínica',
      dataIndex: ['clinica', 'nome'],
      key: 'clinica',
      render: (text: string, record: Usuario) => (
        <div>
          <div>{text || 'N/A'}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.clinica?.clinicaLogin || ''}
          </Text>
        </div>
      ),
    },
    {
      title: 'Psicólogo',
      dataIndex: ['psicologo', 'nome'],
      key: 'psicologo',
      render: (text: string, record: Usuario) => (
        <div>
          <div>{text || 'N/A'}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.psicologo?.psicologLogin || ''}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag 
          color={status ? 'green' : 'red'} 
          icon={status ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        >
          {status ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Usuario) => (
        <Space>
          <Tooltip title={record.status ? 'Desativar usuário' : 'Ativar usuário'}>
            <Switch
              checked={record.status}
              onChange={() => handleToggleStatus(record.id, record.status)}
              checkedChildren="Ativo"
              unCheckedChildren="Inativo"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Erro"
        description={error}
        type="error"
        showIcon
        style={{ margin: '16px' }}
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Avatar 
                size={48}
                icon={<TeamOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>Usuários</Title>
                <Text type="secondary">Gerencie os usuários do sistema</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadUsuarios}
                loading={loading}
              >
                Atualizar
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total de Usuários"
              value={usuarios.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Usuários Ativos"
              value={activeUsers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Usuários Inativos"
              value={inactiveUsers}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Table */}
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input
            size="large"
            placeholder="Buscar usuários..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
          
          <Table
            columns={columns}
            dataSource={filteredUsuarios}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} usuários`,
            }}
            scroll={{ x: 800 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default UsuariosList;
