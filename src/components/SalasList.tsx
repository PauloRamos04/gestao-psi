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
  EnvironmentOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Sala, Clinica } from '../types';

const { Option } = Select;

const SalasList: React.FC = () => {
  const { user } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSala, setEditingSala] = useState<Sala | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [clinicaFilter, setClinicaFilter] = useState<number | undefined>(undefined);

  // Estatísticas
  const totalSalas = salas.length;
  const salasPorClinica = salas.reduce((acc, sala) => {
    const clinicaNome = sala.clinica?.nome || 'Sem clínica';
    acc[clinicaNome] = (acc[clinicaNome] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  useEffect(() => {
    loadSalas();
    loadClinicas();
  }, []);

  const loadSalas = async () => {
    if (!user?.clinicaId) return;
    
    setLoading(true);
    try {
      const data = await apiService.getSalas(user.clinicaId);
      setSalas(data);
    } catch (error) {
      message.error('Erro ao carregar salas');
    } finally {
      setLoading(false);
    }
  };

  const loadClinicas = async () => {
    try {
      // Mock de clínicas para o filtro
      const mockClinicas: Clinica[] = [
        {
          id: 1,
          clinicaLogin: 'clinica1',
          nome: 'Clínica Psicológica Central',
          status: true,
          titulo: 'Clínica Central'
        },
        {
          id: 2,
          clinicaLogin: 'clinica2',
          nome: 'Centro de Psicologia Avançada',
          status: true,
          titulo: 'Centro Avançado'
        }
      ];
      setClinicas(mockClinicas);
    } catch (error) {
      console.error('Erro ao carregar clínicas:', error);
    }
  };

  const handleAdd = () => {
    setEditingSala(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (sala: Sala) => {
    setEditingSala(sala);
    form.setFieldsValue({
      nome: sala.nome,
      clinicaId: sala.clinicaId
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // Aqui você implementaria a chamada para deletar
      message.success('Sala removida com sucesso');
      loadSalas();
    } catch (error) {
      message.error('Erro ao remover sala');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingSala) {
        // Atualizar sala existente
        message.success('Sala atualizada com sucesso');
      } else {
        // Criar nova sala
        message.success('Sala criada com sucesso');
      }
      
      setModalVisible(false);
      loadSalas();
    } catch (error) {
      message.error('Erro ao salvar sala');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingSala(null);
    form.resetFields();
  };

  const filteredSalas = salas.filter(sala => {
    const matchesSearch = sala.nome.toLowerCase().includes(searchText.toLowerCase()) ||
                         sala.clinica?.nome.toLowerCase().includes(searchText.toLowerCase());
    const matchesClinica = !clinicaFilter || sala.clinicaId === clinicaFilter;
    
    return matchesSearch && matchesClinica;
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Sala',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string, record: Sala) => (
        <div className="flex items-center">
          <Avatar 
            icon={<EnvironmentOutlined />} 
            style={{ backgroundColor: '#52c41a', marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ID: {record.id}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Clínica',
      dataIndex: ['clinica', 'nome'],
      key: 'clinica',
      render: (text: string, record: Sala) => (
        <div className="flex items-center">
          <Avatar 
            icon={<BankOutlined />} 
            size="small"
            style={{ backgroundColor: '#1890ff', marginRight: 8 }}
          />
          <span>{text || 'Sem clínica'}</span>
        </div>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_: any, record: Sala) => (
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
            title="Tem certeza que deseja remover esta sala?"
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
          <h1 className="text-2xl font-bold text-gray-900">Salas</h1>
          <p className="text-gray-600">Gerencie as salas das clínicas</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Nova Sala
        </Button>
      </div>

      {/* Estatísticas */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Salas"
              value={totalSalas}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Clínicas com Salas"
              value={Object.keys(salasPorClinica).length}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Média por Clínica"
              value={Object.keys(salasPorClinica).length > 0 ? (totalSalas / Object.keys(salasPorClinica).length).toFixed(1) : 0}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sua Clínica"
              value={salas.filter(s => s.clinicaId === user?.clinicaId).length}
              prefix={<BankOutlined />}
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
              placeholder="Buscar por nome da sala ou clínica..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filtrar por clínica"
              value={clinicaFilter}
              onChange={setClinicaFilter}
              style={{ width: '100%' }}
              allowClear
            >
              {clinicas.map(clinica => (
                <Option key={clinica.id} value={clinica.id}>
                  {clinica.nome}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadSalas}
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
          dataSource={filteredSalas}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} salas`,
          }}
        />
      </Card>

      {/* Modal de Adicionar/Editar */}
      <Modal
        title={editingSala ? 'Editar Sala' : 'Nova Sala'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            clinicaId: user?.clinicaId
          }}
        >
          <Form.Item
            name="nome"
            label="Nome da Sala"
            rules={[
              { required: true, message: 'Por favor, insira o nome da sala' },
              { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
            ]}
          >
            <Input placeholder="Digite o nome da sala" />
          </Form.Item>

          <Form.Item
            name="clinicaId"
            label="Clínica"
            rules={[{ required: true, message: 'Por favor, selecione a clínica' }]}
          >
            <Select placeholder="Selecione a clínica">
              {clinicas.map(clinica => (
                <Option key={clinica.id} value={clinica.id}>
                  {clinica.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalasList;
