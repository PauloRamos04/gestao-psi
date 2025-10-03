import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Card,
  DatePicker,
  Button,
  Space,
  Tag,
  Avatar,
  Typography,
  Spin,
  Alert,
  Row,
  Col,
  Statistic,
  Radio,
  Input,
  Select,
  message,
  Tooltip
} from 'antd';
import {
  CalendarOutlined,
  FilterOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { Sessao, FiltroPeriodo, FiltroDia } from '../types';
import apiService from '../services/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SessoesList: React.FC = () => {
  const { user } = useAuth();
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [filtro, setFiltro] = useState<'hoje' | 'periodo'>('hoje');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dataHoje, setDataHoje] = useState(format(new Date(), 'yyyy-MM-dd'));

  const loadSessoesHoje = useCallback(async () => {
    if (!user?.clinicaId || !user?.psicologId) return;

    try {
      setLoading(true);
      setError('');
      const filtroDia: FiltroDia = {
        clinicaId: user.clinicaId,
        psicologId: user.psicologId,
        data: dataHoje
      };
      const data = await apiService.getSessoesPorDia(filtroDia);
      setSessoes(data);
    } catch (err: any) {
      setError('Erro ao carregar sessões do dia');
    } finally {
      setLoading(false);
    }
  }, [user, dataHoje]);

  const loadSessoesPeriodo = useCallback(async () => {
    if (!user?.clinicaId || !user?.psicologId || !dataInicio || !dataFim) return;

    try {
      setLoading(true);
      setError('');
      const filtroPeriodo: FiltroPeriodo = {
        clinicaId: user.clinicaId,
        psicologId: user.psicologId,
        inicio: dataInicio,
        fim: dataFim
      };
      const data = await apiService.getSessoesPorPeriodo(filtroPeriodo);
      setSessoes(data);
    } catch (err: any) {
      setError('Erro ao carregar sessões do período');
    } finally {
      setLoading(false);
    }
  }, [user, dataInicio, dataFim]);

  useEffect(() => {
    if (user?.clinicaId && user?.psicologId) {
      if (filtro === 'hoje') {
        loadSessoesHoje();
      } else {
        if (dataInicio && dataFim) {
          loadSessoesPeriodo();
        }
      }
    }
  }, [user, filtro, dataInicio, dataFim, loadSessoesHoje, loadSessoesPeriodo]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return 'green';
      case 'CANCELADA':
        return 'red';
      case 'CONCLUIDA':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return 'Ativa';
      case 'CANCELADA':
        return 'Cancelada';
      case 'CONCLUIDA':
        return 'Concluída';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Data/Hora',
      key: 'dataHora',
      render: (_: any, record: Sessao) => (
        <Space>
          <Avatar 
            icon={<ClockCircleOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>
              {format(parseISO(record.data), 'dd/MM/yyyy', { locale: ptBR })}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.hora}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Paciente',
      key: 'paciente',
      render: (_: any, record: Sessao) => (
        <Space>
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#52c41a' }}
          />
          <Text strong>{record.paciente?.nome || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Sala',
      key: 'sala',
      render: (_: any, record: Sessao) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#fa8c16' }} />
          <Text>{record.sala?.nome || 'N/A'}</Text>
        </Space>
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
  ];

  const activeSessions = sessoes.filter(s => s.status === 'ATIVA').length;
  const completedSessions = sessoes.filter(s => s.status === 'CONCLUIDA').length;
  const cancelledSessions = sessoes.filter(s => s.status === 'CANCELADA').length;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Avatar 
                size={48}
                icon={<CalendarOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>Sessões</Title>
                <Text type="secondary">Gerencie as sessões de terapia</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              size="large"
            >
              Nova Sessão
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total de Sessões"
              value={sessoes.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Sessões Ativas"
              value={activeSessions}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Sessões Concluídas"
              value={completedSessions}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space>
            <FilterOutlined style={{ color: '#8c8c8c' }} />
            <Text strong>Filtros:</Text>
          </Space>
          
          <Space wrap>
            <Radio.Group 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="hoje">Hoje</Radio.Button>
              <Radio.Button value="periodo">Período</Radio.Button>
            </Radio.Group>

            {filtro === 'hoje' && (
              <DatePicker
                value={dayjs(dataHoje)}
                onChange={(date) => setDataHoje(date?.format('YYYY-MM-DD') || '')}
                style={{ width: 200 }}
              />
            )}

            {filtro === 'periodo' && (
              <RangePicker
                value={[
                  dataInicio ? dayjs(dataInicio) : null,
                  dataFim ? dayjs(dataFim) : null
                ]}
                onChange={(dates) => {
                  if (dates) {
                    setDataInicio(dates[0]?.format('YYYY-MM-DD') || '');
                    setDataFim(dates[1]?.format('YYYY-MM-DD') || '');
                  } else {
                    setDataInicio('');
                    setDataFim('');
                  }
                }}
                style={{ width: 300 }}
              />
            )}

            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                if (filtro === 'hoje') {
                  loadSessoesHoje();
                } else {
                  loadSessoesPeriodo();
                }
              }}
              loading={loading}
            >
              Atualizar
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Sessions Table */}
      <Card>
        {error ? (
          <Alert
            message="Erro"
            description={error}
            type="error"
            showIcon
          />
        ) : (
          <Table
            columns={columns}
            dataSource={sessoes}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} sessões`,
            }}
            scroll={{ x: 800 }}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <CalendarOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                  <div style={{ fontSize: '16px', color: '#262626', marginBottom: '8px' }}>
                    Nenhuma sessão encontrada
                  </div>
                  <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    {filtro === 'hoje' 
                      ? 'Não há sessões agendadas para hoje.'
                      : 'Não há sessões no período selecionado.'
                    }
                  </div>
                </div>
              )
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default SessoesList;
