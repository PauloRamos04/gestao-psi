import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  DatePicker,
  Table,
  Typography,
  Space,
  Statistic,
  Tag,
  message,
  Spin,
  Alert,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Tooltip
} from 'antd';
import {
  EnvironmentOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ReloadOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface Sublocation {
  id: number;
  roomName: string;
  tenantName: string;
  tenantType: 'psychologist' | 'therapist' | 'other';
  startDate: string;
  endDate: string;
  monthlyRate: number;
  status: 'active' | 'inactive' | 'pending';
  totalSessions: number;
  totalRevenue: number;
  lastPayment: string;
  nextPayment: string;
}

const SublocationsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sublocations, setSublocations] = useState<Sublocation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSublocation, setEditingSublocation] = useState<Sublocation | null>(null);
  const [form] = Form.useForm();

  const tenantTypes = [
    { value: 'psychologist', label: 'Psicólogo' },
    { value: 'therapist', label: 'Terapeuta' },
    { value: 'other', label: 'Outro' }
  ];

  const loadSublocations = async () => {
    setLoading(true);
    try {
      if (!user?.clinicaId) return;
      const data = await apiService.getSublocacoes(user.clinicaId);
      setSublocations(data);
    } catch (error) {
      message.error('Erro ao carregar sublocações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSublocations();
  }, []);

  const handleAddSublocation = () => {
    setEditingSublocation(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditSublocation = (sublocation: Sublocation) => {
    setEditingSublocation(sublocation);
    form.setFieldsValue({
      ...sublocation,
      startDate: sublocation.startDate ? new Date(sublocation.startDate) : null,
      endDate: sublocation.endDate ? new Date(sublocation.endDate) : null
    });
    setModalVisible(true);
  };

  const handleDeleteSublocation = (id: number) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir esta sublocação?',
      onOk: () => {
        return apiService.deletarSublocacao(id).then(() => {
          message.success('Sublocação excluída com sucesso!');
          loadSublocations();
        });
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingSublocation) {
        await apiService.atualizarSublocacao(editingSublocation.id, values);
        message.success('Sublocação atualizada com sucesso!');
      } else {
        await apiService.criarSublocacao(user!.clinicaId, values);
        message.success('Sublocação adicionada com sucesso!');
      }
      await loadSublocations();
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao salvar sublocação');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'inactive': return 'Inativa';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getTenantTypeText = (type: string) => {
    const tenantType = tenantTypes.find(t => t.value === type);
    return tenantType ? tenantType.label : type;
  };

  const columns = [
    {
      title: 'Sala',
      dataIndex: 'roomName',
      key: 'roomName',
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Locatário',
      dataIndex: 'tenantName',
      key: 'tenantName',
      render: (text: string, record: Sublocation) => (
        <Space direction="vertical" size="small">
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {getTenantTypeText(record.tenantType)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Período',
      key: 'period',
      render: (record: Sublocation) => (
        <Space direction="vertical" size="small">
          <Text style={{ fontSize: '12px' }}>
            Início: {format(new Date(record.startDate), 'dd/MM/yyyy', { locale: ptBR })}
          </Text>
          <Text style={{ fontSize: '12px' }}>
            Fim: {format(new Date(record.endDate), 'dd/MM/yyyy', { locale: ptBR })}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Valor Mensal',
      dataIndex: 'monthlyRate',
      key: 'monthlyRate',
      render: (value: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          R$ {value.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Sessões',
      dataIndex: 'totalSessions',
      key: 'totalSessions',
      render: (value: number) => (
        <Space>
          <CalendarOutlined />
          {value}
        </Space>
      ),
    },
    {
      title: 'Receita',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (value: number) => (
        <Text style={{ color: '#52c41a' }}>
          R$ {value.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Sublocation) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditSublocation(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteSublocation(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const totalRevenue = sublocations.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalSessions = sublocations.reduce((sum, item) => sum + item.totalSessions, 0);
  const activeSublocations = sublocations.filter(item => item.status === 'active').length;
  const monthlyRevenue = sublocations
    .filter(item => item.status === 'active')
    .reduce((sum, item) => sum + item.monthlyRate, 0);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <EnvironmentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Sublocações
            </Title>
            <Text type="secondary">
              Gerencie as sublocações de salas da sua clínica
            </Text>
          </div>

          <Divider />

          {/* Estatísticas */}
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="Sublocações Ativas"
                value={activeSublocations}
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Receita Total"
                value={totalRevenue}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Sessões Realizadas"
                value={totalSessions}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Receita Mensal"
                value={monthlyRevenue}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
          </Row>

          {/* Controles */}
          <Row justify="space-between" align="middle">
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddSublocation}
              >
                Nova Sublocação
              </Button>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadSublocations}
                  loading={loading}
                >
                  Atualizar
                </Button>
                <Button
                  icon={<FileTextOutlined />}
                >
                  Relatório
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Tabela */}
          <Table
            columns={columns}
            dataSource={sublocations}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} sublocações`,
            }}
            scroll={{ x: 800 }}
          />

          {/* Modal de Adicionar/Editar */}
          <Modal
            title={editingSublocation ? 'Editar Sublocação' : 'Nova Sublocação'}
            open={modalVisible}
            onOk={handleModalOk}
            onCancel={() => {
              setModalVisible(false);
              form.resetFields();
            }}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Nome da Sala"
                    name="roomName"
                    rules={[{ required: true, message: 'Por favor, insira o nome da sala!' }]}
                  >
                    <Input placeholder="Ex: Sala 1 - Individual" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nome do Locatário"
                    name="tenantName"
                    rules={[{ required: true, message: 'Por favor, insira o nome do locatário!' }]}
                  >
                    <Input placeholder="Ex: Dr. João Silva" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Tipo de Locatário"
                    name="tenantType"
                    rules={[{ required: true, message: 'Por favor, selecione o tipo!' }]}
                  >
                    <Select placeholder="Selecione o tipo">
                      {tenantTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Valor Mensal (R$)"
                    name="monthlyRate"
                    rules={[{ required: true, message: 'Por favor, insira o valor mensal!' }]}
                  >
                    <InputNumber
                      placeholder="0.00"
                      style={{ width: '100%' }}
                      min={0}
                      step={0.01}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Data de Início"
                    name="startDate"
                    rules={[{ required: true, message: 'Por favor, selecione a data de início!' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Data de Fim"
                    name="endDate"
                    rules={[{ required: true, message: 'Por favor, selecione a data de fim!' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Por favor, selecione o status!' }]}
              >
                <Select placeholder="Selecione o status">
                  <Option value="active">Ativa</Option>
                  <Option value="inactive">Inativa</Option>
                  <Option value="pending">Pendente</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      </Card>
    </div>
  );
};

export default SublocationsPage;
