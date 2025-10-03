import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  DatePicker,
  Select,
  Table,
  Typography,
  Space,
  Statistic,
  Tag,
  message,
  Spin,
  Alert,
  Divider,
  Tabs,
  Tooltip
} from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'sessions' | 'patients' | 'general';
  data: any[];
  summary: {
    total: number;
    paid: number;
    pending: number;
    cancelled: number;
  };
}

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [selectedReport, setSelectedReport] = useState<string>('sessions');
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const reportTypes = [
    {
      key: 'sessions',
      title: 'Relatório de Sessões',
      description: 'Sessões realizadas, pagas e pendentes',
      icon: <CalendarOutlined />
    },
    {
      key: 'patients',
      title: 'Relatório de Pacientes',
      description: 'Informações sobre pacientes atendidos',
      icon: <UserOutlined />
    },
    {
      key: 'financial',
      title: 'Relatório Financeiro',
      description: 'Receitas, pagamentos e faturamento',
      icon: <DollarOutlined />
    },
    {
      key: 'general',
      title: 'Relatório Geral',
      description: 'Visão geral das atividades',
      icon: <BarChartOutlined />
    }
  ];

  const loadReportData = async () => {
    if (!dateRange) {
      message.warning('Selecione um período para gerar o relatório');
      return;
    }

    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui seria feita a chamada real para o backend
      // const data = await apiService.getReport(selectedReport, dateRange[0], dateRange[1]);
      
      // Dados mockados para demonstração
      const mockData: ReportData = {
        id: selectedReport,
        title: reportTypes.find(r => r.key === selectedReport)?.title || '',
        description: reportTypes.find(r => r.key === selectedReport)?.description || '',
        type: selectedReport as any,
        data: generateMockData(selectedReport),
        summary: {
          total: 45,
          paid: 38,
          pending: 5,
          cancelled: 2
        }
      };
      
      setReportData(mockData);
      message.success('Relatório gerado com sucesso!');
    } catch (error) {
      message.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (type: string) => {
    const baseData = [
      { id: 1, name: 'Ana Silva', date: '2024-01-15', value: 150, status: 'paid' },
      { id: 2, name: 'Bruno Santos', date: '2024-01-16', value: 150, status: 'pending' },
      { id: 3, name: 'Carla Oliveira', date: '2024-01-17', value: 150, status: 'paid' },
      { id: 4, name: 'Diego Costa', date: '2024-01-18', value: 150, status: 'cancelled' },
      { id: 5, name: 'Elena Ferreira', date: '2024-01-19', value: 150, status: 'paid' }
    ];

    return baseData;
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    if (!reportData) {
      message.warning('Gere um relatório primeiro');
      return;
    }

    message.success(`Relatório exportado em formato ${format.toUpperCase()}`);
    // Aqui seria implementada a lógica de exportação
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR }),
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `R$ ${value.toFixed(2)}`,
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
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <FileTextOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Relatórios
            </Title>
            <Text type="secondary">
              Gere relatórios detalhados sobre suas atividades
            </Text>
          </div>

          <Divider />

          {/* Filtros */}
          <Card title="Filtros do Relatório" size="small">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Text strong>Tipo de Relatório:</Text>
                <Select
                  value={selectedReport}
                  onChange={setSelectedReport}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {reportTypes.map(report => (
                    <Option key={report.key} value={report.key}>
                      <Space>
                        {report.icon}
                        {report.title}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <Text strong>Período:</Text>
                <RangePicker
                  style={{ width: '100%', marginTop: '8px' }}
                  onChange={(dates, dateStrings) => {
                    if (dates && dates[0] && dates[1]) {
                      setDateRange([dateStrings[0], dateStrings[1]]);
                    } else {
                      setDateRange(null);
                    }
                  }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Space style={{ marginTop: '32px' }}>
                  <Button
                    type="primary"
                    icon={<FileTextOutlined />}
                    onClick={loadReportData}
                    loading={loading}
                  >
                    Gerar Relatório
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setReportData(null);
                      setDateRange(null);
                    }}
                  >
                    Limpar
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Resultado do Relatório */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>
                <Text>Gerando relatório...</Text>
              </div>
            </div>
          ) : reportData ? (
            <Card title={reportData.title} size="small">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Resumo */}
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={6}>
                    <Statistic
                      title="Total"
                      value={reportData.summary.total}
                      prefix={<BarChartOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Statistic
                      title="Pagas"
                      value={reportData.summary.paid}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Statistic
                      title="Pendentes"
                      value={reportData.summary.pending}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Statistic
                      title="Canceladas"
                      value={reportData.summary.cancelled}
                      prefix={<CloseCircleOutlined />}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                </Row>

                <Divider />

                {/* Ações de Exportação */}
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Exportar Relatório:</Text>
                  </Col>
                  <Col>
                    <Space>
                      <Tooltip title="Exportar como PDF">
                        <Button
                          icon={<FileTextOutlined />}
                          onClick={() => exportReport('pdf')}
                        >
                          PDF
                        </Button>
                      </Tooltip>
                      <Tooltip title="Exportar como Excel">
                        <Button
                          icon={<DownloadOutlined />}
                          onClick={() => exportReport('excel')}
                        >
                          Excel
                        </Button>
                      </Tooltip>
                    </Space>
                  </Col>
                </Row>

                {/* Tabela de Dados */}
                <Table
                  columns={columns}
                  dataSource={reportData.data}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} de ${total} itens`,
                  }}
                  scroll={{ x: 600 }}
                />
              </Space>
            </Card>
          ) : (
            <Alert
              message="Nenhum relatório gerado"
              description="Selecione um tipo de relatório e período, depois clique em 'Gerar Relatório' para visualizar os dados."
              type="info"
              showIcon
            />
          )}

          {/* Tipos de Relatórios Disponíveis */}
          <Card title="Tipos de Relatórios Disponíveis" size="small">
            <Row gutter={[16, 16]}>
              {reportTypes.map(report => (
                <Col xs={24} sm={12} lg={6} key={report.key}>
                  <Card
                    size="small"
                    hoverable
                    style={{
                      border: selectedReport === report.key ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedReport(report.key)}
                  >
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }}>
                          {report.icon}
                        </div>
                        <Text strong>{report.title}</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                        {report.description}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default ReportsPage;
