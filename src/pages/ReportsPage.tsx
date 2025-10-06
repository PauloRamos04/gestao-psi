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
    if (!user?.clinicaId || !user?.psicologId) {
      message.error('Usuário não autenticado');
      return;
    }

    if (selectedReport !== 'patients' && !dateRange) {
      message.warning('Selecione um período para gerar o relatório');
      return;
    }

    setLoading(true);
    try {
      const [inicio, fim] = dateRange || ['', ''];
      
      if (selectedReport === 'sessions') {
        const data = await apiService.getRelatorioSessoes(user.clinicaId, user.psicologId, inicio, fim);
        setReportData({
          id: 'sessions',
          title: 'Relatório de Sessões',
          description: `Período: ${inicio} a ${fim}`,
          type: 'sessions',
          data: [],
          summary: {
            total: data.totalSessoes,
            paid: data.sessoesConfirmadas,
            pending: data.sessoesPendentes,
            cancelled: 0
          }
        });
        message.success('Relatório gerado com sucesso!');
      } else if (selectedReport === 'patients') {
        const data = await apiService.getRelatorioPacientes(user.clinicaId, user.psicologId);
        setReportData({
          id: 'patients',
          title: 'Relatório de Pacientes',
          description: 'Todos os pacientes',
          type: 'patients',
          data: [],
          summary: {
            total: data.totalPacientes,
            paid: data.pacientesAtivos,
            pending: data.pacientesInativos,
            cancelled: 0
          }
        });
        message.success('Relatório gerado com sucesso!');
      } else if (selectedReport === 'financial') {
        const data = await apiService.getRelatorioFinanceiro(user.clinicaId, user.psicologId, inicio, fim);
        setReportData({
          id: 'financial',
          title: 'Relatório Financeiro',
          description: `Período: ${inicio} a ${fim}`,
          type: 'financial',
          data: Object.entries(data.porTipoPagamento).map(([tipo, valor]) => ({ tipo, valor })),
          summary: {
            total: data.totalRecebido,
            paid: data.quantidadePagamentos,
            pending: 0,
            cancelled: 0
          }
        });
        message.success('Relatório gerado com sucesso!');
      } else if (selectedReport === 'general') {
        // Relatório geral combina todos os dados
        const [sessoes, pacientes, financeiro] = await Promise.all([
          apiService.getRelatorioSessoes(user.clinicaId, user.psicologId, inicio, fim),
          apiService.getRelatorioPacientes(user.clinicaId, user.psicologId),
          apiService.getRelatorioFinanceiro(user.clinicaId, user.psicologId, inicio, fim)
        ]);
        
        setReportData({
          id: 'general',
          title: 'Relatório Geral',
          description: `Período: ${inicio} a ${fim}`,
          type: 'general',
          data: [
            { label: 'Total de Sessões', value: sessoes.totalSessoes },
            { label: 'Total de Pacientes', value: pacientes.totalPacientes },
            { label: 'Total Recebido', value: `R$ ${financeiro.totalRecebido.toFixed(2)}` },
            { label: 'Ticket Médio', value: `R$ ${financeiro.ticketMedio.toFixed(2)}` }
          ],
          summary: {
            total: sessoes.totalSessoes,
            paid: pacientes.pacientesAtivos,
            pending: sessoes.sessoesPendentes,
            cancelled: pacientes.pacientesInativos
          }
        });
        message.success('Relatório geral gerado com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao gerar relatório:', error);
      message.error(error.response?.data?.message || 'Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    if (!reportData) {
      message.warning('Gere um relatório primeiro');
      return;
    }

    if (format === 'excel') {
      exportToExcel();
    } else if (format === 'pdf') {
      exportToPDF();
    }
  };

  const exportToExcel = () => {
    // Criar CSV (compatível com Excel)
    const headers = columns.map(col => col.title).join(',');
    const rows = reportData!.data.map(row => {
      return columns.map(col => {
        const value = row[col.dataIndex];
        return typeof value === 'string' ? `"${value}"` : value || '';
      }).join(',');
    });
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${reportData!.type}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    message.success('Relatório exportado para Excel (CSV)!');
  };

  const exportToPDF = () => {
    // Simples: abrir janela de impressão (usuário pode salvar como PDF)
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportData!.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1890ff; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #1890ff; color: white; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { text-align: center; padding: 15px; background: #f0f0f0; border-radius: 8px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #1890ff; }
          .stat-label { font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${reportData!.title}</h1>
        <p>${reportData!.description}</p>
        
        <div class="stats">
          <div class="stat">
            <div class="stat-value">${reportData!.summary.total}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat">
            <div class="stat-value">${reportData!.summary.paid}</div>
            <div class="stat-label">Confirmadas</div>
          </div>
          <div class="stat">
            <div class="stat-value">${reportData!.summary.pending}</div>
            <div class="stat-label">Pendentes</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              ${columns.map(col => `<th>${col.title}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${reportData!.data.map(row => `
              <tr>
                ${columns.map(col => `<td>${row[col.dataIndex] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <p style="margin-top: 30px; text-align: center; color: #666;">
          Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
        </p>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
      message.success('Janela de impressão aberta! Salve como PDF.');
    } else {
      message.error('Bloqueador de pop-ups ativado. Permita pop-ups para exportar PDF.');
    }
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

  // Colunas dinâmicas baseadas no tipo de relatório
  const getColumns = () => {
    if (!reportData) return [];
    
    if (reportData.type === 'general') {
      return [
        {
          title: 'Indicador',
          dataIndex: 'label',
          key: 'label',
        },
        {
          title: 'Valor',
          dataIndex: 'value',
          key: 'value',
          render: (value: any) => typeof value === 'number' ? value.toLocaleString('pt-BR') : value
        }
      ];
    }
    
    if (reportData.type === 'financial') {
      return [
        {
          title: 'Tipo de Pagamento',
          dataIndex: 'tipo',
          key: 'tipo',
        },
        {
          title: 'Valor Total',
          dataIndex: 'valor',
          key: 'valor',
          render: (valor: number) => `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
      ];
    }
    
    return [
      {
        title: 'Descrição',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Informação',
        dataIndex: 'info',
        key: 'info',
      }
    ];
  };

  const columns = getColumns();

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
                {reportData.data && reportData.data.length > 0 && (
                  <Table
                    columns={columns}
                    dataSource={reportData.data}
                    rowKey={(record, index) => record.id || record.label || record.tipo || `row-${index}`}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} de ${total} itens`,
                    }}
                    scroll={{ x: 600 }}
                  />
                )}
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
