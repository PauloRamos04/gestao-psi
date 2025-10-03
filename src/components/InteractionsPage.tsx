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
  Modal,
  Form,
  Input,
  Select,
  List,
  Avatar,
  Tag,
  Tooltip,
  Tabs,
  Statistic
} from 'antd';
import {
  MessageOutlined,
  PlusOutlined,
  SendOutlined,
  UserOutlined,
  StarOutlined,
  HeartOutlined,
  BulbOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface Suggestion {
  id: number;
  title: string;
  content: string;
  type: 'feature' | 'improvement' | 'bug' | 'other';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  author: string;
  date: string;
  response?: string;
  responseDate?: string;
}

interface Recommendation {
  id: number;
  name: string;
  profession: string;
  contact: string;
  location: string;
  description: string;
  status: 'pending' | 'contacted' | 'hired' | 'rejected';
  date: string;
}

const InteractionsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [suggestionModalVisible, setSuggestionModalVisible] = useState(false);
  const [recommendationModalVisible, setRecommendationModalVisible] = useState(false);
  const [suggestionForm] = Form.useForm();
  const [recommendationForm] = Form.useForm();

  const suggestionTypes = [
    { value: 'feature', label: 'Nova Funcionalidade', icon: <BulbOutlined /> },
    { value: 'improvement', label: 'Melhoria', icon: <StarOutlined /> },
    { value: 'bug', label: 'Correção de Bug', icon: <CheckCircleOutlined /> },
    { value: 'other', label: 'Outro', icon: <MessageOutlined /> }
  ];

  const priorities = [
    { value: 'low', label: 'Baixa', color: 'green' },
    { value: 'medium', label: 'Média', color: 'orange' },
    { value: 'high', label: 'Alta', color: 'red' }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados para demonstração
      const mockSuggestions: Suggestion[] = [
        {
          id: 1,
          title: 'Adicionar notificações push',
          content: 'Seria muito útil ter notificações push para lembretes de sessões e pagamentos pendentes.',
          type: 'feature',
          status: 'pending',
          priority: 'high',
          author: 'Dr. João Silva',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Melhorar interface do calendário',
          content: 'O calendário poderia ter uma visualização semanal mais clara e intuitiva.',
          type: 'improvement',
          status: 'in_progress',
          priority: 'medium',
          author: 'Dra. Maria Santos',
          date: '2024-01-10',
          response: 'Obrigado pela sugestão! Estamos trabalhando nessa melhoria.',
          responseDate: '2024-01-12'
        },
        {
          id: 3,
          title: 'Erro ao salvar relatórios',
          content: 'Quando tento gerar um relatório em PDF, o sistema apresenta erro.',
          type: 'bug',
          status: 'completed',
          priority: 'high',
          author: 'Dr. Pedro Costa',
          date: '2024-01-08',
          response: 'Bug corrigido na versão 2.1.3. Obrigado pelo reporte!',
          responseDate: '2024-01-14'
        }
      ];

      const mockRecommendations: Recommendation[] = [
        {
          id: 1,
          name: 'Dr. Carlos Mendes',
          profession: 'Psicólogo Clínico',
          contact: 'carlos.mendes@email.com',
          location: 'São Paulo, SP',
          description: 'Especialista em terapia cognitivo-comportamental com 10 anos de experiência.',
          status: 'pending',
          date: '2024-01-20'
        },
        {
          id: 2,
          name: 'Dra. Ana Beatriz',
          profession: 'Psicóloga Organizacional',
          contact: '(11) 99999-9999',
          location: 'Rio de Janeiro, RJ',
          description: 'Experiência em RH e desenvolvimento organizacional.',
          status: 'contacted',
          date: '2024-01-18'
        }
      ];

      setSuggestions(mockSuggestions);
      setRecommendations(mockRecommendations);
    } catch (error) {
      message.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitSuggestion = async () => {
    try {
      const values = await suggestionForm.validateFields();
      
      const newSuggestion: Suggestion = {
        id: Math.max(...suggestions.map(s => s.id)) + 1,
        ...values,
        status: 'pending',
        author: user?.titulo || 'Usuário',
        date: format(new Date(), 'yyyy-MM-dd')
      };
      
      setSuggestions(prev => [newSuggestion, ...prev]);
      setSuggestionModalVisible(false);
      suggestionForm.resetFields();
      message.success('Sugestão enviada com sucesso!');
    } catch (error) {
      message.error('Erro ao enviar sugestão');
    }
  };

  const handleSubmitRecommendation = async () => {
    try {
      const values = await recommendationForm.validateFields();
      
      const newRecommendation: Recommendation = {
        id: Math.max(...recommendations.map(r => r.id)) + 1,
        ...values,
        status: 'pending',
        date: format(new Date(), 'yyyy-MM-dd')
      };
      
      setRecommendations(prev => [newRecommendation, ...prev]);
      setRecommendationModalVisible(false);
      recommendationForm.resetFields();
      message.success('Indicação enviada com sucesso!');
    } catch (error) {
      message.error('Erro ao enviar indicação');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'rejected': return 'red';
      case 'contacted': return 'blue';
      case 'hired': return 'green';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'rejected': return 'Rejeitado';
      case 'contacted': return 'Contatado';
      case 'hired': return 'Contratado';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    const suggestionType = suggestionTypes.find(t => t.value === type);
    return suggestionType ? suggestionType.icon : <MessageOutlined />;
  };

  const getTypeText = (type: string) => {
    const suggestionType = suggestionTypes.find(t => t.value === type);
    return suggestionType ? suggestionType.label : type;
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending').length;
  const completedSuggestions = suggestions.filter(s => s.status === 'completed').length;
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending').length;

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <MessageOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Interações
            </Title>
            <Text type="secondary">
              Envie sugestões e indique profissionais para nossa equipe
            </Text>
          </div>

          <Divider />

          {/* Estatísticas */}
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Sugestões Pendentes"
                  value={pendingSuggestions}
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Sugestões Implementadas"
                  value={completedSuggestions}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Indicações Pendentes"
                  value={pendingRecommendations}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Total de Interações"
                  value={suggestions.length + recommendations.length}
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Ações Rápidas */}
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Button
                type="primary"
                icon={<BulbOutlined />}
                size="large"
                block
                onClick={() => setSuggestionModalVisible(true)}
              >
                Enviar Sugestão
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Button
                icon={<UserOutlined />}
                size="large"
                block
                onClick={() => setRecommendationModalVisible(true)}
              >
                Indicar Profissional
              </Button>
            </Col>
          </Row>

          {/* Tabs */}
          <Tabs defaultActiveKey="suggestions">
            {/* Sugestões */}
            <TabPane tab="Sugestões" key="suggestions">
              <List
                dataSource={suggestions}
                loading={loading}
                renderItem={(suggestion) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: '#1890ff' }}>
                          {getTypeIcon(suggestion.type)}
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong>{suggestion.title}</Text>
                          <Tag color={getStatusColor(suggestion.status)}>
                            {getStatusText(suggestion.status)}
                          </Tag>
                          <Tag color={priorities.find(p => p.value === suggestion.priority)?.color}>
                            {priorities.find(p => p.value === suggestion.priority)?.label}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {suggestion.content}
                          </Paragraph>
                          <Space>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <UserOutlined /> {suggestion.author}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <ClockCircleOutlined /> {format(new Date(suggestion.date), 'dd/MM/yyyy', { locale: ptBR })}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {getTypeText(suggestion.type)}
                            </Text>
                          </Space>
                          {suggestion.response && (
                            <Alert
                              message="Resposta da Equipe"
                              description={
                                <Space direction="vertical" size="small">
                                  <Text>{suggestion.response}</Text>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {format(new Date(suggestion.responseDate!), 'dd/MM/yyyy', { locale: ptBR })}
                                  </Text>
                                </Space>
                              }
                              type="info"
                            />
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>

            {/* Indicações */}
            <TabPane tab="Indicações" key="recommendations">
              <List
                dataSource={recommendations}
                loading={loading}
                renderItem={(recommendation) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: '#52c41a' }}>
                          <UserOutlined />
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong>{recommendation.name}</Text>
                          <Tag color={getStatusColor(recommendation.status)}>
                            {getStatusText(recommendation.status)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text strong>{recommendation.profession}</Text>
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {recommendation.description}
                          </Paragraph>
                          <Space wrap>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <MailOutlined /> {recommendation.contact}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <EnvironmentOutlined /> {recommendation.location}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <ClockCircleOutlined /> {format(new Date(recommendation.date), 'dd/MM/yyyy', { locale: ptBR })}
                            </Text>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>

          {/* Modal de Sugestão */}
          <Modal
            title="Enviar Sugestão"
            open={suggestionModalVisible}
            onOk={handleSubmitSuggestion}
            onCancel={() => {
              setSuggestionModalVisible(false);
              suggestionForm.resetFields();
            }}
            width={600}
          >
            <Form
              form={suggestionForm}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label="Tipo de Sugestão"
                name="type"
                rules={[{ required: true, message: 'Por favor, selecione o tipo!' }]}
              >
                <Select placeholder="Selecione o tipo de sugestão">
                  {suggestionTypes.map(type => (
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
                label="Prioridade"
                name="priority"
                rules={[{ required: true, message: 'Por favor, selecione a prioridade!' }]}
              >
                <Select placeholder="Selecione a prioridade">
                  {priorities.map(priority => (
                    <Option key={priority.value} value={priority.value}>
                      <Tag color={priority.color}>{priority.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Título"
                name="title"
                rules={[{ required: true, message: 'Por favor, insira o título!' }]}
              >
                <Input placeholder="Resumo da sua sugestão" />
              </Form.Item>

              <Form.Item
                label="Descrição"
                name="content"
                rules={[{ required: true, message: 'Por favor, descreva sua sugestão!' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Descreva detalhadamente sua sugestão, melhoria ou problema encontrado..."
                />
              </Form.Item>
            </Form>
          </Modal>

          {/* Modal de Indicação */}
          <Modal
            title="Indicar Profissional"
            open={recommendationModalVisible}
            onOk={handleSubmitRecommendation}
            onCancel={() => {
              setRecommendationModalVisible(false);
              recommendationForm.resetFields();
            }}
            width={600}
          >
            <Form
              form={recommendationForm}
              layout="vertical"
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Nome"
                    name="name"
                    rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
                  >
                    <Input placeholder="Nome completo" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Profissão"
                    name="profession"
                    rules={[{ required: true, message: 'Por favor, insira a profissão!' }]}
                  >
                    <Input placeholder="Ex: Psicólogo Clínico" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Contato"
                    name="contact"
                    rules={[{ required: true, message: 'Por favor, insira o contato!' }]}
                  >
                    <Input placeholder="Email ou telefone" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Localização"
                    name="location"
                    rules={[{ required: true, message: 'Por favor, insira a localização!' }]}
                  >
                    <Input placeholder="Cidade, Estado" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Descrição"
                name="description"
                rules={[{ required: true, message: 'Por favor, descreva o profissional!' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Descreva a experiência, especialidades e por que você recomenda este profissional..."
                />
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      </Card>
    </div>
  );
};

export default InteractionsPage;
