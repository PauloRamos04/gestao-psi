import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  message,
  Spin,
  Alert,
  Divider,
  List,
  Avatar,
  Tag,
  Tooltip,
  Progress,
  Modal,
  Form,
  Select,
  DatePicker,
  Statistic
} from 'antd';
import {
  DownloadOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  DatabaseOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface DownloadItem {
  id: number;
  name: string;
  type: 'pdf' | 'excel' | 'csv' | 'json';
  size: string;
  description: string;
  category: 'patients' | 'sessions' | 'reports' | 'backup';
  status: 'available' | 'generating' | 'error';
  createdAt: string;
  downloadCount: number;
  lastDownload?: string;
}

interface DownloadRequest {
  id: number;
  name: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  estimatedTime?: string;
}

const DownloadsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [downloadRequests, setDownloadRequests] = useState<DownloadRequest[]>([]);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [form] = Form.useForm();

  const downloadCategories = [
    {
      key: 'patients',
      name: 'Dados de Pacientes',
      description: 'Exportar informações dos pacientes',
      icon: <UserOutlined />
    },
    {
      key: 'sessions',
      name: 'Sessões',
      description: 'Exportar dados das sessões',
      icon: <CalendarOutlined />
    },
    {
      key: 'reports',
      name: 'Relatórios',
      description: 'Relatórios financeiros e estatísticos',
      icon: <FileTextOutlined />
    },
    {
      key: 'backup',
      name: 'Backup Completo',
      description: 'Backup de todos os dados',
      icon: <DatabaseOutlined />
    }
  ];

  const fileTypes = [
    { value: 'pdf', label: 'PDF', icon: <FilePdfOutlined /> },
    { value: 'excel', label: 'Excel', icon: <FileExcelOutlined /> },
    { value: 'csv', label: 'CSV', icon: <FileTextOutlined /> },
    { value: 'json', label: 'JSON', icon: <DatabaseOutlined /> }
  ];

  const loadDownloads = async () => {
    setLoading(true);
    try {
      // TODO: Implementar endpoint para buscar downloads
      // const data = await apiService.getDownloads();
      // setDownloads(data);
      
      setDownloads([]);
    } catch (error) {
      message.error('Erro ao carregar downloads');
    } finally {
      setLoading(false);
    }
  };

  const loadDownloadRequests = async () => {
    try {
      // TODO: Implementar endpoint para buscar requisições de download
      // const data = await apiService.getDownloadRequests();
      // setDownloadRequests(data);
      
      setDownloadRequests([]);
    } catch (error) {
      message.error('Erro ao carregar requisições');
    }
  };

  useEffect(() => {
    loadDownloads();
    loadDownloadRequests();
  }, []);

  const handleDownload = (download: DownloadItem) => {
    if (download.status === 'available') {
      message.success(`Iniciando download de ${download.name}`);
      // Aqui seria implementada a lógica de download real
    } else if (download.status === 'generating') {
      message.info('Arquivo ainda está sendo gerado. Tente novamente em alguns minutos.');
    } else {
      message.error('Erro no arquivo. Tente gerar novamente.');
    }
  };

  const handleRequestDownload = async () => {
    try {
      const values = await form.validateFields();
      
      const newRequest: DownloadRequest = {
        id: Math.max(...downloadRequests.map(r => r.id)) + 1,
        name: `${values.category}_${format(new Date(), 'yyyy-MM-dd')}.${values.type}`,
        type: values.type,
        status: 'pending',
        progress: 0,
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      };
      
      setDownloadRequests(prev => [newRequest, ...prev]);
      setRequestModalVisible(false);
      form.resetFields();
      message.success('Solicitação de download criada com sucesso!');
    } catch (error) {
      message.error('Erro ao criar solicitação');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green';
      case 'generating': return 'blue';
      case 'error': return 'red';
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'generating': return 'Gerando';
      case 'error': return 'Erro';
      case 'pending': return 'Pendente';
      case 'processing': return 'Processando';
      case 'completed': return 'Concluído';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircleOutlined />;
      case 'generating': return <ClockCircleOutlined />;
      case 'error': return <ExclamationCircleOutlined />;
      case 'pending': return <ClockCircleOutlined />;
      case 'processing': return <ClockCircleOutlined />;
      case 'completed': return <CheckCircleOutlined />;
      case 'failed': return <ExclamationCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getTypeIcon = (type: string) => {
    const fileType = fileTypes.find(t => t.value === type);
    return fileType ? fileType.icon : <FileTextOutlined />;
  };

  const getCategoryInfo = (category: string) => {
    const cat = downloadCategories.find(c => c.key === category);
    return cat || { name: category, icon: <FileTextOutlined /> };
  };

  const availableDownloads = downloads.filter(d => d.status === 'available').length;
  const generatingDownloads = downloads.filter(d => d.status === 'generating').length;
  const totalDownloads = downloads.reduce((sum, d) => sum + d.downloadCount, 0);
  const pendingRequests = downloadRequests.filter(r => r.status === 'pending' || r.status === 'processing').length;

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <DownloadOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Downloads
            </Title>
            <Text type="secondary">
              Baixe relatórios, dados de pacientes e backups do sistema
            </Text>
          </div>

          <Divider />

          {/* Estatísticas */}
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Arquivos Disponíveis"
                  value={availableDownloads}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Gerando"
                  value={generatingDownloads}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Total de Downloads"
                  value={totalDownloads}
                  prefix={<CloudDownloadOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Solicitações Pendentes"
                  value={pendingRequests}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Ações */}
          <Row justify="space-between" align="middle">
            <Col>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => setRequestModalVisible(true)}
              >
                Solicitar Download
              </Button>
            </Col>
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadDownloads}
                loading={loading}
              >
                Atualizar
              </Button>
            </Col>
          </Row>

          {/* Requisições em Andamento */}
          {downloadRequests.filter(r => r.status === 'pending' || r.status === 'processing').length > 0 && (
            <Card title="Solicitações em Andamento" size="small">
              <List
                dataSource={downloadRequests.filter(r => r.status === 'pending' || r.status === 'processing')}
                renderItem={(request) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: '#1890ff' }}>
                          {getTypeIcon(request.type)}
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong>{request.name}</Text>
                          <Tag color={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Progress
                            percent={request.progress}
                            size="small"
                            status={request.status === 'processing' ? 'active' : 'normal'}
                          />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <ClockCircleOutlined /> {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            {request.estimatedTime && (
                              <span> • Tempo estimado: {request.estimatedTime}</span>
                            )}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Lista de Downloads */}
          <Card title="Arquivos Disponíveis" size="small">
            <List
              dataSource={downloads}
              loading={loading}
              renderItem={(download) => (
                <List.Item
                  actions={[
                    <Tooltip title="Baixar arquivo">
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(download)}
                        disabled={download.status !== 'available'}
                      >
                        Baixar
                      </Button>
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {getTypeIcon(download.type)}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <Text strong>{download.name}</Text>
                        <Tag color={getStatusColor(download.status)}>
                          {getStatusIcon(download.status)}
                          {getStatusText(download.status)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text>{download.description}</Text>
                        <Space wrap>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <DatabaseOutlined /> {getCategoryInfo(download.category).name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Tamanho: {download.size}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Downloads: {download.downloadCount}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <ClockCircleOutlined /> {format(new Date(download.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                          </Text>
                          {download.lastDownload && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Último download: {format(new Date(download.lastDownload), 'dd/MM/yyyy', { locale: ptBR })}
                            </Text>
                          )}
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Modal de Solicitação */}
          <Modal
            title="Solicitar Download"
            open={requestModalVisible}
            onOk={handleRequestDownload}
            onCancel={() => {
              setRequestModalVisible(false);
              form.resetFields();
            }}
            width={500}
          >
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label="Categoria"
                name="category"
                rules={[{ required: true, message: 'Por favor, selecione a categoria!' }]}
              >
                <Select placeholder="Selecione a categoria">
                  {downloadCategories.map(category => (
                    <Option key={category.key} value={category.key}>
                      <Space>
                        {category.icon}
                        {category.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Formato"
                name="type"
                rules={[{ required: true, message: 'Por favor, selecione o formato!' }]}
              >
                <Select placeholder="Selecione o formato">
                  {fileTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <Space>
                        {type.icon}
                        {type.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Período (Opcional)"
                name="dateRange"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </Modal>

          {/* Informações sobre Downloads */}
          <Alert
            message="Informações sobre Downloads"
            description={
              <div>
                <Paragraph>
                  • Os arquivos são gerados sob demanda e podem levar alguns minutos para ficarem prontos<br/>
                  • Arquivos grandes podem demorar mais tempo para serem processados<br/>
                  • Downloads ficam disponíveis por 7 dias após a geração<br/>
                  • Para backups completos, entre em contato com o suporte técnico
                </Paragraph>
              </div>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default DownloadsPage;
