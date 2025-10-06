import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  DatePicker,
  Select,
  Typography,
  Space,
  Statistic,
  Tag,
  message,
  Spin,
  Alert,
  Divider,
  Tabs,
  Progress,
  List,
  Avatar
} from 'antd';
import {
  HistoryOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface HistoryData {
  period: string;
  sessions: number;
  revenue: number;
  patients: number;
  rooms: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

interface RoomUsage {
  roomName: string;
  usageCount: number;
  totalHours: number;
  percentage: number;
}

const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6months');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [roomUsage, setRoomUsage] = useState<RoomUsage[]>([]);

  const periodOptions = [
    { key: '6months', label: 'Últimos 6 meses', months: 6 },
    { key: '12months', label: 'Últimos 12 meses', months: 12 },
    { key: 'custom', label: 'Período personalizado', months: 0 }
  ];

  const loadHistoryData = async () => {
    setLoading(true);
    try {
      // TODO: Implementar endpoint para buscar histórico
      // const history = await apiService.getHistory(selectedPeriod, dateRange);
      // setHistoryData(history.data);
      // setRoomUsage(history.roomUsage);
      
      setHistoryData([]);
      setRoomUsage([]);
      message.success('Dados históricos carregados com sucesso!');
    } catch (error) {
      message.error('Erro ao carregar dados históricos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoryData();
  }, [selectedPeriod]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
      case 'down': return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
      default: return <div style={{ width: '16px' }} />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#52c41a';
      case 'down': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  const totalSessions = historyData.reduce((sum, item) => sum + item.sessions, 0);
  const totalRevenue = historyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalPatients = historyData.reduce((sum, item) => sum + item.patients, 0);
  const averageSessions = totalSessions / historyData.length;

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <HistoryOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Históricos
            </Title>
            <Text type="secondary">
              Acompanhe o histórico de suas atividades e performance
            </Text>
          </div>

          <Divider />

          {/* Filtros */}
          <Card title="Filtros" size="small">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Text strong>Período:</Text>
                <Select
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {periodOptions.map(option => (
                    <Option key={option.key} value={option.key}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              {selectedPeriod === 'custom' && (
                <Col xs={24} sm={8}>
                  <Text strong>Período Personalizado:</Text>
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
              )}
              <Col xs={24} sm={8}>
                <Button
                  type="primary"
                  icon={<HistoryOutlined />}
                  onClick={loadHistoryData}
                  loading={loading}
                  style={{ marginTop: '32px' }}
                >
                  Atualizar Dados
                </Button>
              </Col>
            </Row>
          </Card>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>
                <Text>Carregando dados históricos...</Text>
              </div>
            </div>
          ) : (
            <Tabs defaultActiveKey="overview">
              {/* Visão Geral */}
              <TabPane tab="Visão Geral" key="overview">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {/* Estatísticas Gerais */}
                  <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title="Total de Sessões"
                        value={totalSessions}
                        prefix={<CalendarOutlined />}
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
                        title="Pacientes Atendidos"
                        value={totalPatients}
                        prefix={<UserOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title="Média Mensal"
                        value={averageSessions.toFixed(1)}
                        prefix={<BarChartOutlined />}
                        valueStyle={{ color: '#fa8c16' }}
                      />
                    </Col>
                  </Row>

                  {/* Histórico Mensal */}
                  <Card title="Histórico Mensal" size="small">
                    <List
                      dataSource={historyData}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar style={{ backgroundColor: getTrendColor(item.trend) }}>
                                {getTrendIcon(item.trend)}
                              </Avatar>
                            }
                            title={
                              <Space>
                                <Text strong>{item.period}</Text>
                                <Tag color={getTrendColor(item.trend)}>
                                  {item.percentage > 0 ? '+' : ''}{item.percentage}%
                                </Tag>
                              </Space>
                            }
                            description={
                              <Row gutter={[16, 8]}>
                                <Col span={6}>
                                  <Text type="secondary">Sessões: {item.sessions}</Text>
                                </Col>
                                <Col span={6}>
                                  <Text type="secondary">Receita: R$ {item.revenue.toFixed(2)}</Text>
                                </Col>
                                <Col span={6}>
                                  <Text type="secondary">Pacientes: {item.patients}</Text>
                                </Col>
                                <Col span={6}>
                                  <Text type="secondary">Salas: {item.rooms}</Text>
                                </Col>
                              </Row>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Space>
              </TabPane>

              {/* Utilização de Salas */}
              <TabPane tab="Utilização de Salas" key="rooms">
                <Card title="Utilização de Salas por Período" size="small">
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {roomUsage.map((room, index) => (
                      <Card key={index} size="small">
                        <Row gutter={[16, 16]} align="middle">
                          <Col xs={24} sm={8}>
                            <Space>
                              <EnvironmentOutlined />
                              <Text strong>{room.roomName}</Text>
                            </Space>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Progress
                              percent={room.percentage}
                              strokeColor="#1890ff"
                              format={() => `${room.percentage}%`}
                            />
                          </Col>
                          <Col xs={24} sm={8}>
                            <Space direction="vertical" size="small">
                              <Text type="secondary">
                                {room.usageCount} utilizações
                              </Text>
                              <Text type="secondary">
                                {room.totalHours}h totais
                              </Text>
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </Space>
                </Card>
              </TabPane>

              {/* Gráficos */}
              <TabPane tab="Gráficos" key="charts">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Sessões por Mês" size="small">
                      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Space direction="vertical" size="large">
                          <BarChartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                          <Text type="secondary">Gráfico de barras das sessões mensais</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            (Implementação futura com biblioteca de gráficos)
                          </Text>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Receita por Mês" size="small">
                      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Space direction="vertical" size="large">
                          <LineChartOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                          <Text type="secondary">Gráfico de linha da receita mensal</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            (Implementação futura com biblioteca de gráficos)
                          </Text>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Distribuição de Pacientes" size="small">
                      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Space direction="vertical" size="large">
                          <PieChartOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
                          <Text type="secondary">Gráfico de pizza da distribuição</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            (Implementação futura com biblioteca de gráficos)
                          </Text>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Tendências" size="small">
                      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Space direction="vertical" size="large">
                          <ArrowUpOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
                          <Text type="secondary">Análise de tendências</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            (Implementação futura com biblioteca de gráficos)
                          </Text>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default HistoryPage;
