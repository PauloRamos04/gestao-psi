import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Input,
  Select,
  DatePicker,
  Space,
  Button,
  Typography,
  Row,
  Col,
  Statistic,
  Tooltip,
  Modal
} from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';
import apiService from '../services/api';
import type { LogAuditoria } from '../types';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50);
  const [selectedLog, setSelectedLog] = useState<LogAuditoria | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Filtros
  const [filtroAcao, setFiltroAcao] = useState<string>('');
  const [filtroEntidade, setFiltroEntidade] = useState<string>('');
  const [filtroModulo, setFiltroModulo] = useState<string>('');

  useEffect(() => {
    loadLogs();
  }, [page, size]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await apiService.getLogs(page, size);
      setLogs(response.content || response);
      setTotal(response.totalElements || 0);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const response = await apiService.getLogsFiltrados({
        acao: filtroAcao || undefined,
        entidade: filtroEntidade || undefined,
        modulo: filtroModulo || undefined,
        page,
        size
      });
      setLogs(response.content || response);
      setTotal(response.totalElements || 0);
    } catch (error) {
      console.error('Erro ao filtrar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAcaoBadge = (acao: string) => {
    const colors: Record<string, string> = {
      'CREATE': 'green',
      'UPDATE': 'blue',
      'DELETE': 'red',
      'LOGIN': 'cyan',
      'LOGOUT': 'default',
      'VIEW': 'purple',
      'EXPORT': 'orange',
      'ERROR': 'red'
    };
    return <Tag color={colors[acao] || 'default'}>{acao}</Tag>;
  };

  const getNivelBadge = (nivel: string, sucesso: boolean) => {
    if (!sucesso) {
      return <Tag icon={<CloseCircleOutlined />} color="error">ERRO</Tag>;
    }
    
    const colors: Record<string, string> = {
      'INFO': 'blue',
      'WARNING': 'orange',
      'ERROR': 'red',
      'CRITICAL': 'red'
    };
    
    const icons: Record<string, any> = {
      'INFO': <CheckCircleOutlined />,
      'WARNING': <WarningOutlined />,
      'ERROR': <CloseCircleOutlined />,
      'CRITICAL': <CloseCircleOutlined />
    };
    
    return <Tag icon={icons[nivel]} color={colors[nivel] || 'default'}>{nivel}</Tag>;
  };

  const showDetails = (log: LogAuditoria) => {
    setSelectedLog(log);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Data/Hora',
      dataIndex: 'dataHora',
      key: 'dataHora',
      width: 160,
      render: (data: string) => format(new Date(data), 'dd/MM/yyyy HH:mm:ss'),
      sorter: (a: LogAuditoria, b: LogAuditoria) => 
        new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime(),
    },
    {
      title: 'Usuário',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (text: string) => text || <Text type="secondary">SYSTEM</Text>,
    },
    {
      title: 'Ação',
      dataIndex: 'acao',
      key: 'acao',
      width: 100,
      render: (acao: string) => getAcaoBadge(acao),
    },
    {
      title: 'Entidade',
      dataIndex: 'entidade',
      key: 'entidade',
      width: 120,
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'sucesso',
      key: 'sucesso',
      width: 100,
      render: (_: any, record: LogAuditoria) => getNivelBadge(record.nivel, record.sucesso),
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 130,
      render: (text: string) => text || '-',
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 80,
      render: (_: any, record: LogAuditoria) => (
        <Tooltip title="Ver detalhes">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              <FileTextOutlined /> Logs do Sistema
            </Title>
            <Text type="secondary">Auditoria e rastreamento de ações</Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={loadLogs}>
            Atualizar
          </Button>
        </div>
      </Card>

      {/* Filtros */}
      <Card style={{ marginBottom: '24px' }} title={<><FilterOutlined /> Filtros</>}>
        <Row gutter={16}>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filtrar por ação"
              allowClear
              value={filtroAcao || undefined}
              onChange={setFiltroAcao}
            >
              <Option value="CREATE">Criação</Option>
              <Option value="UPDATE">Atualização</Option>
              <Option value="DELETE">Exclusão</Option>
              <Option value="LOGIN">Login</Option>
              <Option value="LOGOUT">Logout</Option>
              <Option value="VIEW">Visualização</Option>
              <Option value="EXPORT">Exportação</Option>
              <Option value="ERROR">Erro</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filtrar por entidade"
              allowClear
              value={filtroEntidade || undefined}
              onChange={setFiltroEntidade}
            >
              <Option value="Paciente">Paciente</Option>
              <Option value="Psicologo">Psicólogo</Option>
              <Option value="Usuario">Usuário</Option>
              <Option value="Sessao">Sessão</Option>
              <Option value="Prontuario">Prontuário</Option>
              <Option value="Pagamento">Pagamento</Option>
              <Option value="Sala">Sala</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filtrar por módulo"
              allowClear
              value={filtroModulo || undefined}
              onChange={setFiltroModulo}
            >
              <Option value="SESSOES">Sessões</Option>
              <Option value="PRONTUARIOS">Prontuários</Option>
              <Option value="PAGAMENTOS">Pagamentos</Option>
              <Option value="USUARIOS">Usuários</Option>
              <Option value="PACIENTES">Pacientes</Option>
              <Option value="SALAS">Salas</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleFilter} block>
              Filtrar
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tabela de Logs */}
      <Card>
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page + 1,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
            onChange: (newPage, newSize) => {
              setPage(newPage - 1);
              if (newSize) setSize(newSize);
            },
            pageSizeOptions: ['20', '50', '100', '200']
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal de Detalhes */}
      <Modal
        title="Detalhes do Log"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Fechar
          </Button>
        ]}
        width={800}
      >
        {selectedLog && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>ID:</Text> {selectedLog.id}
              </Col>
              <Col span={12}>
                <Text strong>Data/Hora:</Text> {format(new Date(selectedLog.dataHora), 'dd/MM/yyyy HH:mm:ss')}
              </Col>
              <Col span={12}>
                <Text strong>Usuário:</Text> {selectedLog.username || 'SYSTEM'}
              </Col>
              <Col span={12}>
                <Text strong>Ação:</Text> {getAcaoBadge(selectedLog.acao)}
              </Col>
              <Col span={12}>
                <Text strong>Entidade:</Text> {selectedLog.entidade || '-'}
              </Col>
              <Col span={12}>
                <Text strong>ID Entidade:</Text> {selectedLog.entidadeId || '-'}
              </Col>
              <Col span={12}>
                <Text strong>IP:</Text> {selectedLog.ipAddress || '-'}
              </Col>
              <Col span={12}>
                <Text strong>Método HTTP:</Text> {selectedLog.metodoHttp || '-'}
              </Col>
              <Col span={24}>
                <Text strong>Endpoint:</Text> {selectedLog.endpoint || '-'}
              </Col>
              <Col span={24}>
                <Text strong>Descrição:</Text>
                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginTop: '8px' }}>
                  {selectedLog.descricao || '-'}
                </div>
              </Col>
              {selectedLog.dadosAnteriores && (
                <Col span={24}>
                  <Text strong>Dados Anteriores:</Text>
                  <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginTop: '8px', overflow: 'auto' }}>
                    {selectedLog.dadosAnteriores}
                  </pre>
                </Col>
              )}
              {selectedLog.dadosNovos && (
                <Col span={24}>
                  <Text strong>Dados Novos:</Text>
                  <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginTop: '8px', overflow: 'auto' }}>
                    {selectedLog.dadosNovos}
                  </pre>
                </Col>
              )}
              {selectedLog.mensagemErro && (
                <Col span={24}>
                  <Text strong type="danger">Mensagem de Erro:</Text>
                  <div style={{ background: '#fff2f0', padding: '12px', borderRadius: '4px', marginTop: '8px', color: '#cf1322' }}>
                    {selectedLog.mensagemErro}
                  </div>
                </Col>
              )}
              {selectedLog.userAgent && (
                <Col span={24}>
                  <Text strong>User Agent:</Text>
                  <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginTop: '8px', fontSize: '12px' }}>
                    {selectedLog.userAgent}
                  </div>
                </Col>
              )}
              {selectedLog.tempoExecucaoMs && (
                <Col span={12}>
                  <Text strong>Tempo de Execução:</Text> {selectedLog.tempoExecucaoMs}ms
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LogsPage;

