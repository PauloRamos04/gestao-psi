import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Tooltip,
  Avatar,
  Typography,
  Row,
  Col,
  Statistic,
  Form,
  Input,
  Select
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { Psicologo } from '../../../types';
import apiService from '../../../services/api';
import PsicologosForm from './PsicologosForm';
import { format } from 'date-fns';

const { Title, Text } = Typography;
const { Option } = Select;

const PsicologosList: React.FC = () => {
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUsuarioVisible, setModalUsuarioVisible] = useState(false);
  const [selectedPsicologo, setSelectedPsicologo] = useState<Psicologo | null>(null);
  const [psicologosComUsuario, setPsicologosComUsuario] = useState<Record<number, boolean>>({});
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [formUsuario] = Form.useForm();

  useEffect(() => {
    loadPsicologos();
  }, []);

  const loadPsicologos = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPsicologos();
      setPsicologos(data);
      
      // Verificar quais psicólogos têm usuário
      const statusUsuarios: Record<number, boolean> = {};
      for (const psi of data) {
        try {
          const temUsuario = await apiService.verificarPsicologoTemUsuario(psi.id);
          statusUsuarios[psi.id] = temUsuario;
        } catch {
          statusUsuarios[psi.id] = false;
        }
      }
      setPsicologosComUsuario(statusUsuarios);
    } catch (error: any) {
      message.error('Erro ao carregar psicólogos');
    } finally {
      setLoading(false);
    }
  };

  const handleCriarUsuario = async (values: any) => {
    if (!selectedPsicologo) return;
    
    setLoadingUsuario(true);
    try {
      await apiService.criarUsuarioParaPsicologo(selectedPsicologo.id, values);
      message.success('Usuário criado com sucesso!');
      setModalUsuarioVisible(false);
      formUsuario.resetFields();
      loadPsicologos();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setLoadingUsuario(false);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este psicólogo?',
      okText: 'Sim',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await apiService.deletarPsicologo(id);
          message.success('Psicólogo excluído com sucesso!');
          loadPsicologos();
        } catch (error: any) {
          message.error('Erro ao excluir psicólogo');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Psicólogo',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string, record: Psicologo) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Login',
      dataIndex: 'psicologLogin',
      key: 'psicologLogin',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Data de Ativação',
      dataIndex: 'dtAtivacao',
      key: 'dtAtivacao',
      render: (data: string) => format(new Date(data), 'dd/MM/yyyy'),
    },
    {
      title: 'Categoria',
      dataIndex: 'categoriaNome',
      key: 'categoria',
      render: (text: string) => <Tag color="green">{text || 'N/A'}</Tag>,
    },
    {
      title: 'Usuário',
      key: 'usuario',
      width: 120,
      render: (_: any, record: Psicologo) => (
        <div>
          {psicologosComUsuario[record.id] ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Tem Usuário
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="warning">
              Sem Usuário
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 180,
      render: (_: any, record: Psicologo) => (
        <Space>
          {!psicologosComUsuario[record.id] && (
            <Tooltip title="Criar Usuário">
              <Button
                type="primary"
                size="small"
                icon={<UserAddOutlined />}
                onClick={() => {
                  setSelectedPsicologo(record);
                  setModalUsuarioVisible(true);
                  formUsuario.setFieldsValue({
                    username: record.psicologLogin || record.nome.toLowerCase().replace(/\s+/g, '.')
                  });
                }}
              >
                Criar
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedPsicologo(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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
                style={{ backgroundColor: '#52c41a' }}
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>Psicólogos</Title>
                <Text type="secondary">Gerencie os psicólogos do sistema</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary"
                icon={<PlusOutlined />} 
                onClick={() => {
                  setSelectedPsicologo(null);
                  setModalVisible(true);
                }}
              >
                Novo Psicólogo
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadPsicologos}
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
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Total de Psicólogos"
              value={psicologos.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={psicologos}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} psicólogos`,
          }}
        />
      </Card>

      {/* Modal Editar/Criar Psicólogo */}
      <Modal
        title={selectedPsicologo ? 'Editar Psicólogo' : 'Novo Psicólogo'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedPsicologo(null);
        }}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <PsicologosForm
          psicologo={selectedPsicologo}
          onSuccess={() => {
            setModalVisible(false);
            setSelectedPsicologo(null);
            loadPsicologos();
          }}
          onCancel={() => {
            setModalVisible(false);
            setSelectedPsicologo(null);
          }}
        />
      </Modal>

      {/* Modal Criar Usuário para Psicólogo */}
      <Modal
        title={
          <Space>
            <UserAddOutlined />
            <span>Criar Usuário para {selectedPsicologo?.nome}</span>
          </Space>
        }
        open={modalUsuarioVisible}
        onCancel={() => {
          setModalUsuarioVisible(false);
          setSelectedPsicologo(null);
          formUsuario.resetFields();
        }}
        footer={null}
        width={500}
      >
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#e6f7ff', 
          border: '1px solid #91d5ff', 
          borderRadius: '4px',
          marginBottom: 24 
        }}>
          <p style={{ margin: 0, color: '#0050b3' }}>
            💡 Este psicólogo ainda não possui usuário de acesso ao sistema. Preencha os dados abaixo para criar.
          </p>
        </div>

        <Form
          form={formUsuario}
          layout="vertical"
          onFinish={handleCriarUsuario}
        >
          <Form.Item 
            name="username" 
            label="Username (Login)" 
            rules={[{ required: true, message: 'Username é obrigatório' }]}
          >
            <Input placeholder="Ex: joao.silva" />
          </Form.Item>

          <Form.Item 
            name="senha" 
            label="Senha" 
            rules={[
              { required: true, message: 'Senha é obrigatória' },
              { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
            ]}
          >
            <Input.Password placeholder="Mínimo 6 caracteres" />
          </Form.Item>

          <Form.Item name="tipoUserId" label="Tipo de Usuário">
            <Select placeholder="Deixe em branco para usar PSICOLOGO" allowClear>
              <Option value={2}>Psicólogo</Option>
              <Option value={1}>Admin</Option>
              <Option value={3}>Funcionário</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loadingUsuario}>
                Criar Usuário
              </Button>
              <Button onClick={() => {
                setModalUsuarioVisible(false);
                setSelectedPsicologo(null);
                formUsuario.resetFields();
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PsicologosList;
