import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Button,
  Select,
  Table,
  message,
  Space,
  Tooltip
} from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { FiltroPeriodo, Pagamento } from '../types';
import SimpleBarChart from '../components/common/SimpleBarChart';
import SimplePieChart from '../components/common/SimplePieChart';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FaturamentoPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [faturamentoData, setFaturamentoData] = useState<{
    total: number;
    pagamentos: Pagamento[];
    porMes: { mes: string; valor: number }[];
    porTipo: { tipo: string; valor: number; quantidade: number }[];
  }>({
    total: 0,
    pagamentos: [],
    porMes: [],
    porTipo: []
  });

  useEffect(() => {
    loadFaturamento();
  }, [dateRange]);

  const loadFaturamento = async () => {
    if (!user?.clinicaId || !user?.psicologId) return;
    
    setLoading(true);
    try {
      const filtro: FiltroPeriodo = {
        clinicaId: user.clinicaId,
        psicologId: user.psicologId,
        inicio: dateRange ? dateRange[0] : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fim: dateRange ? dateRange[1] : new Date().toISOString().split('T')[0]
      };
      
      const total = await apiService.getFaturamentoPorPeriodo(filtro);
      const pagamentos = await apiService.getPagamentosPorPeriodo(filtro);
      
      // Processar dados para gráficos
      const porMes = processarDadosPorMes(pagamentos);
      const porTipo = processarDadosPorTipo(pagamentos);
      
      setFaturamentoData({
        total,
        pagamentos,
        porMes,
        porTipo
      });
    } catch (error) {
      message.error('Erro ao carregar dados de faturamento');
    } finally {
      setLoading(false);
    }
  };

  const processarDadosPorMes = (pagamentos: Pagamento[]) => {
    const dadosPorMes: { [key: string]: number } = {};
    
    pagamentos.forEach(pagamento => {
      const mes = new Date(pagamento.data).toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      });
      dadosPorMes[mes] = (dadosPorMes[mes] || 0) + pagamento.valor;
    });
    
    return Object.entries(dadosPorMes).map(([mes, valor]) => ({ mes, valor }));
  };

  const processarDadosPorTipo = (pagamentos: Pagamento[]) => {
    const dadosPorTipo: { [key: string]: { valor: number; quantidade: number } } = {};
    
    pagamentos.forEach(pagamento => {
      const tipo = pagamento.tipoPagamentoNome || 'Não informado';
      if (!dadosPorTipo[tipo]) {
        dadosPorTipo[tipo] = { valor: 0, quantidade: 0 };
      }
      dadosPorTipo[tipo].valor += pagamento.valor;
      dadosPorTipo[tipo].quantidade += 1;
    });
    
    return Object.entries(dadosPorTipo).map(([tipo, dados]) => ({
      tipo,
      valor: dados.valor,
      quantidade: dados.quantidade
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };

  const handleExport = () => {
    if (faturamentoData.pagamentos.length === 0) {
      message.warning('Não há dados para exportar');
      return;
    }

    // Exportar como CSV
    const headers = 'Data,Paciente,Valor,Tipo\n';
    const rows = faturamentoData.pagamentos.map(pag => 
      `${formatDate(pag.data)},"${pag.pacienteNome || 'N/A'}",${pag.valor},"${pag.tipoPagamentoNome || 'N/A'}"`
    ).join('\n');
    
    const csv = headers + rows;
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `faturamento_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    message.success('Relatório de faturamento exportado!');
  };

  const columns = [
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Paciente',
      dataIndex: 'pacienteNome',
      key: 'paciente',
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
      title: 'Tipo',
      dataIndex: 'tipoPagamentoNome',
      key: 'tipo',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturamento</h1>
          <p className="text-gray-600">Relatórios e análises de faturamento</p>
        </div>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Exportar
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadFaturamento}
            loading={loading}
          >
            Atualizar
          </Button>
        </Space>
      </div>

      {/* Filtros */}
      <Card>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <RangePicker
              placeholder={['Data inicial', 'Data final']}
              onChange={handleDateRangeChange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select placeholder="Período" style={{ width: '100%' }}>
              <Option value="7">Últimos 7 dias</Option>
              <Option value="30">Últimos 30 dias</Option>
              <Option value="90">Últimos 90 dias</Option>
              <Option value="365">Último ano</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Estatísticas Principais */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Faturamento Total"
              value={faturamentoData.total}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Pagamentos"
              value={faturamentoData.pagamentos.length}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Valor Médio"
              value={faturamentoData.pagamentos.length > 0 ? faturamentoData.total / faturamentoData.pagamentos.length : 0}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Período Selecionado"
              value={dateRange ? `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}` : 'Últimos 30 dias'}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Faturamento por Mês" extra={<LineChartOutlined />}>
            <SimpleBarChart
              data={faturamentoData.porMes.map(item => ({ 
                label: item.mes, 
                value: item.valor 
              }))}
              valueFormatter={formatCurrency}
              color="#1890ff"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Faturamento por Tipo de Pagamento" extra={<PieChartOutlined />}>
            <SimplePieChart
              data={faturamentoData.porTipo.map(item => ({ 
                label: item.tipo, 
                value: item.valor 
              }))}
              valueFormatter={formatCurrency}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabela de Pagamentos */}
      <Card title="Detalhamento dos Pagamentos">
        <Table
          columns={columns}
          dataSource={faturamentoData.pagamentos}
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

      {/* Resumo por Tipo */}
      <Card title="Resumo por Tipo de Pagamento">
        <Row gutter={16}>
          {faturamentoData.porTipo.map((item, index) => (
            <Col span={6} key={index}>
              <Card size="small">
                <Statistic
                  title={item.tipo}
                  value={item.valor}
                  formatter={(value) => formatCurrency(Number(value))}
                  suffix={`(${item.quantidade} pagamentos)`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default FaturamentoPage;

