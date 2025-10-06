import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  List,
  Avatar,
  Typography,
  Spin,
  Space,
  Tag,
  Empty,
  Divider
} from 'antd';
import {
  CalendarOutlined,
  RiseOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Sessao, Mensagem } from '../types';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Title, Text, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessoesHoje, setSessoesHoje] = useState<Sessao[]>([]);
  const [sessoesSemana, setSessoesSemana] = useState<Sessao[]>([]);
  const [faturamentoMes, setFaturamentoMes] = useState<number>(0);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const hoje = format(new Date(), 'yyyy-MM-dd');
      const inicioMes = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
      const fimMes = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd');
      const inicioSemana = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      const fimSemana = format(new Date(), 'yyyy-MM-dd');

      const [sessoesHojeData, sessoesSemanaData, faturamentoData, mensagensData] = await Promise.all([
        apiService.getSessoesPorDia({
          clinicaId: user!.clinicaId,
          psicologId: user!.psicologId,
          data: hoje
        }),
        apiService.getSessoesPorPeriodo({
          clinicaId: user!.clinicaId,
          psicologId: user!.psicologId,
          inicio: inicioSemana,
          fim: fimSemana
        }),
        apiService.getFaturamentoPorPeriodo({
          clinicaId: user!.clinicaId,
          psicologId: user!.psicologId,
          inicio: inicioMes,
          fim: fimMes
        }),
        apiService.getMensagensAtivas()
      ]);

      setSessoesHoje(sessoesHojeData);
      setSessoesSemana(sessoesSemanaData);
      setFaturamentoMes(faturamentoData);
      setMensagens(mensagensData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.clinicaId && user?.psicologId) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  const statsData = [
    {
      title: 'Sessões Hoje',
      value: sessoesHoje.length,
      icon: <CalendarOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: 'Sessões Esta Semana',
      value: sessoesSemana.length,
      icon: <ClockCircleOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: 'Faturamento do Mês',
      value: faturamentoMes,
      prefix: 'R$ ',
      precision: 2,
      icon: <RiseOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1'
    },
    {
      title: 'Mensagens Ativas',
      value: mensagens.length,
      icon: <MessageOutlined style={{ color: '#fa8c16' }} />,
      color: '#fa8c16'
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size="small">
              <Title level={2} style={{ margin: 0 }}>
                Bem-vindo, {user?.tituloSite || 'Usuário'}!
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                {user?.clinicaNome || 'Clínica'} • {user?.psicologoNome || 'Psicólogo'}
              </Text>
            </Space>
          </Col>
          <Col>
            <Space align="center">
              <CalendarOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
              <Text type="secondary">
                {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                precision={stat.precision}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Sessões de Hoje */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                Sessões de Hoje
              </Space>
            }
            extra={
              <Tag color="blue">{sessoesHoje.length} sessões</Tag>
            }
          >
            {sessoesHoje.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size="small">
                    <Text strong>Nenhuma sessão hoje</Text>
                    <Text type="secondary">Você não tem sessões agendadas para hoje.</Text>
                  </Space>
                }
              />
            ) : (
              <List
                dataSource={sessoesHoje}
                renderItem={(sessao) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<ClockCircleOutlined />} 
                          style={{ backgroundColor: '#1890ff' }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{sessao.pacienteNome || 'Paciente'}</Text>
                          {sessao.status ? (
                            <Tag color="green" icon={<CheckCircleOutlined />}>
                              Confirmada
                            </Tag>
                          ) : (
                            <Tag color="orange" icon={<ExclamationCircleOutlined />}>
                              Pendente
                            </Tag>
                          )}
                        </Space>
                      }
                      description={
                        <Space>
                          <Text type="secondary">{sessao.hora}</Text>
                          <Text type="secondary">•</Text>
                          <Text type="secondary">Sala {sessao.salaNome || 'N/A'}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Mensagens Importantes */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <MessageOutlined />
                Mensagens Importantes
              </Space>
            }
            extra={
              <Tag color="orange">{mensagens.length} mensagens</Tag>
            }
          >
            {mensagens.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size="small">
                    <Text strong>Nenhuma mensagem</Text>
                    <Text type="secondary">Não há mensagens importantes no momento.</Text>
                  </Space>
                }
              />
            ) : (
              <List
                dataSource={mensagens.slice(0, 3)}
                renderItem={(mensagem) => (
                  <List.Item>
                    <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Title level={5} style={{ margin: 0, color: '#389e0d' }}>
                          {mensagem.titulo}
                        </Title>
                        <Paragraph 
                          ellipsis={{ rows: 2 }} 
                          style={{ margin: 0, color: '#52c41a' }}
                        >
                          {mensagem.conteudo}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {format(new Date(mensagem.dataCriacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </Text>
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
