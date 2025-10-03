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
  InputNumber,
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
  DollarOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Pagamento, Paciente, TipoPagamento, FiltroPeriodo } from '../types';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PagamentosList: React.FC = () => {
  const { user } = useAuth();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPagamento, setEditingPagamento] = useState<Pagamento | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // Estatísticas
  const totalPagamentos = pagamentos.length;
  const valorTotal = pagamentos.reduce((sum, p) => sum + p.valor, 0);
  const valorMedio = totalPagamentos > 0 ? valorTotal / totalPagamentos : 0;

  useEffect(() => {
    loadPagamentos();
  }, []);

  const loadPagamentos = async () => {
    if (!user?.clinicaId || !user?.psicologId) return;
    
    setLoading(true);
    try {
      const filtro: FiltroPeriodo = {
        clinicaId: user.clinicaId,
        psicologId: user.psicologId,
        inicio: dateRange ? dateRange[0] : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fim: dateRange ? dateRange[1] : new Date().toISOString().split('T')[0]
      };
      
      const data = await apiService.getPagamentosPorPeriodo(filtro);
      setPagamentos(data);
    } catch (error) {
      message.error('Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPagamento(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (pagamento: Pagamento) => {
    setEditingPagamento(pagamento);
    form.setFieldsValue({
      pacienteId: pagamento.pacienteId,
      valor: pagamento.valor,
      data: pagamento.data,
      tipoPagamentoId: pagamento.tipoPagamentoId
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // Aqui você implementaria a chamada para deletar
      message.success('Pagamento removido com sucesso');
      loadPagamentos();
    } catch (error) {
      message.error('Erro ao remover pagamento');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingPagamento) {
        // Atualizar pagamento existente
        message.success('Pagamento atualizado com sucesso');
      } else {
        // Criar novo pagamento
        message.success('Pagamento criado com sucesso');
      }
      
      setModalVisible(false);
      loadPagamentos();
    } catch (error) {
      message.error('Erro ao salvar pagamento');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingPagamento(null);
    form.resetFields();
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };

  const filteredPagamentos = pagamentos.filter(pagamento => {
    const matchesSearch = pagamento.paciente?.nome?.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Paciente',
      dataIndex: ['paciente', 'nome'],
      key: 'paciente',
      render: (text: string) => text || '-',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (value: number) => (
        <span style={{ fontWeight: 500, color: '#52c41a' }}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Tipo de Pagamento',
      dataIndex: ['tipoPagamento', 'nome'],
      key: 'tipoPagamento',
      render: (text: string) => (
        <Tag color="blue">{text || 'Não informado'}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_: any, record: Pagamento) => (
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
            title="Tem certeza que deseja remover este pagamento?"
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
          <h1 className="text-2xl font-bold text-gray-900">Pagamentos</h1>
          <p className="text-gray-600">Gerencie os pagamentos recebidos</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Novo Pagamento
        </Button>
      </div>

      {/* Estatísticas */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Pagamentos"
              value={totalPagamentos}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Valor Total"
              value={valorTotal}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Valor Médio"
              value={valorMedio}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Período"
              value={dateRange ? `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}` : 'Últimos 30 dias'}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <Card>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="Buscar por paciente..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <RangePicker
              placeholder={['Data inicial', 'Data final']}
              onChange={handleDateRangeChange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadPagamentos}
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
          dataSource={filteredPagamentos}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} pagamentos`,
          }}
        />
      </Card>

      {/* Modal de Adicionar/Editar */}
      <Modal
        title={editingPagamento ? 'Editar Pagamento' : 'Novo Pagamento'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="pacienteId"
            label="Paciente"
            rules={[{ required: true, message: 'Por favor, selecione o paciente' }]}
          >
            <Select placeholder="Selecione o paciente">
              {/* Aqui você carregaria a lista de pacientes */}
              <Option value={1}>Paciente Exemplo</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="valor"
            label="Valor"
            rules={[
              { required: true, message: 'Por favor, insira o valor' },
              { type: 'number', min: 0.01, message: 'Valor deve ser maior que zero' }
            ]}
          >
            <InputNumber
              placeholder="0,00"
              formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/R\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="data"
            label="Data do Pagamento"
            rules={[{ required: true, message: 'Por favor, selecione a data' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="tipoPagamentoId"
            label="Tipo de Pagamento"
            rules={[{ required: true, message: 'Por favor, selecione o tipo de pagamento' }]}
          >
            <Select placeholder="Selecione o tipo de pagamento">
              <Option value={1}>Dinheiro</Option>
              <Option value={2}>Cartão de Débito</Option>
              <Option value={3}>Cartão de Crédito</Option>
              <Option value={4}>PIX</Option>
              <Option value={5}>Transferência</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PagamentosList;
