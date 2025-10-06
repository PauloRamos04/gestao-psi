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
  message,
  Card,
  Row,
  Col,
  Statistic,
  Tooltip,
  Popconfirm,
  Avatar
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import apiService from '../../../services/api';
import { Clinica } from '../../../types';

const { Option } = Select;

const ClinicasList: React.FC = () => {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClinica, setEditingClinica] = useState<Clinica | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Estatísticas
  const totalClinicas = clinicas.length;
  const clinicasAtivas = clinicas.filter(c => c.status).length;
  const clinicasInativas = clinicas.filter(c => !c.status).length;

  useEffect(() => {
    loadClinicas();
  }, []);

  const loadClinicas = async () => {
    setLoading(true);
    try {
      const data = await apiService.getClinicas();
      setClinicas(data);
      if (data.length === 0) {
        message.info('Nenhuma clínica cadastrada ainda');
      }
    } catch (error) {
      message.error('Erro ao carregar clínicas');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingClinica(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (clinica: Clinica) => {
    setEditingClinica(clinica);
    form.setFieldsValue({
      clinicaLogin: clinica.clinicaLogin,
      nome: clinica.nome,
      titulo: clinica.titulo,
      status: clinica.status
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.desativarClinica(id);
      message.success('Clínica desativada com sucesso');
      loadClinicas();
    } catch (error) {
      message.error('Erro ao desativar clínica');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingClinica) {
        // Atualizar clínica existente
        await apiService.atualizarClinica(editingClinica.id, values);
        message.success('Clínica atualizada com sucesso');
      } else {
        // Criar nova clínica
        await apiService.criarClinica(values);
        message.success('Clínica criada com sucesso');
      }
      
      setModalVisible(false);
      loadClinicas();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar clínica');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingClinica(null);
    form.resetFields();
  };

  const filteredClinicas = clinicas.filter(clinica => {
    const matchesSearch = clinica.nome.toLowerCase().includes(searchText.toLowerCase()) ||
                         clinica.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
                         clinica.clinicaLogin.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && clinica.status) ||
      (statusFilter === 'inactive' && !clinica.status);
    
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
      title: 'Clínica',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string, record: Clinica) => (
        <div className="flex items-center">
          <Avatar 
            icon={<BankOutlined />} 
            style={{ backgroundColor: record.status ? '#1890ff' : '#d9d9d9', marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.titulo}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Login',
      dataIndex: 'clinicaLogin',
      key: 'clinicaLogin',
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Ativa' : 'Inativa'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_: any, record: Clinica) => (
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
            title="Tem certeza que deseja remover esta clínica?"
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
          <h1 className="text-2xl font-bold text-gray-900">Clínicas</h1>
          <p className="text-gray-600">Gerencie as clínicas do sistema</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Nova Clínica
        </Button>
      </div>

      {/* Estatísticas */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Clínicas"
              value={totalClinicas}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Clínicas Ativas"
              value={clinicasAtivas}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Clínicas Inativas"
              value={clinicasInativas}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Taxa de Ativas"
              value={totalClinicas > 0 ? ((clinicasAtivas / totalClinicas) * 100).toFixed(1) : 0}
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
              placeholder="Buscar por nome, título ou login..."
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
              <Option value="all">Todas</Option>
              <Option value="active">Ativas</Option>
              <Option value="inactive">Inativas</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadClinicas}
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
          dataSource={filteredClinicas}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} clínicas`,
          }}
        />
      </Card>

      {/* Modal de Adicionar/Editar */}
      <Modal
        title={editingClinica ? 'Editar Clínica' : 'Nova Clínica'}
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
            name="clinicaLogin"
            label="Login da Clínica"
            rules={[
              { required: true, message: 'Por favor, insira o login da clínica' },
              { min: 3, message: 'Login deve ter pelo menos 3 caracteres' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Login deve conter apenas letras, números e underscore' }
            ]}
          >
            <Input placeholder="Digite o login da clínica" />
          </Form.Item>

          <Form.Item
            name="nome"
            label="Nome da Clínica"
            rules={[
              { required: true, message: 'Por favor, insira o nome da clínica' },
              { min: 3, message: 'Nome deve ter pelo menos 3 caracteres' }
            ]}
          >
            <Input placeholder="Digite o nome completo da clínica" />
          </Form.Item>

          <Form.Item
            name="titulo"
            label="Título"
            rules={[
              { required: true, message: 'Por favor, insira o título da clínica' },
              { min: 2, message: 'Título deve ter pelo menos 2 caracteres' }
            ]}
          >
            <Input placeholder="Digite o título da clínica" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Por favor, selecione o status' }]}
          >
            <Select placeholder="Selecione o status">
              <Option value={true}>Ativa</Option>
              <Option value={false}>Inativa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClinicasList;
