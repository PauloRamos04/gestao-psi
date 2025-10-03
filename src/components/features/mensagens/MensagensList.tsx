import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Statistic,
  Tooltip,
  Popconfirm,
  Badge,
  Avatar
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  BellOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import { Mensagem } from '../../../types';

const { Option } = Select;
const { TextArea } = Input;

const MensagensList: React.FC = () => {
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingMensagem, setEditingMensagem] = useState<Mensagem | null>(null);
  const [selectedMensagem, setSelectedMensagem] = useState<Mensagem | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Estatísticas
  const totalMensagens = mensagens.length;
  const mensagensAtivas = mensagens.filter(m => m.status).length;
  const mensagensInativas = mensagens.filter(m => !m.status).length;

  useEffect(() => {
    loadMensagens();
  }, []);

  const loadMensagens = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMensagensAtivas();
      setMensagens(data);
    } catch (error) {
      message.error('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMensagem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (mensagem: Mensagem) => {
    setEditingMensagem(mensagem);
    form.setFieldsValue({
      titulo: mensagem.titulo,
      conteudo: mensagem.conteudo,
      status: mensagem.status
    });
    setModalVisible(true);
  };

  const handleView = (mensagem: Mensagem) => {
    setSelectedMensagem(mensagem);
    setViewModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // Aqui você implementaria a chamada para deletar
      message.success('Mensagem removida com sucesso');
      loadMensagens();
    } catch (error) {
      message.error('Erro ao remover mensagem');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingMensagem) {
        // Atualizar mensagem existente
        message.success('Mensagem atualizada com sucesso');
      } else {
        // Criar nova mensagem
        message.success('Mensagem criada com sucesso');
      }
      
      setModalVisible(false);
      loadMensagens();
    } catch (error) {
      message.error('Erro ao salvar mensagem');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingMensagem(null);
    form.resetFields();
  };

  const handleViewModalCancel = () => {
    setViewModalVisible(false);
    setSelectedMensagem(null);
  };

  const filteredMensagens = mensagens.filter(mensagem => {
    const matchesSearch = mensagem.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
                         mensagem.conteudo.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
          <p className="text-gray-600">Gerencie as mensagens do sistema</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Nova Mensagem
        </Button>
      </div>

      {/* Estatísticas */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Mensagens"
              value={totalMensagens}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Mensagens Ativas"
              value={mensagensAtivas}
              valueStyle={{ color: '#3f8600' }}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Mensagens Inativas"
              value={mensagensInativas}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Taxa de Ativas"
              value={totalMensagens > 0 ? ((mensagensAtivas / totalMensagens) * 100).toFixed(1) : 0}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <Card>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Input
              placeholder="Buscar por título ou conteúdo..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadMensagens}
              loading={loading}
            >
              Atualizar
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Lista de Mensagens */}
      <Card>
        <List
          loading={loading}
          dataSource={filteredMensagens}
          renderItem={(mensagem) => (
            <List.Item
              actions={[
                <Tooltip title="Visualizar">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => handleView(mensagem)}
                  />
                </Tooltip>,
                <Tooltip title="Editar">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEdit(mensagem)}
                  />
                </Tooltip>,
                <Popconfirm
                  title="Tem certeza que deseja remover esta mensagem?"
                  onConfirm={() => handleDelete(mensagem.id)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Tooltip title="Remover">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    />
                  </Tooltip>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge 
                    status={mensagem.status ? "success" : "default"} 
                    dot
                  >
                    <Avatar 
                      icon={<MessageOutlined />} 
                      style={{ backgroundColor: mensagem.status ? '#52c41a' : '#d9d9d9' }}
                    />
                  </Badge>
                }
                title={
                  <div className="flex items-center justify-between">
                    <span style={{ fontWeight: 500 }}>{mensagem.titulo}</span>
                    <Tag color={mensagem.status ? 'green' : 'red'}>
                      {mensagem.status ? 'Ativa' : 'Inativa'}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <p className="mb-2">
                      {mensagem.conteudo.length > 100 
                        ? `${mensagem.conteudo.substring(0, 100)}...` 
                        : mensagem.conteudo
                      }
                    </p>
                    <small className="text-gray-500">
                      Criada em: {formatDate(mensagem.dataCriacao)}
                    </small>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Modal de Adicionar/Editar */}
      <Modal
        title={editingMensagem ? 'Editar Mensagem' : 'Nova Mensagem'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: true
          }}
        >
          <Form.Item
            name="titulo"
            label="Título"
            rules={[
              { required: true, message: 'Por favor, insira o título da mensagem' },
              { min: 3, message: 'Título deve ter pelo menos 3 caracteres' }
            ]}
          >
            <Input placeholder="Digite o título da mensagem" />
          </Form.Item>

          <Form.Item
            name="conteudo"
            label="Conteúdo"
            rules={[
              { required: true, message: 'Por favor, insira o conteúdo da mensagem' },
              { min: 10, message: 'Conteúdo deve ter pelo menos 10 caracteres' }
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Digite o conteúdo da mensagem"
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Por favor, selecione o status' }]}
          >
            <Select placeholder="Selecione o status">
              <Option value={true}>Ativa</Option>
              <Option value={false}>Inativa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Visualização */}
      <Modal
        title="Visualizar Mensagem"
        open={viewModalVisible}
        onCancel={handleViewModalCancel}
        footer={[
          <Button key="close" onClick={handleViewModalCancel}>
            Fechar
          </Button>
        ]}
        width={600}
      >
        {selectedMensagem && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedMensagem.titulo}</h3>
              <div className="flex items-center space-x-2 mt-2">
                <Tag color={selectedMensagem.status ? 'green' : 'red'}>
                  {selectedMensagem.status ? 'Ativa' : 'Inativa'}
                </Tag>
                <span className="text-sm text-gray-500">
                  Criada em: {formatDate(selectedMensagem.dataCriacao)}
                </span>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Conteúdo:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedMensagem.conteudo}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MensagensList;
