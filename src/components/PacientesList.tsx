import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Paciente, Clinica, Psicologo } from '../types';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PacientesList: React.FC = () => {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Estatísticas
  const totalPacientes = pacientes.length;
  const pacientesAtivos = pacientes.filter(p => p.status).length;
  const pacientesInativos = pacientes.filter(p => !p.status).length;

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    if (!user?.clinicaId || !user?.psicologId) return;
    
    setLoading(true);
    try {
      const data = await apiService.getPacientes(user.clinicaId, user.psicologId);
      setPacientes(data);
    } catch (error) {
      message.error('Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPaciente(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (paciente: Paciente) => {
    setEditingPaciente(paciente);
    form.setFieldsValue({
      nome: paciente.nome,
      status: paciente.status
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // Aqui você implementaria a chamada para deletar
      message.success('Paciente removido com sucesso');
      loadPacientes();
    } catch (error) {
      message.error('Erro ao remover paciente');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingPaciente) {
        // Atualizar paciente existente
        message.success('Paciente atualizado com sucesso');
      } else {
        // Criar novo paciente
        message.success('Paciente criado com sucesso');
      }
      
      setModalVisible(false);
      loadPacientes();
    } catch (error) {
      message.error('Erro ao salvar paciente');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingPaciente(null);
    form.resetFields();
  };

  const filteredPacientes = pacientes.filter(paciente => {
    const matchesSearch = paciente.nome.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && paciente.status) ||
      (statusFilter === 'inactive' && !paciente.status);
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string, record: Paciente) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.psicologo?.nome}
          </div>
        </div>
      ),
    },
    {
      title: 'Clínica',
      dataIndex: ['clinica', 'nome'],
      key: 'clinica',
      render: (text: string) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_: any, record: Paciente) => (
        <Space size="small">
          <Tooltip title="Visualizar">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Tem certeza que deseja remover este paciente?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Remover">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Gerencie os pacientes da clínica</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Novo Paciente
        </Button>
      </div>

      {/* Estatísticas */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Pacientes"
              value={totalPacientes}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pacientes Ativos"
              value={pacientesAtivos}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pacientes Inativos"
              value={pacientesInativos}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Taxa de Ativos"
              value={totalPacientes > 0 ? ((pacientesAtivos / totalPacientes) * 100).toFixed(1) : 0}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <Card>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Input
              placeholder="Buscar por nome..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Todos</Option>
              <Option value="active">Ativos</Option>
              <Option value="inactive">Inativos</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadPacientes}
              loading={loading}
            >
              Atualizar
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tabela */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPacientes}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} pacientes`,
          }}
        />
      </Card>

      {/* Modal de Adicionar/Editar */}
      <Modal
        title={editingPaciente ? 'Editar Paciente' : 'Novo Paciente'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: true
          }}
        >
          <Form.Item
            name="nome"
            label="Nome do Paciente"
            rules={[
              { required: true, message: 'Por favor, insira o nome do paciente' },
              { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
            ]}
          >
            <Input placeholder="Digite o nome completo do paciente" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Por favor, selecione o status' }]}
          >
            <Select placeholder="Selecione o status">
              <Option value={true}>Ativo</Option>
              <Option value={false}>Inativo</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PacientesList;
